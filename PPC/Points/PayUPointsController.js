// ============================================================
// PayUPointsController.js
// PayU integration for Points plan purchases. Writes PointsPayU
// rows and, on success, credits the buyer's PointsBalance +
// writes a PointsTransaction entry.
//
// Credentials come from .env:
//   PAYU_KEY, PAYU_SALT, BASE_URL
// ============================================================

const crypto = require('crypto');

const {
  PointsPayU,
  PointsBalance,
  PointsTransaction,
  PointsPlan,
} = require('./PointsModel');

const MERCHANT_KEY = process.env.PAYU_KEY || '4t4TYq';
const SALT = process.env.PAYU_SALT || 'fo4y9bmHxvV9Stt5LbIEWRbhdybPfPz0';
const BASE_URL = (process.env.BASE_URL || 'https://rentpondy.com').replace(/\/+$/, '');

// PayU callbacks hit the backend at /PPC/PPC/... because the host
// reverse-proxies /PPC → server which itself mounts /PPC prefix.
const SURL = `${BASE_URL}/PPC/PPC/payu/points-success`;
const FURL = `${BASE_URL}/PPC/PPC/payu/points-failure`;

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
exports.createPointsPayment = async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      planId,
      points,
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

    await PointsPayU.findOneAndUpdate(
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
        points: Number(points) || 0,
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
    console.error('createPointsPayment error:', err);
    return res.status(500).json({ error: 'Payment creation failed', details: err.message });
  }
};

/* ==============================================================
   STEP 2: PAY LATER
============================================================== */
exports.savePointsPayLater = async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      payustatususer,
      planName,
      planId,
      points,
    } = req.body;

    if (payustatususer !== 'pay later') {
      return res.status(400).json({ error: 'Invalid pay later request' });
    }

    await PointsPayU.findOneAndUpdate(
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
        points: Number(points) || 0,
        payUdate: new Date().toISOString(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: 'Pay later saved successfully' });
  } catch (err) {
    console.error('savePointsPayLater error:', err);
    return res.status(500).json({ error: 'Pay later failed', details: err.message });
  }
};

/* ==============================================================
   Credit helper — idempotent on (phoneNumber + txnId)
============================================================== */
const creditPointsOnce = async ({ phoneNumber, points, planId, planName, amount, txnId }) => {
  const phone = normalizePhone(phoneNumber);
  const pts = Number(points) || 0;
  if (!phone || pts <= 0) return null;

  const existing = await PointsTransaction.findOne({
    phoneNumber: phone,
    txnId,
    type: 'credit',
  });
  if (existing) {
    const bal = await PointsBalance.findOne({ phoneNumber: phone });
    return { balance: bal?.balance ?? existing.balanceAfter, alreadyCredited: true };
  }

  const updated = await PointsBalance.findOneAndUpdate(
    { phoneNumber: phone },
    {
      $inc: { balance: pts, totalEarned: pts, totalPaid: Number(amount) || 0 },
      $set: { lastActivityAt: new Date() },
      $setOnInsert: { phoneNumber: phone },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await PointsTransaction.create({
    phoneNumber: phone,
    type: 'credit',
    points: pts,
    balanceAfter: updated.balance,
    planId: planId || null,
    planName: planName || null,
    reason: 'purchase',
    txnId: txnId || null,
    amount: Number(amount) || null,
  });

  return { balance: updated.balance, alreadyCredited: false };
};

/* ==============================================================
   STEP 3: PAYMENT SUCCESS (also auto-credits points)
============================================================== */
exports.handlePointsPaymentSuccess = async (req, res) => {
  try {
    const body = { ...req.query, ...req.body };
    const {
      txnid,
      status,
      amount,
      firstname,
      email,
      phone,
      mihpayid,
    } = body;

    let { planName } = body;

    if (status && status !== 'success') {
      return res.redirect(`${BASE_URL}/points-payment-failure?${new URLSearchParams(body).toString()}`);
    }

    const existing = await PointsPayU.findOne({ txnid });
    if (!existing) {
      console.error('PointsPayU row not found for txnid:', txnid);
      // Still attempt a credit if udf1 + udf2 + phone are present,
      // then redirect to failure so support can investigate.
      return res.redirect(`${BASE_URL}/points-payment-failure?${new URLSearchParams(body).toString()}`);
    }

    try {
      const parsed = typeof planName === 'string' ? JSON.parse(planName) : null;
      if (parsed && parsed.planName) planName = parsed.planName;
    } catch {
      /* planName is a plain string */
    }

    const planId = existing.planId || null;
    const points = Number(existing.points) || 0;
    const buyerPhone = existing.phone || normalizePhone(phone);

    if (existing.status !== 'success') {
      await PointsPayU.updateOne(
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

    // Credit points (idempotent)
    let creditResult = null;
    try {
      creditResult = await creditPointsOnce({
        phoneNumber: buyerPhone,
        points,
        planId,
        planName: planName || existing.planName,
        amount,
        txnId: mihpayid || txnid,
      });
    } catch (creditErr) {
      console.error('creditPointsOnce error (non-fatal for redirect):', creditErr);
    }

    return res.redirect(
      buildRedirect(`${BASE_URL}/points-payment-success`, {
        txnid,
        firstname,
        status: 'success',
        amount,
        email,
        phone: buyerPhone,
        mihpayid,
        planName: planName || existing.planName,
        planId,
        points,
        balance: creditResult?.balance,
        payUdate: existing.payUdate,
      })
    );
  } catch (err) {
    console.error('handlePointsPaymentSuccess error:', err);
    return res.redirect(`${BASE_URL}/points-payment-failure`);
  }
};

/* ==============================================================
   STEP 4: PAYMENT FAILURE
============================================================== */
exports.handlePointsPaymentFailure = async (req, res) => {
  try {
    const body = { ...req.query, ...req.body };
    const { txnid, firstname, amount, email, phone, mihpayid, planName, status } = body;

    await PointsPayU.findOneAndUpdate(
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
      buildRedirect(`${BASE_URL}/points-payment-failure`, {
        txnid,
        firstname,
        status: status || 'failure',
        amount,
        email,
        phone,
        mihpayid,
        planName,
      })
    );
  } catch (err) {
    console.error('handlePointsPaymentFailure error:', err);
    return res.redirect(`${BASE_URL}/points-payment-failure`);
  }
};

/* ==============================================================
   STEP 5: LIST PAYMENTS BY STATUS (admin/support debug)
============================================================== */
exports.getPointsPaymentsByStatus = (status) => async (req, res) => {
  try {
    const rows = await PointsPayU.find({ payustatususer: status }).sort({ createdAt: -1 });
    return res.json({ success: true, total: rows.length, payments: rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* ==============================================================
   STEP 6: DELETE A PAYMENT RECORD (admin)
   Hard-deletes a single PointsPayU row by _id. Paid records are
   protected — only pay now / pay later / pay failed can be removed.
============================================================== */
exports.deletePointsPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const row = await PointsPayU.findById(id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    if (row.payustatususer === 'paid') {
      return res
        .status(400)
        .json({ success: false, message: 'Paid records cannot be deleted.' });
    }

    await PointsPayU.deleteOne({ _id: id });
    return res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
