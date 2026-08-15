const mongoose = require("mongoose");

const PMBulkSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    totalRecipients: {
      type: Number,
      default: 0
    },
    sentCount: {
      type: Number,
      default: 0
    },
    pendingCount: {
      type: Number,
      default: 0
    },
    failedCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "sent", "partially-sent", "failed"],
      default: "pending"
    },
    phoneNumbers: [{
      phone: {
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
      sentAt: {
        type: Date,
        default: null
      },
      deliveredAt: {
        type: Date,
        default: null
      },
      errorMessage: {
        type: String,
        default: null
      }
    }],
    sentBy: {
      type: String,
      required: true,
      default: "admin"
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

// Add indexes for better query performance
PMBulkSchema.index({ campaignName: 1 });
PMBulkSchema.index({ status: 1 });
PMBulkSchema.index({ sentBy: 1 });
PMBulkSchema.index({ createdAt: -1 });
PMBulkSchema.index({ "phoneNumbers.status": 1 });

module.exports = mongoose.model("PMBulk", PMBulkSchema);