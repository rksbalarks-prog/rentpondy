const express = require("express");
const router = express.Router();
const PMBulk = require("./PMBulkModel");
const { createWasender } = require("wasenderapi");
require("dotenv/config");

// ── Wasender initialization ──────────────────────────────────────────────────
let wasender = null;

function initializeWasender() {
  if (wasender) return wasender;

  const apiKey = process.env.WASENDER_API_KEY;
  const accessToken = process.env.WASENDER_PERSONAL_ACCESS_TOKEN;
  const webhookSecret = process.env.WASENDER_WEBHOOK_SECRET;

  if (!apiKey || !accessToken) {
    console.error(
      "❌ Wasender initialization failed: Missing WASENDER_API_KEY or WASENDER_PERSONAL_ACCESS_TOKEN in .env"
    );
    return null;
  }

  try {
    wasender = createWasender(
      apiKey,
      accessToken,
      undefined,
      undefined,
      {
        enabled: true,
        maxRetries: 3
      },
      webhookSecret
    );
    console.log("✅ Wasender initialized successfully for bulk messaging");
  } catch (err) {
    console.error("❌ Failed to initialize Wasender:", err.message);
  }

  return wasender;
}

// ── Verify credentials on startup ─────────────────────────────────────────────
if (!process.env.WASENDER_API_KEY || !process.env.WASENDER_PERSONAL_ACCESS_TOKEN) {
  console.error("❌ MISSING ENV VARS: WASENDER_API_KEY or WASENDER_PERSONAL_ACCESS_TOKEN not set in .env");
} else {
  console.log("✅ Wasender credentials found for bulk messaging, initializing...");
  initializeWasender();
}

/**
 * POST /send-bulk-text
 * Send WhatsApp messages to multiple recipients
 */
router.post("/send-bulk-text", async (req, res) => {
  try {
    const { campaignName, message, phoneNumbers, totalRecipients, sentBy } = req.body;

    // Validation
    if (!campaignName || !String(campaignName).trim()) {
      return res.status(400).json({ success: false, message: "Campaign name is required" });
    }
    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res.status(400).json({ success: false, message: "Phone numbers array is required" });
    }
    if (message.length > 4096) {
      return res.status(400).json({ success: false, message: "Message exceeds maximum length (4096 characters)" });
    }

    console.log(`📢 Starting bulk campaign: ${campaignName} with ${phoneNumbers.length} recipients`);

    // Create campaign record
    const campaign = await PMBulk.create({
      campaignName: campaignName.trim(),
      message: message.trim(),
      totalRecipients: totalRecipients || phoneNumbers.length,
      sentCount: 0,
      pendingCount: phoneNumbers.length,
      failedCount: 0,
      status: "in-progress",
      phoneNumbers: phoneNumbers.map(phone => ({
        phone,
        status: "pending"
      })),
      sentBy: sentBy || "admin"
    });

    console.log("💾 Campaign record created:", campaign._id);

    // Send messages asynchronously to avoid timeout
    setImmediate(async () => {
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < phoneNumbers.length; i++) {
        const phone = phoneNumbers[i];
        
        try {
          let messageId = null;
          let deliveryStatus = "failed";
          let errorMessage = null;
          let wasenderResponse = null;

          const wasenderInstance = initializeWasender();

          if (wasenderInstance) {
            try {
              const result = await wasenderInstance.sendMessage(
                phone,
                message.trim(),
                {}
              );

              if (result && result.success) {
                messageId = result.messageId || result.id;
                deliveryStatus = "sent";
                successCount++;
                console.log(`✅ Message sent to ${phone}`);
              } else {
                failureCount++;
                errorMessage = result?.error || "Unknown error";
                console.log(`❌ Failed to send to ${phone}: ${errorMessage}`);
              }

              wasenderResponse = result;
            } catch (apiErr) {
              failureCount++;
              errorMessage = apiErr.message;
              deliveryStatus = "failed";
              console.log(`🚨 API Error for ${phone}:`, apiErr.message);
            }
          } else {
            failureCount++;
            errorMessage = "Wasender not initialized";
            console.log(`⚠️ Wasender not initialized for ${phone}`);
          }

          // Update campaign record with message status
          campaign.phoneNumbers[i].status = deliveryStatus;
          campaign.phoneNumbers[i].messageId = messageId;
          campaign.phoneNumbers[i].sentAt = new Date();
          campaign.phoneNumbers[i].errorMessage = errorMessage;

          // Update counts
          if (deliveryStatus === "sent") {
            campaign.sentCount++;
            campaign.pendingCount--;
          } else {
            campaign.failedCount++;
            campaign.pendingCount--;
          }

        } catch (error) {
          console.error(`Error processing ${phone}:`, error);
          failureCount++;
          campaign.failedCount++;
          campaign.pendingCount--;
          campaign.phoneNumbers[i].status = "failed";
          campaign.phoneNumbers[i].errorMessage = error.message;
        }

        // Save progress every 10 messages
        if ((i + 1) % 10 === 0 || i === phoneNumbers.length - 1) {
          await campaign.save();
          console.log(`📊 Progress: ${i + 1}/${phoneNumbers.length}`);
        }
      }

      // Mark campaign as complete
      campaign.status = failureCount === 0 ? "sent" : "partially-sent";
      campaign.completedAt = new Date();
      await campaign.save();

      console.log(`✅ Campaign ${campaign._id} completed: ${successCount} sent, ${failureCount} failed`);
    });

    // Send immediate response
    return res.status(200).json({
      success: true,
      message: `Campaign "${campaignName}" created successfully. Sending ${phoneNumbers.length} messages...`,
      campaignId: campaign._id,
      totalRecipients: phoneNumbers.length,
      successCount: 0
    });

  } catch (error) {
    console.error("🚨 Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating bulk campaign",
      error: error.message
    });
  }
});

