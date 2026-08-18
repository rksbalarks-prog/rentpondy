const express = require("express");
const router = express.Router();
const PMBulk = require("./PMBulkModel");
const whatsapp = require("../services/whatsapp");
require("dotenv/config");

// How many numbers go into a single SmartGrowth campaign call. The API takes an
// array, so one call covers the whole chunk instead of one call per recipient.
const CHUNK_SIZE = Number(process.env.SMARTGROWTH_BATCH_SIZE) || 500;
// Pause between chunks so a large list does not hammer the provider.
const CHUNK_DELAY_MS = Number(process.env.SMARTGROWTH_BATCH_DELAY_MS) || 2000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── SmartGrowth AI credentials check on startup ──────────────────────────────
if (!whatsapp.isConfigured()) {
  console.error("❌ MISSING ENV VARS: SMARTGROWTH_TOKEN or SMARTGROWTH_API_CODE not set in .env");
} else {
  console.log("✅ SmartGrowth AI WhatsApp credentials found for bulk messaging");
}

/**
 * POST /send-bulk-text
 * Send a WhatsApp campaign to multiple recipients.
 *
 * NOTE: SmartGrowth is a template-only campaign API — `message` is stored on
 * the campaign record for the audit trail, but what recipients receive is the
 * approved template (SMARTGROWTH_BULK_TEMPLATE_ID, or the `templateId` in the
 * request body).
 */
router.post("/send-bulk-text", async (req, res) => {
  try {
    const { campaignName, message, phoneNumbers, totalRecipients, sentBy, templateId } = req.body;

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

    // Send asynchronously to avoid a request timeout on large lists
    setImmediate(async () => {
      let successCount = 0;
      let failureCount = 0;
      const finalTemplateId = templateId || whatsapp.TEMPLATES.bulk();

      // Walk the recipient list in chunks; each chunk is one campaign call.
      for (let start = 0; start < phoneNumbers.length; start += CHUNK_SIZE) {
        const indices = [];
        const chunk = [];
        for (let i = start; i < Math.min(start + CHUNK_SIZE, phoneNumbers.length); i++) {
          const normalised = whatsapp.normalizePhone(phoneNumbers[i]);
          if (normalised) {
            indices.push(i);
            chunk.push(normalised);
          } else {
            // Unusable number — fail it here, it never reaches the provider.
            failureCount++;
            campaign.failedCount++;
            campaign.pendingCount--;
            campaign.phoneNumbers[i].status = "failed";
            campaign.phoneNumbers[i].errorMessage = "Invalid phone number";
            campaign.phoneNumbers[i].sentAt = new Date();
          }
        }

        if (chunk.length === 0) continue;

        let chunkStatus = "failed";
        let chunkMessageId = null;
        let chunkError = null;

        try {
          if (!whatsapp.isConfigured()) {
            throw new Error("SmartGrowth AI is not configured (SMARTGROWTH_TOKEN / SMARTGROWTH_API_CODE)");
          }

          const result = await whatsapp.sendCampaign({
            phoneNumbers: chunk,
            campaignName: campaign.campaignName,
            templateId: finalTemplateId,
          });

          chunkStatus = "sent";
          chunkMessageId = result.campaignName;
          console.log(`✅ Chunk sent: ${chunk.length} recipient(s) as "${result.campaignName}"`);
        } catch (apiErr) {
          chunkError =
            apiErr.response?.data?.message ||
            (apiErr.response?.data && JSON.stringify(apiErr.response.data).slice(0, 300)) ||
            apiErr.message ||
            "Unknown error";
          console.error(`🚨 Chunk failed (${chunk.length} recipients):`, chunkError);
        }

        // Apply the chunk result to every recipient it covered.
        for (const i of indices) {
          campaign.phoneNumbers[i].status = chunkStatus;
          campaign.phoneNumbers[i].messageId = chunkMessageId;
          campaign.phoneNumbers[i].sentAt = new Date();
          campaign.phoneNumbers[i].errorMessage = chunkError;
          campaign.pendingCount--;
          if (chunkStatus === "sent") {
            successCount++;
            campaign.sentCount++;
          } else {
            failureCount++;
            campaign.failedCount++;
          }
        }

        await campaign.save();
        console.log(`📊 Progress: ${Math.min(start + CHUNK_SIZE, phoneNumbers.length)}/${phoneNumbers.length}`);

        if (start + CHUNK_SIZE < phoneNumbers.length && CHUNK_DELAY_MS > 0) {
          await sleep(CHUNK_DELAY_MS);
        }
      }

      // Mark campaign as complete
      campaign.status = failureCount === 0 ? "sent" : successCount === 0 ? "failed" : "partially-sent";
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