const mongoose = require('mongoose');

const SalePropertyViewSchema = new mongoose.Schema({
  rentId: { type: Number}, // The PPC ID of the property
  userPhoneNumber: { type: String, required: true }, // The phone number of the user interacting with the property
  viewedAt: { type: Date, default: Date.now }, // Timestamp of when the property was viewed
});

const SalePropertyView = mongoose.model('SalePropertyView', SalePropertyViewSchema);

module.exports = SalePropertyView;
