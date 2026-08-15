import 'dotenv/config.js';
import axios from 'axios';

// ── Meta WhatsApp Cloud API sender ───────────────────────────────────────────
// Thin wrapper around the Graph API /messages endpoint. Credentials are read
// from .env at call time (not at import time) so a `pm2 restart server` — which
// reloads .env — always picks up the latest token / phone-number id.

const GRAPH_BASE = 'https://graph.facebook.com';

function getConfig() {
  return {
    version: process.env.WA_API_VERSION || 'v21.0',
    phoneNumberId: process.env.WA_PHONE_NUMBER_ID,
    token: process.env.WA_TOKEN,
  };
}

// Low-level POST to /{version}/{phoneNumberId}/messages. Adds the Bearer auth
// header, returns response.data on success, and on failure logs the full Meta
// error body (error.response.data) before rethrowing so callers can surface it.
async function postMessage(payload) {
  const { version, phoneNumberId, token } = getConfig();

  if (!token || !phoneNumberId) {
    const msg = 'WhatsApp not configured: missing WA_TOKEN or WA_PHONE_NUMBER_ID in .env';
    console.error('❌ [whatsapp]', msg);
    throw new Error(msg);
  }

  const url = `${GRAPH_BASE}/${version}/${phoneNumberId}/messages`;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    // Meta puts the useful details in error.response.data (invalid token,
    // unregistered recipient, template mismatch, out-of-window text, …).
    // Log it, then rethrow so the route can return it to the caller.
    const metaError = error.response?.data;
    console.error(
      '❌ [whatsapp] Cloud API send failed:',
      JSON.stringify(metaError || error.message, null, 2)
    );
    throw error;
  }
}

// Send a free-form text message.
// NOTE: Meta only delivers free-form text inside the 24h customer-service
// window; outside it you must use sendTemplate() with an approved template.
export async function sendText(to, message) {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: message },
  };
  return postMessage(payload);
}

// Send a pre-approved template message (works outside the 24h window).
// `components` is Meta's template components array (header/body/button params);
// omit it for parameterless templates like hello_world.
export async function sendTemplate(to, templateName, languageCode = 'en_US', components = []) {
  const template = {
    name: templateName,
    language: { code: languageCode },
  };
  if (Array.isArray(components) && components.length > 0) {
    template.components = components;
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template,
  };
  return postMessage(payload);
}

export default { sendText, sendTemplate };
