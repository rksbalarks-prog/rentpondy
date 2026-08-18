// routes/rolePermissions.js
const express = require('express');
const router = express.Router();
const RolePermission = require('../AdminRolls/AdminRollModel');
const whatsapp = require("../services/whatsapp");


// Get all role permissions
router.get('/get-role-permissions', async (req, res) => {
  try {
    const data = await RolePermission.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


 



// Send a WhatsApp message via the SmartGrowth AI campaign API.
// Template-only provider: `message` is not transmitted — the recipient gets the
// approved template (SMARTGROWTH_NOTIFY_TEMPLATE_ID).
router.post("/send-message", async (req, res) => {
  try {
    const { to, message, campaignName, templateId } = req.body;

    if (message) {
      console.log(`ℹ️ [AdminRoll] body not delivered (template-only): ${String(message).slice(0, 120)}`);
    }

    const result = await whatsapp.sendCampaign({
      phoneNumbers: [to],
      campaignName: campaignName || "adminroll",
      templateId: templateId || whatsapp.TEMPLATES.notify(),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
});


// Update role permissions
router.post('/update-role-permissions', async (req, res) => {
  const { role, viewedFiles } = req.body;

  if (!role || !Array.isArray(viewedFiles)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const result = await RolePermission.findOneAndUpdate(
      { role },
      { viewedFiles },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

module.exports = router;
