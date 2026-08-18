const express = require("express");
const whatsapp = require("../services/whatsapp"); // SmartGrowth AI campaign API

const router = express.Router();

// POST /bulk-message
// Body: { to | phoneNumbers[], message?, campaignName?, templateId? }
//
// ⚠ Template-only provider: `message` is not transmitted. Recipients receive the
// approved template (SMARTGROWTH_BULK_TEMPLATE_ID, or `templateId` in the body).
router.post("/bulk-message", async (req, res) => {
  try {
    const { to, phoneNumbers, message, campaignName, templateId } = req.body;

    const recipients = Array.isArray(phoneNumbers) ? phoneNumbers : to ? [to] : [];
    if (recipients.length === 0) {
      return res.status(400).json({ error: 'Provide "to" or a "phoneNumbers" array' });
    }
    if (message) {
      console.log(`ℹ️ [BulkMessage] body not delivered (template-only): ${String(message).slice(0, 120)}`);
    }

    const result = await whatsapp.sendCampaign({
      phoneNumbers: recipients,
      campaignName: campaignName || "bulkmessage",
      templateId: templateId || whatsapp.TEMPLATES.bulk(),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
});

module.exports = router;
