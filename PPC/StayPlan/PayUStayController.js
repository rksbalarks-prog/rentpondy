// ============================================================
// PayUStayController.js
// PayU integration for "Stay Owners Plan" purchases. Writes
// StayPlanPayU rows and, on success, grants/extends the owner's
// StayOwnerSubscription.
//
// Credentials come from .env (shared with the Points module):
//   PAYU_KEY, PAYU_SALT, BASE_URL
// ============================================================

const crypto = require('crypto');

const {
  StayPlanPayU,
  StayOwnerSubscription,
  StayOwnerPlan,
} = require('./StayPlanModel');

const MERCHANT_KEY = process.env.PAYU_KEY || '4t4TYq';
const SALT = process.env.PAYU_SALT || 'fo4y9bmHxvV9Stt5LbIEWRbhdybPfPz0';
const BASE_URL = (process.env.BASE_URL || 'https://rentpondy.com').replace(/\/+$/, '');

// PayU callbacks hit the backend at /PPC/PPC/... (host reverse-proxies /PPC)
const SURL = `${BASE_URL}/PPC/PPC/payu/stay-success`;
const FURL = `${BASE_URL}/PPC/PPC/payu/stay-failure`;

const normalizePhone = (raw = '') =>
  String(raw).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();

const buildRedirect = (base, params) => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `${base}?${qs}` : base;
};

