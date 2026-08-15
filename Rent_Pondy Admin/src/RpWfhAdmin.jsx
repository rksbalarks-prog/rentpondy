import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./RpWfhCallManagement.css";

// Admin console for the Call Management System.
// URL: /process/dashboard/rp.wfh-admin
// Uses the same /PPC/rcm/* API as the staff page but requires role=ADMIN.
// The login form lives on this page and rejects non-ADMIN accounts.

const API_URL  = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
const LS_TOKEN = "rcm_rpwfh_admin_token"; // separate from staff token

const STATUS_OPTIONS = ["Ring", "Not Exist", "Not Interested", "Interested"];

function hasDetails(call) {
  const d = call?.interestedDetails;
  if (!d) return false;
  return !!(d.rent || d.advance || d.bhk || d.floorNo || d.carPark || d.availableFrom);
}

// ───────── API client ─────────
async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  let resp;
  try {
    resp = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Network error — check your connection and try again.");
  }
  const text = await resp.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!resp.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${resp.status})`;
    const err = new Error(msg);
    err.status = resp.status;
    throw err;
  }
  return data;
}

// ───────── date helpers ─────────
function toISODateInput(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${dd}/${mm}/${yy}, ${String(h).padStart(2, "0")}:${m}:${s} ${ampm}`;
}

// ───────── Toast ─────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "", show: false });
  const timerRef = useRef(null);
  const push = useCallback((msg, type = "") => {
    setToast({ msg, type, show: true });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }, []);
  const node = (
    <div className={`rcm-toast ${toast.show ? "show" : ""} ${toast.type}`}>{toast.msg}</div>
  );
  return { push, node };
}

