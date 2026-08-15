const mongoose = require('mongoose');

/*
 * VisitorFollowUp
 * ---------------
 * Phone-based follow-ups created from the Login (OTP) Report when a row's
 * Remark Status is "Visitor". Like No-Response follow-ups, these are keyed only
 * by the phone number — there is no listing (rentId) or tenant (Ra_Id) behind a
 * visitor caller. Stored in their own collection and surfaced on the
 * "Visitor Followups Data" page (under "No Response Followups Data").
 */
const visitorFollowUpSchema = new mongoose.Schema(
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
      enum: ['Payment Followup', 'Data Followup', 'Enquiry Followup', 'No Response', 'Payment Closed'],
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
visitorFollowUpSchema.plugin(require('../utils/cityScopePlugin'));

module.exports = mongoose.model('VisitorFollowUp', visitorFollowUpSchema);
