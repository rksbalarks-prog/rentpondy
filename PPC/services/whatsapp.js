/**
 * SmartGrowth AI — WhatsApp campaign sender.
 *
 * This is the ONLY WhatsApp integration in the backend. The previous Meta
 * Cloud API (graph.facebook.com), Wasender (wasenderapi) and OneMSG paths have
 * all been removed.
 *
 *   POST https://newapp.smartgrowthai.com/send/campaign
 *   Authorization: Bearer <SMARTGROWTH_TOKEN>
 *   Content-Type: application/json
 *   {
 *     "templateId":   "1625325505557221",
 *     "apiCode":      "<SMARTGROWTH_API_CODE>",
 *     "campaignName": "testaugust",
 *     "phoneNumbers": ["919361546021"]
 *   }
 *
 * ⚠ TEMPLATE-ONLY PROVIDER
 * The documented payload carries no message body. What the recipient receives
 * is whatever the approved template (templateId) says — the free-form `message`
 * text the old providers accepted can no longer be transmitted. Callers still
 * pass their text; it is logged and persisted for the audit trail, but delivery
 * uses the template. To vary the wording per flow, get another template
 * approved and point that flow at it via its own env var (see TEMPLATES below).
 *
 * Written in CommonJS so both the ESM files (`import whatsapp from …`) and the
 * CommonJS routers (`require(…)`) in this codebase can consume it.
 */

require("dotenv/config");
const axios = require("axios");

const DEFAULT_ENDPOINT = "https://newapp.smartgrowthai.com/send/campaign";
const DEFAULT_TEMPLATE_ID = "1625325505557221";

// Per-flow template overrides. Each falls back to SMARTGROWTH_TEMPLATE_ID so a
// single approved template is enough to get running; set the specific vars once
// you have more templates approved.
const TEMPLATES = {
  default: () => process.env.SMARTGROWTH_TEMPLATE_ID || DEFAULT_TEMPLATE_ID,
  bulk: () => process.env.SMARTGROWTH_BULK_TEMPLATE_ID || TEMPLATES.default(),
  report: () => process.env.SMARTGROWTH_REPORT_TEMPLATE_ID || TEMPLATES.default(),
  notify: () => process.env.SMARTGROWTH_NOTIFY_TEMPLATE_ID || TEMPLATES.default(),
};

// Read at call time (not import time) so `pm2 restart server` — which reloads
// .env — always picks up the latest credentials.
function getConfig() {
  return {
    url: process.env.SMARTGROWTH_API_URL || DEFAULT_ENDPOINT,
    token: process.env.SMARTGROWTH_TOKEN,
    apiCode: process.env.SMARTGROWTH_API_CODE,
    timeout: Number(process.env.SMARTGROWTH_TIMEOUT_MS) || 30000,
  };
}

function isConfigured() {
  const { token, apiCode } = getConfig();
  return Boolean(token && apiCode);
}

/**
 * Normalise a phone number to the digits-only form the API expects
 * ("919361546021"). Accepts "+91 93615-46021", "9361546021", etc.
 * Returns null when the input cannot be salvaged.
 */
function normalizePhone(raw) {
  if (raw == null) return null;
  let s = String(raw).replace(/\D+/g, "");
  if (!s) return null;
  if (s.length === 10) s = "91" + s; // bare Indian number
  if (s.length < 11 || s.length > 15) return null;
  return s;
}

/**
 * Build a campaign name the API will accept. SmartGrowth groups sends by this
 * name, so by default a timestamp suffix is appended to keep each send
 * individually traceable.
 *
 * If SmartGrowth turns out to require campaign names that were pre-registered
 * in their dashboard, set SMARTGROWTH_UNIQUE_CAMPAIGN_NAMES=0 and the name is
 * passed through as-is (slugged only).
 */
function buildCampaignName(base) {
  const slug = String(base || "rentpondy")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40) || "rentpondy";
  if (process.env.SMARTGROWTH_UNIQUE_CAMPAIGN_NAMES === "0") return slug;
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `${slug}${stamp}`;
}

/**
 * Send one campaign.
 *
 * @param {object}   opts
 * @param {string[]} opts.phoneNumbers  recipients (normalised internally)
 * @param {string}   opts.campaignName  human label; a timestamp is appended
 * @param {string}  [opts.templateId]   approved template; defaults to TEMPLATES.default()
 * @param {string}  [opts.rawCampaignName] pass a name through verbatim (no timestamp)
 * @returns {Promise<{success, campaignName, templateId, phoneNumbers, response}>}
 */
async function sendCampaign({ phoneNumbers, campaignName, templateId, rawCampaignName } = {}) {
  const { url, token, apiCode, timeout } = getConfig();

  if (!token || !apiCode) {
    const msg =
      "WhatsApp not configured: set SMARTGROWTH_TOKEN and SMARTGROWTH_API_CODE in .env";
    console.error("❌ [whatsapp]", msg);
    throw new Error(msg);
  }

  const list = (Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers])
    .map(normalizePhone)
    .filter(Boolean);
  const unique = [...new Set(list)];

  if (unique.length === 0) {
    throw new Error("No valid phone numbers to send to");
  }

  const finalTemplate = templateId || TEMPLATES.default();
  const finalName = rawCampaignName || buildCampaignName(campaignName);

  const payload = {
    templateId: String(finalTemplate),
    apiCode,
    campaignName: finalName,
    phoneNumbers: unique,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout,
    });

    console.log(
      `✅ [whatsapp] campaign "${finalName}" template=${finalTemplate} recipients=${unique.length}`
    );

    return {
      success: true,
      campaignName: finalName,
      templateId: String(finalTemplate),
      phoneNumbers: unique,
      response: response.data,
    };
  } catch (error) {
    // SmartGrowth puts the useful detail in the response body; log it before
    // rethrowing so the route can surface it to the caller.
    const apiError = error.response?.data;
    console.error(
      `❌ [whatsapp] campaign "${finalName}" failed:`,
      JSON.stringify(apiError || error.message, null, 2)
    );
    throw error;
  }
}

/**
 * Compatibility shim for the old free-form `sendText(to, message)` callers.
 *
 * The message text CANNOT be delivered by this provider (see the header note);
 * it is logged only. Delivery uses `templateId`.
 */
async function sendText(to, message, opts = {}) {
  if (message) {
    console.log(
      `ℹ️ [whatsapp] template-only provider — body not delivered to ${to}: ` +
        String(message).replace(/\s+/g, " ").slice(0, 160)
    );
  }
  return sendCampaign({
    phoneNumbers: [to],
    campaignName: opts.campaignName || "notify",
    templateId: opts.templateId || TEMPLATES.notify(),
  });
}

/** Compatibility shim for the old `sendTemplate(to, templateId)` callers. */
async function sendTemplate(to, templateId, opts = {}) {
  return sendCampaign({
    phoneNumbers: [to],
    campaignName: opts.campaignName || "template",
    templateId: templateId || TEMPLATES.default(),
  });
}

module.exports = {
  sendCampaign,
  sendText,
  sendTemplate,
  isConfigured,
  normalizePhone,
  buildCampaignName,
  TEMPLATES,
};