/* ==============================================================
   STEP 1: CREATE PAYMENT (PAY NOW)
============================================================== */
exports.createStayPayment = async (req, res) => {
  try {
    const {
      txnid, amount, productinfo, firstname, email, phone,
      payustatususer, planName, planId, maxListings, durationDays, featured,
    } = req.body;

    if (payustatususer !== 'pay now') {
      return res.status(400).json({ error: 'Invalid payment status for this endpoint' });
    }
    if (!txnid || !amount || !planId) {
      return res.status(400).json({ error: 'txnid, amount and planId are required' });
    }

    const hashString =
      `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    await StayPlanPayU.findOneAndUpdate(
      { txnid },
      {
        txnid,
        status: 'process',
        amount,
        productinfo,
        firstname,
        email,
        phone: normalizePhone(phone),
        payustatususer,
        planName,
        planId,
        maxListings: Number(maxListings) || 0,
        durationDays: Number(durationDays) || 0,
        featured: !!featured,
        payUdate: new Date().toISOString(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      key: MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: SURL,
      furl: FURL,
      service_provider: 'payu_paisa',
      hash,
    });
  } catch (err) {
    console.error('createStayPayment error:', err);
    return res.status(500).json({ error: 'Payment creation failed', details: err.message });
  }
};

/* ==============================================================
   STEP 2: PAY LATER
============================================================== */
exports.saveStayPayLater = async (req, res) => {
  try {
    const {
      txnid, amount, productinfo, firstname, email, phone,
      payustatususer, planName, planId, maxListings, durationDays, featured,
    } = req.body;

    if (payustatususer !== 'pay later') {
      return res.status(400).json({ error: 'Invalid pay later request' });
    }

    await StayPlanPayU.findOneAndUpdate(
      { txnid },
      {
        txnid,
        status: 'pending',
        amount,
        productinfo,
        firstname,
        email,
        phone: normalizePhone(phone),
        payustatususer,
        planName,
        planId,
        maxListings: Number(maxListings) || 0,
        durationDays: Number(durationDays) || 0,
        featured: !!featured,
        payUdate: new Date().toISOString(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: 'Pay later saved successfully' });
  } catch (err) {
    console.error('saveStayPayLater error:', err);
    return res.status(500).json({ error: 'Pay later failed', details: err.message });
  }
};

/* ==============================================================
   Grant/extend subscription — idempotent on (phoneNumber + txnId)
============================================================== */
const grantSubscriptionOnce = async ({ phoneNumber, planId, planName, maxListings, durationDays, featured, amount, txnId }) => {
  const phone = normalizePhone(phoneNumber);
  if (!phone || !txnId) return null;

  // Idempotency: if this txn already applied, return current state
  const existing = await StayOwnerSubscription.findOne({ phoneNumber: phone });
  if (existing && existing.lastTxnId === txnId) {
    return { subscription: existing, alreadyApplied: true };
  }

  const now = new Date();
  // Extend from the later of "now" and the current (still-valid) expiry
  let base = now;
  if (existing && existing.expiresAt && new Date(existing.expiresAt) > now) {
    base = new Date(existing.expiresAt);
  }
  const days = Number(durationDays) || 0;
  const expiresAt = days > 0 ? new Date(base.getTime() + days * 24 * 60 * 60 * 1000) : null;

  const updated = await StayOwnerSubscription.findOneAndUpdate(
    { phoneNumber: phone },
    {
      $set: {
        planId: planId || null,
        planName: planName || null,
        maxListings: Number(maxListings) || 0,
        featured: !!featured,
        startAt: existing && existing.startAt ? existing.startAt : now,
        expiresAt,
        lastTxnId: txnId,
        lastAmount: Number(amount) || 0,
      },
      $inc: { totalPaid: Number(amount) || 0 },
      $setOnInsert: { phoneNumber: phone },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return { subscription: updated, alreadyApplied: false };
};

/* ==============================================================
   STEP 3: PAYMENT SUCCESS (grants subscription)
============================================================== */
exports.handleStayPaymentSuccess = async (req, res) => {
  try {
    const body = { ...req.query, ...req.body };
    const { txnid, status, amount, firstname, email, phone, mihpayid } = body;
    let { planName } = body;

    if (status && status !== 'success') {
      return res.redirect(buildRedirect(`${BASE_URL}/stay-payment-result`, { status: 'failure', txnid }));
    }

    const existing = await StayPlanPayU.findOne({ txnid });
    if (!existing) {
      console.error('StayPlanPayU row not found for txnid:', txnid);
      return res.redirect(buildRedirect(`${BASE_URL}/stay-payment-result`, { status: 'failure', txnid }));
    }

    const buyerPhone = existing.phone || normalizePhone(phone);

    if (existing.status !== 'success') {
      await StayPlanPayU.updateOne(
        { _id: existing._id },
        {
          $set: {
            status: 'success',
            payustatususer: 'paid',
            mihpayid,
            payUdate: new Date().toISOString(),
            planName: planName || existing.planName,
          },
        }
      );
    }

    let result = null;
    try {
      result = await grantSubscriptionOnce({
        phoneNumber: buyerPhone,
        planId: existing.planId,
        planName: planName || existing.planName,
        maxListings: existing.maxListings,
        durationDays: existing.durationDays,
        featured: existing.featured,
        amount,
        txnId: mihpayid || txnid,
      });
    } catch (subErr) {
      console.error('grantSubscriptionOnce error (non-fatal for redirect):', subErr);
    }

    return res.redirect(
      buildRedirect(`${BASE_URL}/stay-payment-result`, {
        status: 'success',
        txnid,
        firstname,
        amount,
        phone: buyerPhone,
        mihpayid,
        planName: planName || existing.planName,
        expiresAt: result?.subscription?.expiresAt
          ? new Date(result.subscription.expiresAt).toISOString()
          : '',
      })
    );
  } catch (err) {
    console.error('handleStayPaymentSuccess error:', err);
    return res.redirect(buildRedirect(`${BASE_URL}/stay-payment-result`, { status: 'failure' }));
  }
};

/* ==============================================================
   STEP 4: PAYMENT FAILURE
============================================================== */
exports.handleStayPaymentFailure = async (req, res) => {
  try {
    const body = { ...req.query, ...req.body };
    const { txnid, firstname, amount, phone, mihpayid, planName } = body;

    await StayPlanPayU.findOneAndUpdate(
      { txnid },
      {
        $set: {
          status: 'failure',
          payustatususer: 'pay failed',
          mihpayid,
          payUdate: new Date().toISOString(),
          planName: planName || undefined,
        },
      }
    );

    return res.redirect(
      buildRedirect(`${BASE_URL}/stay-payment-result`, {
        status: 'failure',
        txnid,
        firstname,
        amount,
        phone,
        planName,
      })
    );
  } catch (err) {
    console.error('handleStayPaymentFailure error:', err);
    return res.redirect(buildRedirect(`${BASE_URL}/stay-payment-result`, { status: 'failure' }));
  }
};

/* ==============================================================
   STEP 5/6: ADMIN DEBUG — list by status / delete a record
============================================================== */
exports.getStayPaymentsByStatus = (status) => async (req, res) => {
  try {
    const rows = await StayPlanPayU.find({ payustatususer: status }).sort({ createdAt: -1 });
    return res.json({ success: true, total: rows.length, payments: rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteStayPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await StayPlanPayU.findById(id);
    if (!row) return res.status(404).json({ success: false, message: 'Record not found.' });
    if (row.payustatususer === 'paid') {
      return res.status(400).json({ success: false, message: 'Paid records cannot be deleted.' });
    }
    await StayPlanPayU.deleteOne({ _id: id });
    return res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
