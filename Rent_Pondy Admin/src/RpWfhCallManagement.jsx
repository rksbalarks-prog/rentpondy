import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./RpWfhCallManagement.css";

// Standalone "Call Management" feature reachable at /process/dashboard/rp.wfh.
// Data is fully server-backed via /PPC/rcm/* so the same staff session and the
// same call history appear across devices and browsers (no localStorage state
// other than the bearer token).

const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

const LS_TOKEN = "rcm_rpwfh_token";

const STATUS_OPTIONS = ["Ring", "Not Exist", "Not Interested", "Interested"];

const EMPTY_INTERESTED = {
  rent: "", advance: "", bhk: "", floorNo: "", carPark: "", availableFrom: "",
};

const BHK_OPTIONS = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5+BHK"];

// Has the call captured any "Interested" property details yet?
function hasDetails(call) {
  const d = call?.interestedDetails;
  if (!d) return false;
  return !!(d.rent || d.advance || d.bhk || d.floorNo || d.carPark || d.availableFrom);
}

// ───────── tiny API client ─────────
async function apiRequest(path, { method = "GET", body, token, signal } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkErr) {
    throw new Error("Network error — check your connection and try again.");
  }

  let data = null;
  const text = await resp.text();
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }

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

function fmtTodayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ───────── Toast hook ─────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "", show: false });
  const timerRef = useRef(null);

  const push = useCallback((msg, type = "") => {
    setToast({ msg, type, show: true });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2600);
  }, []);

  const node = (
    <div className={`rcm-toast ${toast.show ? "show" : ""} ${toast.type}`}>
      {toast.msg}
    </div>
  );

  return { push, node };
}

