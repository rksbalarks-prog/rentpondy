const mongoose = require('mongoose');

// Numbers pushed by an admin into the "Automatic" queue.
// Round-robin: when a staff requests the next number, we pick the active
// document with the lowest `assignCount` (ties broken by _id) and atomically
// increment it. This balances load across all staff devices and browsers.
const RcmAutoNumberSchema = new mongoose.Schema({
  number:         { type: String, required: true, match: /^[0-9]{10}$/, index: true },
  active:         { type: Boolean, default: true, index: true },
  addedBy:        { type: String, default: 'system' }, // admin username
  assignCount:    { type: Number, default: 0, index: true },
  lastAssignedAt: { type: Date,   default: null },
}, { timestamps: true });

RcmAutoNumberSchema.index({ active: 1, assignCount: 1, _id: 1 });

module.exports = mongoose.model('RcmAutoNumber', RcmAutoNumberSchema);
