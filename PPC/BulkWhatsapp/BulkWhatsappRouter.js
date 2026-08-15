const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const crypto = require("crypto");
const { createWasender } = require("wasenderapi");
require("dotenv/config");

const uuidv4 = () => crypto.randomUUID();

const BulkWhatsapp = require("./BulkWhatsappModel");

const router = express.Router();

// ── Multer (in-memory, up to 50 MB — 460k numbers in .xlsx is ~5-15 MB) ─────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ── Wasender singleton ──────────────────────────────────────────────────────
let wasender = null;
function getWasender() {
  if (wasender) return wasender;
  const apiKey = process.env.WASENDER_API_KEY;
  const accessToken = process.env.WASENDER_PERSONAL_ACCESS_TOKEN;
  if (!apiKey || !accessToken) {
    console.error("[BulkWhatsapp] Missing WASENDER_API_KEY / WASENDER_PERSONAL_ACCESS_TOKEN in .env");
    return null;
  }
  try {
    wasender = createWasender(
      apiKey,
      accessToken,
      undefined,
      undefined,
      { enabled: true, maxRetries: 3 },
      process.env.WASENDER_WEBHOOK_SECRET
    );
    console.log("[BulkWhatsapp] Wasender initialized.");
  } catch (err) {
    console.error("[BulkWhatsapp] Failed to init Wasender:", err.message);
  }
  return wasender;
}
getWasender();

// ── Worker registry: one worker per active batch, tracked by batchId ────────
const runningWorkers = new Set();
const cancelledBatches = new Set();

const WORKER_CHUNK = 100;             // records pulled from DB per loop
const INTER_MESSAGE_DELAY_MS = 5000;  // 5s — matches Wasender "Account Protection" (1 msg / 5s)
const RATE_LIMIT_RETRY_MS = 6000;     // sleep this long on 429 before retrying
const MAX_RATE_LIMIT_RETRIES = 3;     // up to 3 retries per record on 429

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Detect a 429 / rate-limit error from any shape the wasenderapi package might surface
function isRateLimitError(errOrResult) {
  if (!errOrResult) return false;
  const status =
    errOrResult?.status ||
    errOrResult?.statusCode ||
    errOrResult?.response?.status ||
    errOrResult?.response?.statusCode;
  if (status === 429) return true;
  const text =
    errOrResult?.message ||
    errOrResult?.error ||
    errOrResult?.response?.data?.message ||
    errOrResult?.response?.data?.error ||
    "";
  return /\b429\b|rate.?limit|account protection|too many requests/i.test(String(text));
}

// ── Phone normalization ─────────────────────────────────────────────────────
// Accepts: "919876543210", "+91 98765-43210", "98765 43210" → "919876543210"
function normalizePhone(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;
  // strip non-digits (including +, spaces, hyphens, parentheses)
  s = s.replace(/\D+/g, "");
  if (!s) return null;
  // If 10-digit Indian number, prefix 91
  if (s.length === 10) s = "91" + s;
  // Final sanity: 7-15 digits per E.164
  if (s.length < 10 || s.length > 15) return null;
  return s;
}

// ── Parse a file buffer (xlsx | csv | txt) → array of normalized phone strings
function parseNumbersFromBuffer(buffer, filename) {
  const name = (filename || "").toLowerCase();
  const raw = [];

  if (/\.(xlsx|xls)$/.test(name)) {
    const wb = XLSX.read(buffer, { type: "buffer" });
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
      // Prefer column A; if it's mostly empty, fall back to scanning every cell.
      const colA = rows.map((r) => (r && r[0] != null ? r[0] : ""));
      const colAHasNumbers = colA.some((v) => /\d/.test(String(v)));
      if (colAHasNumbers) {
        for (const v of colA) raw.push(v);
      } else {
        for (const r of rows) for (const c of (r || [])) if (c != null) raw.push(c);
      }
    }
  } else {
    // .txt or .csv — split on any non-digit/non-+ separator
    const text = buffer.toString("utf8");
    for (const tok of text.split(/[\s,;:\n\r\t|]+/)) {
      if (tok) raw.push(tok);
    }
  }

  // Normalize + de-dupe
  const seen = new Set();
  const out = [];
  let invalid = 0;
  for (const r of raw) {
    const norm = normalizePhone(r);
    if (!norm) { invalid++; continue; }
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }
  return { numbers: out, invalid, totalParsed: raw.length };
}

