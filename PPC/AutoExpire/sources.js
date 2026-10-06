// RentPondy-specific half: what counts as a live record, which dates restart
// its clock, what paid cover protects it, and how to expire it.
//
// Reads go through the raw driver (Model.collection) so the city-scope plugin
// never narrows them and legacy documents never fail hydration. Writes are
// guarded by the status the record had when it was read, so a record an admin
// changed mid-run is left alone.

const AddModel = require('../AddModel');
const BuyerAssistance = require('../BuyerAssistance/BuyerAssistanceModel');
const Bill = require('../CreateBill/BillModel');
const BuyerBill = require('../CreateBuyerBill/BuyerBillModel');
const PaymentPayU = require('../PayU/PayUModel');
const PaymentPayUBuyer = require('../PayuBuyer/PayuBuyerModel');
const PricingPlans = require('../plans/PricingPlanModel');
const BuyerPlan = require('../BuyerPlan/BuyerModel');
const { AdExpressAd } = require('../AdExpress/AdExpressModel');
const { DAY, toMs } = require('./engine');

const phoneKey = (v) => String(v || '').replace(/\D/g, '').slice(-10);
const lower = (v) => String(v || '').trim().toLowerCase();

const push = (map, key, value) => {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
};

// ── shared bill / payment readers (property and tenant bills share a shape) ──

const billDay = (b) => {
  const d = toMs(b.billDate);
  return Number.isFinite(d) ? d : toMs(b.createdAt);
};

// Office bills: 'Free' is how most are written, but a handful say Free with a
// real amount. Any money at all counts as paid — the cautious reading.
const isPaidBill = (b) =>
  Number(b.netAmount) > 0 || (!/free/i.test(String(b.paymentType || '')) && Number(b.billAmount) > 0);

const billCoverDays = (b) =>
  Math.max(Number(b.validity) || 0, Number(b.featuredAmount) > 0 ? Number(b.featuredValidity) || 0 : 0);

// The moment a PayU payment counts from. A 'pay later' row is created first and
// flipped to 'paid' afterwards, so take the later of the two dates on it.
const paidAt = (p) => Math.max(...[toMs(p.payUdate), toMs(p.createdAt)].filter(Number.isFinite));

/** Turn bills + payments into clock / protect entries for one record. */
function signalsFor({ key, phone, billsByKey, paidBillsByPhone, paysByKey, paysByPhone, durationOf }) {
  const clock = [];
  const protect = [];

  for (const b of billsByKey.get(key) || []) {
    const day = billDay(b);
    clock.push({ at: day, why: 'bill' });
    if (isPaidBill(b)) protect.push({ until: day + billCoverDays(b) * DAY, why: 'paid-bill' });
  }
  for (const b of paidBillsByPhone.get(phone) || []) {
    if (String(b.key) === key) continue;
    protect.push({ until: billDay(b) + billCoverDays(b) * DAY, why: 'owner-paid-bill' });
  }
  for (const p of paysByKey.get(key) || []) {
    const at = paidAt(p);
    clock.push({ at, why: 'payment' });
    protect.push({ until: at + durationOf(p) * DAY, why: 'paid-online' });
  }
  for (const p of paysByPhone.get(phone) || []) {
    if (String(p.key) === key) continue;
    protect.push({ until: paidAt(p) + durationOf(p) * DAY, why: 'owner-paid-online' });
  }
  return { clock, protect };
}

/** Plan length in days for a payment: the plan its record is enrolled in, else the plan it names. */
function planLookup(plans, nameField, enrolKey, daysOf, fallback) {
  const byName = new Map();
  const byKey = new Map();
  for (const plan of plans) {
    const days = daysOf(plan);
    byName.set(lower(plan[nameField]), days);
    for (const entry of plan.phoneNumbers || []) {
      const k = String(entry && entry[enrolKey] != null ? entry[enrolKey] : '');
      if (k && (byKey.get(k) || 0) < days) byKey.set(k, days);
    }
  }
  return { durationOf: (p) => byKey.get(String(p.key)) || byName.get(lower(p.planName)) || fallback };
}

