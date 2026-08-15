// ============================================================
// PointsPricingModel.js
//
// Models for the **admin panel** side of the Points module.
//
// This file does NOT redefine the four base models (PointsPlan,
// PointsBalance, PointsTransaction, PointsPayU). It re-exports
// them from ./PointsModel so the admin router operates on the
// same collections the user-facing router already reads/writes.
//
// It ADDS two new models:
//   - PointsPayLaterLead — per-lead follow-up status keyed on
//     the PayU txnid. Kept separate so the PointsPayU schema
//     stays untouched.
//   - PointsConfig — singleton for tunable settings (e.g.
//     pointsPerContactReveal).
// ============================================================

const mongoose = require('mongoose');

// Re-export base models so admin callers only import from here.
const base = require('../Points/PointsModel');

/* ------------------------------------------------------------
 * PointsPayLaterLead
 *   One row per pay-later attempt the support team is working.
 *   `_id` uses the PayU txnid as a string, so lookups/merges
 *   with PointsPayU rows are trivial.
 *
 *   `status` is the admin-owned follow-up lifecycle, distinct
 *   from PointsPayU.payustatususer (which is the PayU state).
 * ---------------------------------------------------------- */
const PointsPayLaterLeadSchema = new mongoose.Schema(
  {
    _id: { type: String }, // txnid
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'dropped'],
      default: 'new',
      index: true,
    },
    note: { type: String, default: '' },
    lastContactAt: { type: Date, default: null },
    updatedBy: { type: String, default: null }, // admin username / id
    history: [
      {
        _id: false,
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
        by: String,
      },
    ],
  },
  { timestamps: true, _id: false }
);

/* ------------------------------------------------------------
 * PointsConfig
 *   Singleton. Always read/written with _id = 'points-config'.
 *   Holds values the admin can tune without a code release.
 * ---------------------------------------------------------- */
const PointsConfigSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'points-config' },
    pointsPerContactReveal: { type: Number, default: 10, min: 1 },
    // Points charged when a user reveals a tenant's number from the
    // "Tenant Assistance by Pincode" details popup.
    pointsPerTenantContactReveal: { type: Number, default: 20, min: 1 },
    // Points charged when a user reveals a viewer's number in the
    // "Tourist Lead" tab (Place To Stay leads).
    pointsPerTouristContactReveal: { type: Number, default: 10, min: 1 },
    updatedBy: { type: String, default: null },
  },
  { timestamps: true, _id: false }
);

/* ------------------------------------------------------------
 * PointsRefundRequest
 *   User-initiated refund request for a contact-reveal deduction.
 *   Approval atomically credits points back and writes a refund
 *   row to PointsTransaction (refundTxnId points at it).
 * ---------------------------------------------------------- */
const PointsRefundRequestSchema = new mongoose.Schema(
  {
    phoneNumber:   { type: String, required: true, index: true, trim: true },
    transactionId: { type: String, required: true, index: true },
    rentId:        { type: mongoose.Schema.Types.Mixed, default: null },
    points:        { type: Number, required: true, min: 1 },
    reason:        { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminId:    { type: String, default: null },
    adminNote:  { type: String, default: '' },
    resolvedAt: { type: Date,   default: null },
    refundTxnId:{ type: String, default: null },
  },
  { timestamps: true }
);

module.exports = {
  // Re-exports (same compiled model — shared collection)
  PointsPlan: base.PointsPlan,
  PointsBalance: base.PointsBalance,
  PointsTransaction: base.PointsTransaction,
  PointsPayU: base.PointsPayU,

  // New admin-only models
  PointsPayLaterLead:
    mongoose.models.PointsPayLaterLead ||
    mongoose.model('PointsPayLaterLead', PointsPayLaterLeadSchema),
  PointsConfig:
    mongoose.models.PointsConfig ||
    mongoose.model('PointsConfig', PointsConfigSchema),
  PointsRefundRequest:
    mongoose.models.PointsRefundRequest ||
    mongoose.model('PointsRefundRequest', PointsRefundRequestSchema),
};
