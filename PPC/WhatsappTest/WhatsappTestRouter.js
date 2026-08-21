/**
 * WhatsApp bulk-send TEST PAGE — SmartGrowth AI campaign API.
 *
 * A standalone, passcode-gated console for firing a real campaign at a list of
 * numbers, so the SmartGrowth credentials / template can be verified on the
 * live server without going through any admin screen.
 *
 *   GET  /whatsapp-test          the page
 *   GET  /whatsapp-test/config   endpoint + template + limits (no secrets)
 *   POST /whatsapp-test/send     the send (x-test-key header required)
 *
 * DELIBERATELY SELF-CONTAINED. It does NOT import services/whatsapp.js: this
 * module is meant to be droppable onto a server whose other WhatsApp wiring is
 * a different vintage, and a test tool must never change the behaviour of the
 * flows it is testing. The normalise / campaign-name / batching logic below is
 * a deliberate copy of that service, kept payload-identical to it.
 *
 * TEMPLATE-ONLY PROVIDER. The campaign payload carries no message body — the
 * recipient sees the approved template (templateId), never the text typed on
 * the page. That text is logged for the audit trail only.
 */

import 'dotenv/config.js';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_ENDPOINT = 'https://newapp.smartgrowthai.com/send/campaign';
const DEFAULT_TEMPLATE_ID = '1625325505557221';

// Hard ceiling for one page submission. This is a test console, not a campaign
// tool — the cap stops a stray paste from becoming a 100k-number blast.
const MAX_RECIPIENTS = 10000;

const router = express.Router();

// ── Config ───────────────────────────────────────────────────────────────────
// Read at call time (not import time) so `pm2 restart server`, which reloads
// .env, always picks up the latest values.
function getConfig() {
  return {
    url: process.env.SMARTGROWTH_API_URL || DEFAULT_ENDPOINT,
    token: process.env.SMARTGROWTH_TOKEN,
    apiCode: process.env.SMARTGROWTH_API_CODE,
    templateId: process.env.SMARTGROWTH_TEMPLATE_ID || DEFAULT_TEMPLATE_ID,
    bulkTemplateId:
      process.env.SMARTGROWTH_BULK_TEMPLATE_ID ||
      process.env.SMARTGROWTH_TEMPLATE_ID ||
      DEFAULT_TEMPLATE_ID,
    batchSize: Number(process.env.SMARTGROWTH_BATCH_SIZE) || 500,
    batchDelayMs: Number(process.env.SMARTGROWTH_BATCH_DELAY_MS) || 2000,
    timeout: Number(process.env.SMARTGROWTH_TIMEOUT_MS) || 30000,
    uniqueNames: process.env.SMARTGROWTH_UNIQUE_CAMPAIGN_NAMES !== '0',
  };
}

// The page's passcode. Falls back to the internal send-route key so a server
// that already has that one configured needs no new secret.
function getTestKey() {
  return process.env.WHATSAPP_TEST_KEY || process.env.WA_INTERNAL_API_KEY || '';
}

/** Digits-only form the API expects ("919361546021"). null when unsalvageable. */
function normalizePhone(raw) {
  if (raw == null) return null;
  let s = String(raw).replace(/\D+/g, '');
  if (!s) return null;
  if (s.length === 10) s = '91' + s; // bare Indian number
  if (s.length < 11 || s.length > 15) return null;
  return s;
}

/**
 * Split a pasted blob into candidate numbers.
 *
 * Splitting on every run of non-digits is wrong: it tears "+91 93615-46021"
 * into three fragments. So split on the real record separators first (newline,
 * comma, semicolon, tab, pipe) and treat each line as ONE number — unless its
 * digits overflow a phone number, which means several numbers share the line,
 * and only then fall back to splitting on whitespace.
 */