// ════════════════════════════════════════════════════════════════════
//  Login screen
// ════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin, toast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter username and password");
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiRequest("/rcm/login", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      if (!data?.token) throw new Error("Login response missing token");
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
        <div className="rcm-logo">📞 Rent Pondy</div>
        <div className="rcm-subtitle">Call Management — Staff Login</div>

        {error && <div className="rcm-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="rcm-field">
            <label htmlFor="rcm-username">Username</label>
            <input
              id="rcm-username"
              type="text"
              autoComplete="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <div className="rcm-field">
            <label htmlFor="rcm-password">Password</label>
            <input
              id="rcm-password"
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
            {submitting ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="rcm-hint">
          Default seed: <b>sandhoshi</b> / <b>1234</b> &nbsp;|&nbsp; <b>admin</b> / <b>admin</b>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  Dashboard screen
// ════════════════════════════════════════════════════════════════════
function DashboardScreen({ session, onLogout, toast }) {
  const today = useMemo(() => new Date(), []);
  const todayStr = toISODateInput(today);
  const yest = useMemo(() => { const d = new Date(today); d.setDate(today.getDate() - 1); return d; }, [today]);
  const yestStr = toISODateInput(yest);

  const [activeRange, setActiveRange] = useState("today"); // 'today' | 'yesterday' | 'custom'
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [applied, setApplied] = useState({ from: todayStr, to: todayStr });

  const [mode, setMode] = useState("Manual");
  const [mobile, setMobile] = useState("");
  const [currentCallId, setCurrentCallId] = useState(null);
  const [autoNumberId, setAutoNumberId] = useState(null);

  const [calls, setCalls] = useState([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [queueEmpty, setQueueEmpty] = useState(false);
  const [busy, setBusy] = useState(false);

  // Modal state for capturing property details when marking a call as Interested.
  const [interestedForm, setInterestedForm] = useState(EMPTY_INTERESTED);
  const [interestedModalOpen, setInterestedModalOpen] = useState(false);

  // Read-only details viewer (shown when clicking "View" on a report row).
  const [detailsViewer, setDetailsViewer] = useState(null); // call object or null

  // "Call Extension" toggle — when ON, "Call Now" triggers the device dialer
  // (tel:<number>). When OFF, the call record is created but the dialer
  // is not opened. Default ON to preserve the prior behavior.
  const [callExtensionEnabled, setCallExtensionEnabled] = useState(true);

  const tokenRef = useRef(session.token);
  useEffect(() => { tokenRef.current = session.token; }, [session.token]);

  // ───────── Reload calls whenever the filter changes ─────────
  const loadCalls = useCallback(async () => {
    setLoadingCalls(true);
    try {
      const data = await apiRequest(
        `/rcm/calls?from=${encodeURIComponent(applied.from)}&to=${encodeURIComponent(applied.to)}`,
        { token: tokenRef.current }
      );
      setCalls(data?.calls || []);
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      toast(err.message, "error");
    } finally {
      setLoadingCalls(false);
    }
  }, [applied, onLogout, toast]);

  useEffect(() => { loadCalls(); }, [loadCalls]);

  // ───────── Fetch the next auto number (round-robin from the server) ─────────
  const fetchNextAutoNumber = useCallback(async () => {
    try {
      const data = await apiRequest("/rcm/auto-queue/next", { token: tokenRef.current });
      setMobile(data.number);
      setAutoNumberId(data.id);
      setQueueEmpty(false);
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      if (err.status === 404) {
        setMobile("");
        setAutoNumberId(null);
        setQueueEmpty(true);
        return;
      }
      toast(err.message, "error");
    }
  }, [onLogout, toast]);

  // When mode changes (and there is no active call) preload/clear the input.
  useEffect(() => {
    if (currentCallId) return;
    if (mode === "Automatic") {
      fetchNextAutoNumber();
    } else {
      setMobile("");
      setAutoNumberId(null);
      setQueueEmpty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ───────── Filter controls ─────────
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
    if (fromDate > toDate) { toast("From date cannot be after To date", "error"); return; }
    setActiveRange("custom");
    setApplied({ from: fromDate, to: toDate });
  };

  // ───────── Call flow ─────────
  const mobileValid = /^\d{10}$/.test(mobile.trim());
  const callBtnReady = mobileValid && currentCallId === null && !busy;

  const handleMobileChange = (e) => {
    if (mode === "Automatic") return; // input is locked in automatic
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleCallNow = async () => {
    if (!mobileValid) { toast("Enter a valid 10-digit number", "error"); return; }

    // Fast client-side duplicate check using whatever the report has loaded.
    // The server is still the source of truth — this just gives quicker UX
    // when the duplicate is visible on the current page. Mirrors the server
    // rule: a Ring-only history does NOT block a re-dial; only final
    // outcomes (Not Exist / Not Interested / Interested) do.
    const trimmed = mobile.trim();
    const localDup = calls.find((c) => c.number === trimmed && c.status !== "Ring");
    if (localDup) {
      toast(`Already called (status: ${localDup.status}). Pick a different number.`, "error");
      if (mode === "Automatic") await fetchNextAutoNumber();
      return;
    }

    setBusy(true);
    try {
      const data = await apiRequest("/rcm/calls", {
        method: "POST",
        token: tokenRef.current,
        body: { number: trimmed, mode, autoNumberId },
      });
      const newCall = data?.call;
      if (!newCall?._id) throw new Error("Server did not return a call id");

      setCalls((cur) => [newCall, ...cur]);
      setCurrentCallId(newCall._id);
      if (callExtensionEnabled) {
        try { window.location.href = "tel:" + newCall.number; } catch { /* noop */ }
      }
      toast(
        callExtensionEnabled
          ? `Call initiated for ${newCall.number}`
          : `Call logged for ${newCall.number} (dialer skipped)`,
        "success"
      );
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      toast(err.message, "error");
      // 409 = duplicate. In Automatic mode, advance to the next queue number
      // automatically so the staff doesn't have to fight the round-robin.
      if (err.status === 409 && mode === "Automatic") {
        await fetchNextAutoNumber();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleStatusForCurrent = async (newStatus) => {
    if (!currentCallId) return;
    // "Interested" needs the property-details popup — open it instead of saving.
    if (newStatus === "Interested") {
      setInterestedForm(EMPTY_INTERESTED);
      setInterestedModalOpen(true);
      return;
    }
    await saveStatus(newStatus, null);
  };

  // Single saver used by both the status buttons and the Interested modal.
  const saveStatus = async (newStatus, details) => {
    if (!currentCallId) return;
    setBusy(true);
    try {
      const body = { status: newStatus };
      if (details) body.interestedDetails = details;
      const data = await apiRequest(`/rcm/calls/${currentCallId}/status`, {
        method: "PATCH",
        token: tokenRef.current,
        body,
      });
      const updated = data?.call;
      setCalls((cur) => cur.map((c) => (c._id === currentCallId ? updated : c)));
      toast(`Marked as ${newStatus}`, "success");
      setCurrentCallId(null);
      setInterestedModalOpen(false);

      if (mode === "Automatic") {
        await fetchNextAutoNumber();
      } else {
        setMobile("");
      }
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveInterested = (e) => {
    e?.preventDefault();
    const d = interestedForm;
    if (!d.rent || !d.advance || !d.bhk || !d.floorNo || !d.carPark || !d.availableFrom) {
      toast("Please fill all property fields", "error");
      return;
    }
    saveStatus("Interested", d);
  };

  const handleRowStatusChange = async (id, newStatus) => {
    const prev = calls;
    setCalls((cur) => cur.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
    try {
      await apiRequest(`/rcm/calls/${id}/status`, {
        method: "PATCH",
        token: tokenRef.current,
        body: { status: newStatus },
      });
      toast("Status updated", "success");
    } catch (err) {
      setCalls(prev); // rollback optimistic update
      if (err.status === 401) { onLogout(); return; }
      toast(err.message, "error");
    }
  };

  // ───────── Derived counts ─────────
  const totalCount = calls.length;
  const activeCount = calls.filter((c) => c.status === "Ring").length;
  const interestedCount = calls.filter((c) => c.status === "Interested").length;

  const handleLogout = async () => {
    try { await apiRequest("/rcm/logout", { method: "POST", token: tokenRef.current }); }
    catch { /* ignore — still log out client-side */ }
    onLogout();
  };

  return (
    <>
      <header className="rcm-header">
        <div className="rcm-brand">📞 Call Management <span className="rcm-light">System</span></div>
        <div className="rcm-user-area">
          <span className="rcm-role-badge">{session.role || "STAFF"}</span>
          <span>👤 {session.username}</span>
          <button className="rcm-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      <main className="rcm-page">
        {/* ===== My Dashboard ===== */}
        <section className="rcm-card">
          <h2 className="rcm-card-title">
            📊 My Dashboard
            <span className="rcm-right-date">{fmtTodayLabel()}</span>
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

          <div className="rcm-date-row">
            <div className="rcm-field">
              <label htmlFor="rcm-from">From</label>
              <input
                id="rcm-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="rcm-field">
              <label htmlFor="rcm-to">To</label>
              <input
                id="rcm-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button className="rcm-btn rcm-btn-primary" onClick={handleApply}>Apply</button>
          </div>

          <div className="rcm-stats-grid">
            <div className="rcm-stat rcm-total">
              <div className="rcm-label">TOTAL CALLS</div>
              <div className="rcm-count">{totalCount}</div>
            </div>
            <div className="rcm-stat rcm-active">
              <div className="rcm-label">ACTIVE CALLS</div>
              <div className="rcm-count">{activeCount}</div>
            </div>
            <div className="rcm-stat rcm-interested">
              <div className="rcm-label">INTERESTED</div>
              <div className="rcm-count">{interestedCount}</div>
            </div>
          </div>
        </section>

        {/* ===== Call Section ===== */}
        <section className="rcm-card">
          <h2 className="rcm-card-title">📞 Call Section</h2>

          <div className="rcm-modes" style={{ flexWrap: "wrap" }}>
            <label className="rcm-mode-option">
              <input
                type="radio"
                name="rcm-mode"
                value="Automatic"
                checked={mode === "Automatic"}
                onChange={() => setMode("Automatic")}
                disabled={!!currentCallId || busy}
              />
              Automatic
            </label>
            <label className="rcm-mode-option">
              <input
                type="radio"
                name="rcm-mode"
                value="Manual"
                checked={mode === "Manual"}
                onChange={() => setMode("Manual")}
                disabled={!!currentCallId || busy}
              />
              Manual
            </label>
            <label
              className="rcm-mode-option"
              style={{ marginLeft: "auto" }}
              title="When on, Call Now opens your phone's dialer. When off, only the call record is created."
            >
              <input
                type="checkbox"
                checked={callExtensionEnabled}
                onChange={(e) => setCallExtensionEnabled(e.target.checked)}
              />
              📞 Call Extension
            </label>
          </div>

          <div className="rcm-field rcm-call-row">
            <label htmlFor="rcm-mobile">
              {mode === "Automatic" ? "Mobile Number (auto-assigned)" : "Enter Mobile Number"}
            </label>
            <input
              id="rcm-mobile"
              type="tel"
              placeholder={mode === "Automatic" ? "Loading next number…" : "Enter 10-digit number"}
              value={mobile}
              maxLength={10}
              onChange={handleMobileChange}
              readOnly={mode === "Automatic"}
              style={mode === "Automatic" ? { background: "#f5f5f7", cursor: "not-allowed" } : undefined}
            />
            {mode === "Automatic" && queueEmpty && (
              <p style={{ color: "#a01818", fontSize: 12, fontWeight: 600, marginTop: 6 }}>
                No numbers in the admin queue. Ask admin to push numbers, or switch to Manual.
              </p>
            )}
            {mode === "Manual" && mobile.length > 0 && mobile.length < 10 && (
              <p style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
                {10 - mobile.length} more digit{10 - mobile.length === 1 ? "" : "s"} to enable Call Now.
              </p>
            )}
          </div>

          <button
            className={`rcm-call-now ${callBtnReady ? "ready" : ""}`}
            onClick={handleCallNow}
            disabled={!callBtnReady}
          >
            📞 {busy && currentCallId === null ? "Calling…" : "Call Now"}
          </button>

          <div className="rcm-status-grid">
            <button
              className="rcm-status-btn rcm-ring"
              disabled={!currentCallId || busy}
              onClick={() => handleStatusForCurrent("Ring")}
            >🔔 Ring</button>
            <button
              className="rcm-status-btn rcm-not-exist"
              disabled={!currentCallId || busy}
              onClick={() => handleStatusForCurrent("Not Exist")}
            >❌ Not Exist</button>
            <button
              className="rcm-status-btn rcm-not-interested"
              disabled={!currentCallId || busy}
              onClick={() => handleStatusForCurrent("Not Interested")}
            >👎 Not Interested</button>
            <button
              className="rcm-status-btn rcm-interested"
              disabled={!currentCallId || busy}
              onClick={() => handleStatusForCurrent("Interested")}
            >✅ Interested</button>
          </div>
        </section>

        {/* ===== Call Report ===== */}
        <section className="rcm-card">
          <h2 className="rcm-card-title">📋 Call Report</h2>
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
              {loadingCalls ? (
                <tr className="rcm-empty-row"><td colSpan={4}>Loading…</td></tr>
              ) : calls.length === 0 ? (
                <tr className="rcm-empty-row">
                  <td colSpan={4}>No calls in this date range.</td>
                </tr>
              ) : (
                calls.map((c) => (
                  <tr key={c._id}>
                    <td data-label="DATE & TIME">{fmtDateTime(c.createdAt)}</td>
                    <td data-label="NUMBER"><b>{c.number}</b></td>
                    <td data-label="MODE">
                      <span className={`rcm-mode-pill ${c.mode === "Manual" ? "rcm-manual" : "rcm-automatic"}`}>
                        {c.mode}
                      </span>
                    </td>
                    <td data-label="STATUS">
                      <select
                        className="rcm-status-select"
                        value={c.status}
                        onChange={(e) => handleRowStatusChange(c._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
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
      </main>

      {/* ===== Interested-details popup (capture) ===== */}
      {interestedModalOpen && (
        <div className="rcm-modal-overlay" onClick={() => !busy && setInterestedModalOpen(false)}>
          <div className="rcm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rcm-modal-title">✅ Interested — Property Details</div>
            <div className="rcm-modal-sub">
              Captured for the current call. All fields are required.
            </div>
            <form onSubmit={handleSaveInterested}>
              <div className="rcm-modal-grid">
                <div className="rcm-field">
                  <label htmlFor="rcm-rent">Rent (₹)</label>
                  <input
                    id="rcm-rent"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 12000"
                    value={interestedForm.rent}
                    onChange={(e) => setInterestedForm({ ...interestedForm, rent: e.target.value.replace(/\D/g, "") })}
                    required
                  />
                </div>
                <div className="rcm-field">
                  <label htmlFor="rcm-advance">Advance (₹)</label>
                  <input
                    id="rcm-advance"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 60000"
                    value={interestedForm.advance}
                    onChange={(e) => setInterestedForm({ ...interestedForm, advance: e.target.value.replace(/\D/g, "") })}
                    required
                  />
                </div>
                <div className="rcm-field">
                  <label htmlFor="rcm-bhk">BHK</label>
                  <select
                    id="rcm-bhk"
                    className="rcm-status-select"
                    style={{ width: "100%", minWidth: 0 }}
                    value={interestedForm.bhk}
                    onChange={(e) => setInterestedForm({ ...interestedForm, bhk: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    {BHK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="rcm-field">
                  <label htmlFor="rcm-floor">Floor No</label>
                  <input
                    id="rcm-floor"
                    type="text"
                    placeholder="e.g. Ground / 1 / 2"
                    value={interestedForm.floorNo}
                    onChange={(e) => setInterestedForm({ ...interestedForm, floorNo: e.target.value })}
                    required
                  />
                </div>
                <div className="rcm-field">
                  <label htmlFor="rcm-carpark">Car Park</label>
                  <select
                    id="rcm-carpark"
                    className="rcm-status-select"
                    style={{ width: "100%", minWidth: 0 }}
                    value={interestedForm.carPark}
                    onChange={(e) => setInterestedForm({ ...interestedForm, carPark: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="rcm-field">
                  <label htmlFor="rcm-availfrom">Available From</label>
                  <input
                    id="rcm-availfrom"
                    type="date"
                    value={interestedForm.availableFrom}
                    onChange={(e) => setInterestedForm({ ...interestedForm, availableFrom: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="rcm-modal-actions">
                <button
                  type="button"
                  className="rcm-btn-sm"
                  onClick={() => setInterestedModalOpen(false)}
                  disabled={busy}
                >Cancel</button>
                <button type="submit" className="rcm-btn rcm-btn-primary" disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Read-only details viewer ===== */}
      {detailsViewer && (
        <div className="rcm-modal-overlay" onClick={() => setDetailsViewer(null)}>
          <div className="rcm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rcm-modal-title">📋 Interested Property Details</div>
            <div className="rcm-modal-sub">
              Number <b>{detailsViewer.number}</b> · {fmtDateTime(detailsViewer.createdAt)}
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
//  Root — validates the stored token on mount, then routes to login or dashboard
// ════════════════════════════════════════════════════════════════════
const RpWfhCallManagement = () => {
  const [session, setSession] = useState(null);   // {token, username, role}
  const [bootChecking, setBootChecking] = useState(true);
  const { push, node: toastNode } = useToast();

  useEffect(() => {
    document.title = "Call Management | Rent Pondy";
  }, []);

  // Validate any stored token against /rcm/me. If it fails, drop to login.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = localStorage.getItem(LS_TOKEN);
      if (!token) { setBootChecking(false); return; }
      try {
        const me = await apiRequest("/rcm/me", { token });
        if (cancelled) return;
        setSession({ token, username: me.username, role: me.role });
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
      <div className="rcm-root">
        <div className="rcm-login-wrap">
          <div className="rcm-login-card" style={{ textAlign: "center" }}>
            <div className="rcm-logo">📞 Rent Pondy</div>
            <div className="rcm-subtitle">Connecting…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rcm-root">
      {session
        ? <DashboardScreen session={session} onLogout={handleLogout} toast={push} />
        : <LoginScreen onLogin={setSession} toast={push} />}
      {toastNode}
    </div>
  );
};

export default RpWfhCallManagement;
