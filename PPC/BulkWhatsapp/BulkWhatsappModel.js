const mongoose = require("mongoose");

const BulkWhatsappSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    scheduleTime: {
      type: Date,
      required: true,
    },
    scheduleMinutes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Sending", "Sent", "Failed"],
      default: "Pending",
    },
    batchId: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    messageId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

BulkWhatsappSchema.index({ batchId: 1, status: 1 });
BulkWhatsappSchema.index({ status: 1, scheduleTime: 1 });

module.exports = mongoose.model("BulkWhatsapp", BulkWhatsappSchema);
