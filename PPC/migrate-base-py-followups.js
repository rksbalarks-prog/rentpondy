/**
 * One-time migration: backfill `base = 'PY'` on all existing follow-ups.
 *
 * Follow-ups (tenant and buyer) didn't carry a `base` field before. Every row
 * created up to now belongs to Pondicherry, so this tags them all 'PY'. From
 * now on, /followup-create and /followup-create-buyer tag new follow-ups
 * from the admin's active city scope (?base=).
 *
 * Idempotent — only writes rows whose `base` is missing or null.
 *
 * Run from the PPC directory:
 *   node migrate-base-py-followups.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const FollowUp = require('./FollowUp/FollowUpModel');
const FollowUpBuyer = require('./FollowUp/FollowUpBuyerModel');

async function backfill(label, Model) {
  const filter = { $or: [{ base: { $exists: false } }, { base: null }] };
  const pending = await Model.countDocuments(filter);
  if (pending === 0) {
    console.log(`  ${label}: nothing to update (already tagged).`);
    return;
  }
  const result = await Model.updateMany(filter, { $set: { base: 'PY' } });
  console.log(`  ${label}: updated ${result.modifiedCount} of ${pending} document(s) to base 'PY'.`);
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected. Backfilling follow-up base = PY ...');

    await backfill('Tenant follow-ups (FollowUp)', FollowUp);
    await backfill('Buyer follow-ups (FollowUpBuyer)', FollowUpBuyer);

    console.log('✅ Migration complete.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

run();
