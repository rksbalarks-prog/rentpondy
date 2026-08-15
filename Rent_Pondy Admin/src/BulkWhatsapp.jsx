import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PASTE_MAX_NUMBERS = 5000; // hard cap when typing/pasting in the browser

const API = "https://rentpondy.com/PPC/PPC/api/bulk-whatsapp";

const SCHEDULE_OPTIONS = [
  { label: "1 min", value: 1 },
  { label: "2 min", value: 2 },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
];

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px",
    background: "#f4f6f9",
    minHeight: "100vh",
    color: "#1a1a2e",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: { fontSize: "22px", fontWeight: 700, color: "#1a1a2e", margin: 0 },
  createBtn: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px 32px",
    width: "560px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    position: "relative",
  },
  modalTitle: { fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#1a1a2e" },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
  },
  tab: {
    padding: "10px 18px",
    background: "none",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#666",
    marginBottom: "-2px",
  },
  tabActive: { color: "#128C7E", borderBottom: "3px solid #25D366" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "90px",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },
  fieldGroup: { marginBottom: "18px" },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "8px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    minHeight: "44px",
    maxHeight: "200px",
    overflowY: "auto",
    background: "#fafafa",
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#e8f8f1",
    border: "1px solid #25D366",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: "13px",
    color: "#128C7E",
    fontWeight: 600,
  },
  tagRemove: { cursor: "pointer", fontSize: "14px", lineHeight: 1, fontWeight: 700 },
  numberInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    minWidth: "160px",
    flex: 1,
  },
  hint: { fontSize: "11px", color: "#888", marginTop: "4px" },
  fileBox: {
    border: "2px dashed #25D366",
    borderRadius: "10px",
    padding: "26px 16px",
    textAlign: "center",
    background: "#f8fffb",
    cursor: "pointer",
  },
  fileBoxActive: { background: "#e8f8f1", borderColor: "#128C7E" },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px",
    boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
  },
  tableWrap: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    marginTop: "10px",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    background: "#1a1a2e",
    color: "#fff",
    padding: "13px 16px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
    color: "#333",
  },
  emptyRow: { textAlign: "center", padding: "40px", color: "#aaa", fontSize: "15px" },
  toast: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    background: "#1a1a2e",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    zIndex: 2000,
    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
  },
  progressOuter: {
    background: "#eee",
    borderRadius: "6px",
    height: "8px",
    overflow: "hidden",
    minWidth: "100px",
  },
  progressInner: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    height: "100%",
    transition: "width 0.3s",
  },
  badgeRunning: {
    background: "#fff8e6",
    color: "#e67e22",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: 700,
    border: "1px solid #f39c12",
  },
  badgeDone: {
    background: "#e8f8f1",
    color: "#128C7E",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: 700,
    border: "1px solid #25D366",
  },
  badgeFailed: {
    background: "#fff0f0",
    color: "#e74c3c",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: 700,
    border: "1px solid #e74c3c",
  },
  btnGhost: {
    background: "none",
    border: "1.5px solid #ddd",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    color: "#333",
  },
  btnDanger: {
    background: "none",
    border: "1.5px solid #e74c3c",
    color: "#e74c3c",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
};

function Toast({ msg }) {
  if (!msg) return null;
  return <div style={styles.toast}>{msg}</div>;
}

function BatchStatusBadge({ batch }) {
  if (batch.running) return <span style={styles.badgeRunning}>⏳ Sending</span>;
  if (batch.pending > 0) return <span style={styles.badgeRunning}>⏸ Paused</span>;
  if (batch.failed > 0 && batch.sent === 0) return <span style={styles.badgeFailed}>✗ Failed</span>;
  return <span style={styles.badgeDone}>✓ Done</span>;
}

