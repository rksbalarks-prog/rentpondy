import 'dotenv/config.js';
import express from 'express';
import whatsapp from '../services/whatsapp.js';

const { sendCampaign, isConfigured, TEMPLATES } = whatsapp;

const router = express.Router();

// ── SmartGrowth AI WhatsApp send API ─────────────────────────────────────────
// The Meta Cloud API webhook (GET/POST /webhook) that used to live here is
// gone: SmartGrowth is a campaign API, it has no inbound webhook contract with
// this server. Only the internal send endpoints remain.

// ── Internal auth guard ──────────────────────────────────────────────────────
// This codebase has no shared auth middleware, so protect these internal-only
// endpoints with a simple x-api-key header checked against WA_INTERNAL_API_KEY.
function requireInternalApiKey(req, res, next) {
  const expected = process.env.WA_INTERNAL_API_KEY;
  const provided = req.headers['x-api-key'];

  if (!expected) {
    return res.status(500).json({ error: 'WA_INTERNAL_API_KEY is not configured on the server' });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing x-api-key' });
  }
  return next();
}

// ── GET /api/whatsapp-status ─────────────────────────────────────────────────
// Cheap check that the SmartGrowth credentials are present (no secrets echoed).
router.get('/api/whatsapp-status', (req, res) => {
  res.json({
    provider: 'smartgrowthai',
    endpoint: process.env.SMARTGROWTH_API_URL || 'https://newapp.smartgrowthai.com/send/campaign',
    configured: isConfigured(),
    defaultTemplateId: TEMPLATES.default(),
  });
});

// ── POST /api/send-whatsapp ──────────────────────────────────────────────────
// Body: { to, campaignName?, templateId? }
//   or: { phoneNumbers: [...], campaignName?, templateId? }
// "to" may be a bare 10-digit Indian number or include the country code; the
// service normalises it to the digits-only form the API expects.
router.post('/api/send-whatsapp', requireInternalApiKey, async (req, res) => {
  try {
    const { to, phoneNumbers, campaignName, templateId } = req.body || {};

    const recipients = Array.isArray(phoneNumbers) ? phoneNumbers : to ? [to] : [];
    if (recipients.length === 0) {
      return res.status(400).json({ error: 'Provide "to" or a "phoneNumbers" array' });
    }

    const result = await sendCampaign({
      phoneNumbers: recipients,
      campaignName: campaignName || 'notify',
      templateId,
    });

    return res.status(200).json(result);
  } catch (error) {
    // Return the SmartGrowth error body when present so the caller can debug.
    const apiError = error.response?.data;
    return res.status(500).json(apiError || { error: error.message });
  }
});

// ── POST /api/send-whatsapp-campaign ─────────────────────────────────────────
// Straight pass-through to the campaign API for many recipients at once.
router.post('/api/send-whatsapp-campaign', requireInternalApiKey, async (req, res) => {
  try {
    const { phoneNumbers, campaignName, templateId } = req.body || {};

    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res.status(400).json({ error: '"phoneNumbers" must be a non-empty array' });
    }

    const result = await sendCampaign({
      phoneNumbers,
      campaignName: campaignName || 'campaign',
      templateId: templateId || TEMPLATES.bulk(),
    });

    return res.status(200).json(result);
  } catch (error) {
    const apiError = error.response?.data;
    return res.status(500).json(apiError || { error: error.message });
  }
});

export default router;
