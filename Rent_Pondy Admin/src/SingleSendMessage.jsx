import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ── config ──────────────────────────────────────────────────────────────── */
const API_BASE        = process.env.REACT_APP_API_URL;
// MongoDB doc limit is 16MB. Each recipient subdoc is ~100 bytes
// (phone, status, messageId, sentAt, deliveredAt, errorMessage, _id),
// so 40,000 keeps each campaign doc safely under ~4 MB.
const CHUNK_SIZE      = 40000;
const CHUNK_GAP_MS    = 1500;  // pause between consecutive chunk POSTs
const POLL_INTERVAL_MS = 6000; // campaign progress poll

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── number helpers ──────────────────────────────────────────────────────── */
const formatPhoneNumber = (raw) => {
  const cleaned = String(raw).replace(/\D/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;
  if (cleaned.length >= 11 && cleaned.length <= 15) return `+${cleaned}`;
  return null;
};

// Parse raw text into clean, deduped list of E.164 numbers.
// Returns { valid: string[], invalid: number, dupes: number }
const parseRawText = (text) => {
  const tokens = text.split(/[\s,;\n\r\t]+/);
  const seen = new Set();
  const valid = [];
  let invalid = 0;
  let dupes = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok) continue;
    const f = formatPhoneNumber(tok);
    if (!f) { invalid++; continue; }
    if (seen.has(f)) { dupes++; continue; }
    seen.add(f);
    valid.push(f);
  }
  return { valid, invalid, dupes };
};

const fmtNum = (n) => n.toLocaleString("en-IN");

