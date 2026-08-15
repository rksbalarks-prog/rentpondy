import 'dotenv/config.js';
import express from 'express';
import { sendText, sendTemplate } from '../services/whatsapp.js';

const router = express.Router();

// ── Meta webhook verification (GET /webhook) ─────────────────────────────────
// Meta calls this once when you save the callback URL. Echo hub.challenge back
// as PLAIN TEXT when hub.mode === 'subscribe' and hub.verify_token matches our
// WA_VERIFY_TOKEN; otherwise 403. This route is intentionally unauthenticated —
// Meta calls it with no credentials.
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    console.log('✅ [whatsapp] Webhook verified by Meta');
    return res.status(200).send(String(challenge));
  }

  console.warn('⚠️ [whatsapp] Webhook verification failed', {
    mode,
    tokenMatch: token === process.env.WA_VERIFY_TOKEN,
  });
  return res.sendStatus(403);
});

// ── Meta inbound events (POST /webhook) ──────────────────────────────────────
// Meta requires a fast 200, so acknowledge FIRST and parse afterwards. Every
// field access is optional-chained/guarded so an unexpected payload shape only
// logs — it never throws out of the handler (we already responded).
router.post('/webhook', (req, res) => {
  // 1. Acknowledge immediately so Meta does not retry or disable the webhook.
  res.sendStatus(200);

  // 2. Process the payload defensively.
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    if (!value) {
      console.log('ℹ️ [whatsapp] Webhook POST with no value payload:', JSON.stringify(req.body));
      return;
    }

    // Inbound messages from users.
    if (Array.isArray(value.messages) && value.messages.length > 0) {
      value.messages.forEach((msg) => {
        const from = msg?.from;
        const type = msg?.type;
        const text = msg?.text?.body;
        const timestamp = msg?.timestamp;
        const messageId = msg?.id;

        console.log('📩 [whatsapp] Inbound message:', {
          from,
          type,
          text,
          timestamp,
          messageId,
        });

        // ─────────────────────────────────────────────────────────────────
        // TODO: handle the inbound message — save to DB and/or auto-reply.
        //   e.g.
        //   await InboundWhatsappModel.create({ from, type, text, timestamp, messageId });
        //   if (type === 'text') {
        //     await sendText(from, 'Thanks! We received your message.');
        //   }
        // ─────────────────────────────────────────────────────────────────
      });
      return;
    }

    // Delivery / read status receipts.
    if (Array.isArray(value.statuses) && value.statuses.length > 0) {
      value.statuses.forEach((st) => {
        console.log('📦 [whatsapp] Status update:', {
          status: st?.status,
          recipientId: st?.recipient_id,
          messageId: st?.id,
        });
      });
      return;
    }

    // Anything else (errors, template status updates, account changes, …).
    console.log('ℹ️ [whatsapp] Webhook event with no messages/statuses:', JSON.stringify(value));
  } catch (err) {
    // We already sent 200 — never let a bad payload crash the process.
    console.error('❌ [whatsapp] Error handling webhook payload:', err.message);
  }
});

// ── Internal auth guard for the send API ─────────────────────────────────────
// This codebase has no shared auth middleware, so protect this internal-only
// endpoint with a simple x-api-key header checked against WA_INTERNAL_API_KEY.
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

// ── Internal send endpoint (POST /api/send-whatsapp) ─────────────────────────
// Body: { to, message }             -> free-form text (24h window only)
//   or: { to, template, language }  -> template send
// "to" must be digits only with a country code, e.g. 917094422941. We strip
// '+', spaces and dashes before sending.
router.post('/api/send-whatsapp', requireInternalApiKey, async (req, res) => {
  try {
    const { to, message, template, language } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: '"to" is required' });
    }

    // Normalise: keep digits only (strips +, spaces, dashes, etc.).
    const cleanTo = String(to).replace(/\D/g, '');

    // Digits only WITH country code — reject a bare 10-digit number.
    // (11–15 digits covers 91 + 10-digit India numbers and other country codes.)
    if (!/^\d{11,15}$/.test(cleanTo)) {
      return res.status(400).json({
        error: 'Invalid "to": must be digits only including the country code, e.g. 917094422941',
      });
    }

    let data;
    if (template) {
      data = await sendTemplate(cleanTo, template, language || 'en_US');
    } else if (message) {
      data = await sendText(cleanTo, message);
    } else {
      return res.status(400).json({
        error: 'Provide "message" for a text send or "template" for a template send',
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    // Return the Meta error body when present so the caller can debug.
    const metaError = error.response?.data;
    return res.status(500).json(metaError || { error: error.message });
  }
});

export default router;
