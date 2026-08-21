// ============================================================
// PointsPricingRouter.js
//
// Admin-only endpoints for the Points Pricing module consumed
// by the admin panel (src/PointsPricing/*.jsx).
//
// Mount in server.js AFTER the base PointsRouter:
//   const PointsPricingRouter = require('./backend/PointsPricingRouter');
//   app.use('/PPC/admin', PointsPricingRouter);
//
// Frontend base URL is REACT_APP_API_URL, which already ends
// with /PPC, so the admin UI hits e.g. /admin/points-plans.
//
// Conventions:
//   - Reads/writes share collections with the user-facing
//     PointsRouter. Never create a parallel collection.
//   - `active` (bool) in admin JSON <-> `status: 'active'|'hide'`
//     in the DB. Translate here, leave the model alone.
//   - DELETE hard-removes the plan unconditionally. Historic
//     PointsTransaction / PointsPayU rows already snapshot
//     `planName`, so receipts still render after deletion; only
//     the `planId` reference becomes dangling (no FK constraint).
//     To keep a plan but stop selling it, use the PATCH /active
//     toggle to hide it.
//   - Plan _id is a foreign key in PointsTransaction/PointsPayU;
//     PUT rejects any attempt to change it.
// ============================================================

const express = require('express');
const router = express.Router();

const {
  PointsPlan,
  PointsBalance,
  PointsTransaction,
  PointsPayU,
  PointsPayLaterLead,
  PointsConfig,
  PointsRefundRequest,
} = require('./PointsPricingModel');

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------
const normalizePhone = (raw = '') =>
  String(raw).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();

const toPlanJSON = (plan) => {
  if (!plan) return null;
  const o = plan.toObject ? plan.toObject() : plan;
  return { ...o, active: o.status === 'active' };
};

const parseIntOr = (v, fallback) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// Admin-side sentinel used to tag manual balance adjustments
// (PointsTransaction.type only allows 'credit' | 'deduct').
const MANUAL_ADJUST_PREFIX = 'MANUAL-ADJUST';

// ============================================================
// SECTION A — Plans CRUD
// ============================================================

// NOTE: Admin list ("all plans including hidden") is served by the
// shared PointsRouter at GET /points-plans?all=1 to avoid routing
// collisions now that both routers are mounted under /PPC. Keep
// create/update/delete handlers here.

