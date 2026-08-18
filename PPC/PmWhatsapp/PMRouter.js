const express = require("express");
const router = express.Router();
const PM = require("./PMModel");
const whatsapp = require("../services/whatsapp");
require("dotenv/config");

// ── SmartGrowth AI credentials check on startup ──────────────────────────────
if (!whatsapp.isConfigured()) {
  console.error("❌ MISSING ENV VARS: SMARTGROWTH_TOKEN or SMARTGROWTH_API_CODE not set in .env");
} else {
  console.log("✅ SmartGrowth AI WhatsApp credentials found (PM single send)");
}

/**
 * POST /send-text
 *
 * NOTE: SmartGrowth is a template-only campaign API — the `text` body is stored
 * for the audit trail but the recipient receives the approved template. Point
 * this flow at its own template with SMARTGROWTH_NOTIFY_TEMPLATE_ID.
 */
router.post("/send-text", async (req, res) => {
  try {
    const { to, text, campaignName, templateId } = req.body;

    // Validation
    if (!to || !String(to).trim()) {
      return res.status(400).json({ success: false, message: "Phone number (to) is required" });
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const phoneNumber = whatsapp.normalizePhone(to);
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    console.log("📱 Sending WhatsApp to:", phoneNumber);

    let messageId = null;
    let deliveryStatus = "failed";
    let errorMessage = null;
    let apiResponse = null;

    try {
      if (!whatsapp.isConfigured()) {
        return res.status(503).json({
          success: false,
          message: "WhatsApp is not configured. Set SMARTGROWTH_TOKEN and SMARTGROWTH_API_CODE in .env."
        });
      }

      console.log("📤 Sending to SmartGrowth AI campaign API...");

      apiResponse = await whatsapp.sendCampaign({
        phoneNumbers: [phoneNumber],
        campaignName: campaignName || "pmsingle",
        templateId: templateId || whatsapp.TEMPLATES.notify(),
      });

      messageId = apiResponse.campaignName;
      deliveryStatus = "sent";
      console.log("✅ Message sent successfully! Campaign:", messageId);
    } catch (apiErr) {
      console.error("❌ SmartGrowth API Error:", apiErr.message);
      deliveryStatus = "failed";
      errorMessage =
        apiErr.response?.data?.message ||
        (apiErr.response?.data && JSON.stringify(apiErr.response.data).slice(0, 300)) ||
        apiErr.message ||
        "Failed to connect to WhatsApp service";
    }

    // Save to DB
    const messageRecord = await PM.create({
      phoneNumber,
      message: text.trim(),
      status: deliveryStatus,
      messageId,
      sentBy: "admin",
      sentAt: new Date(),
      errorMessage: deliveryStatus === "failed" ? errorMessage : null,
      metadata: {
        api: "smartgrowthai",
        apiResponse: apiResponse || null,
        originalRequest: { to, text }
      }
    });

    console.log("💾 DB record saved:", messageRecord._id, "| Status:", deliveryStatus);

    if (deliveryStatus === "sent") {
      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: { messageId, phoneNumber, status: deliveryStatus, dbId: messageRecord._id }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Failed to send message: ${errorMessage}`,
        data: { phoneNumber, status: deliveryStatus, error: errorMessage, dbId: messageRecord._id }
      });
    }
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending message",
      error: error.message
    });
  }
});

/**
 * GET /pm-history
 */
router.get("/pm-history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const messages = await PM.find().sort({ sentAt: -1 }).limit(limit).skip(skip);
    const total = await PM.countDocuments();

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch message history", error: error.message });
  }
});

/**
 * GET /pm-stats
 */
router.get("/pm-stats", async (req, res) => {
  try {
    const [total, sent, failed, pending] = await Promise.all([
      PM.countDocuments(),
      PM.countDocuments({ status: "sent" }),
      PM.countDocuments({ status: "failed" }),
      PM.countDocuments({ status: "pending" })
    ]);

    return res.status(200).json({ success: true, stats: { total, sent, failed, pending } });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch statistics", error: error.message });
  }
});

module.exports = router;