/* ── modal ──────────────────────────────────────────────────────────────── */
const SendMessageModal = ({ onClose, onSent }) => {
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage]           = useState("");
  const [inputMode, setInputMode]       = useState("paste"); // "paste" | "upload"
  const [pasteText, setPasteText]       = useState("");
  const [fileName, setFileName]         = useState("");
  const [parseStats, setParseStats]     = useState(null); // { count, invalid, dupes, first5, last5 }
  const [parsing, setParsing]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  // chunk state
  const [chunkProgress, setChunkProgress] = useState({ done: 0, total: 0 });
  const [campaigns, setCampaigns] = useState([]);
  // each campaign: { id, label, total, sent, failed, pending, status }

  // refs — large data stays out of React's diffing path
  const parsedNumbersRef = useRef([]);  // could hold 400k+ strings
  const cancelRef        = useRef(false);
  const pollTimerRef     = useRef(null);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* cleanup poll on unmount */
  useEffect(() => () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
  }, []);

  /* ── parsing ── */
  const applyParse = (text) => {
    setParsing(true);
    // defer parse so the UI can paint "parsing…" first
    setTimeout(() => {
      const { valid, invalid, dupes } = parseRawText(text);
      parsedNumbersRef.current = valid;
      setParseStats({
        count: valid.length,
        invalid,
        dupes,
        first5: valid.slice(0, 5),
        last5:  valid.length > 5 ? valid.slice(-5) : [],
      });
      setParsing(false);
    }, 0);
  };

  const handlePasteChange = (e) => {
    const val = e.target.value;
    setPasteText(val);
    // for very large pastes, debounce a bit; for typical pastes parse right away
    if (val.length > 100000) {
      // debounce-ish: parse only when user stops typing for 250ms
      clearTimeout(handlePasteChange._t);
      handlePasteChange._t = setTimeout(() => applyParse(val), 250);
    } else {
      applyParse(val);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|csv)$/i.test(file.name)) {
      setError("⚠️ Only .txt or .csv files are supported.");
      return;
    }
    setError("");
    setFileName(file.name);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      applyParse(String(ev.target.result || ""));
    };
    reader.onerror = () => {
      setParsing(false);
      setError("⚠️ Failed to read file.");
    };
    reader.readAsText(file);
  };

  const clearNumbers = () => {
    parsedNumbersRef.current = [];
    setParseStats(null);
    setPasteText("");
    setFileName("");
  };

  /* ── send ── */
  const handleSend = async () => {
    if (!campaignName.trim()) return setError("⚠️ Campaign name is required.");
    if (!message.trim())      return setError("⚠️ Message cannot be empty.");
    if (message.length > 4096) return setError("⚠️ Message exceeds 4096 characters.");
    const numbers = parsedNumbersRef.current;
    if (!numbers || numbers.length === 0) {
      return setError("⚠️ No valid phone numbers loaded. Paste or upload a .txt first.");
    }

    setError(""); setSuccess("");
    setLoading(true);
    cancelRef.current = false;

    const total = numbers.length;
    const chunkCount = Math.ceil(total / CHUNK_SIZE);
    setChunkProgress({ done: 0, total: chunkCount });
    setCampaigns([]);

    const sentBy = localStorage.getItem("pmEmail") || "admin";
    const created = [];

    for (let i = 0; i < chunkCount; i++) {
      if (cancelRef.current) break;

      const start = i * CHUNK_SIZE;
      const end   = Math.min(start + CHUNK_SIZE, total);
      const chunk = numbers.slice(start, end);
      const label = chunkCount > 1
        ? `${campaignName.trim()} (${i + 1}/${chunkCount})`
        : campaignName.trim();

      try {
        const res = await axios.post(
          `${API_BASE}/send-bulk-text`,
          {
            campaignName: label,
            message: message.trim(),
            phoneNumbers: chunk,
            totalRecipients: chunk.length,
            sentBy,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("pmToken") || ""}`,
            },
          }
        );
        const data = res.data || {};
        if (data.success) {
          const entry = {
            id: data.campaignId,
            label,
            total: chunk.length,
            sent: 0,
            failed: 0,
            pending: chunk.length,
            status: "in-progress",
          };
          created.push(entry);
          setCampaigns([...created]);
        } else {
          created.push({
            id: null, label, total: chunk.length,
            sent: 0, failed: chunk.length, pending: 0,
            status: "failed", error: data.message || "Unknown error",
          });
          setCampaigns([...created]);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Unknown error";
        created.push({
          id: null, label, total: chunk.length,
          sent: 0, failed: chunk.length, pending: 0,
          status: "failed", error: errorMsg,
        });
        setCampaigns([...created]);
      }

      setChunkProgress({ done: i + 1, total: chunkCount });

      if (i < chunkCount - 1) await sleep(CHUNK_GAP_MS);
    }

    setLoading(false);

    const queued = created.filter((c) => c.id).length;
    if (queued === 0) {
      setError(`❌ Failed to queue any campaigns.`);
      return;
    }
    if (queued < chunkCount) {
      setSuccess(`⚠️ Queued ${queued} of ${chunkCount} campaign chunks. See details below.`);
    } else {
      setSuccess(`✅ ${queued} campaign${queued > 1 ? "s" : ""} queued — sending ${fmtNum(total)} message${total > 1 ? "s" : ""} via WaSender.`);
    }

    onSent?.(total);
    startPolling(created.filter((c) => c.id).map((c) => c.id));
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  /* ── poll campaign progress ── */
  const startPolling = (ids) => {
    if (!ids || ids.length === 0) return;
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    const tick = async () => {
      try {
        const updates = await Promise.all(
          ids.map((id) =>
            axios
              .get(`${API_BASE}/pm-bulk-campaign/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("pmToken") || ""}` },
              })
              .then((r) => r.data?.data)
              .catch(() => null)
          )
        );
        setCampaigns((prev) =>
          prev.map((c) => {
            const u = updates.find((x) => x && String(x._id) === String(c.id));
            if (!u) return c;
            return {
              ...c,
              sent: u.sentCount,
              failed: u.failedCount,
              pending: u.pendingCount,
              status: u.status,
            };
          })
        );

        // stop polling once all are terminal
        const allDone = updates.every(
          (u) => u && ["sent", "partially-sent", "failed"].includes(u.status)
        );
        if (allDone && pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      } catch (_) { /* swallow */ }
    };

    tick(); // first immediate tick
    pollTimerRef.current = setInterval(tick, POLL_INTERVAL_MS);
  };

  /* ── render ── */
  const numbersLoaded = parseStats?.count > 0;
  const willChunk = (parseStats?.count || 0) > CHUNK_SIZE;
  const chunkCount = numbersLoaded ? Math.ceil(parseStats.count / CHUNK_SIZE) : 0;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.waIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z"/>
              </svg>
            </div>
            <div>
              <h2 style={styles.modalTitle}>Send Bulk WhatsApp Messages</h2>
              <p style={styles.modalSub}>Paste numbers or upload a .txt file — sends via WaSender</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>×</button>
        </div>

        {/* body */}
        <div style={styles.modalBody}>

          {/* Campaign Name */}
          <div style={styles.field}>
            <label style={styles.label}>Campaign Name <span style={{ color: "#e53e3e" }}>*</span></label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., March Promo 2026"
              style={styles.input}
              disabled={loading}
            />
            <p style={styles.hint}>Used for tracking. Large lists are split into multiple sub-campaigns.</p>
          </div>

          {/* Input mode tabs */}
          <div style={styles.field}>
            <label style={styles.label}>Phone Numbers <span style={{ color: "#e53e3e" }}>*</span></label>
            <div style={styles.tabRow}>
              <button
                type="button"
                onClick={() => setInputMode("paste")}
                style={{ ...styles.tab, ...(inputMode === "paste" ? styles.tabActive : {}) }}
                disabled={loading}
              >
                ✎ Paste
              </button>
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                style={{ ...styles.tab, ...(inputMode === "upload" ? styles.tabActive : {}) }}
                disabled={loading}
              >
                📄 Upload .txt
              </button>
            </div>

            {inputMode === "paste" ? (
              <textarea
                value={pasteText}
                onChange={handlePasteChange}
                placeholder={"Paste numbers separated by commas, spaces or new lines\ne.g. 9876543210, 9123456789\n+91 98765 43210"}
                rows={5}
                style={styles.textarea}
                disabled={loading}
              />
            ) : (
              <div style={styles.dropzone}>
                <input
                  type="file"
                  accept=".txt,.csv,text/plain"
                  onChange={handleFileUpload}
                  style={styles.fileInput}
                  id="rp-wa-file"
                  disabled={loading}
                />
                <label htmlFor="rp-wa-file" style={styles.fileLabel}>
                  <div style={{ fontSize: 32 }}>📄</div>
                  <div style={{ fontWeight: 600, color: "#1a202c", marginTop: 6 }}>
                    {fileName ? fileName : "Click to choose a .txt file"}
                  </div>
                  <div style={styles.hint}>One number per line, or comma-separated. Supports very large files.</div>
                </label>
              </div>
            )}

            {/* parse summary */}
            {parsing && <p style={styles.hint}>Parsing numbers…</p>}
            {!parsing && parseStats && (
              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryCount}>{fmtNum(parseStats.count)}</span>
                  <span style={styles.summaryLabel}> valid numbers loaded</span>
                  {parseStats.invalid > 0 && (
                    <span style={styles.summaryWarn}>{fmtNum(parseStats.invalid)} invalid skipped</span>
                  )}
                  {parseStats.dupes > 0 && (
                    <span style={styles.summaryMuted}>{fmtNum(parseStats.dupes)} duplicates removed</span>
                  )}
                  <button type="button" onClick={clearNumbers} style={styles.clearLink} disabled={loading}>clear</button>
                </div>

                {(parseStats.first5.length > 0 || parseStats.last5.length > 0) && (
                  <div style={styles.previewLine}>
                    <span style={{ color: "#718096" }}>preview: </span>
                    {parseStats.first5.join(", ")}
                    {parseStats.last5.length > 0 && (
                      <> &nbsp;…&nbsp; {parseStats.last5.join(", ")}</>
                    )}
                  </div>
                )}

                {willChunk && (
                  <div style={styles.chunkWarn}>
                    ⚠ This list will be split into <b>{chunkCount} sub-campaigns</b> of up to {fmtNum(CHUNK_SIZE)} recipients each
                    (MongoDB single-document limit). You'll see each one tracked separately below.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          <div style={styles.field}>
            <label style={styles.label}>Message <span style={{ color: "#e53e3e" }}>*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your WhatsApp message here..."
              rows={6}
              style={styles.textarea}
              disabled={loading}
            />
            <p style={styles.counter}>{message.length} / 4096 characters</p>
          </div>

          {/* Chunk submission progress (while POSTing chunks) */}
          {loading && chunkProgress.total > 0 && (
            <div style={styles.progressBox}>
              <div style={styles.progressTopRow}>
                <span style={{ fontWeight: 600, color: "#1a202c" }}>Queuing sub-campaigns…</span>
                <span style={{ color: "#4a5568" }}>
                  {chunkProgress.done} / {chunkProgress.total}
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(chunkProgress.done / chunkProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Per-campaign live status (with polling) */}
          {campaigns.length > 0 && (
            <div style={styles.resultsBox}>
              <div style={styles.resultsHeader}>
                <span>Campaigns</span>
                <span style={{ color: "#a0aec0", fontWeight: 500 }}>
                  {campaigns.length} chunk{campaigns.length > 1 ? "s" : ""}
                </span>
              </div>
              {campaigns.map((c, idx) => {
                const sent = c.sent || 0;
                const failed = c.failed || 0;
                const total = c.total || 0;
                const pct = total > 0 ? ((sent + failed) / total) * 100 : 0;
                return (
                  <div key={idx} style={styles.campaignRow}>
                    <div style={styles.campaignTopRow}>
                      <span style={{ fontWeight: 600, color: "#1a202c" }}>{c.label}</span>
                      <span style={statusPillStyle(c.status)}>{c.status}</span>
                    </div>
                    <div style={styles.campaignMeta}>
                      <span style={{ color: "#15803d" }}>✓ {fmtNum(sent)} sent</span>
                      <span style={{ color: "#c53030" }}>✗ {fmtNum(failed)} failed</span>
                      <span style={{ color: "#718096" }}>… {fmtNum(c.pending || 0)} pending</span>
                      <span style={{ color: "#4a5568", marginLeft: "auto" }}>{fmtNum(total)} total</span>
                    </div>
                    <div style={styles.miniProgressTrack}>
                      <div style={{ ...styles.miniProgressFill, width: `${pct}%` }} />
                    </div>
                    {c.error && (
                      <div style={{ ...styles.errorBox, marginTop: 6 }}>⚠ {c.error}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <span>⚠ {error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successBox}>
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={styles.modalFooter}>
          {loading ? (
            <button onClick={handleCancel} style={styles.cancelBtn}>
              Stop queuing
            </button>
          ) : (
            <button onClick={onClose} style={styles.cancelBtn}>
              Close
            </button>
          )}
          <button
            onClick={handleSend}
            style={styles.sendBtn}
            disabled={loading || !numbersLoaded || parsing}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={styles.spinner} /> Queuing {chunkProgress.done}/{chunkProgress.total}…
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z"/>
                </svg>
                {numbersLoaded
                  ? `Send to ${fmtNum(parseStats.count)} number${parseStats.count > 1 ? "s" : ""}`
                  : "Send Messages"}
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

/* ── main page ───────────────────────────────────────────────────────────── */
const SingleSendMessage = () => {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState("");

  const handleSent = (count = 1) => {
    setToast(
      count > 1
        ? `✓ ${count.toLocaleString("en-IN")} messages queued via WaSender!`
        : "✓ Message queued successfully!"
    );
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div style={styles.page}>

      {toast && <div style={styles.toast}>{toast}</div>}

      {/* page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            <span style={styles.waDot} />
            Send Bulk WhatsApp Messages
          </h1>
          <p style={styles.pageDesc}>Paste numbers or upload a .txt file — delivered via WaSender</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.createBtn}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z" fill="currentColor"/>
          </svg>
          Send Message
        </button>
      </div>

      {/* info card */}
      <div style={styles.infoCard}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 24 }}>💬</div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#1a202c" }}>
              Bulk Message Sender (WaSender)
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#718096", lineHeight: 1.5 }}>
              Upload a .txt with phone numbers (one per line) or paste them, write your message, and we'll queue the
              campaign on the server. Very large lists are automatically split into 40,000-recipient sub-campaigns so
              they fit within MongoDB's per-document limit. Sending continues even if you close this browser tab.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <SendMessageModal onClose={() => setShowModal(false)} onSent={handleSent} />
      )}
    </div>
  );
};

/* ── helpers ─────────────────────────────────────────────────────────────── */
function statusPillStyle(status) {
  const base = {
    fontSize: 11, fontWeight: 700, padding: "2px 9px",
    borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.3,
  };
  switch (status) {
    case "sent":
      return { ...base, background: "#dcfce7", color: "#166534" };
    case "partially-sent":
      return { ...base, background: "#fef3c7", color: "#92400e" };
    case "failed":
      return { ...base, background: "#fee2e2", color: "#991b1b" };
    case "in-progress":
    default:
      return { ...base, background: "#e0f2fe", color: "#075985" };
  }
}

/* ── styles ──────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9fc",
    padding: "28px 32px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
  },
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 28, flexWrap: "wrap", gap: 16,
  },
  pageTitle: {
    fontSize: 22, fontWeight: 700, color: "#1a202c",
    margin: 0, display: "flex", alignItems: "center", gap: 10,
  },
  waDot: {
    width: 10, height: 10, borderRadius: "50%",
    background: "#25d366", display: "inline-block",
  },
  pageDesc: { fontSize: 13.5, color: "#718096", margin: "4px 0 0" },
  createBtn: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "10px 20px", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", boxShadow: "0 4px 14px rgba(37,211,102,.35)",
    transition: "transform .15s, box-shadow .15s",
  },
  infoCard: {
    background: "#fff", borderRadius: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)",
    padding: "20px", marginBottom: 28,
    border: "1px solid rgba(37,211,102,.15)",
  },
  /* modal */
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,.45)", backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1050, padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640,
    boxShadow: "0 20px 60px rgba(0,0,0,.2)",
    display: "flex", flexDirection: "column",
    maxHeight: "92vh", overflow: "hidden",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 14px",
    borderBottom: "1px solid #f0f0f0",
  },
  waIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 },
  modalSub: { fontSize: 12, color: "#a0aec0", margin: "2px 0 0" },
  closeBtn: {
    background: "#f4f4f4", border: "none", borderRadius: 8,
    width: 32, height: 32, fontSize: 20, cursor: "pointer",
    color: "#666", display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
  },
  modalBody: { padding: "18px 22px", overflowY: "auto", flex: 1 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 7 },
  hint: { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0" },
  input: {
    width: "100%", padding: "9px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5,
    outline: "none", boxSizing: "border-box", color: "#1a202c",
    transition: "border-color .15s",
    fontFamily: "inherit",
  },
  counter: { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0", textAlign: "right" },
  textarea: {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5,
    outline: "none", resize: "vertical", boxSizing: "border-box",
    fontFamily: "inherit", color: "#1a202c", lineHeight: 1.4,
  },
  tabRow: {
    display: "flex", gap: 8, marginBottom: 10,
  },
  tab: {
    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#4a5568", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  tabActive: {
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", borderColor: "transparent",
    boxShadow: "0 2px 6px rgba(37,211,102,.3)",
  },
  dropzone: {
    border: "2px dashed #cbd5e0", borderRadius: 10,
    background: "#f9fafb", textAlign: "center", padding: "22px",
    transition: "border-color .15s",
  },
  fileInput: { display: "none" },
  fileLabel: { display: "block", cursor: "pointer" },
  summaryBox: {
    marginTop: 10, padding: "12px 14px", background: "#f0fdf4",
    border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13,
  },
  summaryRow: {
    display: "flex", flexWrap: "wrap", alignItems: "center",
    gap: 12, color: "#1a202c",
  },
  summaryCount: { fontSize: 18, fontWeight: 700, color: "#15803d" },
  summaryLabel: { color: "#2d3748" },
  summaryWarn:  { color: "#c2410c", fontWeight: 600 },
  summaryMuted: { color: "#718096", fontSize: 12 },
  clearLink: {
    background: "none", border: "none", color: "#3182ce",
    cursor: "pointer", fontSize: 12, textDecoration: "underline",
    marginLeft: "auto", fontFamily: "inherit",
  },
  previewLine: {
    marginTop: 8, fontSize: 12, color: "#4a5568",
    wordBreak: "break-all", fontFamily: "monospace",
  },
  chunkWarn: {
    marginTop: 10, padding: "8px 12px", borderRadius: 6,
    background: "#fffbeb", border: "1px solid #fde68a",
    color: "#92400e", fontSize: 12, lineHeight: 1.5,
  },
  progressBox: {
    background: "#f7fafc", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "12px 14px", marginTop: 4, marginBottom: 10,
  },
  progressTopRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13, marginBottom: 8,
  },
  progressTrack: {
    width: "100%", height: 8, background: "#e2e8f0",
    borderRadius: 999, overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: "linear-gradient(135deg,#25d366,#128c7e)",
    transition: "width .25s ease",
  },
  resultsBox: {
    border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "10px 12px", marginTop: 4, marginBottom: 10,
    background: "#fff",
  },
  resultsHeader: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13, fontWeight: 700, color: "#1a202c",
    paddingBottom: 8, borderBottom: "1px solid #edf2f7", marginBottom: 8,
  },
  campaignRow: {
    padding: "8px 4px", borderBottom: "1px dashed #edf2f7",
  },
  campaignTopRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 4, fontSize: 13,
  },
  campaignMeta: {
    display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, marginBottom: 6,
  },
  miniProgressTrack: {
    width: "100%", height: 5, background: "#edf2f7",
    borderRadius: 999, overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%", background: "#25d366",
    transition: "width .35s ease",
  },
  errorBox: {
    background: "#fff5f5", border: "1px solid #fed7d7",
    borderRadius: 8, padding: "10px 14px", color: "#c53030",
    fontSize: 13, marginTop: 4,
  },
  successBox: {
    background: "#f0fdf4", border: "1px solid #dcfce7",
    borderRadius: 8, padding: "10px 14px", color: "#15803d",
    fontSize: 13, marginTop: 4,
  },
  modalFooter: {
    display: "flex", gap: 10, justifyContent: "flex-end",
    padding: "14px 22px", borderTop: "1px solid #f0f0f0",
  },
  cancelBtn: {
    padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#4a5568", fontSize: 13.5,
    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  sendBtn: {
    padding: "9px 22px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center",
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37,211,102,.3)",
  },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff", borderRadius: "50%",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },
  toast: {
    position: "fixed", top: 20, right: 24,
    background: "#1a7a3c", color: "#fff",
    padding: "12px 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 500,
    boxShadow: "0 6px 20px rgba(0,0,0,.15)", zIndex: 2000,
    animation: "fadeIn .3s ease",
  },
};

/* keyframes injected once */
if (typeof document !== "undefined" && !document.getElementById("rp-wa-anim")) {
  const s = document.createElement("style");
  s.id = "rp-wa-anim";
  s.textContent = `
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeIn  { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
}

export default SingleSendMessage;
