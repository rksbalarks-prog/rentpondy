// ============================================================
// StayPlanModel.js
// Models for the "Stay Owners Plan" — listing subscriptions that
// stay owners buy (via PayU) to post / feature their Place To Stay
// listings. Mirrors the Points module shape, but instead of a points
// wallet a successful purchase grants/extends an owner SUBSCRIPTION.
//
// Shared by:
//   - StayPlanRouter        (admin CRUD + user list + subscription read)
//   - PayUStayController     (PayU purchase → subscription)
// ============================================================

const mongoose = require('mongoose');

/* ------------------------------------------------------------
 * StayOwnerPlan
 *   A purchasable listing plan. `status` ('active' | 'hide')
 *   controls visibility to the user app.
 * ---------------------------------------------------------- */
const StayOwnerPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 1 },           // ₹
    maxListings: { type: Number, default: 1, min: 0 },         // stays allowed (0 = unlimited)
    durationDays: { type: Number, default: 0 },                // validity (0 = no expiry)
    featured: { type: Boolean, default: false },               // featured placement
    popular: { type: Boolean, default: false },                // "most popular" badge
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'hide'], default: 'active', index: true },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * StayOwnerSubscription
 *   One document per owner (keyed on phoneNumber). The owner's
 *   currently-active listing entitlement. Re-purchasing extends
 *   expiresAt and refreshes the plan's allowances.
 * ---------------------------------------------------------- */
const StayOwnerSubscriptionSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    planId: { type: String, default: null },
    planName: { type: String, default: null },
    maxListings: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    startAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },                  // null = no expiry
    lastTxnId: { type: String, default: null, index: true },
    lastAmount: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },                   // lifetime ₹
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * StayPlanPayU
 *   PayU transaction mirror for stay-plan purchases.
 * ---------------------------------------------------------- */
const StayPlanPayUSchema = new mongoose.Schema(
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
    maxListings: { type: Number, default: 0 },
    durationDays: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------
 * StayPlanSelection
 *   Snapshot written when an owner presses "Pay Now" / "Pay Later".
 * ---------------------------------------------------------- */
const StayPlanSelectionSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    planName: String,
    amount: Number,
  },
  { timestamps: true }
);

module.exports = {
  StayOwnerPlan:
    mongoose.models.StayOwnerPlan || mongoose.model('StayOwnerPlan', StayOwnerPlanSchema),
  StayOwnerSubscription:
    mongoose.models.StayOwnerSubscription ||
    mongoose.model('StayOwnerSubscription', StayOwnerSubscriptionSchema),
  StayPlanPayU:
    mongoose.models.StayPlanPayU || mongoose.model('StayPlanPayU', StayPlanPayUSchema),
  StayPlanSelection:
    mongoose.models.StayPlanSelection ||
    mongoose.model('StayPlanSelection', StayPlanSelectionSchema),
};
