import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getActiveBase, baseToPath } from '../../utils/cityBase';

const PaymentFailurePoints = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const mihpayid = searchParams.get('mihpayid');
  const amount = searchParams.get('amount');
  const firstname = searchParams.get('firstname');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const status = searchParams.get('status');
  const payUdate = searchParams.get('payUdate');
  const planName = searchParams.get('planName');

  const formattedDate = payUdate
    ? new Date(payUdate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'N/A';

  const navigate = useNavigate();
  const handleTryClick = () => navigate('/points-plans');
  const handleClick = () => navigate(baseToPath(getActiveBase()));

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        maxWidth: '420px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
        boxShadow: '0 10px 30px rgba(220,38,38,0.12)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8v4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 style={{ color: '#DC2626', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Payment Failed!</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{formattedDate}</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#F3F4F6', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <Row label="Transaction ID" value={mihpayid} />
        <Row label="Plan" value={planName} />
        <Row label="Amount" value={`â‚¹ ${amount}`} />
        <Row
          label="Status"
          value={
            <span style={{ color: '#DC2626', fontWeight: 600, backgroundColor: '#FEE2E2', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.875rem' }}>
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

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleTryClick}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        <button
          onClick={handleClick}
          style={{
            flex: 1,
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #D1D5DB',
            padding: '0.75rem',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
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

export default PaymentFailurePoints;