// Create a new plan.
router.post('/points-plans', async (req, res) => {
  try {
    const {
      name, description, price, points, durationDays, popular, sortOrder, active,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }
    if (!(Number(price) > 0)) {
      return res.status(400).json({ success: false, message: 'price must be > 0' });
    }
    if (!(Number(points) > 0)) {
      return res.status(400).json({ success: false, message: 'points must be > 0' });
    }

    const plan = await PointsPlan.create({
      name: String(name).trim(),
      description: description || '',
      price: Number(price),
      points: Number(points),
      durationDays: Number(durationDays) || 0,
      popular: !!popular,
      sortOrder: Number(sortOrder) || 0,
      status: active === false ? 'hide' : 'active',
    });
    return res.status(201).json({ success: true, plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create plan', error: err.message });
  }
});

// Update a plan. _id may not change.
router.put('/points-plans/:id', async (req, res) => {
  try {
    const { _id, id, active, ...rest } = req.body || {};
    if ((_id && String(_id) !== String(req.params.id)) ||
        (id && String(id) !== String(req.params.id))) {
      return res.status(400).json({ success: false, message: 'Plan _id cannot be changed' });
    }

    if (rest.price != null && !(Number(rest.price) > 0)) {
      return res.status(400).json({ success: false, message: 'price must be > 0' });
    }
    if (rest.points != null && !(Number(rest.points) > 0)) {
      return res.status(400).json({ success: false, message: 'points must be > 0' });
    }

    const update = { ...rest };
    if (typeof active === 'boolean') update.status = active ? 'active' : 'hide';

    const plan = await PointsPlan.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update plan', error: err.message });
  }
});

// Toggle active flag.
router.patch('/points-plans/:id/active', async (req, res) => {
  try {
    const { active } = req.body || {};
    if (typeof active !== 'boolean') {
      return res.status(400).json({ success: false, message: 'body { active: boolean } required' });
    }
    const plan = await PointsPlan.findByIdAndUpdate(
      req.params.id,
      { status: active ? 'active' : 'hide' },
      { new: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to toggle plan', error: err.message });
  }
});

// Hard-delete a plan. Historic PointsTransaction / PointsPayU rows
// already snapshot planName, so they remain readable after deletion.
router.delete('/points-plans/:id', async (req, res) => {
  try {
    const plan = await PointsPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, message: 'Plan deleted', plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete plan', error: err.message });
  }
});

// ============================================================
// SECTION B — Users + manual balance adjust
// ============================================================

// Paginated users. Optional ?phone= filter (substring match).
router.get('/points-users', async (req, res) => {
  try {
    const page = parseIntOr(req.query.page, 1);
    const limit = Math.min(parseIntOr(req.query.limit, 25), 200);
    const filter = {};
    if (req.query.phone) {
      const q = normalizePhone(req.query.phone);
      filter.phoneNumber = { $regex: q, $options: 'i' };
    }
    const [total, users] = await Promise.all([
      PointsBalance.countDocuments(filter),
      PointsBalance.find(filter)
        .sort({ lastActivityAt: -1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);
    return res.json({ success: true, total, page, limit, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to list users', error: err.message });
  }
});

// Manually create a new Points user with a zero balance.
// body: { phoneNumber, adminId? }  Returns 409 if already exists.
router.post('/points-users', async (req, res) => {
  try {
    const { phoneNumber } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    }
    const phone = normalizePhone(phoneNumber);
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' });
    }

    const existing = await PointsBalance.findOne({ phoneNumber: phone });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        user: existing,
      });
    }

    const user = await PointsBalance.create({
      phoneNumber: phone,
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      totalPaid: 0,
      lastActivityAt: new Date(),
    });
    return res.status(201).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
  }
});

// Manual credit/debit. body: { phoneNumber, points (signed int), reason, adminId }
// +N credits, -N debits. Writes a PointsTransaction with a note starting
// with MANUAL_ADJUST_PREFIX so the admin ledger can filter for adjustments.
router.post('/points-adjust', async (req, res) => {
  try {
    const { phoneNumber, points, reason, adminId } = req.body || {};
    const delta = Number(points);
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'phoneNumber is required' });
    }
    if (!Number.isFinite(delta) || delta === 0) {
      return res.status(400).json({ success: false, message: 'points must be a non-zero number' });
    }
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ success: false, message: 'reason is required' });
    }

    const phone = normalizePhone(phoneNumber);
    let doc = await PointsBalance.findOne({ phoneNumber: phone });
    if (!doc) doc = await PointsBalance.create({ phoneNumber: phone, balance: 0 });

    if (delta < 0 && doc.balance < Math.abs(delta)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot debit more than current balance',
        balance: doc.balance,
      });
    }

    // Atomic balance update using $inc to avoid lost-update races.
    const inc = { balance: delta };
    if (delta > 0) inc.totalEarned = delta;
    else inc.totalSpent = -delta;

    const updated = await PointsBalance.findOneAndUpdate(
      { phoneNumber: phone },
      { $inc: inc, $set: { lastActivityAt: new Date() } },
      { new: true }
    );

    const type = delta > 0 ? 'credit' : 'deduct';
    const note = `${MANUAL_ADJUST_PREFIX} | ${String(reason).trim()} | by ${adminId || 'unknown'}`;

    const txn = await PointsTransaction.create({
      phoneNumber: phone,
      type,
      points: Math.abs(delta),
      balanceAfter: updated.balance,
      reason: 'manual-adjust',
      note,
    });

    return res.json({ success: true, balance: updated.balance, transaction: txn });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to adjust balance', error: err.message });
  }
});

// ============================================================
// SECTION C — Transactions ledger
// ============================================================
//
// Logical type filters the admin UI exposes:
//   purchase       -> type:'credit' AND txnId != null AND note !~ MANUAL-ADJUST
//   contact-reveal -> type:'deduct' AND reason == 'view-owner-contact'
//   manual-adjust  -> note starts with MANUAL-ADJUST
//   refund         -> reserved; currently alias for manual-adjust with reason 'refund'
router.get('/points-transactions', async (req, res) => {
  try {
    const page = parseIntOr(req.query.page, 1);
    const limit = Math.min(parseIntOr(req.query.limit, 50), 500);
    const filter = {};

    if (req.query.phone) filter.phoneNumber = normalizePhone(req.query.phone);
    if (req.query.planId) filter.planId = req.query.planId;

    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }

    switch (req.query.type) {
      case 'purchase':
        filter.type = 'credit';
        filter.txnId = { $ne: null };
        filter.note = { $not: /^MANUAL-ADJUST/ };
        break;
      case 'contact-reveal':
        filter.type = 'deduct';
        filter.reason = 'view-owner-contact';
        break;
      case 'manual-adjust':
        filter.note = { $regex: `^${MANUAL_ADJUST_PREFIX}` };
        break;
      case 'refund':
        filter.note = { $regex: `^${MANUAL_ADJUST_PREFIX} \\| refund`, $options: 'i' };
        break;
      case 'credit':
      case 'deduct':
        filter.type = req.query.type;
        break;
      default:
        break;
    }

    const [total, txns] = await Promise.all([
      PointsTransaction.countDocuments(filter),
      PointsTransaction.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return res.json({ success: true, total, page, limit, transactions: txns });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err.message });
  }
});

