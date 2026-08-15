const mongoose = require('mongoose');

// One call record per dial attempt made by a staff member from the
// Call Management screen. Status defaults to "Ring" the moment the
// staff clicks "Call Now"; the staff then updates it.
const RcmCallSchema = new mongoose.Schema({
  agentUsername: { type: String, required: true, index: true },
  number:        { type: String, required: true, match: /^[0-9]{10}$/ }, // server-enforced 10 digits
  mode:          { type: String, enum: ['Manual', 'Automatic'], required: true },
  status:        {
    type: String,
    enum: ['Ring', 'Not Exist', 'Not Interested', 'Interested'],
    default: 'Ring',
  },
  // Filled in when the staff marks the call as "Interested" via the popup.
  // Kept as a sub-document so all fields stay together with the call.
  interestedDetails: {
    rent:          { type: String, default: "" },
    advance:       { type: String, default: "" },
    bhk:           { type: String, default: "" },
    floorNo:       { type: String, default: "" },
    carPark:       { type: String, default: "" },   // 'Yes' | 'No'
    availableFrom: { type: String, default: "" },   // YYYY-MM-DD
    capturedAt:    { type: Date,   default: null },
  },
  // The admin-queue document this call was assigned from, if any.
  // Null for manual dials.
  autoNumberId:  { type: mongoose.Schema.Types.ObjectId, ref: 'RcmAutoNumber', default: null },
}, { timestamps: true });

RcmCallSchema.index({ createdAt: -1 });
RcmCallSchema.index({ agentUsername: 1, createdAt: -1 });

module.exports = mongoose.model('RcmCall', RcmCallSchema);
