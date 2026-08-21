// ============================================================
// PointsRouter.js
// User-facing Points Pricing endpoints consumed by the mobile/web
// user app (Rent_pondy_user). Mounted at /PPC.
//
// Endpoints (prefix = /PPC):
//   GET  /points-plans                - list active plans
//   GET  /points-balance/:phone       - current balance for a user
//   POST /select-points-plan          - pre-purchase snapshot
//   POST /points-credit               - credit after PayU success
//   POST /points-deduct               - deduct on view-owner-contact
//   GET  /points-transactions/:phone  - user transaction history
//   GET  /points-config-public        - read tunable settings (pointsPerContactReveal)
// ============================================================

const express = require('express');
const router = express.Router();

const {
  PointsPlan,
  PointsBalance,
  PointsTransaction,
  PointsPayU,
  PointsPlanSelection,
} = require('./PointsModel');

// Admin config singleton model lives in PointsPricingModel.js. Require it
// lazily inside handlers so the admin module can load first if needed.
const loadPointsConfig = () => {
  const { PointsConfig } = require('../PointsPricing/PointsPricingModel');
  return PointsConfig;
};

// PointsRefundRequest is defined in the admin-side model file alongside
// PointsConfig. Loaded lazily for the same reason.
const loadPointsRefundRequest = () => {
  const { PointsRefundRequest } = require('../PointsPricing/PointsPricingModel');
  return PointsRefundRequest;
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const normalizePhone = (raw = '') =>
  String(raw).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();

// ============================================================
// GET /points-plans
//   Default (user app)    : returns a flat array of ACTIVE plans only.
//   Admin (?all=1 or ?all=true): returns { success, total, plans: [...] }
//   including hidden ones, each with an `active` boolean derived from
//   `status === 'active'`. Admin screens rely on that shape.
// ============================================================
router.get('/points-plans', async (req, res) => {
  try {
    const wantAll = req.query.all === '1' || req.query.all === 'true';
    if (wantAll) {
      const plans = await PointsPlan.find({}).sort({ sortOrder: 1, createdAt: -1 });
      const shaped = plans.map((p) => {
        const o = p.toObject();
        return { ...o, active: o.status === 'active' };
      });
      return res.json({ success: true, total: shaped.length, plans: shaped });
    }

    const plans = await PointsPlan.find({ status: 'active' }).sort({
      sortOrder: 1,
      price: 1,
      createdAt: -1,
    });
    return res.json(plans);
  } catch (err) {
    console.error('points-plans error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load plans', error: err.message });
  }
});

// ============================================================
// GET /points-balance/:phone — current balance + lifetime totals
// ============================================================
router.get('/points-balance/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    if (!phone) {
      return res.status(400).json({ success: false, message: 'phone is required' });
    }
    let doc = await PointsBalance.findOne({ phoneNumber: phone });
    if (!doc) {
      doc = await PointsBalance.create({ phoneNumber: phone, balance: 0 });
    }
    return res.json({
      success: true,
      phoneNumber: doc.phoneNumber,
      balance: doc.balance,
      totalEarned: doc.totalEarned,
      totalSpent: doc.totalSpent,
      totalPaid: doc.totalPaid,
      lastActivityAt: doc.lastActivityAt,
    });
  } catch (err) {
    console.error('points-balance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch balance', error: err.message });
  }
});

// ============================================================
// POST /select-points-plan — stores a snapshot of the pending
// purchase so the admin can follow up on pay-later leads or
// reconcile partially-completed PayU flows.
// body: { phoneNumber, planId, points, amount }
// ============================================================
router.post('/select-points-plan', async (req, res) => {
  try {
    const { phoneNumber, planId, points, amount } = req.body || {};
    if (!phoneNumber || !planId) {
      return res.status(400).json({ success: false, message: 'phoneNumber and planId are required' });
    }
    const plan = await PointsPlan.findById(planId).catch(() => null);
    const snapshot = await PointsPlanSelection.create({
      phoneNumber: normalizePhone(phoneNumber),
      planId,
      planName: plan?.name || null,
      points: Number(points) || plan?.points || 0,
      amount: Number(amount) || plan?.price || 0,
    });
    return res.json({ success: true, selection: snapshot });
  } catch (err) {
    console.error('select-points-plan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save selection', error: err.message });
  }
});

