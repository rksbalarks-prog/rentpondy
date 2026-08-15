const express = require('express');
const router = express.Router();
const LiveUserActivity = require('./LiveActivityModel');
// Read-only lookups used to enrich the feed with who this number actually is.
const AddModel = require('../AddModel');
const PaymentPayU = require('../PayU/PayUModel');
const FollowUp = require('../FollowUp/FollowUpModel');

/**
 * Live User Activity — ingest + admin read API.
 *
 *   POST /PPC/track-activity          (user app, public, batched, fire-and-forget)
 *   GET  /PPC/live-activity           (admin feed; `since` for incremental polling)
 *   GET  /PPC/live-activity/online    (who is active right now)
 *   GET  /PPC/live-activity/stats     (counters for the header cards)
 *   GET  /PPC/live-activity/session/:sessionId   (one visitor's full trail)
 *
 * Strictly additive: no existing route, model or collection is touched.
 */

// A single batch can never write more than this many rows.
const MAX_BATCH = 50;
// Feed page size ceiling.
const MAX_LIMIT = 500;
// A visitor counts as "online" if seen within this many minutes.
const ONLINE_MINUTES = 5;

const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress ||
  '';

const str = (v, max = 500) => (v === undefined || v === null ? '' : String(v).slice(0, max));

/** Turn one raw client event into a safe document. */
const toDoc = (e, req) => ({
  phone: str(e.phone, 20),
  sessionId: str(e.sessionId, 60),
  action: str(e.action, 60) || 'UNKNOWN',
  label: str(e.label, 160),
  detail: str(e.detail, 500),
  path: str(e.path, 300),
  endpoint: str(e.endpoint, 300),
  method: str(e.method, 10).toUpperCase(),
  status: Number(e.status) || 0,
  ok: e.ok === undefined ? true : !!e.ok,
  base: str(e.base, 4) === 'CH' ? 'CH' : 'PY',
  device: str(e.device, 20),
  ip: clientIp(req),
  userAgent: str(req.headers['user-agent'], 300),
  at: e.at ? new Date(e.at) : new Date(),
});

// ── INGEST ────────────────────────────────────────────────────────────────────
// Accepts either { events: [...] } or a single event object. Always answers 200
// quickly — tracking must never slow down or break the user app.
router.post('/track-activity', async (req, res) => {
  try {
    const raw = Array.isArray(req.body?.events) ? req.body.events : [req.body];
    const docs = raw
      .filter((e) => e && typeof e === 'object' && e.action)
      .slice(0, MAX_BATCH)
      .map((e) => toDoc(e, req));

    if (!docs.length) return res.status(200).json({ success: true, saved: 0 });

    // ordered:false — one bad row must not drop the rest of the batch.
    await LiveUserActivity.insertMany(docs, { ordered: false });
    res.status(200).json({ success: true, saved: docs.length });
  } catch (error) {
    console.error('track-activity error:', error.message);
    // Still 200: the client is fire-and-forget and must not retry-storm.
    res.status(200).json({ success: false });
  }
});