function indexBillsAndPays(bills, pays, keyField) {
  const billsByKey = new Map();
  const paidBillsByPhone = new Map();
  for (const b of bills) {
    b.key = String(b[keyField] ?? '');
    push(billsByKey, b.key, b);
    if (isPaidBill(b)) push(paidBillsByPhone, phoneKey(b.ownerPhone), b);
  }
  const paysByKey = new Map();
  const paysByPhone = new Map();
  for (const p of pays) {
    p.key = String(p[keyField] ?? '');
    push(paysByKey, p.key, p);
    push(paysByPhone, phoneKey(p.phone), p);
  }
  return { billsByKey, paidBillsByPhone, paysByKey, paysByPhone };
}

// ── Properties ───────────────────────────────────────────────────────────────

async function loadProperties(cfg, restoredAt) {
  const [props, adexBatches, adexRentIds, bills, pays, plans] = await Promise.all([
    AddModel.collection
      .find(
        { status: { $in: cfg.propertyStatuses }, isDeleted: { $ne: true } },
        {
          projection: {
            rentId: 1, phoneNumber: 1, status: 1, createdAt: 1, updatedAt: 1,
            previousStatus: 1, bulkUploadId: 1, featureStatus: 1,
          },
        }
      )
      .toArray(),
    AdExpressAd.collection.distinct('bulkUploadId'),
    AdExpressAd.collection.distinct('importedRentId'),
    Bill.collection
      .find({}, {
        projection: {
          rentId: 1, ownerPhone: 1, billDate: 1, createdAt: 1, paymentType: 1,
          netAmount: 1, billAmount: 1, validity: 1, featuredAmount: 1, featuredValidity: 1,
        },
      })
      .toArray(),
    PaymentPayU.collection
      .find(
        { payustatususer: 'paid', removed: { $ne: true } },
        { projection: { rentId: 1, phone: 1, planName: 1, payUdate: 1, createdAt: 1 } }
      )
      .toArray(),
    PricingPlans.collection.find({}, { projection: { name: 1, durationDays: 1, 'phoneNumbers.rentId': 1 } }).toArray(),
  ]);

  const adexBatchSet = new Set(adexBatches.filter(Boolean).map(String));
  const adexIdSet = new Set(adexRentIds.filter((v) => v != null).map(String));
  // A plan lists its subscribers as phoneNumbers[{ number, rentId }]; prefer the
  // plan this listing is enrolled in, then fall back to the plan named on the payment.
  const { durationOf } = planLookup(plans, 'name', 'rentId', (p) => Number(p.durationDays) || 0, 0);
  const idx = indexBillsAndPays(bills, pays, 'rentId');

  return props.map((p) => {
    const key = String(p.rentId ?? '');
    const isAdex = adexIdSet.has(key) || (p.bulkUploadId && adexBatchSet.has(String(p.bulkUploadId)));
    const rule = isAdex ? 'adex' : 'general';
    const { clock, protect } = signalsFor({ key, phone: phoneKey(p.phoneNumber), durationOf, ...idx });

    // Restored from the Expired page: that route writes previousStatus 'expired'
    // and bumps updatedAt, so updatedAt is (at latest) the restore moment.
    if (p.previousStatus === 'expired') clock.push({ at: p.updatedAt, why: 'restored' });
    if (restoredAt.has(key)) clock.push({ at: restoredAt.get(key), why: 'restored' });
    if (cfg.protectFeatured && p.featureStatus === 'yes') protect.push({ until: Infinity, why: 'featured' });

    return {
      kind: 'property',
      key,
      recordId: p._id,
      status: p.status,
      rule,
      days: cfg.days[rule],
      createdAt: p.createdAt || (p._id && p._id.getTimestamp && p._id.getTimestamp()),
      clock,
      protect,
    };
  });
}

async function expireProperty(rec, d, cfg, now) {
  const day = now.toISOString().slice(0, 10);
  const res = await AddModel.collection.updateOne(
    { _id: rec.recordId, status: rec.status, isDeleted: { $ne: true } },
    {
      $set: {
        status: 'expired',
        previousStatus: rec.status,
        reason: `${cfg.actor} ${day}: no renewal for ${rec.days} days (${rec.rule === 'adex' ? 'Adexpress' : 'general'} rule)`,
        updatedAt: now,
      },
    }
  );
  return res.modifiedCount === 1;
}

