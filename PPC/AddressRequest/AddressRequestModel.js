const mongoose = require("mongoose");

const AddressRequestSchema = new mongoose.Schema({
  rentId: { type: Number },
  requesterPhoneNumber: { type: String, required: true },
  postedUserPhoneNumber: { type: String },
  city: { type: String },
  district: { type: String },
  area: { type: String },
  status: {
    type: String,
    enum: ["address request pending", "address sent", "address request rejected", "deleted"],
    default: "address request pending",
  },
  previousStatus: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("AddressRequest", AddressRequestSchema);
