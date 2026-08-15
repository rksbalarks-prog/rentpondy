import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Admin control for the active OTP provider used at login.
 * Two independent targets, each switchable between SMS Idea (server-side SMS
 * gateway) and Firebase (client-side Firebase Phone Auth):
 *   - User app login  (Rent Pondy user app / WebLogin)
 *   - Admin panel login (this app)
 * Backed by GET/PUT `${API}/otp-setting`.
 */
const PROVIDERS = [
  { value: 'smsidea', label: 'SMS Idea (SMS gateway)' },
  { value: 'firebase', label: 'Firebase (Phone Auth)' },
];

const OtpProviderControl = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [userProvider, setUserProvider] = useState('smsidea');
  const [adminProvider, setAdminProvider] = useState('smsidea');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/otp-setting`);
        if (!cancelled && res.data) {
          if (res.data.userProvider) setUserProvider(res.data.userProvider);
          if (res.data.adminProvider) setAdminProvider(res.data.adminProvider);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load the current settings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  // Persist a single target. `target` is 'user' | 'admin'.
  const saveProvider = async (target, value) => {
    const prevUser = userProvider;
    const prevAdmin = adminProvider;
    // optimistic update
    if (target === 'user') setUserProvider(value);
    else setAdminProvider(value);

    setSaving(target);
    setError('');
    setSavedMsg('');
    try {
      const body = target === 'user' ? { userProvider: value } : { adminProvider: value };
      const res = await axios.put(`${API_URL}/otp-setting`, body);
      if (res.data) {
        if (res.data.userProvider) setUserProvider(res.data.userProvider);
        if (res.data.adminProvider) setAdminProvider(res.data.adminProvider);
      }
      const labelFor = (v) => PROVIDERS.find((p) => p.value === v)?.label || v;
      setSavedMsg(`${target === 'user' ? 'User app' : 'Admin panel'} OTP set to ${labelFor(value)}.`);
    } catch (err) {
      // revert on failure
      setUserProvider(prevUser);
      setAdminProvider(prevAdmin);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving('');
    }
  };

  const cardStyle = {
    padding: '18px 20px',
    borderRadius: 12,
    border: '1px solid #e3e3e3',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: 16,
  };
  const selectStyle = {
    width: '100%',
    maxWidth: 320,
    marginTop: 8,
    padding: '10px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    background: '#fafafa',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '24px', maxWidth: 680, margin: '0 auto' }}>
      <h3 style={{ fontWeight: 700, color: '#333', marginBottom: 4 }}>OTP Provider Settings</h3>
      <p style={{ color: '#777', marginBottom: 20, fontSize: 14 }}>
        Choose which OTP service is used for login. <strong>SMS Idea</strong> sends the OTP from
        the server; <strong>Firebase</strong> sends and verifies it in the user's browser. You can
        set the user app and the admin panel independently.
      </p>

      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: '#333' }}>User App login</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
          {loading ? 'Loading current setting…' : 'Provider used by the Rent Pondy user app.'}
        </div>
        <select
          value={userProvider}
          disabled={loading || saving === 'user'}
          onChange={(e) => saveProvider('user', e.target.value)}
          style={selectStyle}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {saving === 'user' && <span style={{ marginLeft: 12, color: '#888', fontSize: 13 }}>Saving…</span>}
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: '#333' }}>Admin Panel login</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
          Provider used by this admin panel. In Firebase mode, admins enter a registered office
          number to receive the OTP.
        </div>
        <select
          value={adminProvider}
          disabled={loading || saving === 'admin'}
          onChange={(e) => saveProvider('admin', e.target.value)}
          style={selectStyle}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {saving === 'admin' && <span style={{ marginLeft: 12, color: '#888', fontSize: 13 }}>Saving…</span>}
      </div>

      {savedMsg && <p style={{ color: '#2e7d32', fontSize: 13, marginTop: 12 }}>{savedMsg}</p>}
      {error && <p style={{ color: '#c62828', fontSize: 13, marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default OtpProviderControl;
