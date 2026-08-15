const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/bulk-message", async (req, res) => {
  try {
    const { to, message } = req.body;

    // ─── OneMSG (commented out — replaced by Meta WhatsApp Cloud API) ───
    // const response = await axios.post(
    //   "https://app.onemsg.io/api/create-message",
    //   new URLSearchParams({
    //     appkey: process.env.BULK_ONEMSG_APPKEY,
    //     authkey: process.env.BULK_ONEMSG_AUTHKEY,
    //     to,
    //     message
    //   }),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   }
    // );
    // Bulk sender falls back to the main Meta number/token if META_BULK_* are unset.
    const response = await axios.post(
      `https://graph.facebook.com/${process.env.META_API_VERSION || "v21.0"}/${process.env.META_BULK_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: String(to).replace(/\D/g, ""),
        type: "text",
        text: { preview_url: false, body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_BULK_WHATSAPP_TOKEN || process.env.META_WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