// ── The worker: drains Pending records for one batchId as fast as it can ────
async function runBatchWorker(batchId) {
  if (runningWorkers.has(batchId)) return;
  runningWorkers.add(batchId);
  console.log(`[BulkWhatsapp] Worker START batch=${batchId}`);

  const wa = getWasender();
  if (!wa) {
    console.error(`[BulkWhatsapp] Worker abort: Wasender not initialized (batch=${batchId})`);
    runningWorkers.delete(batchId);
    return;
  }

  try {
    let processed = 0;
    while (true) {
      if (cancelledBatches.has(batchId)) {
        console.log(`[BulkWhatsapp] Worker cancelled batch=${batchId}`);
        cancelledBatches.delete(batchId);
        break;
      }

      // Pull next chunk of Pending records whose scheduleTime is now/past
      const chunk = await BulkWhatsapp.find({
        batchId,
        status: "Pending",
        scheduleTime: { $lte: new Date() },
      })
        .sort({ scheduleTime: 1, _id: 1 })
        .limit(WORKER_CHUNK)
        .lean();

      if (chunk.length === 0) {
        // Check if there are any future-scheduled records still pending
        const future = await BulkWhatsapp.findOne({
          batchId,
          status: "Pending",
        })
          .sort({ scheduleTime: 1 })
          .lean();

        if (!future) break; // batch fully drained

        const waitMs = Math.max(0, new Date(future.scheduleTime) - Date.now());
        if (waitMs > 0) {
          // Sleep until the next scheduled record (capped at 60s so we re-check)
          await sleep(Math.min(waitMs, 60_000));
          continue;
        }
      }

      for (const rec of chunk) {
        if (cancelledBatches.has(batchId)) break;

        // Ensure E.164 format (Wasender expects +<country><number>)
        const to = rec.phoneNumber.startsWith("+") ? rec.phoneNumber : "+" + rec.phoneNumber;

        // ── Send-with-retry: on 429 we sleep + retry instead of marking Failed
        let attempt = 0;
        let finalStatus = null; // 'Sent' | 'Failed'
        let finalErr = null;
        let finalMessageId = null;

        while (attempt <= MAX_RATE_LIMIT_RETRIES) {
          if (cancelledBatches.has(batchId)) break;

          try {
            const result = await wa.send({
              messageType: "text",
              to,
              text: rec.message,
            });

            // wasenderapi returns { response: { messageId, ... } } on success
            const ok = !!(result && (result.response || result.success === true));
            if (ok) {
              finalMessageId =
                result?.response?.messageId ||
                result?.response?.id ||
                result?.messageId ||
                result?.id ||
                null;
              finalStatus = "Sent";
              break;
            }

            // Non-throwing failure: check for rate limit in the result body
            if (isRateLimitError(result) && attempt < MAX_RATE_LIMIT_RETRIES) {
              console.warn(`[BulkWhatsapp] 429 (in body) to=${to} attempt=${attempt + 1} — sleeping ${RATE_LIMIT_RETRY_MS}ms`);
              await sleep(RATE_LIMIT_RETRY_MS);
              attempt++;
              continue;
            }

            finalStatus = "Failed";
            finalErr =
              result?.error ||
              result?.message ||
              (typeof result === "object" ? JSON.stringify(result).slice(0, 300) : String(result)) ||
              "Unknown error from Wasender";
            break;
          } catch (err) {
            if (isRateLimitError(err) && attempt < MAX_RATE_LIMIT_RETRIES) {
              console.warn(`[BulkWhatsapp] 429 (thrown) to=${to} attempt=${attempt + 1} — sleeping ${RATE_LIMIT_RETRY_MS}ms`);
              await sleep(RATE_LIMIT_RETRY_MS);
              attempt++;
              continue;
            }
            finalStatus = "Failed";
            finalErr =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              (err?.response?.data && JSON.stringify(err.response.data).slice(0, 300)) ||
              err?.message ||
              String(err);
            break;
          }
        }

        if (finalStatus === "Sent") {
          await BulkWhatsapp.updateOne(
            { _id: rec._id },
            {
              $set: {
                status: "Sent",
                sentAt: new Date(),
                messageId: finalMessageId,
                errorMessage: null,
              },
            }
          );
        } else if (finalStatus === "Failed") {
          console.error(`[BulkWhatsapp] Send failed to=${to}:`, finalErr);
          await BulkWhatsapp.updateOne(
            { _id: rec._id },
            { $set: { status: "Failed", errorMessage: finalErr } }
          );
        }
        // If cancelled mid-retry, leave the record as Pending so it gets picked up later.

        processed++;
        if (INTER_MESSAGE_DELAY_MS > 0) await sleep(INTER_MESSAGE_DELAY_MS);
      }

      if (processed % 500 === 0) {
        console.log(`[BulkWhatsapp] batch=${batchId} processed=${processed}`);
      }
    }
    console.log(`[BulkWhatsapp] Worker DONE batch=${batchId} processed=${processed}`);
  } catch (err) {
    console.error(`[BulkWhatsapp] Worker crashed batch=${batchId}:`, err.message);
  } finally {
    runningWorkers.delete(batchId);
  }
}