// ============================================================
// SECTION D — Pay-later leads
// ============================================================

// List pay-later leads. Merges PointsPayU rows with
// PointsPayLaterLead follow-up rows. Optional ?status= filters on lead status.
router.get('/points-paylater', async (req, res) => {
  try {
    const page = parseIntOr(req.query.page, 1);
    const limit = Math.min(parseIntOr(req.query.limit, 50), 500);

    const payUFilter = { payustatususer: 'pay later' };
    const [payURows, total] = await Promise.all([
      PointsPayU.find(payUFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      PointsPayU.countDocuments(payUFilter),
    ]);

    const txnIds = payURows.map((r) => r.txnid);
    const leads = await PointsPayLaterLead.find({ _id: { $in: txnIds } });
    const leadMap = new Map(leads.map((l) => [l._id, l]));

    const merged = payURows.map((r) => {
      const lead = leadMap.get(r.txnid);
      return {
        ...r.toObject(),
        leadStatus: lead?.status || 'new',
        leadNote: lead?.note || '',
        lastContactAt: lead?.lastContactAt || null,
        updatedBy: lead?.updatedBy || null,
      };
    });

    const filtered = req.query.status
      ? merged.filter((row) => row.leadStatus === req.query.status)
      : merged;

    return res.json({ success: true, total, page, limit, leads: filtered });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to list pay-later leads', error: err.message });
  }
});

// Update a lead. :id is the PayU txnid. body: { status, note, adminId }
router.patch('/points-paylater/:id', async (req, res) => {
  try {
    const { status, note, adminId } = req.body || {};
    if (status && !['new', 'contacted', 'converted', 'dropped'].includes(status)) {
      return res.status(400).json({ success: false, message: 'invalid status' });
    }

    // Confirm the underlying PayU row exists — prevents writing leads for unknown txnids.
    const payu = await PointsPayU.findOne({ txnid: req.params.id });
    if (!payu) return res.status(404).json({ success: false, message: 'PayU record not found' });

    const now = new Date();
    const set = { updatedBy: adminId || null };
    if (status) set.status = status;
    if (typeof note === 'string') set.note = note;
    if (status === 'contacted' || status === 'converted') set.lastContactAt = now;

    const historyEntry = {
      status: status || undefined,
      note: note || undefined,
      by: adminId || undefined,
      at: now,
    };

    const lead = await PointsPayLaterLead.findOneAndUpdate(
      { _id: req.params.id },
      { $set: set, $push: { history: historyEntry }, $setOnInsert: { _id: req.params.id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, lead });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update lead', error: err.message });
  }
});

// ============================================================
// SECTION E — Config (singleton)
// ============================================================

const getConfig = async () => {
  let cfg = await PointsConfig.findById('points-config');
  if (!cfg) cfg = await PointsConfig.create({ _id: 'points-config' });
  return cfg;
};

router.get('/points-config', async (req, res) => {
  try {
    const cfg = await getConfig();
    return res.json({ success: true, config: cfg });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to read config', error: err.message });
  }
});

router.put('/points-config', async (req, res) => {
  try {
    const { pointsPerContactReveal, pointsPerTenantContactReveal, pointsPerTouristContactReveal, popupPlanIds, adminId } = req.body || {};
    const update = { updatedBy: adminId || null };
    if (pointsPerContactReveal != null) {
      const n = Number(pointsPerContactReveal);
      if (!Number.isFinite(n) || n < 1) {
        return res.status(400).json({ success: false, message: 'pointsPerContactReveal must be >= 1' });
      }
      update.pointsPerContactReveal = n;
    }
    if (pointsPerTenantContactReveal != null) {
      const n = Number(pointsPerTenantContactReveal);
      if (!Number.isFinite(n) || n < 1) {
        return res.status(400).json({ success: false, message: 'pointsPerTenantContactReveal must be >= 1' });
      }
      update.pointsPerTenantContactReveal = n;
    }
    if (pointsPerTouristContactReveal != null) {
      const n = Number(pointsPerTouristContactReveal);
      if (!Number.isFinite(n) || n < 1) {
        return res.status(400).json({ success: false, message: 'pointsPerTouristContactReveal must be >= 1' });
      }
      update.pointsPerTouristContactReveal = n;
    }
    // Plans to show in the user app's "no points" popup. Sent as an array of
    // PointsPlan _id strings, in display order. An empty array is a valid,
    // meaningful value — it clears the choice and puts the popup back on its
    // cheapest-active-plan fallback — so this is checked with Array.isArray
    // rather than a truthiness test.
    if (Array.isArray(popupPlanIds)) {
      const ids = [...new Set(popupPlanIds.map((x) => String(x || '').trim()).filter(Boolean))];
      const bad = ids.filter((id) => !/^[0-9a-fA-F]{24}$/.test(id));
      if (bad.length) {
        return res.status(400).json({ success: false, message: `Invalid plan id: ${bad[0]}` });
      }
      if (ids.length) {
        const found = await PointsPlan.find({ _id: { $in: ids } }, { _id: 1 }).lean();
        if (found.length !== ids.length) {
          return res.status(400).json({ success: false, message: 'One or more selected plans no longer exist' });
        }
      }
      update.popupPlanIds = ids;
    }

    const cfg = await PointsConfig.findByIdAndUpdate(
      'points-config',
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, config: cfg });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update config', error: err.message });
  }
});

// ============================================================
// SECTION F — Refund requests
// ============================================================

// List refund requests for the admin screen.
// Query: ?page&limit&status&phone
// Default sort: most recent first. Default status filter: none
// (so a row the admin just resolved stays visible).
router.get('/points-refund-requests', async (req, res) => {
  try {
    const page = parseIntOr(req.query.page, 1);
    const limit = Math.min(parseIntOr(req.query.limit, 50), 500);

    const filter = {};
    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.phone) {
      filter.phoneNumber = normalizePhone(req.query.phone);
    }

    const [total, requests] = await Promise.all([
      PointsRefundRequest.countDocuments(filter),
      PointsRefundRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);
    return res.json({ success: true, total, page, limit, requests });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to list refund requests',
      error: err.message,
    });
  }
});