// ── Tenant Assistance ────────────────────────────────────────────────────────

async function loadAssistance(cfg, restoredAt) {
  const [records, bills, pays, plans] = await Promise.all([
    BuyerAssistance.collection
      .find(
        { ra_status: { $in: cfg.assistanceStatuses }, isDeleted: { $ne: true } },
        { projection: { Ra_Id: 1, phoneNumber: 1, ra_status: 1, createdAt: 1 } }
      )
      .toArray(),
    BuyerBill.collection
      .find({}, {
        projection: {
          Ra_Id: 1, ownerPhone: 1, billDate: 1, createdAt: 1, paymentType: 1,
          netAmount: 1, billAmount: 1, validity: 1, featuredAmount: 1, featuredValidity: 1,
        },
      })
      .toArray(),
    PaymentPayUBuyer.collection
      .find(
        { payustatususer: 'paid', removed: { $ne: true } },
        { projection: { Ra_Id: 1, phone: 1, planName: 1, payUdate: 1, createdAt: 1 } }
      )
      .toArray(),
    BuyerPlan.collection.find({}, { projection: { planName: 1, planValidity: 1, 'phoneNumbers.Ra_Id': 1 } }).toArray(),
  ]);

  // Unmatched plans fall back to 30 days, as BuyerPlan/BuyerRouter.js does.
  const { durationOf } = planLookup(plans, 'planName', 'Ra_Id', (p) => parseInt(p.planValidity, 10) || 30, 30);
  const idx = indexBillsAndPays(bills, pays, 'Ra_Id');

  return records.map((r) => {
    const key = String(r.Ra_Id ?? '');
    const { clock, protect } = signalsFor({ key, phone: phoneKey(r.phoneNumber), durationOf, ...idx });
    if (restoredAt.has(key)) clock.push({ at: restoredAt.get(key), why: 'restored' });
    return {
      kind: 'assistance',
      key,
      recordId: r._id,
      status: r.ra_status,
      rule: 'assistance',
      days: cfg.days.assistance,
      createdAt: r.createdAt || (r._id && r._id.getTimestamp && r._id.getTimestamp()),
      clock,
      protect,
    };
  });
}

// Same writes as the admin's "Mark as Expired" (PUT /mark-buyerAssistance-expired-rent),
// so the record lands in the Expired screen's "Manually Expired" list where its
// Undo button already works.
async function expireAssistance(rec, d, cfg, now) {
  const res = await BuyerAssistance.collection.updateOne(
    { _id: rec.recordId, ra_status: rec.status, isDeleted: { $ne: true } },
    { $set: { ra_status: 'raExpired', raExpiredAt: now, raExpiredBy: cfg.actor, updatedAt: now } }
  );
  if (res.modifiedCount !== 1) return false;
  const Ra_Id = Number(rec.key);
  if (Number.isFinite(Ra_Id)) {
    await PaymentPayUBuyer.collection.updateMany(
      { Ra_Id, payustatususer: 'paid' },
      { $set: { payustatususer: 'expiredPlan', updatedAt: now } }
    );
  }
  return true;
}

// What "back to live" means for each kind, for restore detection.
const KINDS = [
  { kind: 'property', label: 'Properties', load: loadProperties, expire: expireProperty, liveStatuses: (cfg) => cfg.propertyStatuses,
    currentStatus: async (ids) => AddModel.collection.find({ _id: { $in: ids } }, { projection: { status: 1, isDeleted: 1 } }).toArray(),
    statusOf: (doc) => (doc.isDeleted ? 'deleted' : doc.status) },
  { kind: 'assistance', label: 'Tenant Assistance', load: loadAssistance, expire: expireAssistance, liveStatuses: (cfg) => cfg.assistanceStatuses,
    currentStatus: async (ids) => BuyerAssistance.collection.find({ _id: { $in: ids } }, { projection: { ra_status: 1, isDeleted: 1 } }).toArray(),
    statusOf: (doc) => (doc.isDeleted ? 'deleted' : doc.ra_status) },
];

module.exports = { KINDS, isPaidBill, billCoverDays, phoneKey };