// ── On startup, resume any batches that still have Pending records ──────────
async function resumePendingBatches() {
  try {
    const batchIds = await BulkWhatsapp.distinct("batchId", { status: "Pending" });
    if (batchIds.length) {
      console.log(`[BulkWhatsapp] Resuming ${batchIds.length} pending batch(es)`);
      batchIds.forEach((id) => runBatchWorker(id));
    }
  } catch (err) {
    console.error("[BulkWhatsapp] resumePendingBatches error:", err.message);
  }
}
resumePendingBatches();

// ── Validate / parse schedule input → base time + per-message interval ──────
function parseScheduleInput({ scheduleMinutes, scheduleDateTime }) {
  const validDelays = [0, 1, 2, 5, 10, 15, 30];
  let baseScheduleTime;
  let intervalMinutes = 0;

  if (scheduleDateTime && scheduleMinutes) {
    baseScheduleTime = new Date(scheduleDateTime);
    if (isNaN(baseScheduleTime.getTime())) throw new Error("Invalid scheduleDateTime format.");
    if (baseScheduleTime <= new Date()) throw new Error("Schedule date/time must be in the future.");
    intervalMinutes = Number(scheduleMinutes);
    if (!validDelays.includes(intervalMinutes))
      throw new Error("Invalid scheduleMinutes interval (1, 2, 5, 10, 15, 30 min allowed).");
  } else if (scheduleDateTime) {
    baseScheduleTime = new Date(scheduleDateTime);
    if (isNaN(baseScheduleTime.getTime())) throw new Error("Invalid scheduleDateTime format.");
    if (baseScheduleTime <= new Date()) throw new Error("Schedule date/time must be in the future.");
  } else if (scheduleMinutes !== undefined && scheduleMinutes !== null && scheduleMinutes !== "") {
    if (!validDelays.includes(Number(scheduleMinutes)))
      throw new Error("Invalid scheduleMinutes value (0, 1, 2, 5, 10, 15, 30 min allowed).");
    baseScheduleTime = new Date(Date.now() + Number(scheduleMinutes) * 60 * 1000);
  } else {
    throw new Error("Either scheduleMinutes or scheduleDateTime is required.");
  }

  return { baseScheduleTime, intervalMinutes };
}

// ── Bulk-insert numbers as Pending records in chunks ────────────────────────
async function insertBatch({ phoneNumbers, message, batchId, baseScheduleTime, intervalMinutes }) {
  const INSERT_CHUNK = 5000;
  let inserted = 0;
  for (let i = 0; i < phoneNumbers.length; i += INSERT_CHUNK) {
    const slice = phoneNumbers.slice(i, i + INSERT_CHUNK);
    const docs = slice.map((phoneNumber, idx) => ({
      phoneNumber,
      message,
      scheduleMinutes: intervalMinutes,
      scheduleTime: new Date(
        baseScheduleTime.getTime() + ((i + idx) * intervalMinutes * 60 * 1000)
      ),
      status: "Pending",
      batchId,
    }));
    await BulkWhatsapp.insertMany(docs, { ordered: false });
    inserted += docs.length;
  }
  return inserted;
}