// Resolve a refund request. body: { status: 'approved'|'rejected', adminId, adminNote }
//
// On approval:
//   - $inc PointsBalance.balance + totalEarned by reqDoc.points (atomic)
//   - create a credit row in PointsTransaction with reason 'refund'
//     and note 'REFUND | request <id> | by <admin> | <note>'
//   - mark request approved, store adminId, resolvedAt, refundTxnId
router.patch('/points-refund-requests/:id', async (req, res) => {
  try {
    const { status, adminId, adminNote } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be approved or rejected',
      });
    }

    const reqDoc = await PointsRefundRequest.findById(req.params.id);
    if (!reqDoc) {
      return res.status(404).json({ success: false, message: 'Refund request not found' });
    }
    if (reqDoc.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: `Already ${reqDoc.status}`,
      });
    }

    const now = new Date();
    const cleanNote = String(adminNote || '').trim();

    if (status === 'rejected') {
      reqDoc.status = 'rejected';
      reqDoc.adminId = adminId || null;
      reqDoc.adminNote = cleanNote;
      reqDoc.resolvedAt = now;
      await reqDoc.save();
      return res.json({ success: true, request: reqDoc });
    }

    // Approval path — atomic credit back to the user's balance.
    const updated = await PointsBalance.findOneAndUpdate(
      { phoneNumber: reqDoc.phoneNumber },
      {
        $inc: { balance: reqDoc.points, totalEarned: reqDoc.points },
        $set: { lastActivityAt: now },
        $setOnInsert: { phoneNumber: reqDoc.phoneNumber },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const refundNote =
      `REFUND | request ${reqDoc._id} | by ${adminId || 'admin'}` +
      (cleanNote ? ` | ${cleanNote}` : '');

    const creditTxn = await PointsTransaction.create({
      phoneNumber: reqDoc.phoneNumber,
      type: 'credit',
      points: reqDoc.points,
      balanceAfter: updated.balance,
      reason: 'refund',
      note: refundNote,
      rentId: reqDoc.rentId != null ? reqDoc.rentId : null,
    });

    reqDoc.status = 'approved';
    reqDoc.adminId = adminId || null;
    reqDoc.adminNote = cleanNote;
    reqDoc.resolvedAt = now;
    reqDoc.refundTxnId = String(creditTxn._id);
    await reqDoc.save();

    return res.json({
      success: true,
      request: reqDoc,
      balance: updated.balance,
      transaction: creditTxn,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update refund request',
      error: err.message,
    });
  }
});

module.exports = router;
