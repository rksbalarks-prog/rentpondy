// One row per (viewer, property, day) — the de-duplication ledger behind the
// "User X viewed your property" notification.
//
// Why a collection rather than querying the notifications themselves: the
// unique index below makes the check ATOMIC. Two requests arriving at the same
// instant (double-tap, React strict-mode double effect, a retry) both try to
// insert; exactly one succeeds and the other gets a duplicate-key error, so the
// owner can never be notified twice for the same viewer on the same day. A
// find-then-insert would race and occasionally send two.
//
// Rows expire themselves after 7 days — the ledger only ever needs "today", the
// extra days are slack for timezone edges. Nothing reads this collection except
// the router that writes it.

const mongoose = require('mongoose');

const propertyViewNotifySchema = new mongoose.Schema({
  // Always the LAST 10 DIGITS. The same person is stored as 9443095257,
  // +919443095257 and 919443095257 in different parts of the app, and without
  // reducing to a single form one viewer would claim several daily slots for
  // the same property and be notified more than once.
  viewerPhoneNumber: { type: String, required: true },
  rentId: { type: String, required: true },
  // IST calendar day, 'YYYY-MM-DD'. Stored as a string so the uniqueness rule
  // is exact — a Date would need truncating and could drift across timezones.
  day: { type: String, required: true },
  ownerPhoneNumber: { type: String },
  // TTL: MongoDB drops the row ~7 days after it is written.
  createdAt: { type: Date, default: Date.now, expires: '7d' },
});

propertyViewNotifySchema.index(
  { viewerPhoneNumber: 1, rentId: 1, day: 1 },
  { unique: true }
);

module.exports = mongoose.model('PropertyViewNotify', propertyViewNotifySchema);