// ============================================================================
// POST /api/bulk-whatsapp/upload-and-send
// Multipart: file=<.xlsx|.csv|.txt>, message, scheduleMinutes?, scheduleDateTime?
// Designed for very large lists (tested up to 460k+ numbers).
// ============================================================================
router.post("/upload-and-send", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file is required (multipart field 'file')." });
    const { message, scheduleMinutes, scheduleDateTime } = req.body || {};
    if (!message || !String(message).trim())
      return res.status(400).json({ error: "message is required." });

    let schedule;
    try {
      schedule = parseScheduleInput({ scheduleMinutes, scheduleDateTime });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const parsed = parseNumbersFromBuffer(req.file.buffer, req.file.originalname);
    if (parsed.numbers.length === 0) {
      return res.status(400).json({
        error: "No valid phone numbers found in file.",
        totalParsed: parsed.totalParsed,
        invalid: parsed.invalid,
      });
    }

    const batchId = uuidv4();
    const cleanMessage = String(message).trim();

    // Respond immediately — the insert + worker run in the background
    res.status(202).json({
      success: true,
      batchId,
      totalParsed: parsed.totalParsed,
      uniqueValid: parsed.numbers.length,
      invalid: parsed.invalid,
      message: "Upload accepted. Insertion and sending will run in the background.",
    });

    // Background insertion + worker kickoff
    setImmediate(async () => {
      try {
        const inserted = await insertBatch({
          phoneNumbers: parsed.numbers,
          message: cleanMessage,
          batchId,
          baseScheduleTime: schedule.baseScheduleTime,
          intervalMinutes: schedule.intervalMinutes,
        });
        console.log(`[BulkWhatsapp] batch=${batchId} inserted=${inserted}`);
        runBatchWorker(batchId);
      } catch (err) {
        console.error(`[BulkWhatsapp] insertBatch error batch=${batchId}:`, err.message);
      }
    });
  } catch (err) {
    console.error("[BulkWhatsapp] /upload-and-send error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// POST /api/bulk-whatsapp/create-message
// JSON body: { phoneNumbers, message, scheduleMinutes?, scheduleDateTime? }
// For small batches pasted in the UI. Same flow as upload but without multer.
// ============================================================================
router.post("/create-message", async (req, res) => {
  try {
    const { phoneNumbers, message, scheduleMinutes, scheduleDateTime } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0)
      return res.status(400).json({ error: "phoneNumbers array is required." });
    if (!message || !String(message).trim())
      return res.status(400).json({ error: "message is required." });

    let schedule;
    try {
      schedule = parseScheduleInput({ scheduleMinutes, scheduleDateTime });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Normalize + dedupe
    const seen = new Set();
    const unique = [];
    let invalid = 0;
    for (const n of phoneNumbers) {
      const v = normalizePhone(n);
      if (!v) { invalid++; continue; }
      if (seen.has(v)) continue;
      seen.add(v);
      unique.push(v);
    }
    if (unique.length === 0)
      return res.status(400).json({ error: "No valid phone numbers in payload." });

    const batchId = uuidv4();
    const cleanMessage = String(message).trim();
    const inserted = await insertBatch({
      phoneNumbers: unique,
      message: cleanMessage,
      batchId,
      baseScheduleTime: schedule.baseScheduleTime,
      intervalMinutes: schedule.intervalMinutes,
    });

    runBatchWorker(batchId);

    res.status(201).json({
      success: true,
      batchId,
      totalScheduled: inserted,
      invalid,
    });
  } catch (err) {
    console.error("[BulkWhatsapp] /create-message error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// GET /api/bulk-whatsapp/batches  — list batches (summary, paginated)
// ============================================================================
router.get("/batches", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $group: {
          _id: "$batchId",
          message: { $first: "$message" },
          total: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ["$status", "Sent"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "Failed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          firstScheduleTime: { $min: "$scheduleTime" },
          lastScheduleTime: { $max: "$scheduleTime" },
          createdAt: { $min: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    const batches = await BulkWhatsapp.aggregate(pipeline);
    res.json({
      success: true,
      batches: batches.map((b) => ({
        batchId: b._id,
        message: b.message,
        total: b.total,
        sent: b.sent,
        failed: b.failed,
        pending: b.pending,
        firstScheduleTime: b.firstScheduleTime,
        lastScheduleTime: b.lastScheduleTime,
        createdAt: b.createdAt,
        running: runningWorkers.has(b._id),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// GET /api/bulk-whatsapp/batch/:batchId/stats — live progress for one batch
// ============================================================================
router.get("/batch/:batchId/stats", async (req, res) => {
  try {
    const { batchId } = req.params;
    const agg = await BulkWhatsapp.aggregate([
      { $match: { batchId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ["$status", "Sent"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "Failed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        },
      },
    ]);
    const stats = agg[0] || { total: 0, sent: 0, failed: 0, pending: 0 };
    res.json({
      success: true,
      batchId,
      running: runningWorkers.has(batchId),
      ...stats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// GET /api/bulk-whatsapp/list  — paginated list of individual records
// Optional ?batchId=… filter
// ============================================================================
router.get("/list", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.batchId) filter.batchId = req.query.batchId;
    if (req.query.status) filter.status = req.query.status;

    const [records, total] = await Promise.all([
      BulkWhatsapp.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BulkWhatsapp.countDocuments(filter),
    ]);
    res.json({ success: true, records, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// POST /api/bulk-whatsapp/batch/:batchId/cancel — stop the running worker
// (Pending rows are deleted; Sent/Failed are kept for history.)
// ============================================================================
router.post("/batch/:batchId/cancel", async (req, res) => {
  try {
    const { batchId } = req.params;
    cancelledBatches.add(batchId);
    const r = await BulkWhatsapp.deleteMany({ batchId, status: "Pending" });
    res.json({ success: true, batchId, removedPending: r.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// DELETE /api/bulk-whatsapp/batch/:batchId  — delete entire batch
// ============================================================================
router.delete("/batch/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;
    cancelledBatches.add(batchId);
    const r = await BulkWhatsapp.deleteMany({ batchId });
    res.json({ success: true, batchId, deleted: r.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// GET /api/bulk-whatsapp/batch/:batchId/export — download .xlsx report for a batch
// Columns: SI.No, Phone Number, Message, Status (Delivered/Failed/Pending)
// ============================================================================
router.get("/batch/:batchId/export", async (req, res) => {
  try {
    const { batchId } = req.params;

    // Stream records via cursor so huge batches (460k+) don't OOM
    const cursor = BulkWhatsapp.find({ batchId })
      .sort({ createdAt: 1, _id: 1 })
      .lean()
      .cursor();

    const rows = [["SI.No", "Phone Number", "Status", "Log"]];
    let i = 0;
    for await (const rec of cursor) {
      i++;
      let status;
      let log;
      if (rec.status === "Sent") {
        status = "Sent";
        log = rec.sentAt
          ? `Delivered to Wasender at ${new Date(rec.sentAt).toLocaleString()}`
          : "Delivered to Wasender";
      } else if (rec.status === "Failed") {
        status = "Failed";
        log = rec.errorMessage || "Unknown error (no details returned by Wasender).";
      } else if (rec.status === "Sending") {
        status = "Sending";
        log = "Worker is currently processing this number.";
      } else {
        status = "Pending";
        log = rec.scheduleTime
          ? `Not sent yet. Scheduled for ${new Date(rec.scheduleTime).toLocaleString()}.`
          : "Not sent yet — queued.";
      }
      rows.push([i, rec.phoneNumber, status, log]);
    }

    if (i === 0) {
      return res.status(404).json({ error: "No records for this batch." });
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    // Column widths: SI.No, Phone, Status, Log (wide)
    ws["!cols"] = [{ wch: 8 }, { wch: 18 }, { wch: 12 }, { wch: 80 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `bulk-whatsapp-${batchId.slice(0, 8)}-${stamp}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", buf.length);
    res.send(buf);
  } catch (err) {
    console.error("[BulkWhatsapp] export error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// DELETE /api/bulk-whatsapp/:id — delete one record
// ============================================================================
router.delete("/:id", async (req, res) => {
  try {
    await BulkWhatsapp.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