// ============================================================
// POST /points-credit — credit points after a PayU success.
// body: { phoneNumber, points, planId, amount, txnId }
//
// Idempotent on (phoneNumber + txnId): if a credit with the same
// txnId already exists, we return the current balance without
// double-crediting. Keeps the callback safe to retry.
// ============================================================
router.post('/points-credit', async (req, res) => {
  try {
    const { phoneNumber, points, planId, amount, txnId } = req.body || {};
    const pts = Number(points);
    if (!phoneNumber) return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    if (!Number.isFinite(pts) || pts <= 0) {
      return res.status(400).json({ success: false, message: 'points must be > 0' });
    }

    const phone = normalizePhone(phoneNumber);

    if (txnId) {
      const existing = await PointsTransaction.findOne({ phoneNumber: phone, txnId, type: 'credit' });
      if (existing) {
        const bal = await PointsBalance.findOne({ phoneNumber: phone });
        return res.json({
          success: true,
          alreadyCredited: true,
          balance: bal?.balance ?? existing.balanceAfter,
          transaction: existing,
        });
      }
    }

    const amt = Number(amount) || 0;
    const plan = planId ? await PointsPlan.findById(planId).catch(() => null) : null;

    const updated = await PointsBalance.findOneAndUpdate(
      { phoneNumber: phone },
      {
        $inc: { balance: pts, totalEarned: pts, totalPaid: amt },
        $set: { lastActivityAt: new Date() },
        $setOnInsert: { phoneNumber: phone },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const txn = await PointsTransaction.create({
      phoneNumber: phone,
      type: 'credit',
      points: pts,
      balanceAfter: updated.balance,
      planId: planId || null,
      planName: plan?.name || null,
      reason: 'purchase',
      txnId: txnId || null,
      amount: amt || null,
    });

    return res.json({ success: true, balance: updated.balance, transaction: txn });
  } catch (err) {
    console.error('points-credit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to credit points', error: err.message });
  }
});

// ============================================================
// POST /points-deduct — deduct points for an action (view-owner-contact).
// body: { phoneNumber, points, rentId, reason }
// Returns 402 (Payment Required) if balance is insufficient so
// the caller can route the user to the Points Plans screen.
// ============================================================
router.post('/points-deduct', async (req, res) => {
  try {
    const { phoneNumber, points, rentId, reason, force } = req.body || {};
    const pts = Number(points);
    if (!phoneNumber) return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    if (!Number.isFinite(pts) || pts <= 0) {
      return res.status(400).json({ success: false, message: 'points must be > 0' });
    }

    const phone = normalizePhone(phoneNumber);
    const doc = await PointsBalance.findOne({ phoneNumber: phone });
    if (!doc || doc.balance < pts) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient points',
        balance: doc?.balance || 0,
        required: pts,
      });
    }

    // For contact reveals we de-dupe per (phone, rentId) so the same
    // property/tenant isn't double-charged on accidental re-clicks or a
    // page reload. view-owner-contact keys on the property rentId;
    // view-tenant-contact keys on the tenant Ra_Id (passed as rentId).
    // The user app sets `force: true` after the user explicitly
    // confirms an "already viewed — deduct again?" prompt; in that
    // case we skip the dedupe and charge a fresh deduction.
    if (
      !force &&
      (reason === 'view-owner-contact' || reason === 'view-tenant-contact' || reason === 'view-tourist-contact') &&
      rentId != null
    ) {
      const existing = await PointsTransaction.findOne({
        phoneNumber: phone,
        reason,
        rentId,
        type: 'deduct',
      });
      if (existing) {
        return res.json({
          success: true,
          alreadyDeducted: true,
          balance: doc.balance,
          transaction: existing,
        });
      }
    }

    const updated = await PointsBalance.findOneAndUpdate(
      { phoneNumber: phone, balance: { $gte: pts } },
      {
        $inc: { balance: -pts, totalSpent: pts },
        $set: { lastActivityAt: new Date() },
      },
      { new: true }
    );
    // The conditional update above protects against a race where two
    // concurrent reveals try to drive the balance negative.
    if (!updated) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient points',
        balance: doc.balance,
        required: pts,
      });
    }

    const txn = await PointsTransaction.create({
      phoneNumber: phone,
      type: 'deduct',
      points: pts,
      balanceAfter: updated.balance,
      reason: reason || 'deduct',
      rentId: rentId != null ? rentId : null,
    });

    return res.json({ success: true, balance: updated.balance, transaction: txn });
  } catch (err) {
    console.error('points-deduct error:', err);
    return res.status(500).json({ success: false, message: 'Failed to deduct points', error: err.message });
  }
});

// ============================================================
// GET /points-transactions/:phone — user-facing transaction history
// ============================================================
router.get('/points-transactions/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const txns = await PointsTransaction.find({ phoneNumber: phone })
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.json({ success: true, total: txns.length, transactions: txns });
  } catch (err) {
    console.error('points-transactions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err.message });
  }
});

