// routes/rolePermissions.js
const express = require('express');
const router = express.Router();
const RolePermission = require('../AdminRolls/AdminRollModel');
const axios = require("axios");


// Get all role permissions
router.get('/get-role-permissions', async (req, res) => {
  try {
    const data = await RolePermission.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


 



router.post("/send-message", async (req, res) => {
  try {
    const { to, message } = req.body;

    // ─── OneMSG (commented out — replaced by Meta WhatsApp Cloud API) ───
    // const response = await axios.post(
    //   "https://app.onemsg.io/api/create-message",
    //   new URLSearchParams({
    //     appkey: process.env.ONEMSG_APPKEY,
    //     authkey: process.env.ONEMSG_AUTHKEY,
    //     to,
    //     message
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   }
    // );
    const response = await axios.post(
      `https://graph.facebook.com/${process.env.META_API_VERSION || "v21.0"}/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: String(to).replace(/\D/g, ""),
        type: "text",
        text: { preview_url: false, body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
