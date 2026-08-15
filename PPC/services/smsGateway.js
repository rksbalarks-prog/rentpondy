import 'dotenv/config.js';
import axios from 'axios';

// ── Self-hosted SMS Gateway sender ───────────────────────────────────────────
// Sends SMS through your own Android phone's SIM via the self-hosted SMS Gateway
// (C:\Users\Hp\sms-gateway). The gateway exposes `POST /api/sms/send` and is
// authenticated with a scoped API key (`X-Api-Key: sk_...`).
//
// Config is read from .env at CALL TIME (not import time) so a `pm2 restart
// server` — which reloads .env — always picks up the latest URL / key:
//   SMS_GATEWAY_URL      base URL of the gateway backend (default localhost:4000)
//   SMS_GATEWAY_API_KEY  the sk_... key minted for RentPondy (scope: sms:send)
//
// NOTE on production reachability: the gateway backend must be reachable FROM
// the machine running this PPC server. In dev both run on one box, so the
// localhost default works. In production point SMS_GATEWAY_URL at wherever the
// gateway backend lives (VPS IP / tunnel / LAN), and make sure the Android app
// with the SIM is connected to that gateway.

function getConfig() {
  return {
    baseUrl: (process.env.SMS_GATEWAY_URL || 'http://localhost:4000').replace(/\/+$/, ''),
    apiKey: process.env.SMS_GATEWAY_API_KEY || '',
  };
}

// Normalise any Indian mobile number to strict E.164 (+91XXXXXXXXXX), which is
// what the gateway's schema requires (`^\+[1-9]\d{7,14}$`). It rejects the bare
// 10-digit / 0-prefixed forms rather than guessing, so we convert here.
//   9944244409      -> +919944244409
//   09944244409     -> +919944244409
//   919944244409    -> +919944244409
//   +91 99442 44409 -> +919944244409
export function toE164(raw, defaultCountry = '91') {
  let digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;

  if (digits.length === 10) {
    digits = defaultCountry + digits;                 // bare 10-digit local number
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = defaultCountry + digits.slice(1);         // 0XXXXXXXXXX -> 91XXXXXXXXXX
  }
  // Already includes a country code (e.g. 12 digits starting 91) — leave as is.

  if (digits.length < 8 || digits.length > 15) return null;
  return '+' + digits;
}

/**
 * Send a single SMS through the gateway.
 * @param {string} to        recipient number (any format; converted to E.164)
 * @param {string} body      message text (1–1600 chars)
 * @param {string} [clientRef] optional caller reference echoed back by the gateway
 * @returns {Promise<object>} the gateway's response body (message accepted / queued)
 */
export async function sendSms(to, body, clientRef) {
  const { baseUrl, apiKey } = getConfig();

  if (!apiKey) {
    throw new Error('SMS_GATEWAY_API_KEY is not configured in .env');
  }
  const e164 = toE164(to);
  if (!e164) {
    throw new Error(`Invalid recipient number for SMS gateway: "${to}"`);
  }
  if (!body || !String(body).trim()) {
    throw new Error('SMS body cannot be empty');
  }

  const payload = { to: e164, body: String(body).slice(0, 1600) };
  if (clientRef) payload.clientRef = String(clientRef).slice(0, 128);

  const res = await axios.post(`${baseUrl}/api/sms/send`, payload, {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
  return res.data;
}

export default { sendSms, toE164 };
