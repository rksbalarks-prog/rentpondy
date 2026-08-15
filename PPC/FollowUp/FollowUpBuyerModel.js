

const mongoose = require('mongoose');

const followUpBuyerSchema = new mongoose.Schema({
 Ra_Id: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  followupStatus: { type: String, required: true },
  followupType: { type: String, required: true },
  followupDate: { type: Date, required: true },
  remarks: { type: String, default: '' },
  adminName: { type: String, required: true },
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
}, { timestamps: true });

// City-base scope: every list/count/aggregate query is auto-filtered to the
// request's active base (ALL/PY/CH). See utils/cityScopePlugin.js.
followUpBuyerSchema.plugin(require('../utils/cityScopePlugin'));

module.exports = mongoose.model('FollowUpBuyer', followUpBuyerSchema);
