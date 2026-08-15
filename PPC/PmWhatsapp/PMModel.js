const mongoose = require("mongoose");

const PMSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "delivered"],
      default: "pending"
    },
    messageId: {
      type: String,
      default: null
    },
    sentBy: {
      type: String,
      default: "admin"
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    errorMessage: {
      type: String,
      default: null
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PM", PMSchema);
