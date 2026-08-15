import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPoints = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const mihpayid = searchParams.get('mihpayid');
  const amount = searchParams.get('amount');
  const firstname = searchParams.get('firstname');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const status = searchParams.get('status');
  const payUdate = searchParams.get('payUdate');
  const planName = searchParams.get('planName');
  const planId = searchParams.get('planId');
  const pointsParam = searchParams.get('points');
  const points = pointsParam ? parseInt(pointsParam, 10) : 0;

  const navigate = useNavigate();
  const [creditState, setCreditState] = useState({ done: false, newBalance: null, error: null });

  const formattedDate = payUdate
    ? new Date(payUdate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'N/A';

  useEffect(() => {
    if (status !== 'success' || !phone || !points) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/points-credit`, {
          phoneNumber: phone,
          points,
          planId,
          amount,
          txnId: mihpayid,
        });
        if (!cancelled) {
          setCreditState({ done: true, newBalance: res.data?.balance ?? null, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setCreditState({ done: true, newBalance: null, error: err?.response?.data?.message || 'Failed to credit points' });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [status, phone, points, planId, amount, mihpayid]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/points-plans'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleBack = () => navigate('/points-plans');

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        maxWidth: '420px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
        boxShadow: '0 10px 30px rgba(79,75,126,0.12)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 4L12 14.01l-3-3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 style={{ color: '#16a34a', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Payment Successful!</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{formattedDate}</p>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(245,87,108,0.1))',
          border: '1px solid rgba(79,75,126,0.15)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 13, color: '#666', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {creditState.done && creditState.error ? 'Points status' : 'Points credited'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#4F4B7E', marginTop: 4 }}>
          +{points} pts
        </div>
        {creditState.newBalance !== null && (
          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
            New balance: <b>{creditState.newBalance} pts</b>
          </div>
        )}
        {creditState.error && (
          <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>
            {creditState.error} — please contact support with txn {mihpayid}.
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#F3F4F6', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <Row label="Transaction ID" value={mihpayid} />
        <Row label="Plan" value={planName} />
        <Row label="Amount" value={`₹ ${amount}`} />
        <Row
          label="Status"
          value={
            <span style={{ color: '#16a34a', fontWeight: 600, backgroundColor: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.875rem' }}>
              {status}
            </span>
          }
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#374151', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>
          Customer Details
        </h3>
        <SmallRow label="Name" value={firstname} />
        <SmallRow label="Email" value={email} />
        <SmallRow label="Phone" value={phone} />
      </div>

      <button
        onClick={handleBack}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '0.85rem',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.95rem',
          cursor: 'pointer',
        }}
      >
        Back to Points Plans
      </button>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
    <span style={{ color: '#4B5563', fontWeight: 500 }}>{label}:</span>
    <span style={{ color: '#111827', fontWeight: 600 }}>{value}</span>
  </div>
);

const SmallRow = ({ label, value }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>{label}</p>
    <p style={{ color: '#111827', fontWeight: 500, margin: 0 }}>{value}</p>
  </div>
);

export default PaymentSuccessPoints;