/**
 * GET /pm-bulk-history
 * Get bulk campaign history
 */
router.get("/pm-bulk-history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const campaigns = await PMBulk.find()
      .sort({ startedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await PMBulk.countDocuments();

    return res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign history",
      error: error.message
    });
  }
});

/**
 * GET /pm-bulk-stats
 * Get overall bulk messaging statistics
 */
router.get("/pm-bulk-stats", async (req, res) => {
  try {
    const stats = await PMBulk.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalRecipients" },
          sent: { $sum: "$sentCount" },
          failed: { $sum: "$failedCount" },
          pending: { $sum: "$pendingCount" },
          campaignsCount: { $sum: 1 }
        }
      }
    ]);

    const statsData = stats.length > 0 ? stats[0] : {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
      campaignsCount: 0
    };

    return res.status(200).json({
      success: true,
      stats: {
        total: statsData.total || 0,
        sent: statsData.sent || 0,
        failed: statsData.failed || 0,
        pending: statsData.pending || 0,
        campaignsCount: statsData.campaignsCount || 0
      }
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
});

/**
 * GET /pm-bulk-campaigns
 * Get all bulk campaigns
 */
router.get("/pm-bulk-campaigns", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.status = status;
    }

    const campaigns = await PMBulk.find(query)
      .select("-phoneNumbers") // Exclude detailed phone numbers for list view
      .sort({ startedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await PMBulk.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Campaigns Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message
    });
  }
});

/**
 * GET /pm-bulk-campaign/:campaignId
 * Get detailed campaign information
 */
router.get("/pm-bulk-campaign/:campaignId", async (req, res) => {
  try {
    const campaign = await PMBulk.findById(req.params.campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error("Campaign Detail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign details",
      error: error.message
    });
  }
});

/**
 * GET /pm-bulk-campaign-recipients/:campaignId
 * Get all recipients of a campaign
 */
router.get("/pm-bulk-campaign-recipients/:campaignId", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const campaign = await PMBulk.findById(req.params.campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    let recipients = campaign.phoneNumbers;

    if (status) {
      recipients = recipients.filter(r => r.status === status);
    }

    const total = recipients.length;
    const paginatedRecipients = recipients.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data: paginatedRecipients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Recipients Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recipients",
      error: error.message
    });
  }
});

/**
 * DELETE /pm-bulk-campaign/:campaignId
 * Delete a bulk campaign (soft delete)
 */
router.delete("/pm-bulk-campaign/:campaignId", async (req, res) => {
  try {
    const campaign = await PMBulk.findByIdAndUpdate(
      req.params.campaignId,
      { status: "deleted", deletedAt: new Date() },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: campaign
    });
  } catch (error) {
    console.error("Delete Campaign Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete campaign",
      error: error.message
    });
  }
});

module.exports = router;