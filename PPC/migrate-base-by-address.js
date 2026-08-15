/**
 * One-time migration: re-tag `base` (PY/CH) from each record's ADDRESS.
 *
 * Originally `base` was set from whichever city section the user was browsing
 * when they posted, so a Chennai property posted under the Pondicherry section
 * (or any legacy record) ended up tagged 'PY' and never appeared on /chennai.
 *
 * This script recomputes `base` for every property and tenant request from
 * its own city / district / pincode, using the same resolveBaseFromAddress()
 * helper the live routes now use. After this runs, listings sit under the
 * city they are physically in.
 *
 * Idempotent — only writes documents whose `base` actually changes. Safe to
 * run multiple times.
 *
 * Run from the PPC directory:
 *   node migrate-base-by-address.js            (apply changes)
 *   node migrate-base-by-address.js --dry-run  (report only, no writes)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const { resolveBaseFromAddress } = require('./utils/baseFilter');
const AddModel = require('./AddModel');
const BuyerAssistance = require('./BuyerAssistance/BuyerAssistanceModel');

const DRY_RUN = process.argv.includes('--dry-run');

async function retag(label, Model) {
  const docs = await Model.find(
    {},
    { city: 1, district: 1, pinCode: 1, base: 1 }
  ).lean();

  const ops = [];
  let pyToCh = 0;
  let chToPy = 0;
  const samples = [];

  for (const doc of docs) {
    const target = resolveBaseFromAddress(doc);
    const current = doc.base || null;
    if (current === target) continue;

    if (target === 'CH') pyToCh += 1;
    else chToPy += 1;

    if (samples.length < 10) {
      samples.push(
        `    _id=${doc._id} ${current || 'NULL'} -> ${target}  city=${doc.city || ''} district=${doc.district || ''} pin=${doc.pinCode || ''}`
      );
    }

    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { base: target } },
      },
    });
  }

  console.log(`\n${label}: ${docs.length} document(s) scanned.`);
  console.log(`  -> CH (Chennai): ${pyToCh}    -> PY (Pondicherry): ${chToPy}    unchanged: ${docs.length - ops.length}`);
  if (samples.length) {
    console.log('  Sample changes:');
    samples.forEach((s) => console.log(s));
  }

  if (ops.length === 0) {
    console.log('  Nothing to update.');
    return;
  }

  if (DRY_RUN) {
    console.log(`  [dry-run] ${ops.length} document(s) would be updated.`);
    return;
  }

  const result = await Model.bulkWrite(ops);
  console.log(`  Updated ${result.modifiedCount} document(s).`);
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Database connected. Re-tagging base from address${DRY_RUN ? ' (DRY RUN)' : ''} ...`);

    await retag('Properties (AddModel)', AddModel);
    await retag('Tenant requests (BuyerAssistance)', BuyerAssistance);

    console.log(`\n✅ Migration ${DRY_RUN ? 'dry-run' : ''} complete.`);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

run();
