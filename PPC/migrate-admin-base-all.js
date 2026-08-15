/**
 * One-time migration: backfill `base = 'ALL'` on existing AdminLogin records.
 *
 * Before this feature, admins / staff had no city scope. Treating them all
 * as 'ALL' keeps them able to sign in (and pick any city at the login
 * screen) exactly as before. Any future restriction is set by editing the
 * staff member from the admin panel.
 *
 * Idempotent — only writes rows whose `base` is missing or null.
 *
 * Run from the PPC directory:
 *   node migrate-admin-base-all.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const AdminLogin = require('./Admin/AdminModel');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected. Backfilling admin base = ALL ...');

    const filter = { $or: [{ base: { $exists: false } }, { base: null }] };
    const pending = await AdminLogin.countDocuments(filter);

    if (pending === 0) {
      console.log('  AdminLogin: nothing to update (already tagged).');
    } else {
      const result = await AdminLogin.updateMany(filter, { $set: { base: 'ALL' } });
      console.log(`  AdminLogin: updated ${result.modifiedCount} of ${pending} document(s) to base 'ALL'.`);
    }

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
