// End-to-end check against a throwaway LOCAL database filled with made-up rows.
//   node --test AutoExpire/test/autoExpire.test.js
// Never point this at a real database: it drops the one it uses.

const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');

const DB = process.env.AUTO_EXPIRE_TEST_URI || 'mongodb://127.0.0.1:27017/autoexpire_rp_synth';
const { decide, DAY } = require('../engine');

const now = new Date();
const ago = (days) => new Date(now.getTime() - days * DAY);
const ymd = (d) => d.toISOString().slice(0, 10);

test('engine: clock, protection, bad dates', () => {
  const base = { days: 90, clock: [], protect: [] };
  assert.equal(decide({ ...base, createdAt: ago(100) }, now.getTime()).state, 'due');
  assert.equal(decide({ ...base, createdAt: ago(80) }, now.getTime()).state, 'fresh');
  assert.equal(decide({ ...base, createdAt: ago(300), clock: [{ at: ymd(ago(10)) }] }, now.getTime()).state, 'fresh');
  const p = decide({ ...base, createdAt: ago(300), protect: [{ until: new Date(now.getTime() + DAY), why: 'paid-bill' }] }, now.getTime());
  assert.equal(p.state, 'protected');
  assert.equal(p.protectedBy, 'paid-bill');
  assert.equal(decide({ ...base, createdAt: ago(300), protect: [{ until: ago(1), why: 'paid-bill' }] }, now.getTime()).state, 'due');
  // ambiguous dd/mm strings are ignored, not guessed
  assert.equal(decide({ ...base, createdAt: ago(300), clock: [{ at: '05/10/2026' }] }, now.getTime()).state, 'due');
  // a future clock date counts as today, not as years of cover
  assert.equal(decide({ ...base, createdAt: ago(300), clock: [{ at: new Date(now.getTime() + 900 * DAY) }] }, now.getTime()).state, 'fresh');
  assert.equal(decide({ ...base, createdAt: null }, now.getTime()).state, 'unknown');
});

