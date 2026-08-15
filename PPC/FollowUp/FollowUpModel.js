const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  rentId: {
    type: String
  },
  phoneNumber: {
    type: String
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
  createdAt: {
    type: Date,
    default: Date.now
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
});

// City-base scope: every list/count/aggregate query is auto-filtered to the
// request's active base (ALL/PY/CH). See utils/cityScopePlugin.js.
followUpSchema.plugin(require('../utils/cityScopePlugin'));

module.exports = mongoose.model('FollowUp', followUpSchema);