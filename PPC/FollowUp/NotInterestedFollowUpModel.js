const mongoose = require('mongoose');

/*
 * NotInterestedFollowUp
 * ---------------------
 * Phone-based follow-ups created from the Login (OTP) Report when a row's
 * Remark Status is "Not interested". Like No-Response and Visitor follow-ups,
 * these are keyed only by the phone number — there is no listing (rentId) or
 * tenant (Ra_Id) behind a caller who declined. Stored in their own collection
 * and surfaced on the "Not Interested Followups Data" page (under "Visitor
 * Followups Data").
 */
const notInterestedFollowUpSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true
    },
    adminName: {
      type: String
    },
    remarks: {
      type: String,
      maxlength: 50,
      default: ''
    },
    followupStatus: {
      type: String,
      enum: ['Ring', 'Ready To Pay', 'Not Decided', 'No Response', 'Not Interested-Closed', 'Paid Closed'],
      required: true
    },
    followupType: {
      type: String,
      enum: ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'No Response', 'Not Interested', 'Payment Closed'],
      required: true
    },
    followupDate: {
      type: Date,
      required: true
    },
    transferHistory: [
      {
        from: String,
        to: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    // City base: 'PY' = Pondicherry, 'CH' = Chennai. Set from the admin's
    // login scope at create time; legacy rows backfilled to 'PY'.
    base: {
      type: String,
      enum: ['PY', 'CH'],
      default: 'PY'
    }
  },
  { timestamps: true }
);

// City-base scope: every list/count/aggregate query is auto-filtered to the
// request's active base (ALL/PY/CH). See utils/cityScopePlugin.js.
notInterestedFollowUpSchema.plugin(require('../utils/cityScopePlugin'));

module.exports = mongoose.model('NotInterestedFollowUp', notInterestedFollowUpSchema);