function splitNumbers(input) {
  if (Array.isArray(input)) return input.map((x) => String(x == null ? '' : x));
  const out = [];
  String(input || '')
    .split(/[\n\r,;\t|]+/)
    .forEach((chunk) => {
      const t = chunk.trim();
      if (!t) return;
      const digits = t.replace(/\D+/g, '');
      if (digits.length <= 15) {
        out.push(t); // one number, spaces / dashes / a label alongside it
        return;
      }
      t.split(/\s+/).forEach((p) => {
        if (p.trim()) out.push(p.trim());
      });
    });
  return out;
}

/** Slug + UTC timestamp, so every send is traceable in the SmartGrowth dashboard. */
function buildCampaignName(base, unique) {
  const slug =
    String(base || 'rentpondytest')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 40) || 'rentpondytest';
  if (!unique) return slug;
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  return slug + stamp;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Passcode guard ───────────────────────────────────────────────────────────
function requireTestKey(req, res, next) {
  const expected = getTestKey();
  if (!expected) {
    return res.status(500).json({
      error:
        'No passcode configured on the server. Set WHATSAPP_TEST_KEY in PPC/.env and restart.',
    });
  }
  const provided = req.headers['x-test-key'] || (req.body && req.body.key);
  if (!provided || String(provided) !== expected) {
    return res.status(401).json({ error: 'Wrong passcode.' });
  }
  return next();
}

// ── GET /whatsapp-test ───────────────────────────────────────────────────────
// Read from disk per request: low-traffic test tool, and it means the page can
// be tweaked on the server without a pm2 restart.
router.get('/whatsapp-test', (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  try {
    const html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
    res.type('html').send(html);
  } catch (err) {
    res.status(500).type('text').send('WhatsApp test page missing: ' + err.message);
  }
});

// ── GET /whatsapp-test/config ────────────────────────────────────────────────
// Everything the page needs to render. No secret is echoed — only whether the
// credentials are present.
router.get('/whatsapp-test/config', (req, res) => {
  const c = getConfig();
  res.set('Cache-Control', 'no-store');
  res.json({
    provider: 'smartgrowthai',
    endpoint: c.url,
    configured: Boolean(c.token && c.apiCode),
    hasToken: Boolean(c.token),
    hasApiCode: Boolean(c.apiCode),
    passcodeSet: Boolean(getTestKey()),
    defaultTemplateId: c.templateId,
    bulkTemplateId: c.bulkTemplateId,
    batchSize: c.batchSize,
    batchDelayMs: c.batchDelayMs,
    timeoutMs: c.timeout,
    uniqueCampaignNames: c.uniqueNames,
    maxRecipients: MAX_RECIPIENTS,
  });
});

