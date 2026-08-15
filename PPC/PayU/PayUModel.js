
const mongoose = require('mongoose');

const paymentPayUSchema = new mongoose.Schema({
  txnid: String,
  status: String,
  amount: String,
  productinfo: String,
  firstname: String,
  email: String,
  phone: String,
  mihpayid: String,
  payUdate: String,
  payustatususer: {
    type: String,
    enum: ['pay now', 'pay later', 'paid', 'pay failed','expiredPlan'],
    required: true,
  },
  planName: String,
  rentId: {
    type: Number,
    required: true, // Optional: Only if you always need it
  },
  // Soft-delete flags. Rows where `removed: true` are hidden from the
  // regular Payment Paid Failed / Pay Now / Pay Later admin tables and
  // surface only on the new "Removed Payu" page.
  removed: { type: Boolean, default: false },
  removedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('PaymentPayU', paymentPayUSchema);