// ════════════════════════════════════════════════════════════════════
//  Admin Login
// ════════════════════════════════════════════════════════════════════
function AdminLogin({ onLogin, toast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) { setError("Enter username and password"); return; }
    setSubmitting(true);
    try {
      const data = await apiRequest("/rcm/login", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      if (data?.role !== "ADMIN") {
        // We never store this token because the account isn't allowed here.
        setError("This account is not an admin. Use a staff account on /rp.wfh.");
        return;
      }
      localStorage.setItem(LS_TOKEN, data.token);
      toast(`Welcome, ${data.username}`, "success");
      onLogin({ token: data.token, username: data.username, role: data.role });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rcm-login-wrap">
      <div className="rcm-login-card">
        <div className="rcm-logo">🛠 Rent Pondy</div>
        <div className="rcm-subtitle">Call Management — Admin Console</div>

        {error && <div className="rcm-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="rcm-field">
            <label htmlFor="rcm-admin-username">Username</label>
            <input
              id="rcm-admin-username"
              type="text"
              autoComplete="username"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <div className="rcm-field">
            <label htmlFor="rcm-admin-password">Password</label>
            <input
              id="rcm-admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <button type="submit" className="rcm-btn rcm-btn-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="rcm-hint">Default seed: <b>admin</b> / <b>admin</b></p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Admin Dashboard
// ════════════════════════════════════════════════════════════════════
function AdminDashboard({ session, onLogout, toast }) {
  const today    = useMemo(() => new Date(), []);
  const todayStr = toISODateInput(today);
  const yest     = useMemo(() => { const d = new Date(today); d.setDate(today.getDate() - 1); return d; }, [today]);
  const yestStr  = toISODateInput(yest);

  const [activeRange, setActiveRange] = useState("today");
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate]     = useState(todayStr);
  const [applied, setApplied]   = useState({ from: todayStr, to: todayStr });

  const [stats, setStats] = useState(null);
  const [calls, setCalls] = useState([]);
  const [queue, setQueue] = useState([]);
  const [staff, setStaff] = useState([]);

  const [queueDraft, setQueueDraft] = useState("");
  const [newStaff, setNewStaff] = useState({ username: "", password: "", role: "STAFF" });
  // Excel upload preview: { fileName, numbers: [10-digit strings] }
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Which section the sidebar is showing.
  const [activeView, setActiveView] = useState("stats"); // 'stats' | 'queue' | 'staff' | 'calls' | 'interested'

  // Agent filter for the Overall Stats view ("" = all staff).
  const [selectedAgent, setSelectedAgent] = useState("");
  // Calls belonging to the selected agent — shown inline under their stats.
  const [agentCalls, setAgentCalls] = useState([]);

  // Read-only details viewer (set to a call object to open the modal).
  const [detailsViewer, setDetailsViewer] = useState(null);

  // Per-row "show password" toggles, keyed by staff _id.
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const togglePasswordReveal = (id) =>
    setRevealedPasswords((cur) => ({ ...cur, [id]: !cur[id] }));

  // Column filters for the All Calls table.
  const ALL_CALLS_BLANK = { agent: "", number: "", mode: "", status: "" };
  const [allCallsFilters, setAllCallsFilters] = useState(ALL_CALLS_BLANK);

  // Column filters for the Interest List table.
  const INTEREST_BLANK = {
    agent: "", number: "", bhk: "", rent: "", advance: "",
    floorNo: "", carPark: "", availableFrom: "",
  };
  const [interestFilters, setInterestFilters] = useState(INTEREST_BLANK);

  // Combined set of all agents the dropdowns can offer (active staff + any
  // historical agent that appears in the loaded calls).
  const agentOptions = useMemo(() => {
    const set = new Set();
    staff.forEach((s) => set.add(s.username));
    calls.forEach((c) => set.add(c.agentUsername));
    return Array.from(set).sort();
  }, [staff, calls]);

  const tokenRef = useRef(session.token);
  useEffect(() => { tokenRef.current = session.token; }, [session.token]);

  // ───────── loaders ─────────
  const handle401 = (err) => { if (err.status === 401) { onLogout(); return true; } return false; };

  const loadStats = useCallback(async () => {
    try {
      const q = `from=${applied.from}&to=${applied.to}${selectedAgent ? `&agent=${encodeURIComponent(selectedAgent)}` : ""}`;
      const data = await apiRequest(`/rcm/stats?${q}`, { token: tokenRef.current });
      setStats(data);
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, selectedAgent]);

  // Load just the selected agent's calls for the inline list.
  const loadAgentCalls = useCallback(async () => {
    if (!selectedAgent) { setAgentCalls([]); return; }
    try {
      const q = `from=${applied.from}&to=${applied.to}&agent=${encodeURIComponent(selectedAgent)}`;
      const data = await apiRequest(`/rcm/calls?${q}`, { token: tokenRef.current });
      setAgentCalls(data?.calls || []);
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, selectedAgent]);

  const loadCalls = useCallback(async () => {
    try {
      const data = await apiRequest(`/rcm/calls?from=${applied.from}&to=${applied.to}`, { token: tokenRef.current });
      setCalls(data?.calls || []);
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied]);

  const loadQueue = useCallback(async () => {
    try {
      const data = await apiRequest(`/rcm/auto-queue`, { token: tokenRef.current });
      setQueue(data?.numbers || []);
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStaff = useCallback(async () => {
    try {
      const data = await apiRequest(`/rcm/staff`, { token: tokenRef.current });
      setStaff(data?.staff || []);
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadStats(); loadCalls(); }, [loadStats, loadCalls]);
  useEffect(() => { loadAgentCalls(); }, [loadAgentCalls]);
  useEffect(() => { loadQueue(); loadStaff(); }, [loadQueue, loadStaff]);

  // 30s background refresh — keeps stats, calls, queue and staff lists fresh
  // for admins while 5–6 users are working. Pauses while the tab is hidden so
  // we don't burn requests in the background.
  useEffect(() => {
    const POLL_MS = 30000;
    const tick = () => {
      if (document.hidden) return;
      loadStats();
      loadCalls();
      if (selectedAgent) loadAgentCalls();
      loadQueue();
      loadStaff();
    };
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [loadStats, loadCalls, loadAgentCalls, loadQueue, loadStaff, selectedAgent]);

  // ───────── handlers ─────────
  const handleRange = (range) => {
    setActiveRange(range);
    if (range === "today") {
      setFromDate(todayStr); setToDate(todayStr);
      setApplied({ from: todayStr, to: todayStr });
    } else if (range === "yesterday") {
      setFromDate(yestStr); setToDate(yestStr);
      setApplied({ from: yestStr, to: yestStr });
    }
  };

  const handleApply = () => {
    if (!fromDate || !toDate) { toast("Pick both From and To dates", "error"); return; }
    if (fromDate > toDate)     { toast("From date cannot be after To date", "error"); return; }
    setActiveRange("custom");
    setApplied({ from: fromDate, to: toDate });
  };

  const handleAddNumbers = async () => {
    const list = [...new Set(
      queueDraft.split(/[\s,;\n]+/).map((s) => s.replace(/\D/g, "")).filter((s) => /^\d{10}$/.test(s))
    )];
    if (!list.length) { toast("Paste one or more 10-digit numbers", "error"); return; }
    try {
      const data = await apiRequest(`/rcm/auto-queue`, {
        method: "POST",
        token: tokenRef.current,
        body: { numbers: list },
      });
      toast(`Added ${data.added} number${data.added === 1 ? "" : "s"}`, "success");
      setQueueDraft("");
      loadQueue();
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  // Parse an uploaded Excel/CSV file in the browser. We walk every cell of every
  // sheet, normalize digits, strip common Indian country-code prefixes, and keep
  // anything that ends up as a 10-digit number.
  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const found = new Set();
      for (const sheetName of wb.SheetNames) {
        const sheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
        for (const row of rows) {
          for (const cell of row) {
            const digits = String(cell).replace(/\D/g, "");
            let n = digits;
            if (n.length === 11 && n.startsWith("0")) n = n.slice(1);
            if (n.length === 12 && n.startsWith("91")) n = n.slice(2);
            if (/^[6-9]\d{9}$/.test(n)) found.add(n);
          }
        }
      }
      const numbers = Array.from(found);
      setFilePreview({ fileName: file.name, numbers });
      if (numbers.length === 0) {
        toast("No 10-digit numbers found in that file", "error");
      } else {
        toast(`Detected ${numbers.length} number${numbers.length === 1 ? "" : "s"} in ${file.name}`, "success");
      }
    } catch (err) {
      toast("Failed to read file: " + err.message, "error");
    }
  };

  const handleUploadFromFile = async () => {
    if (!filePreview?.numbers?.length) return;
    try {
      const data = await apiRequest(`/rcm/auto-queue`, {
        method: "POST",
        token: tokenRef.current,
        body: { numbers: filePreview.numbers },
      });
      toast(`Added ${data.added} from ${filePreview.fileName}`, "success");
      clearFilePreview();
      loadQueue();
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  const clearFilePreview = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveNumber = async (id) => {
    if (!window.confirm("Remove this number from the queue?")) return;
    try {
      await apiRequest(`/rcm/auto-queue/${id}`, { method: "DELETE", token: tokenRef.current });
      toast("Number removed", "success");
      setQueue((q) => q.filter((n) => n._id !== id));
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.username.trim() || !newStaff.password) {
      toast("Username and password required", "error");
      return;
    }
    try {
      const data = await apiRequest(`/rcm/staff`, {
        method: "POST",
        token: tokenRef.current,
        body: newStaff,
      });
      toast(`Created ${data.staff.username}`, "success");
      setNewStaff({ username: "", password: "", role: "STAFF" });
      loadStaff();
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  const handleToggleActive = async (s) => {
    try {
      await apiRequest(`/rcm/staff/${s._id}`, {
        method: "PATCH",
        token: tokenRef.current,
        body: { active: !s.active },
      });
      toast(`${s.username} ${s.active ? "deactivated" : "activated"}`, "success");
      loadStaff();
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  const handleResetPassword = async (s) => {
    const next = window.prompt(`Enter a new password for ${s.username} (min 4 chars):`);
    if (!next) return;
    if (next.length < 4) { toast("Password must be at least 4 chars", "error"); return; }
    try {
      await apiRequest(`/rcm/staff/${s._id}`, {
        method: "PATCH",
        token: tokenRef.current,
        body: { password: next },
      });
      toast(`Password reset for ${s.username}`, "success");
      loadStaff();
    } catch (err) { if (!handle401(err)) toast(err.message, "error"); }
  };

  const handleLogout = async () => {
    try { await apiRequest("/rcm/logout", { method: "POST", token: tokenRef.current }); }
    catch { /* ignore */ }
    onLogout();
  };

  return (
    <>
      <header className="rcm-header">
        <div className="rcm-brand">🛠 Admin <span className="rcm-light">· Call Management</span></div>
        <div className="rcm-user-area">
          <span className="rcm-role-badge">ADMIN</span>
          <span>👤 {session.username}</span>
          <button className="rcm-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      <div className="rcm-admin-shell">
        <aside className="rcm-sidebar">
          <div className="rcm-sidebar-section">Call Management</div>
          <nav className="rcm-sidebar-nav">
            <button
              className={`rcm-sidebar-item ${activeView === "stats" ? "active" : ""}`}
              onClick={() => setActiveView("stats")}
            >
              📊 Overall Stats
            </button>
            <button
              className={`rcm-sidebar-item ${activeView === "queue" ? "active" : ""}`}
              onClick={() => setActiveView("queue")}
            >
              📥 Auto-Call Queue
              <span className="rcm-side-badge">{queue.length}</span>
            </button>
            <button
              className={`rcm-sidebar-item ${activeView === "staff" ? "active" : ""}`}
              onClick={() => setActiveView("staff")}
            >
              👥 Staff Accounts
              <span className="rcm-side-badge">{staff.length}</span>
            </button>
            <button
              className={`rcm-sidebar-item ${activeView === "calls" ? "active" : ""}`}
              onClick={() => setActiveView("calls")}
            >
              📋 All Calls
              <span className="rcm-side-badge">{calls.length}</span>
            </button>
            <button
              className={`rcm-sidebar-item ${activeView === "interested" ? "active" : ""}`}
              onClick={() => setActiveView("interested")}
            >
              ✅ Interest List
              <span className="rcm-side-badge">{calls.filter((c) => c.status === "Interested").length}</span>
            </button>
          </nav>
        </aside>

        <main className="rcm-content">
        {activeView === "stats" && (
        <>
        {/* ===== Stats / date + agent filter ===== */}
        <section className="rcm-card">
          <h2 className="rcm-card-title">
            📊 {selectedAgent ? `Report — ${selectedAgent}` : "Overall Stats"}
            {selectedAgent && (
              <button
                type="button"
                className="rcm-btn-sm"
                style={{ marginLeft: 12 }}
                onClick={() => setSelectedAgent("")}
              >← Back to overall</button>
            )}
          </h2>

          <div className="rcm-tabs">
            <button
              className={`rcm-tab-btn ${activeRange === "today" ? "active" : ""}`}
              onClick={() => handleRange("today")}
            >Today</button>
            <button
              className={`rcm-tab-btn ${activeRange === "yesterday" ? "active" : ""}`}
              onClick={() => handleRange("yesterday")}
            >Yesterday</button>
          </div>

          <div className="rcm-date-row" style={{ gridTemplateColumns: "1fr 1fr 1.2fr auto" }}>
            <div className="rcm-field">
              <label>From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="rcm-field">
              <label>To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="rcm-field">
              <label>Staff</label>
              <select
                className="rcm-status-select"
                style={{ width: "100%", minWidth: 0 }}
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">All staff (overall)</option>
                {staff.map((s) => (
                  <option key={s._id} value={s.username}>{s.username}</option>
                ))}
              </select>
            </div>
            <button className="rcm-btn rcm-btn-primary" onClick={handleApply}>Apply</button>
          </div>

          <div className="rcm-stats-grid">
            <div className="rcm-stat rcm-total">
              <div className="rcm-label">TOTAL CALLS</div>
              <div className="rcm-count">{stats?.totalCalls ?? 0}</div>
            </div>
            <div className="rcm-stat rcm-active">
              <div className="rcm-label">ACTIVE (RING)</div>
              <div className="rcm-count">{stats?.ringCount ?? 0}</div>
            </div>
            <div className="rcm-stat rcm-interested">
              <div className="rcm-label">INTERESTED</div>
              <div className="rcm-count">{stats?.interestedCount ?? 0}</div>
            </div>
          </div>

          {/* Status breakdown — useful in both overall and per-agent views. */}
          <div className="rcm-list" style={{ marginTop: 18 }}>
            <div className="rcm-list-row rcm-list-header" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div>RING</div>
              <div>NOT EXIST</div>
              <div>NOT INT.</div>
              <div>INTERESTED</div>
            </div>
            <div className="rcm-list-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div><b>{stats?.ringCount ?? 0}</b></div>
              <div><b>{stats?.notExistCount ?? 0}</b></div>
              <div><b>{stats?.notInterestedCount ?? 0}</b></div>
              <div><b>{stats?.interestedCount ?? 0}</b></div>
            </div>
          </div>

          {/* By-agent table is only meaningful in the overall view. Rows are
              clickable — click any agent to drill into their individual report. */}
          {!selectedAgent && stats?.byAgent?.length > 0 && (
            <>
              <h3 style={{ marginTop: 22, marginBottom: 10, fontSize: 14, color: "#374151" }}>
                By agent <span className="rcm-muted">(click a row to view that staff's report)</span>
              </h3>
              <div className="rcm-list">
                <div className="rcm-list-row rcm-list-header" style={{ gridTemplateColumns: "1.2fr repeat(5, 1fr)" }}>
                  <div>AGENT</div>
                  <div>TOTAL</div>
                  <div>RING</div>
                  <div>NOT EXIST</div>
                  <div>NOT INT.</div>
                  <div>INTERESTED</div>
                </div>
                {stats.byAgent.map((a) => (
                  <div
                    className="rcm-list-row"
                    key={a.agentUsername}
                    style={{ gridTemplateColumns: "1.2fr repeat(5, 1fr)", cursor: "pointer" }}
                    onClick={() => setSelectedAgent(a.agentUsername)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedAgent(a.agentUsername); }}
                  >
                    <div><b>{a.agentUsername}</b></div>
                    <div>{a.total}</div>
                    <div>{a["Ring"] || 0}</div>
                    <div>{a["Not Exist"] || 0}</div>
                    <div>{a["Not Interested"] || 0}</div>
                    <div>{a["Interested"] || 0}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Per-staff call detail (only shown when a specific staff is selected). */}
        {selectedAgent && (
          <section className="rcm-card">
            <h2 className="rcm-card-title">
              📋 {selectedAgent}'s calls ({agentCalls.length})
              <span className="rcm-right-date">{applied.from === applied.to ? applied.from : `${applied.from} → ${applied.to}`}</span>
            </h2>
            <table className="rcm-report-table">
              <thead>
                <tr>
                  <th>DATE &amp; TIME</th>
                  <th>NUMBER</th>
                  <th>MODE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {agentCalls.length === 0 ? (
                  <tr className="rcm-empty-row"><td colSpan={4}>No calls in this date range.</td></tr>
                ) : (
                  agentCalls.map((c) => (
                    <tr key={c._id}>
                      <td data-label="DATE & TIME">{fmtDateTime(c.createdAt)}</td>
                      <td data-label="NUMBER"><b>{c.number}</b></td>
                      <td data-label="MODE">
                        <span className={`rcm-mode-pill ${c.mode === "Manual" ? "rcm-manual" : "rcm-automatic"}`}>
                          {c.mode}
                        </span>
                      </td>
                      <td data-label="STATUS">
                        <span className={`rcm-pill ${
                          c.status === "Interested" ? "rcm-pill-active" :
                          c.status === "Not Exist"  ? "rcm-pill-inactive" :
                          c.status === "Ring"       ? "" : ""
                        }`} style={!["Interested","Not Exist"].includes(c.status) ? { background: "#ececec", color: "#374151" } : undefined}>
                          {c.status}
                        </span>
                        {hasDetails(c) && (
                          <button
                            type="button"
                            className="rcm-detail-link"
                            onClick={() => setDetailsViewer(c)}
                          >View details</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}
        </>
        )}

        {activeView === "queue" && (
          <section className="rcm-card">
            <h2 className="rcm-card-title">📥 Auto-Call Queue ({queue.length})</h2>
            <p className="rcm-muted" style={{ marginBottom: 14 }}>
              Numbers staff will dial in Automatic mode (round-robin server-side).
            </p>

            {/* ───── Excel / CSV upload ───── */}
            <div className="rcm-field">
              <label>📄 Upload from Excel / CSV</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelChange}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px dashed var(--rcm-border)",
                  borderRadius: 8,
                  background: "#fafafa",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              />
              <p className="rcm-muted" style={{ marginTop: 6 }}>
                Any cell containing a 10-digit Indian mobile number is detected automatically.
                Country-code prefixes like <code>+91</code> or leading <code>0</code> are stripped.
                Duplicates are skipped.
              </p>
            </div>

            {filePreview && (
              <div className="rcm-list" style={{ marginBottom: 16 }}>
                <div
                  className="rcm-list-row"
                  style={{
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    background: filePreview.numbers.length ? "#eaf7ef" : "#fff7d8",
                  }}
                >
                  <div>
                    <b>{filePreview.fileName}</b>
                    <div className="rcm-muted">
                      {filePreview.numbers.length} valid number{filePreview.numbers.length === 1 ? "" : "s"} detected
                      {filePreview.numbers.length > 0 && (
                        <> · preview: {filePreview.numbers.slice(0, 5).join(", ")}{filePreview.numbers.length > 5 ? "…" : ""}</>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="rcm-btn rcm-btn-primary"
                      onClick={handleUploadFromFile}
                      disabled={filePreview.numbers.length === 0}
                    >
                      Upload {filePreview.numbers.length || ""}
                    </button>
                    <button className="rcm-btn-sm" type="button" onClick={clearFilePreview}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* ───── Manual entry (existing) ───── */}
            <div className="rcm-field">
              <label>Or paste 10-digit numbers (one per line, comma, or space)</label>
              <textarea
                value={queueDraft}
                placeholder="9876543210&#10;9123456780, 9988776655"
                onChange={(e) => setQueueDraft(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button className="rcm-btn rcm-btn-primary" onClick={handleAddNumbers}>Add to Queue</button>
              <button className="rcm-btn-sm" onClick={() => setQueueDraft("")} type="button">Clear</button>
            </div>

            <div className="rcm-list">
              <div className="rcm-list-row rcm-queue-row rcm-list-header">
                <div>NUMBER</div>
                <div>ASSIGNED</div>
                <div>ACTION</div>
              </div>
              {queue.length === 0 ? (
                <div className="rcm-list-row" style={{ justifyContent: "center" }}>
                  <span className="rcm-muted">Queue is empty.</span>
                </div>
              ) : (
                queue.map((n) => (
                  <div className="rcm-list-row rcm-queue-row" key={n._id}>
                    <div><b>{n.number}</b><div className="rcm-muted">added by {n.addedBy}</div></div>
                    <div>{n.assignCount}×</div>
                    <button className="rcm-btn-sm rcm-danger" onClick={() => handleRemoveNumber(n._id)}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeView === "staff" && (
          <section className="rcm-card">
            <h2 className="rcm-card-title">👥 Staff Accounts ({staff.length})</h2>

            <form onSubmit={handleCreateStaff} style={{ marginBottom: 16 }}>
              <div className="rcm-form-row">
                <div className="rcm-field" style={{ margin: 0 }}>
                  <label>New username</label>
                  <input
                    type="text"
                    value={newStaff.username}
                    onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                    placeholder="e.g. priya"
                  />
                </div>
                <div className="rcm-field" style={{ margin: 0 }}>
                  <label>Role</label>
                  <select
                    className="rcm-status-select"
                    style={{ minWidth: 110 }}
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div className="rcm-form-row">
                <div className="rcm-field" style={{ margin: 0 }}>
                  <label>Initial password (min 4 chars)</label>
                  <input
                    type="text"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="set a password"
                  />
                </div>
                <button type="submit" className="rcm-btn rcm-btn-primary">Create</button>
              </div>
            </form>

            <div className="rcm-list">
              <div className="rcm-list-row rcm-staff-row rcm-list-header">
                <div>USERNAME</div>
                <div>PASSWORD</div>
                <div>ROLE</div>
                <div>STATUS</div>
                <div>RESET PW</div>
                <div>TOGGLE</div>
              </div>
              {staff.length === 0 ? (
                <div className="rcm-list-row" style={{ justifyContent: "center" }}>
                  <span className="rcm-muted">No staff yet.</span>
                </div>
              ) : (
                staff.map((s) => {
                  const revealed = !!revealedPasswords[s._id];
                  const pw = s.plainPassword;
                  return (
                  <div className="rcm-list-row rcm-staff-row" key={s._id}>
                    <div>
                      <b>{s.username}</b>
                      {s.lastLogin && <div className="rcm-muted">last: {new Date(s.lastLogin).toLocaleDateString()}</div>}
                    </div>
                    <div>
                      {pw ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <code
                            style={{
                              background: "#f5f5f7",
                              padding: "3px 8px",
                              borderRadius: 6,
                              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                              fontSize: 13,
                              letterSpacing: revealed ? 0 : 2,
                              minWidth: 60,
                              display: "inline-block",
                            }}
                          >
                            {revealed ? pw : "•".repeat(Math.min(pw.length, 10))}
                          </code>
                          <button
                            type="button"
                            className="rcm-btn-sm"
                            style={{ padding: "3px 8px" }}
                            onClick={() => togglePasswordReveal(s._id)}
                            title={revealed ? "Hide password" : "Show password"}
                          >
                            {revealed ? "🙈 Hide" : "👁 Show"}
                          </button>
                        </span>
                      ) : (
                        <span className="rcm-muted">— (reset to view)</span>
                      )}
                    </div>
                    <div>
                      <span className={`rcm-pill ${s.role === "ADMIN" ? "rcm-pill-admin" : "rcm-pill-staff"}`}>
                        {s.role}
                      </span>
                    </div>
                    <div>
                      <span className={`rcm-pill ${s.active ? "rcm-pill-active" : "rcm-pill-inactive"}`}>
                        {s.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <button className="rcm-btn-sm" onClick={() => handleResetPassword(s)}>Reset</button>
                    <button
                      className={`rcm-btn-sm ${s.active ? "rcm-danger" : "rcm-primary"}`}
                      onClick={() => handleToggleActive(s)}
                      disabled={s.username === session.username}
                      title={s.username === session.username ? "Cannot toggle your own account" : ""}
                    >
                      {s.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {activeView === "calls" && (() => {
          const f = allCallsFilters;
          const filtered = calls.filter((c) => {
            if (f.agent  && c.agentUsername !== f.agent) return false;
            if (f.number && !String(c.number).includes(f.number.trim())) return false;
            if (f.mode   && c.mode !== f.mode) return false;
            if (f.status && c.status !== f.status) return false;
            return true;
          });
          const isActive = Object.values(f).some(Boolean);
          return (
        <section className="rcm-card">
          <h2 className="rcm-card-title">
            📋 All Calls ({filtered.length}{isActive ? ` of ${calls.length}` : ""})
            {isActive && (
              <button
                type="button"
                className="rcm-btn-sm"
                style={{ marginLeft: 12 }}
                onClick={() => setAllCallsFilters(ALL_CALLS_BLANK)}
              >Clear filters</button>
            )}
          </h2>
          <table className="rcm-report-table">
            <thead>
              <tr>
                <th>DATE &amp; TIME</th>
                <th>AGENT</th>
                <th>NUMBER</th>
                <th>MODE</th>
                <th>STATUS</th>
              </tr>
              <tr className="rcm-filter-row">
                <th><span className="rcm-muted" style={{ fontSize: 11 }}>use Overall Stats date range</span></th>
                <th>
                  <select
                    value={f.agent}
                    onChange={(e) => setAllCallsFilters({ ...f, agent: e.target.value })}
                  >
                    <option value="">All agents</option>
                    {agentOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </th>
                <th>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Search number…"
                    value={f.number}
                    onChange={(e) => setAllCallsFilters({ ...f, number: e.target.value.replace(/\D/g, "") })}
                  />
                </th>
                <th>
                  <select
                    value={f.mode}
                    onChange={(e) => setAllCallsFilters({ ...f, mode: e.target.value })}
                  >
                    <option value="">All modes</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </th>
                <th>
                  <select
                    value={f.status}
                    onChange={(e) => setAllCallsFilters({ ...f, status: e.target.value })}
                  >
                    <option value="">All statuses</option>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="rcm-empty-row"><td colSpan={5}>{isActive ? "No calls match the current filters." : "No calls in this date range."}</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id}>
                    <td data-label="DATE & TIME">{fmtDateTime(c.createdAt)}</td>
                    <td data-label="AGENT"><b>{c.agentUsername}</b></td>
                    <td data-label="NUMBER">{c.number}</td>
                    <td data-label="MODE">
                      <span className={`rcm-mode-pill ${c.mode === "Manual" ? "rcm-manual" : "rcm-automatic"}`}>
                        {c.mode}
                      </span>
                    </td>
                    <td data-label="STATUS">
                      <select
                        className="rcm-status-select"
                        value={c.status}
                        onChange={async (e) => {
                          const prev = c.status;
                          const next = e.target.value;
                          setCalls((cur) => cur.map((x) => (x._id === c._id ? { ...x, status: next } : x)));
                          try {
                            await apiRequest(`/rcm/calls/${c._id}/status`, {
                              method: "PATCH",
                              token: tokenRef.current,
                              body: { status: next },
                            });
                            toast("Status updated", "success");
                            loadStats();
                          } catch (err) {
                            setCalls((cur) => cur.map((x) => (x._id === c._id ? { ...x, status: prev } : x)));
                            if (!handle401(err)) toast(err.message, "error");
                          }
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {hasDetails(c) && (
                        <button
                          type="button"
                          className="rcm-detail-link"
                          onClick={() => setDetailsViewer(c)}
                        >View details</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
          );
        })()}

        {activeView === "interested" && (() => {
          const interestedList = calls.filter((c) => c.status === "Interested");
          const f = interestFilters;
          const filteredInterest = interestedList.filter((c) => {
            const d = c.interestedDetails || {};
            if (f.agent         && c.agentUsername !== f.agent) return false;
            if (f.number        && !String(c.number).includes(f.number.trim())) return false;
            if (f.bhk           && d.bhk !== f.bhk) return false;
            if (f.rent          && !String(d.rent || "").includes(f.rent.trim())) return false;
            if (f.advance       && !String(d.advance || "").includes(f.advance.trim())) return false;
            if (f.floorNo       && !String(d.floorNo || "").toLowerCase().includes(f.floorNo.toLowerCase().trim())) return false;
            if (f.carPark       && d.carPark !== f.carPark) return false;
            if (f.availableFrom && d.availableFrom !== f.availableFrom) return false;
            return true;
          });
          const isActive = Object.values(f).some(Boolean);
          return (
            <section className="rcm-card">
              <h2 className="rcm-card-title">
                ✅ Interest List ({filteredInterest.length}{isActive ? ` of ${interestedList.length}` : ""})
                {isActive && (
                  <button
                    type="button"
                    className="rcm-btn-sm"
                    style={{ marginLeft: 12 }}
                    onClick={() => setInterestFilters(INTEREST_BLANK)}
                  >Clear filters</button>
                )}
                <span className="rcm-right-date">
                  {applied.from === applied.to ? applied.from : `${applied.from} → ${applied.to}`}
                </span>
              </h2>
              <p className="rcm-muted" style={{ marginBottom: 14 }}>
                Only calls marked as <b>Interested</b> in the selected date range. Property
                details captured at the time of the call are shown inline; click <b>View</b>
                for the full record.
              </p>
              <table className="rcm-report-table">
                <thead>
                  <tr>
                    <th>DATE &amp; TIME</th>
                    <th>AGENT</th>
                    <th>NUMBER</th>
                    <th>BHK</th>
                    <th>RENT</th>
                    <th>ADVANCE</th>
                    <th>FLOOR</th>
                    <th>CAR PARK</th>
                    <th>AVAILABLE FROM</th>
                    <th>ACTION</th>
                  </tr>
                  <tr className="rcm-filter-row">
                    <th><span className="rcm-muted" style={{ fontSize: 11 }}>use Overall Stats date range</span></th>
                    <th>
                      <select
                        value={f.agent}
                        onChange={(e) => setInterestFilters({ ...f, agent: e.target.value })}
                      >
                        <option value="">All</option>
                        {agentOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </th>
                    <th>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Search…"
                        value={f.number}
                        onChange={(e) => setInterestFilters({ ...f, number: e.target.value.replace(/\D/g, "") })}
                      />
                    </th>
                    <th>
                      <select
                        value={f.bhk}
                        onChange={(e) => setInterestFilters({ ...f, bhk: e.target.value })}
                      >
                        <option value="">All</option>
                        {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5+BHK"].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="₹"
                        value={f.rent}
                        onChange={(e) => setInterestFilters({ ...f, rent: e.target.value.replace(/\D/g, "") })}
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="₹"
                        value={f.advance}
                        onChange={(e) => setInterestFilters({ ...f, advance: e.target.value.replace(/\D/g, "") })}
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        placeholder="Floor"
                        value={f.floorNo}
                        onChange={(e) => setInterestFilters({ ...f, floorNo: e.target.value })}
                      />
                    </th>
                    <th>
                      <select
                        value={f.carPark}
                        onChange={(e) => setInterestFilters({ ...f, carPark: e.target.value })}
                      >
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </th>
                    <th>
                      <input
                        type="date"
                        value={f.availableFrom}
                        onChange={(e) => setInterestFilters({ ...f, availableFrom: e.target.value })}
                      />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterest.length === 0 ? (
                    <tr className="rcm-empty-row">
                      <td colSpan={10}>{isActive ? "No interested calls match the current filters." : "No interested calls in this date range."}</td>
                    </tr>
                  ) : (
                    filteredInterest.map((c) => {
                      const d = c.interestedDetails || {};
                      return (
                        <tr key={c._id}>
                          <td data-label="DATE & TIME">{fmtDateTime(c.createdAt)}</td>
                          <td data-label="AGENT"><b>{c.agentUsername}</b></td>
                          <td data-label="NUMBER">{c.number}</td>
                          <td data-label="BHK">{d.bhk || "—"}</td>
                          <td data-label="RENT">{d.rent ? `₹ ${d.rent}` : "—"}</td>
                          <td data-label="ADVANCE">{d.advance ? `₹ ${d.advance}` : "—"}</td>
                          <td data-label="FLOOR">{d.floorNo || "—"}</td>
                          <td data-label="CAR PARK">{d.carPark || "—"}</td>
                          <td data-label="AVAILABLE FROM">{d.availableFrom || "—"}</td>
                          <td data-label="ACTION">
                            <button
                              type="button"
                              className="rcm-btn-sm rcm-primary"
                              onClick={() => setDetailsViewer(c)}
                            >View</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </section>
          );
        })()}
        </main>
      </div>

      {/* Read-only details viewer (shared across both call tables). */}
      {detailsViewer && (
        <div className="rcm-modal-overlay" onClick={() => setDetailsViewer(null)}>
          <div className="rcm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rcm-modal-title">📋 Interested Property Details</div>
            <div className="rcm-modal-sub">
              Number <b>{detailsViewer.number}</b>
              {detailsViewer.agentUsername && <> · Agent <b>{detailsViewer.agentUsername}</b></>}
              {" · "}{fmtDateTime(detailsViewer.createdAt)}
            </div>
            <div className="rcm-detail-grid">
              <div>
                <div className="rcm-detail-label">Rent</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.rent ? `₹ ${detailsViewer.interestedDetails.rent}` : "—"}</div>
              </div>
              <div>
                <div className="rcm-detail-label">Advance</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.advance ? `₹ ${detailsViewer.interestedDetails.advance}` : "—"}</div>
              </div>
              <div>
                <div className="rcm-detail-label">BHK</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.bhk || "—"}</div>
              </div>
              <div>
                <div className="rcm-detail-label">Floor No</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.floorNo || "—"}</div>
              </div>
              <div>
                <div className="rcm-detail-label">Car Park</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.carPark || "—"}</div>
              </div>
              <div>
                <div className="rcm-detail-label">Available From</div>
                <div className="rcm-detail-value">{detailsViewer.interestedDetails?.availableFrom || "—"}</div>
              </div>
            </div>
            <div className="rcm-modal-actions">
              <button className="rcm-btn rcm-btn-primary" onClick={() => setDetailsViewer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Root — validates the stored admin token; falls back to login.
// ════════════════════════════════════════════════════════════════════
const RpWfhAdmin = () => {
  const [session, setSession] = useState(null);
  const [bootChecking, setBootChecking] = useState(true);
  const { push, node: toastNode } = useToast();

  useEffect(() => { document.title = "Admin · Call Management | Rent Pondy"; }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = localStorage.getItem(LS_TOKEN);
      if (!token) { setBootChecking(false); return; }
      try {
        const me = await apiRequest("/rcm/me", { token });
        if (cancelled) return;
        if (me.role !== "ADMIN") {
          localStorage.removeItem(LS_TOKEN);
        } else {
          setSession({ token, username: me.username, role: me.role });
        }
      } catch {
        localStorage.removeItem(LS_TOKEN);
      } finally {
        if (!cancelled) setBootChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN);
    setSession(null);
  }, []);

  if (bootChecking) {
    return (
      <div className="rcm-root rcm-admin">
        <div className="rcm-login-wrap">
          <div className="rcm-login-card" style={{ textAlign: "center" }}>
            <div className="rcm-logo">🛠 Rent Pondy</div>
            <div className="rcm-subtitle">Connecting…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rcm-root rcm-admin">
      {session
        ? <AdminDashboard session={session} onLogout={handleLogout} toast={push} />
        : <AdminLogin onLogin={setSession} toast={push} />}
      {toastNode}
    </div>
  );
};

export default RpWfhAdmin;
