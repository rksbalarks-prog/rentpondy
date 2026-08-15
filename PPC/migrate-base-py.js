/**
 * One-time migration: backfill `base = 'PY'` on all legacy documents.
 *
 * The platform launched in Pondicherry, so every property / buyer-assistance /
 * user record created before the city-split feature belongs to Pondicherry.
 * This script tags them all with base 'PY'.
 *
 * Safe to run multiple times — it only touches documents whose `base` is
 * missing or null, and never changes a document already tagged 'PY' or 'CH'.
 *
 * Run from the PPC directory:
 *   node migrate-base-py.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const AddModel = require('./AddModel');
const BuyerAssistance = require('./BuyerAssistance/BuyerAssistanceModel');
const UserLogin = require('./user/UserModel');

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
    console.log('✅ Database connected. Backfilling base = PY ...');

    await backfill('Properties (AddModel)', AddModel);
    await backfill('Buyer assistance (BuyerAssistance)', BuyerAssistance);
    await backfill('Users (UserLogin)', UserLogin);

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
