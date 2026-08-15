import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Admin control for the post-login "other products" popup shown in the
 * Rent Pondy user app (after a user logs in on /login/pondicherry or
 * /login/chennai). A single on/off switch backed by GET/PUT
 * `${API}/login-popup-setting`.
 */
const LoginPopupControl = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/login-popup-setting`);
        if (!cancelled && res.data && typeof res.data.enabled === 'boolean') {
          setEnabled(res.data.enabled);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load the current setting.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  const handleToggle = async () => {
    if (saving) return;
    const next = !enabled;
    setEnabled(next); // optimistic
    setSaving(true);
    setError('');
    setSavedMsg('');
    try {
      const res = await axios.put(`${API_URL}/login-popup-setting`, { enabled: next });
      if (res.data && typeof res.data.enabled === 'boolean') {
        setEnabled(res.data.enabled);
      }
      setSavedMsg(`Popup turned ${next ? 'ON' : 'OFF'} successfully.`);
    } catch (err) {
      setEnabled(!next); // revert on failure
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: 640, margin: '0 auto' }}>
      <h3 style={{ fontWeight: 700, color: '#333', marginBottom: 4 }}>
        Login Popup (Other Products)
      </h3>
      <p style={{ color: '#777', marginBottom: 20, fontSize: 14 }}>
        Turn the “other products” popup on or off. When ON, users see the products
        popup right after logging in on the mobile / web app. When OFF, they go
        straight into the app.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '18px 20px',
          borderRadius: 12,
          border: '1px solid #e3e3e3',
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: '#333' }}>Show popup after login</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
            {loading
              ? 'Loading current setting…'
              : `Currently ${enabled ? 'ON — popup is shown' : 'OFF — popup is hidden'}`}
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle login popup"
          disabled={loading || saving}
          onClick={handleToggle}
          style={{
            position: 'relative',
            width: 58,
            height: 32,
            borderRadius: 999,
            border: 'none',
            cursor: loading || saving ? 'not-allowed' : 'pointer',
            background: enabled ? '#8BC34A' : '#cfcfcf',
            transition: 'background 0.25s ease',
            flexShrink: 0,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: enabled ? 29 : 3,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'left 0.25s ease',
            }}
          />
        </button>
      </div>

      {saving && <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>Saving…</p>}
      {savedMsg && <p style={{ color: '#2e7d32', fontSize: 13, marginTop: 12 }}>{savedMsg}</p>}
      {error && <p style={{ color: '#c62828', fontSize: 13, marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default LoginPopupControl;