// ── ADMIN FEED ────────────────────────────────────────────────────────────────
// `since` (ISO date) returns only newer rows — that is what makes the admin
// screen feel live without re-downloading the whole table every few seconds.
router.get('/live-activity', async (req, res) => {
  try {
    const { since, phone, action, base, q } = req.query;
    const limit = Math.min(Number(req.query.limit) || 100, MAX_LIMIT);

    const filter = {};
    if (since) {
      const d = new Date(since);
      // $gte, not $gt: batched events often share a millisecond, and $gt would
      // silently drop the ones landing on the same tick as the newest row the
      // client already holds. The client de-dupes by _id, so overlap is free.
      if (!isNaN(d.getTime())) filter.at = { $gte: d };
    }
    if (phone) filter.phone = { $regex: String(phone).trim(), $options: 'i' };
    if (action) filter.action = String(action).trim();
    if (base === 'PY' || base === 'CH') filter.base = base;
    if (q) {
      const rx = { $regex: String(q).trim(), $options: 'i' };
      filter.$or = [{ label: rx }, { detail: rx }, { path: rx }, { endpoint: rx }, { phone: rx }];
    }

    const rows = await LiveUserActivity.find(filter).sort({ at: -1 }).limit(limit).lean();
    res.status(200).json({ success: true, count: rows.length, rows, serverTime: new Date() });
  } catch (error) {
    console.error('live-activity error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── WHO IS ONLINE ─────────────────────────────────────────────────────────────
// One row per active visitor (grouped by phone when logged in, else by session)
// with their most recent action.
router.get('/live-activity/online', async (req, res) => {
  try {
    const minutes = Math.min(Number(req.query.minutes) || ONLINE_MINUTES, 240);
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);

    const rows = await LiveUserActivity.aggregate([
      { $match: { at: { $gte: cutoff } } },
      { $sort: { at: -1 } },
      {
        $group: {
          _id: { $cond: [{ $gt: ['$phone', ''] }, '$phone', '$sessionId'] },
          phone: { $first: '$phone' },
          sessionId: { $first: '$sessionId' },
          lastAction: { $first: '$label' },
          lastPath: { $first: '$path' },
          base: { $first: '$base' },
          device: { $first: '$device' },
          at: { $first: '$at' },
          hits: { $sum: 1 },
        },
      },
      { $sort: { at: -1 } },
      { $limit: 200 },
    ]);

    res.status(200).json({ success: true, minutes, count: rows.length, rows });
  } catch (error) {
    console.error('live-activity/online error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── HEADER COUNTERS ───────────────────────────────────────────────────────────
router.get('/live-activity/stats', async (req, res) => {
  try {
    const now = Date.now();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const last5 = new Date(now - 5 * 60 * 1000);
    const lastHour = new Date(now - 60 * 60 * 1000);

    const [today, hour, onlinePhones, onlineAll, topActions] = await Promise.all([
      LiveUserActivity.countDocuments({ at: { $gte: startOfDay } }),
      LiveUserActivity.countDocuments({ at: { $gte: lastHour } }),
      LiveUserActivity.distinct('phone', { at: { $gte: last5 }, phone: { $gt: '' } }),
      LiveUserActivity.distinct('sessionId', { at: { $gte: last5 } }),
      LiveUserActivity.aggregate([
        { $match: { at: { $gte: startOfDay } } },
        { $group: { _id: '$label', n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 8 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      today,
      lastHour: hour,
      onlineUsers: onlinePhones.length,
      onlineSessions: onlineAll.length,
      topActions,
      serverTime: new Date(),
    });
  } catch (error) {
    console.error('live-activity/stats error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── WHO IS THIS NUMBER? ───────────────────────────────────────────────────────
// Property `status` -> the wording admins already see elsewhere in the panel.
// Mirrors the switch in AddRouter.js so one number means one thing app-wide.
const DISPLAY_STATUS = {
  active: 'Approved',
  complete: 'PreApproved',
  incomplete: 'Pending',
  pending: 'Waiting Approved',
  expired: 'Expired',
  delete: 'Deleted',
  soldOut: 'Sold Out',
};
const displayStatusOf = (s) => DISPLAY_STATUS[s] || s || 'Unknown';

/** Latest non-removed PayU row per rentId, as a Map(rentId -> payustatususer). */
const paymentMapFor = async (rentIds) => {
  const map = new Map();
  if (!rentIds.length) return map;
  const payments = await PaymentPayU.find({ rentId: { $in: rentIds }, removed: { $ne: true } })
    .sort({ createdAt: -1 })
    .select('rentId payustatususer amount planName createdAt')
    .lean();
  for (const p of payments) {
    if (!map.has(p.rentId)) map.set(p.rentId, p);
  }
  return map;
};

// Bulk paid/free flags — lets the feed colour every number green (paid) or red
// (free) without one request per row.
// GET /live-activity/user-flags?phones=9876543210,9123456789
router.get('/live-activity/user-flags', async (req, res) => {
  try {
    const phones = String(req.query.phones || '')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 200);
    if (!phones.length) return res.status(200).json({ success: true, flags: {} });

    const props = await AddModel.find({ phoneNumber: { $in: phones } })
      .select('phoneNumber rentId status')
      .lean();

    const payMap = await paymentMapFor(props.map((p) => p.rentId).filter((r) => r !== undefined));

    const flags = {};
    for (const phone of phones) flags[phone] = { paid: false, properties: 0, statuses: [] };

    for (const p of props) {
      const f = flags[p.phoneNumber];
      if (!f) continue;
      f.properties += 1;
      const ds = displayStatusOf(p.status);
      if (!f.statuses.includes(ds)) f.statuses.push(ds);
      const pay = payMap.get(p.rentId);
      if (pay && String(pay.payustatususer).toLowerCase() === 'paid') f.paid = true;
    }

    res.status(200).json({ success: true, flags });
  } catch (error) {
    console.error('live-activity/user-flags error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Full picture for one number: its properties (with approval + paid state) and
// every followup raised on it, including which admin raised it.
// GET /live-activity/user-detail?phone=9876543210
router.get('/live-activity/user-detail', async (req, res) => {
  try {
    const phone = String(req.query.phone || '').trim();
    if (!phone) return res.status(400).json({ success: false, message: 'phone is required' });

    const [props, followups] = await Promise.all([
      AddModel.find({ phoneNumber: phone })
        .select('rentId status previousStatus propertyType city area createdAt updatedAt')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      FollowUp.find({ phoneNumber: phone })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    const payMap = await paymentMapFor(props.map((p) => p.rentId).filter((r) => r !== undefined));

    const properties = props.map((p) => {
      const pay = payMap.get(p.rentId);
      const payStatus = pay ? String(pay.payustatususer).toLowerCase() : '';
      return {
        rentId: p.rentId,
        status: p.status,
        displayStatus: displayStatusOf(p.status),
        propertyType: p.propertyType || '',
        city: p.city || '',
        area: p.area || '',
        createdAt: p.createdAt,
        paid: payStatus === 'paid',
        paymentStatus: payStatus || 'no payment',
        planName: pay?.planName || '',
        amount: pay?.amount || '',
        paidAt: pay?.createdAt || null,
      };
    });

    const paid = properties.some((p) => p.paid);

    res.status(200).json({
      success: true,
      phone,
      paid,
      paidLabel: paid ? 'Paid' : 'Free',
      propertyCount: properties.length,
      followupCount: followups.length,
      properties,
      followups: followups.map((f) => ({
        adminName: f.adminName || '',
        followupStatus: f.followupStatus || '',
        followupType: f.followupType || '',
        followupDate: f.followupDate,
        createdAt: f.createdAt,
        remarks: f.remarks || '',
        rentId: f.rentId || '',
        base: f.base || '',
        transferHistory: f.transferHistory || [],
      })),
    });
  } catch (error) {
    console.error('live-activity/user-detail error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── ONE VISITOR'S TRAIL ───────────────────────────────────────────────────────
router.get('/live-activity/session/:sessionId', async (req, res) => {
  try {
    const rows = await LiveUserActivity.find({ sessionId: req.params.sessionId })
      .sort({ at: -1 })
      .limit(MAX_LIMIT)
      .lean();
    res.status(200).json({ success: true, count: rows.length, rows });
  } catch (error) {
    console.error('live-activity/session error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