test('runner: dry run, live run, restore', async (t) => {
  await mongoose.connect(DB);
  const db = mongoose.connection.db;
  await db.dropDatabase();
  t.after(async () => { await db.dropDatabase(); await mongoose.disconnect(); });

  const config = require('../config');
  const { run } = require('../runner');

  const prop = (rentId, days, extra = {}) => ({
    rentId, phoneNumber: `90000000${String(rentId).padStart(2, '0')}`, status: 'active', isDeleted: false,
    createdAt: ago(days), updatedAt: ago(days), featureStatus: 'no', ...extra,
  });
  await db.collection('addmodels').insertMany([
    prop(1, 100), // general, old -> due
    prop(2, 60), // general, fresh
    prop(3, 40, { bulkUploadId: 'BULK-ADEX-1' }), // adex batch, > 30 -> due
    prop(4, 20, { bulkUploadId: 'BULK-ADEX-1' }), // adex, fresh
    prop(5, 200), // free bill 50d ago restarts the clock -> fresh
    prop(6, 200), // paid bill 100d ago, 365d validity -> protected
    prop(7, 200), // paid PayU 120d ago, Gold 365d -> protected
    prop(8, 200, { featureStatus: 'yes' }), // featured -> protected
    prop(9, 200, { phoneNumber: '9111111111' }), // owner paid for #10 recently -> protected
    prop(10, 5, { phoneNumber: '9111111111' }),
    prop(11, 200, { status: 'incomplete' }), // Pending-page row, old -> due
    prop(12, 200, { isDeleted: true }), // soft-deleted not touched
    prop(13, 300, { previousStatus: 'expired', updatedAt: ago(10) }), // restored from Expired page -> fresh
    prop(14, 120, { status: 'pending' }), // pending, old -> due
    prop(15, 50), // adex by importedRentId alone (no batch id) -> due
    prop(16, 95, { bulkUploadId: 'BULK-EXCEL-9' }), // ordinary Excel bulk upload -> general -> due
    prop(17, 200, { status: 'soldOut' }), // not a live status, not touched
    prop(18, 200), // paid 120d ago under an unknown plan name, but enrolled in Gold -> protected
  ]);
  await db.collection('adexpress_ads').insertMany([
    { adKey: 'test-ad-3', bulkUploadId: 'BULK-ADEX-1', importedRentId: 3 },
    { adKey: 'test-ad-15', bulkUploadId: '', importedRentId: 15 },
  ]);
  await db.collection('bills').insertMany([
    { rentId: '5', ownerPhone: '9000000005', billDate: ymd(ago(50)), createdAt: ago(50), paymentType: 'Free', netAmount: 0, billAmount: 0, validity: 180 },
    { rentId: '6', ownerPhone: '9000000006', billDate: ymd(ago(100)), createdAt: ago(100), paymentType: 'Cash', netAmount: 500, billAmount: 500, validity: 365 },
    { rentId: '10', ownerPhone: '9111111111', billDate: ymd(ago(10)), createdAt: ago(10), paymentType: 'Online-PG', netAmount: 500, billAmount: 500, validity: 90 },
  ]);
  await db.collection('pricingplans').insertMany([{ name: 'Gold', durationDays: 365, phoneNumbers: [{ number: '9000000018', rentId: 18 }] }]);
  await db.collection('paymentpayus').insertMany([
    { rentId: 7, phone: '9000000007', planName: 'gold', payustatususer: 'paid', createdAt: ago(120) },
    { rentId: 1, phone: '9000000001', planName: 'Gold', payustatususer: 'pay failed', createdAt: ago(5) }, // not paid: ignored
    { rentId: 18, phone: '9000000018', planName: 'Renamed Plan', payustatususer: 'paid', createdAt: ago(120) },
  ]);

  const ra = (Ra_Id, days, extra = {}) => ({
    Ra_Id, phoneNumber: `80000000${String(Ra_Id).padStart(2, '0')}`, ra_status: 'raActive', isDeleted: false, createdAt: ago(days), ...extra,
  });
  await db.collection('buyerassistances').insertMany([
    ra(1, 100), // due
    ra(2, 30, { ra_status: 'raPending' }), // fresh
    ra(3, 200), // paid 100d ago on a 365d plan -> protected
    ra(4, 200, { ra_status: 'raExpired' }), // already expired, not scanned
    ra(5, 300), // paid 200d ago on a 30d plan -> clock 200d -> due, payment flips
    ra(6, 150, { ra_status: 'rent-interest-tried' }), // status overwritten by send-interest, still live -> due
  ]);
  await db.collection('buyerplans').insertMany([{ planName: 'Tenant Gold', planValidity: '365' }, { planName: 'Basic', planValidity: '30' }]);
  await db.collection('paymentpayubuyers').insertMany([
    { Ra_Id: 3, phone: '8000000003', planName: 'Tenant Gold', payustatususer: 'paid', createdAt: ago(100) },
    { Ra_Id: 5, phone: '8000000005', planName: 'Basic', payustatususer: 'paid', createdAt: ago(200) },
  ]);

  const propStatus = async (rentId) => (await db.collection('addmodels').findOne({ rentId })).status;
  const raDoc = (Ra_Id) => db.collection('buyerassistances').findOne({ Ra_Id });

  // ── dry run: reports, writes nothing ──
  const dry = await run({ mode: 'dry-run', trigger: 'preview', items: true });
  const dueProps = dry.items.property.map((i) => i.key).sort((a, b) => a - b);
  assert.deepStrictEqual(dueProps, ['1', '3', '11', '14', '15', '16']);
  assert.deepStrictEqual(dry.items.assistance.map((i) => i.key).sort(), ['1', '5', '6']);
  assert.equal(dry.summary.property.scanned, 16); // excludes #12 deleted and #17 soldOut
  assert.deepStrictEqual(dry.summary.property.protected, { 'paid-bill': 1, 'paid-online': 2, featured: 1, 'owner-paid-bill': 1 });
  assert.deepStrictEqual(dry.summary.property.dueByRule, { general: 4, adex: 2 });
  assert.equal(dry.summary.assistance.protected['paid-online'], 1);
  assert.equal(await propStatus(1), 'active');
  assert.equal(await db.collection('auto_expire_runs').countDocuments(), 0); // previews are not recorded

  // ── cap ──
  const savedCap = config.maxPerRun;
  config.maxPerRun = 2;
  const capped = await run({ mode: 'dry-run', trigger: 'cli' });
  assert.equal(capped.summary.property.capped, 4);
  assert.equal(capped.sample.property.length, 2);
  // oldest due date first: #11 was due 110 days ago, #14 30 days ago
  assert.deepStrictEqual(capped.sample.property.map((i) => i.key), ['11', '14']);
  config.maxPerRun = savedCap;

  // ── live run ──
  const live = await run({ mode: 'live', trigger: 'manual' });
  assert.equal(live.summary.property.expired, 6);
  assert.equal(live.summary.assistance.expired, 3);
  for (const id of [1, 3, 11, 14, 15, 16]) assert.equal(await propStatus(id), 'expired');
  for (const id of [2, 4, 5, 6, 7, 8, 9, 10, 13, 17]) assert.notEqual(await propStatus(id), 'expired');
  const p14 = await db.collection('addmodels').findOne({ rentId: 14 });
  assert.equal(p14.previousStatus, 'pending');
  assert.match(p14.reason, /Auto Expire/);

  const r1 = await raDoc(1);
  assert.equal(r1.ra_status, 'raExpired');
  assert.equal(r1.raExpiredBy, 'Auto Expire');
  assert.ok(r1.raExpiredAt);
  assert.equal((await db.collection('paymentpayubuyers').findOne({ Ra_Id: 5 })).payustatususer, 'expiredPlan');
  assert.equal((await db.collection('paymentpayubuyers').findOne({ Ra_Id: 3 })).payustatususer, 'paid');
  assert.equal(await db.collection('auto_expire_log').countDocuments(), 9);

  // ── second live run is a no-op ──
  const again = await run({ mode: 'live', trigger: 'manual' });
  assert.equal(again.summary.property.expired, 0);
  assert.equal(again.summary.assistance.expired, 0);

  // ── admin restores #1 and Ra 1 (as the Expired page / Undo would) ──
  await db.collection('addmodels').updateOne({ rentId: 1 }, { $set: { status: 'active' } });
  await db.collection('buyerassistances').updateOne({ Ra_Id: 1 }, { $set: { ra_status: 'raActive', raExpiredAt: null, raExpiredBy: '' } });
  const after = await run({ mode: 'live', trigger: 'manual' });
  assert.equal(after.summary.property.expired, 0, 'a restored property gets a fresh period');
  assert.equal(after.summary.assistance.expired, 0, 'restored tenant assistance gets a fresh period');
  assert.equal(await propStatus(1), 'active');
  assert.equal(await db.collection('auto_expire_log').countDocuments({ restoredSeenAt: { $ne: null } }), 2);

  // ── mode switch persists ──
  const { saveMode, effectiveMode } = require('../runner');
  assert.equal(await effectiveMode(), config.mode);
  await saveMode('live', 'test');
  assert.equal(await effectiveMode(), 'live');
});