// ============================================================
// GET /points-config-public — tunable settings the user app reads
// (e.g. pointsPerContactReveal). Safe for anonymous callers since
// it only exposes tunables meant for display/logic in the app.
// ============================================================
router.get('/points-config-public', async (req, res) => {
  try {
    const PointsConfig = loadPointsConfig();
    let cfg = await PointsConfig.findById('points-config');
    if (!cfg) cfg = await PointsConfig.create({ _id: 'points-config' });

    // Plans for the app's "no points" popup. The admin picks these on the
    // Points Pricing > No Points Popup screen; hidden or deleted plans are
    // dropped here rather than in the app, so the popup can never advertise
    // something that is no longer on sale.
    const PLAN_FIELDS = { name: 1, description: 1, price: 1, points: 1, popular: 1 };
    const chosenIds = Array.isArray(cfg.popupPlanIds) ? cfg.popupPlanIds.map(String) : [];
    let popupPlans = [];
    if (chosenIds.length) {
      const rows = await PointsPlan.find(
        { _id: { $in: chosenIds }, status: 'active' },
        PLAN_FIELDS
      ).lean();
      // Preserve the admin's ordering, which the $in query does not guarantee.
      const byId = new Map(rows.map((r) => [String(r._id), r]));
      popupPlans = chosenIds.map((id) => byId.get(id)).filter(Boolean);
    }
    // No choice made, or every chosen plan has since been hidden: fall back to
    // the cheapest active plan so the popup always has something to sell.
    const popupPlansSource = popupPlans.length ? 'admin' : 'fallback';
    if (!popupPlans.length) {
      popupPlans = await PointsPlan.find({ status: 'active' }, PLAN_FIELDS)
        .sort({ price: 1, sortOrder: 1 })
        .limit(1)
        .lean();
    }

    return res.json({
      success: true,
      pointsPerContactReveal: cfg.pointsPerContactReveal || 10,
      pointsPerTenantContactReveal: cfg.pointsPerTenantContactReveal || 20,
      pointsPerTouristContactReveal: cfg.pointsPerTouristContactReveal || 10,
      popupPlans,
      popupPlansSource,
    });
  } catch (err) {
    console.error('points-config-public error:', err);
    return res.status(500).json({ success: false, message: 'Failed to read config', error: err.message });
  }
});

// ============================================================
// POST /points-refund-request — user submits a refund request for
// a contact-reveal deduction (e.g. property already sold).
// body: { phoneNumber, transactionId, reason }
//
// Validates that the txn exists, belongs to the requester, is a
// contact-reveal deduct, and that no active (pending/approved)
// refund already exists for this transaction.
// ============================================================
router.post('/points-refund-request', async (req, res) => {
  try {
    const PointsRefundRequest = loadPointsRefundRequest();
    const { phoneNumber, transactionId, reason } = req.body || {};
    if (!phoneNumber || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber and transactionId are required',
      });
    }
    const phone = normalizePhone(phoneNumber);

    const txn = await PointsTransaction.findById(transactionId).catch(() => null);
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (txn.phoneNumber !== phone) {
      return res.status(403).json({
        success: false,
        message: 'Transaction does not belong to this user',
      });
    }
    if (
      txn.type !== 'deduct' ||
      (txn.reason !== 'view-owner-contact' && txn.reason !== 'view-tenant-contact')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Only contact-reveal deductions can be refunded',
      });
    }

    const existing = await PointsRefundRequest.findOne({
      transactionId,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          existing.status === 'approved'
            ? 'This transaction has already been refunded'
            : 'A refund request for this transaction is already pending',
        request: existing,
      });
    }

    const reqDoc = await PointsRefundRequest.create({
      phoneNumber: phone,
      transactionId,
      rentId: txn.rentId != null ? txn.rentId : null,
      points: txn.points,
      reason: String(reason || '').trim(),
    });
    return res.status(201).json({ success: true, request: reqDoc });
  } catch (err) {
    console.error('points-refund-request error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create refund request',
      error: err.message,
    });
  }
});

// ============================================================
// GET /points-refund-requests/:phoneNumber — user reads their own
// refund requests, most recent first. Used by Points History to
// render the per-row refund status pill.
// ============================================================
router.get('/points-refund-requests/:phoneNumber', async (req, res) => {
  try {
    const PointsRefundRequest = loadPointsRefundRequest();
    const phone = normalizePhone(req.params.phoneNumber);
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const requests = await PointsRefundRequest.find({ phoneNumber: phone })
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.json({ success: true, total: requests.length, requests });
  } catch (err) {
    console.error('points-refund-requests/:phone error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch refund requests',
      error: err.message,
    });
  }
});

module.exports = router;