export default function BulkWhatsapp() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("file"); // 'file' or 'paste'
  const [batches, setBatches] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Failures modal
  const [failuresBatch, setFailuresBatch] = useState(null);
  const [failures, setFailures] = useState([]);
  const [failuresLoading, setFailuresLoading] = useState(false);

  // Details modal (per-record view for one batch)
  const [detailsBatch, setDetailsBatch] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsPage, setDetailsPage] = useState(1);
  const [detailsTotal, setDetailsTotal] = useState(0);
  const DETAILS_PAGE_SIZE = 100;

  // Paste-mode state
  const [numberInput, setNumberInput] = useState("");
  const [numbers, setNumbers] = useState([]);
  const inputRef = useRef(null);

  // File-mode state
  const [file, setFile] = useState(null);

  // Shared form
  const [message, setMessage] = useState("");
  const [scheduleMinutes, setScheduleMinutes] = useState(1);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    fetchBatches();
    const id = setInterval(fetchBatches, 4000);
    return () => clearInterval(id);
  }, []);

  async function fetchBatches() {
    try {
      const res = await axios.get(`${API}/batches`);
      setBatches(res.data.batches || []);
    } catch (err) {
      console.error(err);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  // ── Paste-mode helpers ────────────────────────────────────────────────────
  function addNumber(raw) {
    const val = raw.trim().replace(/\s+/g, "");
    if (!val) return;
    if (!/^\d{7,15}$/.test(val)) return showToast("Invalid number format: " + val);
    if (numbers.includes(val)) return showToast("Duplicate: " + val);
    if (numbers.length >= PASTE_MAX_NUMBERS)
      return showToast(`Paste mode limit is ${PASTE_MAX_NUMBERS}. Use File Upload for larger lists.`);
    setNumbers((prev) => [...prev, val]);
  }

  function handleNumberKeyDown(e) {
    if (["Enter", ",", " ", "Tab"].includes(e.key)) {
      e.preventDefault();
      if (numberInput.trim()) {
        addNumber(numberInput);
        setNumberInput("");
      }
    } else if (e.key === "Backspace" && !numberInput) {
      setNumbers((prev) => prev.slice(0, -1));
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const tokens = text.split(/[\s,;:\n\r\t|]+/).map((s) => s.trim()).filter(Boolean);
    let added = 0;
    let invalid = 0;
    let dup = 0;
    const next = [...numbers];
    const seen = new Set(numbers);
    for (const t of tokens) {
      if (next.length >= PASTE_MAX_NUMBERS) break;
      const v = t.replace(/\s+/g, "");
      if (!/^\d{7,15}$/.test(v)) { invalid++; continue; }
      if (seen.has(v)) { dup++; continue; }
      seen.add(v);
      next.push(v);
      added++;
    }
    setNumbers(next);
    showToast(`Added ${added}${invalid ? `, ${invalid} invalid` : ""}${dup ? `, ${dup} duplicates` : ""}`);
  }

  function removeNumber(idx) {
    setNumbers((prev) => prev.filter((_, i) => i !== idx));
  }

  function resetForm() {
    setNumbers([]);
    setNumberInput("");
    setFile(null);
    setMessage("");
    setScheduleMinutes(1);
    setScheduleDate("");
    setMode("file");
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!message.trim()) return showToast("Please enter a message.");

    // Schedule UI is hidden — send immediately (0 = no delay).
    // scheduleDateTime is never sent (stale state from older builds could
    // contain a past date which the backend would reject).
    const SAFE_SCHEDULE_MINUTES = 0;

    setLoading(true);
    try {
      if (mode === "file") {
        if (!file) {
          showToast("Please choose a file.");
          setLoading(false);
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("message", message.trim());
        fd.append("scheduleMinutes", String(SAFE_SCHEDULE_MINUTES));
        const res = await axios.post(`${API}/upload-and-send`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        showToast(
          `✓ Accepted: ${res.data.uniqueValid} unique number(s) queued (${res.data.invalid} invalid).`
        );
      } else {
        if (numbers.length === 0) {
          showToast("Add at least one number.");
          setLoading(false);
          return;
        }
        const payload = {
          phoneNumbers: numbers,
          message: message.trim(),
          scheduleMinutes: SAFE_SCHEDULE_MINUTES,
        };
        const res = await axios.post(`${API}/create-message`, payload);
        showToast(`✓ Queued ${res.data.totalScheduled} message(s) for sending.`);
      }
      resetForm();
      setShowModal(false);
      fetchBatches();
    } catch (err) {
      showToast("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(batchId) {
    if (!window.confirm("Cancel this batch? Pending messages will be removed.")) return;
    try {
      await axios.post(`${API}/batch/${batchId}/cancel`);
      showToast("Batch cancelled.");
      fetchBatches();
    } catch (err) {
      showToast("Cancel failed.");
    }
  }

  async function handleDeleteBatch(batchId) {
    if (!window.confirm("Delete this entire batch (all records)?")) return;
    try {
      await axios.delete(`${API}/batch/${batchId}`);
      setBatches((prev) => prev.filter((b) => b.batchId !== batchId));
      showToast("Batch deleted.");
    } catch (err) {
      showToast("Delete failed.");
    }
  }

  async function openFailures(batch) {
    setFailuresBatch(batch);
    setFailuresLoading(true);
    setFailures([]);
    try {
      const res = await axios.get(`${API}/list`, {
        params: { batchId: batch.batchId, status: "Failed", limit: 200, page: 1 },
      });
      setFailures(res.data.records || []);
    } catch (err) {
      showToast("Failed to load errors: " + (err.response?.data?.error || err.message));
    } finally {
      setFailuresLoading(false);
    }
  }

  async function openDetails(batch, page = 1) {
    setDetailsBatch(batch);
    setDetailsPage(page);
    setDetailsLoading(true);
    setDetails([]);
    try {
      const res = await axios.get(`${API}/list`, {
        params: { batchId: batch.batchId, limit: DETAILS_PAGE_SIZE, page },
      });
      setDetails(res.data.records || []);
      setDetailsTotal(res.data.total || 0);
    } catch (err) {
      showToast("Failed to load details: " + (err.response?.data?.error || err.message));
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📲 Bulk WhatsApp Messages</h1>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          <span>＋</span> Create New Message
        </button>
      </div>

      {/* Batches table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["SI.No", "Message", "Total", "Sent", "Failed", "Pending", "Progress", "Status", "Started", "Action", "Report"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan={11} style={styles.emptyRow}>
                  No batches yet. Click "Create New Message" to get started.
                </td>
              </tr>
            ) : (
              batches.map((b, idx) => {
                const done = b.sent + b.failed;
                const pct = b.total ? Math.round((done / b.total) * 100) : 0;
                return (
                  <tr key={b.batchId} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={{ ...styles.td, maxWidth: "220px", wordBreak: "break-word" }}>{b.message}</td>
                    <td style={styles.td}>{b.total.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: "#128C7E", fontWeight: 600 }}>{b.sent.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: "#e74c3c", fontWeight: 600 }}>{b.failed.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: "#e67e22", fontWeight: 600 }}>{b.pending.toLocaleString()}</td>
                    <td style={styles.td}>
                      <div style={styles.progressOuter}>
                        <div style={{ ...styles.progressInner, width: `${pct}%` }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{pct}%</div>
                    </td>
                    <td style={styles.td}><BatchStatusBadge batch={b} /></td>
                    <td style={styles.td}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}</td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button style={{ ...styles.btnGhost, borderColor: "#128C7E", color: "#128C7E" }} onClick={() => openDetails(b, 1)}>
                          Details
                        </button>
                        {b.failed > 0 && (
                          <button style={{ ...styles.btnGhost, borderColor: "#e74c3c", color: "#e74c3c" }} onClick={() => openFailures(b)}>
                            View Errors ({b.failed})
                          </button>
                        )}
                        {b.pending > 0 && (
                          <button style={styles.btnGhost} onClick={() => handleCancel(b.batchId)}>Cancel</button>
                        )}
                        <button style={styles.btnDanger} onClick={() => handleDeleteBatch(b.batchId)}>Delete</button>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <a
                        href={`${API}/batch/${b.batchId}/export`}
                        style={{
                          ...styles.btnGhost,
                          borderColor: "#128C7E",
                          color: "#128C7E",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                        download
                      >
                        ⬇ Excel
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            <div style={styles.modalTitle}>📤 Create Bulk Message</div>

            {/* Mode tabs */}
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tab, ...(mode === "file" ? styles.tabActive : {}) }}
                onClick={() => setMode("file")}
              >
                📄 Upload File (large lists)
              </button>
              <button
                style={{ ...styles.tab, ...(mode === "paste" ? styles.tabActive : {}) }}
                onClick={() => setMode("paste")}
              >
                ✏️ Paste / Type
              </button>
            </div>

            {mode === "file" ? (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Phone Numbers File <span style={{ color: "#888", fontWeight: 400 }}>(.xlsx, .xls, .csv, .txt — up to 50 MB)</span>
                </label>
                <label style={{ ...styles.fileBox, ...(file ? styles.fileBoxActive : {}) }}>
                  <input
                    type="file"
                    accept=".txt,.csv,.xlsx,.xls,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ display: "none" }}
                  />
                  {file ? (
                    <>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#128C7E" }}>📎 {file.name}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#128C7E" }}>📤 Click to choose file</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                        File is sent to the server and processed there. Tested up to 460,000+ numbers.
                      </div>
                    </>
                  )}
                </label>
                <p style={styles.hint}>
                  Server reads column A from Excel (or every cell if column A is empty); .txt/.csv are split on any
                  whitespace/comma. 10-digit Indian numbers get a "91" prefix automatically.
                </p>
              </div>
            ) : (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Phone Numbers{" "}
                  <span style={{ color: "#888", fontWeight: 400 }}>(paste or type — up to {PASTE_MAX_NUMBERS.toLocaleString()})</span>
                </label>
                <div style={styles.tagContainer} onClick={() => inputRef.current?.focus()}>
                  {numbers.slice(0, 200).map((n, i) => (
                    <span key={i} style={styles.tag}>
                      {n}
                      <span style={styles.tagRemove} onClick={() => removeNumber(i)}>×</span>
                    </span>
                  ))}
                  {numbers.length > 200 && (
                    <span style={{ ...styles.tag, background: "#eef", color: "#456" }}>
                      +{(numbers.length - 200).toLocaleString()} more (hidden)
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    style={styles.numberInput}
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    onKeyDown={handleNumberKeyDown}
                    onPaste={handlePaste}
                    placeholder={numbers.length === 0 ? "Enter number e.g. 919876543210" : ""}
                  />
                </div>
                <p style={{ ...styles.hint, color: "#666" }}>
                  {numbers.length.toLocaleString()}/{PASTE_MAX_NUMBERS.toLocaleString()} numbers
                </p>
              </div>
            )}

            {/* Message */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                style={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your WhatsApp message here..."
              />
              <p style={styles.hint}>{message.length} characters</p>
            </div>

            {/* Schedule date & per-message interval hidden per request.
                Defaults still apply: scheduleMinutes=1 (1 min start delay), no scheduleDate.
                Set SHOW_SCHEDULE_CONTROLS = true to re-enable. */}
            {false && (
              <>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Schedule Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    style={styles.input}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p style={styles.hint}>
                    {scheduleDate
                      ? `Batch starts on ${new Date(scheduleDate).toLocaleString()}`
                      : "Leave empty to use Schedule Delay below"}
                  </p>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Per-message interval / start delay</label>
                  <select
                    style={styles.select}
                    value={scheduleMinutes}
                    onChange={(e) => setScheduleMinutes(e.target.value)}
                  >
                    {SCHEDULE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p style={styles.hint}>
                    With a Schedule Date, this is the interval between each number. Without one, this is just the delay
                    before the worker starts sending — actual sending runs as fast as the API allows.
                  </p>
                </div>
              </>
            )}

            <button
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (mode === "file" ? "Uploading…" : "Queuing…") : "Send Messages"}
            </button>
          </div>
        </div>
      )}

      {/* Details modal — every number in the batch with its individual status */}
      {detailsBatch && (
        <div style={styles.overlay} onClick={() => setDetailsBatch(null)}>
          <div
            style={{ ...styles.modal, width: "820px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.closeBtn} onClick={() => setDetailsBatch(null)}>×</button>
            <div style={styles.modalTitle}>
              📋 Batch details — {detailsTotal.toLocaleString()} number(s)
            </div>
            <p style={{ fontSize: 12, color: "#666", marginTop: -10, marginBottom: 12 }}>
              Showing each phone number in this batch with its individual status.
              Page {detailsPage} of {Math.max(1, Math.ceil(detailsTotal / DETAILS_PAGE_SIZE))}.
            </p>
            {detailsLoading ? (
              <div style={{ padding: 30, textAlign: "center", color: "#888" }}>Loading…</div>
            ) : details.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: "#888" }}>
                No records found.
              </div>
            ) : (
              <>
                <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>SI.No</th>
                        <th style={styles.th}>Phone Number</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((r, i) => {
                        const sn = (detailsPage - 1) * DETAILS_PAGE_SIZE + i + 1;
                        const statusEl =
                          r.status === "Sent" ? (
                            <span style={styles.badgeDone}>✓ Sent</span>
                          ) : r.status === "Failed" ? (
                            <span style={styles.badgeFailed}>✗ Failed</span>
                          ) : r.status === "Sending" ? (
                            <span style={styles.badgeRunning}>⏳ Sending</span>
                          ) : (
                            <span style={styles.badgeRunning}>⏸ Pending</span>
                          );
                        const when = r.sentAt
                          ? new Date(r.sentAt).toLocaleString()
                          : r.updatedAt
                          ? new Date(r.updatedAt).toLocaleString()
                          : "—";
                        return (
                          <tr key={r._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={styles.td}>{sn}</td>
                            <td style={{ ...styles.td, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {r.phoneNumber}
                            </td>
                            <td style={styles.td}>{statusEl}</td>
                            <td style={{ ...styles.td, fontSize: 12, whiteSpace: "nowrap" }}>
                              {when}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {detailsTotal > DETAILS_PAGE_SIZE && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                      gap: 8,
                    }}
                  >
                    <button
                      style={{ ...styles.btnGhost, opacity: detailsPage <= 1 ? 0.4 : 1 }}
                      disabled={detailsPage <= 1}
                      onClick={() => openDetails(detailsBatch, detailsPage - 1)}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Page {detailsPage} / {Math.max(1, Math.ceil(detailsTotal / DETAILS_PAGE_SIZE))}
                    </span>
                    <button
                      style={{
                        ...styles.btnGhost,
                        opacity:
                          detailsPage >= Math.ceil(detailsTotal / DETAILS_PAGE_SIZE) ? 0.4 : 1,
                      }}
                      disabled={detailsPage >= Math.ceil(detailsTotal / DETAILS_PAGE_SIZE)}
                      onClick={() => openDetails(detailsBatch, detailsPage + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Failures modal */}
      {failuresBatch && (
        <div style={styles.overlay} onClick={() => setFailuresBatch(null)}>
          <div
            style={{ ...styles.modal, width: "720px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.closeBtn} onClick={() => setFailuresBatch(null)}>×</button>
            <div style={styles.modalTitle}>
              ❌ Failed messages — {failuresBatch.failed.toLocaleString()} total
            </div>
            <p style={{ fontSize: 12, color: "#666", marginTop: -10, marginBottom: 12 }}>
              Showing up to 200 most recent failures. Look at the error message to see why
              Wasender rejected them (bad number format, no active session, API key issue, etc.).
            </p>
            {failuresLoading ? (
              <div style={{ padding: 30, textAlign: "center", color: "#888" }}>Loading…</div>
            ) : failures.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: "#888" }}>
                No failure records found.
              </div>
            ) : (
              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Error</th>
                      <th style={styles.th}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map((f, i) => (
                      <tr key={f._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ ...styles.td, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {f.phoneNumber}
                        </td>
                        <td style={{ ...styles.td, color: "#e74c3c", fontSize: 12, wordBreak: "break-word" }}>
                          {f.errorMessage || "—"}
                        </td>
                        <td style={{ ...styles.td, fontSize: 12, whiteSpace: "nowrap" }}>
                          {f.updatedAt ? new Date(f.updatedAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast msg={toast} />
    </div>
  );
}
