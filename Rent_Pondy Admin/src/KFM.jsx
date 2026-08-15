import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5005";

/* ── Login Form ──────────────────────────────────────────────────────────────── */
const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("⚠️ Please enter username.");
    if (!password.trim()) return setError("⚠️ Please enter password.");

    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("kfmAuthenticated", "true");
        onLoginSuccess();
      } else {
        setError("❌ Invalid username or password.");
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleLogin(e);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <div style={styles.loginHeader}>
          <h2 style={styles.loginTitle}>KFM PORTAL</h2>
          <p style={styles.loginSubtitle}>WhatsApp Send Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              style={styles.formControl}
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              style={styles.formControl}
              disabled={loading}
            />
          </div>

          {error && <div style={styles.loginErrorBox}>{error}</div>}

          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={styles.spinner} /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ── WhatsApp Send Panel ────────────────────────────────────────────────────── */
const WhatsAppPanel = ({ onLogout }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const handleSend = async () => {
    const rawPhone = phoneNumber.trim().replace(/[\s\-()]/g, "");
    if (!rawPhone) return setError("⚠️ Please enter a phone number.");
    if (rawPhone.replace(/\D/g, "").length < 10)
      return setError("⚠️ Phone number must be at least 10 digits.");
    if (!message.trim()) return setError("⚠️ Message cannot be empty.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let formattedNumber = rawPhone;
      if (!formattedNumber.startsWith("+")) {
        if (formattedNumber.startsWith("91") && formattedNumber.length === 12) {
          formattedNumber = "+" + formattedNumber;
        } else {
          formattedNumber = "+91" + formattedNumber.slice(-10);
        }
      }

      const response = await axios.post(
        `${API_BASE}/send-message`,
        { to: formattedNumber, message: message.trim() },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      const isSuccess =
        response.data?.success === true ||
        response.status === 200 ||
        String(response.data?.message_status).toLowerCase().trim() === "success";

      if (isSuccess) {
        setSuccess("✅ Message sent successfully!");
        setPhoneNumber("");
        setTimeout(() => setSuccess(""), 3500);
      } else {
        setError(`❌ ${response.data?.message || "Failed to send message"}`);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                 ||
        "Unknown error";
      setError(`❌ Failed to send message: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) handleSend();
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            <span style={styles.waDot} />
            KFM WhatsApp Panel
          </h1>
          <p style={styles.pageDesc}>Send a WhatsApp message to any number</p>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.waIcon}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Send WhatsApp Message</h2>
            <p style={styles.cardSub}>Enter a phone number and your message</p>
          </div>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.field}>
            <label style={styles.label}>
              Phone Number <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setError(""); }}
              placeholder="9876543210 or +91 98765 43210"
              style={styles.input}
              disabled={loading}
            />
            <p style={styles.hint}>10 digits or include +91. Spaces and dashes are removed automatically.</p>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Message <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Type your WhatsApp message here... (Ctrl+Enter to send)"
              rows={7}
              style={styles.textarea}
              disabled={loading}
            />
            <p style={styles.counter}>{message.length} characters</p>
          </div>

          {error   && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}

          <div style={styles.cardFooter}>
            <button onClick={handleSend} style={styles.sendBtn} disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.spinner} /> Sending...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  Send Message
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Entry ───────────────────────────────────────────────────────────────────── */
const KFM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("kfmAuthenticated");
    setIsAuthenticated(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("kfmAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  return <WhatsAppPanel onLogout={handleLogout} />;
};

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const styles = {
  loginContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 20,
  },
  loginBox: {
    background: "#fff", borderRadius: 16,
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.3)",
    padding: 50, width: "100%", maxWidth: 420,
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  loginHeader: { textAlign: "center", marginBottom: 30 },
  loginTitle: {
    color: "#128c7e", fontWeight: 800, fontSize: 28,
    letterSpacing: "-0.5px", margin: 0,
  },
  loginSubtitle: {
    color: "#999", fontSize: 13, margin: "8px 0 0",
    fontWeight: 500, letterSpacing: "0.5px",
  },
  formGroup: { marginBottom: 18, width: "100%" },
  formLabel: {
    color: "#333", fontWeight: 700, marginBottom: 8, fontSize: 12,
    textTransform: "uppercase", letterSpacing: "0.5px", display: "block",
  },
  formControl: {
    width: "100%", boxSizing: "border-box", border: "2px solid #e8e8e8",
    borderRadius: 8, padding: "12px 14px", fontSize: 14,
    background: "#f9f9f9", color: "#333", outline: "none", fontFamily: "inherit",
  },
  loginErrorBox: {
    background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8,
    padding: "10px 14px", color: "#c53030", fontSize: 13, marginBottom: 16,
  },
  loginBtn: {
    background: "linear-gradient(135deg,#25d366,#128c7e)", border: "none",
    padding: "12px 20px", fontWeight: 700, fontSize: 14, borderRadius: 8,
    marginTop: 8, textTransform: "uppercase", letterSpacing: "0.5px",
    color: "#fff", width: "100%", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  page: {
    minHeight: "100vh", background: "#f7f9fc", padding: "28px 32px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 28, flexWrap: "wrap", gap: 16,
  },
  pageTitle: {
    fontSize: 22, fontWeight: 700, color: "#1a202c", margin: 0,
    display: "flex", alignItems: "center", gap: 10,
  },
  waDot: { width: 10, height: 10, borderRadius: "50%", background: "#25d366", display: "inline-block" },
  pageDesc: { fontSize: 13.5, color: "#718096", margin: "4px 0 0" },
  logoutBtn: {
    background: "#ef4444", color: "#fff", border: "none", borderRadius: 10,
    padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 4px 14px rgba(239, 68, 68, .35)",
  },
  card: {
    background: "#fff", borderRadius: 14, maxWidth: 720, margin: "0 auto",
    boxShadow: "0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)",
    border: "1px solid rgba(37,211,102,.15)", overflow: "hidden",
  },
  cardHeader: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "18px 22px 14px", borderBottom: "1px solid #f0f0f0",
  },
  waIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 },
  cardSub:   { fontSize: 12, color: "#a0aec0", margin: "2px 0 0" },
  cardBody:  { padding: "22px" },
  cardFooter: { display: "flex", justifyContent: "flex-end", marginTop: 18 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 7 },
  hint:  { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0" },
  input: {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5, outline: "none",
    boxSizing: "border-box", color: "#1a202c", fontFamily: "inherit",
  },
  textarea: {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5, outline: "none",
    resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
    color: "#1a202c", lineHeight: 1.4,
  },
  counter: { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0", textAlign: "right" },
  errorBox: {
    background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8,
    padding: "10px 14px", color: "#c53030", fontSize: 13, marginTop: 4,
  },
  successBox: {
    background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 8,
    padding: "10px 14px", color: "#15803d", fontSize: 13, marginTop: 4,
  },
  sendBtn: {
    padding: "10px 24px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37,211,102,.3)",
  },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff", borderRadius: "50%", display: "inline-block",
    animation: "spin .7s linear infinite",
  },
};

if (typeof document !== "undefined" && !document.getElementById("kfm-wa-anim")) {
  const s = document.createElement("style");
  s.id = "kfm-wa-anim";
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

export default KFM;
