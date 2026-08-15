// ============================================================
// PointsModel.js
// Base models for the Points Pricing module. Shared by:
//   - User-facing PointsRouter (./PointsRouter)
//   - User-facing PayUPointsRouter (./PayUPointsRouter)
//   - Admin PointsPricingRouter (../PointsPricing/PointsPricingRouter)
// ============================================================

const mongoose = require('mongoose');

/* ------------------------------------------------------------
 * PointsPlan
 *   A purchasable points pack. `status` ('active' | 'hide')
 *   controls visibility to the user app. Admin can soft-hide.
 * ---------------------------------------------------------- */
const PointsPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 1 },
    durationDays: { type: Number, default: 0 }, // 0 = no expiry
    popular: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'hide'], default: 'active', index: true },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * PointsBalance
 *   One document per user keyed on phoneNumber.
 * ---------------------------------------------------------- */
const PointsBalanceSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 }, // ₹ paid lifetime
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * PointsTransaction
 *   Append-only ledger of every credit/deduct event.
 *   `type: 'credit'` with a `txnId` represents a PayU purchase.
 *   `type: 'deduct'` with reason `view-owner-contact` represents a contact reveal.
 *   Manual admin adjustments use the note prefix 'MANUAL-ADJUST'.
 * ---------------------------------------------------------- */
const PointsTransactionSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    type: { type: String, enum: ['credit', 'deduct'], required: true },
    points: { type: Number, required: true, min: 1 },
    balanceAfter: { type: Number, required: true },
    planId: { type: String, default: null, index: true },
    planName: { type: String, default: null },
    reason: { type: String, default: null }, // e.g. 'purchase', 'view-owner-contact', 'manual-adjust'
    note: { type: String, default: null },
    rentId: { type: mongoose.Schema.Types.Mixed, default: null },
    txnId: { type: String, default: null, index: true }, // PayU mihpayid / internal txnid
    amount: { type: Number, default: null }, // ₹ for purchases
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * PointsPayU
 *   Mirrors PaymentPayU but for points purchases. Keeping the
 *   collection separate keeps property-plan payments and points
 *   top-ups cleanly distinguished.
 * ---------------------------------------------------------- */
const PointsPayUSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true, unique: true, index: true },
    status: { type: String, default: 'process' },
    amount: String,
    productinfo: String,
    firstname: String,
    email: String,
    phone: { type: String, index: true },
    mihpayid: String,
    payUdate: String,
    payustatususer: {
      type: String,
      enum: ['pay now', 'pay later', 'paid', 'pay failed'],
      required: true,
      index: true,
    },
    planId: { type: String, index: true },
    planName: String,
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * PointsPlanSelection
 *   Snapshot written when a user presses "Pay Now" / "Pay Later".
 *   Lets the admin see who selected what, even for pay-later leads
 *   that never completed the PayU redirect.
 * ---------------------------------------------------------- */
const PointsPlanSelectionSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    planName: String,
    points: Number,
    amount: Number,
  },
  { timestamps: true }
);

module.exports = {
  PointsPlan:
    mongoose.models.PointsPlan || mongoose.model('PointsPlan', PointsPlanSchema),
  PointsBalance:
    mongoose.models.PointsBalance || mongoose.model('PointsBalance', PointsBalanceSchema),
  PointsTransaction:
    mongoose.models.PointsTransaction ||
    mongoose.model('PointsTransaction', PointsTransactionSchema),
  PointsPayU:
    mongoose.models.PointsPayU || mongoose.model('PointsPayU', PointsPayUSchema),
  PointsPlanSelection:
    mongoose.models.PointsPlanSelection ||
    mongoose.model('PointsPlanSelection', PointsPlanSelectionSchema),
};