// ── POST /whatsapp-test/send ─────────────────────────────────────────────────
// Body: { numbers: string | string[], campaignName?, templateId?, message?,
//         batchSize?, batchDelayMs?, dryRun? }
router.post('/whatsapp-test/send', requireTestKey, async (req, res) => {
  const c = getConfig();
  const body = req.body || {};

  // Accept a pasted blob or a JSON array.
  const rawList = splitNumbers(body.numbers);
  const nonEmpty = rawList.map((x) => String(x == null ? '' : x).trim()).filter(Boolean);

  const seen = new Set();
  const valid = [];
  const invalid = [];
  let duplicates = 0;

  for (const raw of nonEmpty) {
    const n = normalizePhone(raw);
    if (!n) {
      if (invalid.length < 50) invalid.push(raw);
      continue;
    }
    if (seen.has(n)) {
      duplicates += 1;
      continue;
    }
    seen.add(n);
    valid.push(n);
  }

  const invalidCount = nonEmpty.length - valid.length - duplicates;

  if (valid.length === 0) {
    return res
      .status(400)
      .json({ error: 'No valid phone numbers in the list.', invalidCount, invalidSamples: invalid });
  }
  if (valid.length > MAX_RECIPIENTS) {
    return res.status(400).json({
      error:
        'Too many recipients: ' +
        valid.length +
        '. This test page allows at most ' +
        MAX_RECIPIENTS +
        '.',
    });
  }

  const templateId = String(body.templateId || c.bulkTemplateId);
  const campaignBase = body.campaignName || 'bulktest';
  const batchSize = Math.max(1, Math.min(Number(body.batchSize) || c.batchSize, 1000));
  const requestedDelay = Number(body.batchDelayMs);
  const batchDelayMs = Math.max(
    0,
    Math.min(Number.isFinite(requestedDelay) ? requestedDelay : c.batchDelayMs, 60000)
  );
  const dryRun = body.dryRun !== false; // safe default: dry run unless told otherwise

  // Template-only provider: surface the typed text in the log so the audit
  // trail matches what the operator believed they were sending.
  if (body.message) {
    console.log(
      'ℹ️ [wa-test] template-only provider — body NOT delivered: ' +
        String(body.message).replace(/\s+/g, ' ').slice(0, 200)
    );
  }

  const batches = [];
  for (let i = 0; i < valid.length; i += batchSize) {
    batches.push(valid.slice(i, i + batchSize));
  }

  const summary = {
    dryRun,
    accepted: valid.length,
    duplicatesRemoved: duplicates,
    invalidCount,
    invalidSamples: invalid,
    templateId,
    endpoint: c.url,
    batchCount: batches.length,
    batchSize,
    batchDelayMs,
    recipients: valid,
    results: [],
  };

  if (dryRun) {
    summary.results = batches.map((b, i) => {
      const campaignName = buildCampaignName(campaignBase, c.uniqueNames);
      return {
        batch: i + 1,
        count: b.length,
        status: 'dry-run',
        ok: true,
        campaignName,
        payloadPreview: {
          templateId,
          apiCode: c.apiCode ? '«set»' : '«MISSING»',
          campaignName,
          phoneNumbers: b.slice(0, 5).concat(b.length > 5 ? ['…+' + (b.length - 5) + ' more'] : []),
        },
      };
    });
    summary.allOk = true;
    return res.json(summary);
  }

  if (!c.token || !c.apiCode) {
    return res.status(500).json({
      error:
        'WhatsApp not configured: set SMARTGROWTH_TOKEN and SMARTGROWTH_API_CODE in PPC/.env, then restart.',
    });
  }

  for (let i = 0; i < batches.length; i += 1) {
    const phoneNumbers = batches[i];
    const campaignName = buildCampaignName(campaignBase, c.uniqueNames);
    const payload = { templateId, apiCode: c.apiCode, campaignName, phoneNumbers };

    try {
      const r = await axios.post(c.url, payload, {
        headers: { Authorization: 'Bearer ' + c.token, 'Content-Type': 'application/json' },
        timeout: c.timeout,
      });
      console.log(
        '✅ [wa-test] batch ' +
          (i + 1) +
          '/' +
          batches.length +
          ' "' +
          campaignName +
          '" template=' +
          templateId +
          ' recipients=' +
          phoneNumbers.length
      );
      summary.results.push({
        batch: i + 1,
        count: phoneNumbers.length,
        ok: true,
        status: r.status,
        campaignName,
        response: r.data,
      });
    } catch (err) {
      const status = (err.response && err.response.status) || 0;
      const data = (err.response && err.response.data) || { message: err.message };
      console.error(
        '❌ [wa-test] batch ' +
          (i + 1) +
          '/' +
          batches.length +
          ' "' +
          campaignName +
          '" failed (' +
          status +
          '):',
        JSON.stringify(data)
      );
      summary.results.push({
        batch: i + 1,
        count: phoneNumbers.length,
        ok: false,
        status,
        campaignName,
        error: data,
      });
    }

    if (i < batches.length - 1 && batchDelayMs > 0) await sleep(batchDelayMs);
  }

  summary.allOk = summary.results.every((r) => r.ok);
  return res.json(summary);
});

export default router;
