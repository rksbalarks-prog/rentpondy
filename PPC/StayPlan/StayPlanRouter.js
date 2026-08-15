// ============================================================
// StayPlanRouter.js
// Stay Owners Plan endpoints (mounted at /PPC):
//   - User app : GET /stay-plans (active), GET /stay-subscription/:phone,
//                POST /select-stay-plan
//   - Admin    : GET /stay-plans?all=1, POST/PUT/PATCH/DELETE /stay-plans
//
// `active` (bool) in admin JSON  <->  status: 'active'|'hide' in the DB.
// Plan _id is a foreign key on payments/subscriptions; PUT rejects changes.
// ============================================================

const express = require('express');
const router = express.Router();

const {
  StayOwnerPlan,
  StayOwnerSubscription,
  StayPlanSelection,
} = require('./StayPlanModel');

const normalizePhone = (raw = '') =>
  String(raw).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim();

const toPlanJSON = (plan) => {
  if (!plan) return null;
  const o = plan.toObject ? plan.toObject() : plan;
  return { ...o, active: o.status === 'active' };
};

// ============================================================
// Plans — list
// ============================================================

// GET /stay-plans          → active plans (user app), sorted
// GET /stay-plans?all=1     → all plans incl. hidden (admin)
router.get('/stay-plans', async (req, res) => {
  try {
    const all = req.query.all === '1' || req.query.all === 'true';
    const query = all ? {} : { status: 'active' };
    const plans = await StayOwnerPlan.find(query).sort({ sortOrder: 1, price: 1 }).lean();
    return res.json({
      success: true,
      total: plans.length,
      plans: plans.map((p) => ({ ...p, active: p.status === 'active' })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load plans', error: err.message });
  }
});

// ============================================================
// Plans — admin CRUD
// ============================================================

router.post('/stay-plans', async (req, res) => {
  try {
    const { name, description, price, maxListings, durationDays, featured, popular, sortOrder, active } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }
    if (!(Number(price) > 0)) {
      return res.status(400).json({ success: false, message: 'price must be > 0' });
    }

    const plan = await StayOwnerPlan.create({
      name: String(name).trim(),
      description: description || '',
      price: Number(price),
      maxListings: Number(maxListings) >= 0 ? Number(maxListings) : 1,
      durationDays: Number(durationDays) || 0,
      featured: !!featured,
      popular: !!popular,
      sortOrder: Number(sortOrder) || 0,
      status: active === false ? 'hide' : 'active',
    });
    return res.status(201).json({ success: true, plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create plan', error: err.message });
  }
});

router.put('/stay-plans/:id', async (req, res) => {
  try {
    const { _id, id, active, ...rest } = req.body || {};
    if ((_id && String(_id) !== String(req.params.id)) ||
        (id && String(id) !== String(req.params.id))) {
      return res.status(400).json({ success: false, message: 'Plan _id cannot be changed' });
    }
    if (rest.price != null && !(Number(rest.price) > 0)) {
      return res.status(400).json({ success: false, message: 'price must be > 0' });
    }

    const update = { ...rest };
    if (typeof active === 'boolean') update.status = active ? 'active' : 'hide';

    const plan = await StayOwnerPlan.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update plan', error: err.message });
  }
});

router.patch('/stay-plans/:id/active', async (req, res) => {
  try {
    const { active } = req.body || {};
    if (typeof active !== 'boolean') {
      return res.status(400).json({ success: false, message: 'body { active: boolean } required' });
    }
    const plan = await StayOwnerPlan.findByIdAndUpdate(
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

router.delete('/stay-plans/:id', async (req, res) => {
  try {
    const plan = await StayOwnerPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, message: 'Plan deleted', plan: toPlanJSON(plan) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete plan', error: err.message });
  }
});

// ============================================================
// Owner subscription — read current entitlement
// ============================================================
router.get('/stay-subscription/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    const sub = await StayOwnerSubscription.findOne({ phoneNumber: phone }).lean();
    const active = !!sub && (!sub.expiresAt || new Date(sub.expiresAt) > new Date());
    return res.json({ success: true, active, subscription: sub || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to read subscription', error: err.message });
  }
});

// ============================================================
// Selection snapshot (Pay Now / Pay Later intent)
// ============================================================
router.post('/select-stay-plan', async (req, res) => {
  try {
    const { phoneNumber, planId, planName, amount } = req.body || {};
    if (!phoneNumber || !planId) {
      return res.status(400).json({ success: false, message: 'phoneNumber and planId are required' });
    }
    await StayPlanSelection.create({
      phoneNumber: normalizePhone(phoneNumber),
      planId,
      planName: planName || null,
      amount: Number(amount) || null,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to save selection', error: err.message });
  }
});

module.exports = router;
