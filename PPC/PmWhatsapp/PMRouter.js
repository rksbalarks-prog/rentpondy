const express = require("express");
const router = express.Router();
const PM = require("./PMModel");
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
    console.log("✅ Wasender initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Wasender:", err.message);
  }

  return wasender;
}

// ── Verify credentials on startup ─────────────────────────────────────────────
if (!process.env.WASENDER_API_KEY || !process.env.WASENDER_PERSONAL_ACCESS_TOKEN) {
  console.error("❌ MISSING ENV VARS: WASENDER_API_KEY or WASENDER_PERSONAL_ACCESS_TOKEN not set in .env");
} else {
  console.log("✅ Wasender credentials found, initializing...");
  initializeWasender();
}

/**
 * POST /send-text
 */
router.post("/send-text", async (req, res) => {
  try {
    const { to, text } = req.body;

    // Validation
    if (!to || !String(to).trim()) {
      return res.status(400).json({ success: false, message: "Phone number (to) is required" });
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    // Format phone number
    let phoneNumber = String(to).trim().replace(/[\s\-()]/g, "");
    if (!phoneNumber.startsWith("+")) {
      if (phoneNumber.startsWith("91") && phoneNumber.length === 12) {
        phoneNumber = "+" + phoneNumber;
      } else {
        phoneNumber = "+91" + phoneNumber.slice(-10);
      }
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    console.log("📱 Sending WhatsApp to:", phoneNumber);

    let messageId = null;
    let deliveryStatus = "failed";
    let errorMessage = null;
    let wasenderResponse = null;

    try {
      const wasenderClient = initializeWasender();

      if (!wasenderClient) {
        return res.status(503).json({
          success: false,
          message: "Wasender service is not initialized. Check your environment variables."
        });
      }

      const payload = {
        messageType: "text",
        to: phoneNumber,
        text: text.trim()
      };

      console.log("📤 Sending to Wasender API...");

      wasenderResponse = await wasenderClient.send(payload);

      console.log("✅ Wasender Response:", JSON.stringify(wasenderResponse, null, 2));

      if (wasenderResponse && wasenderResponse.response) {
        messageId = wasenderResponse.response.messageId || wasenderResponse.response.id || null;
        deliveryStatus = "sent";
        console.log("✅ Message sent successfully! ID:", messageId);
      } else {
        deliveryStatus = "failed";
        errorMessage = "Unexpected response from Wasender API";
        console.error("❌ Unexpected response:", errorMessage);
      }
    } catch (apiErr) {
      console.error("❌ Wasender API Error:", apiErr.message);
      console.error("❌ Error Details:", apiErr);
      deliveryStatus = "failed";
      errorMessage = apiErr.message || "Failed to connect to WhatsApp service";
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
        api: "wasender",
        wasenderResponse: wasenderResponse || null,
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
