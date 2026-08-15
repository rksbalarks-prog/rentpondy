import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft, FaCoins, FaArrowDown, FaArrowUp, FaWallet, FaSyncAlt,
  FaUndo, FaTimes,
} from 'react-icons/fa';

// Classify a transaction into a presentation category. Mirrors the
// admin-panel logic so the user-facing labels match what support sees.
const classify = (t) => {
  if (t.note && /^MANUAL-ADJUST/i.test(t.note)) return 'manual';
  if (t.note && /^REFUND/i.test(t.note))         return 'refund';
  if (t.type === 'credit' && t.txnId) return 'purchase';
  if (t.type === 'deduct' && t.reason === 'view-owner-contact') return 'reveal';
  if (t.type === 'deduct' && t.reason === 'view-tenant-contact') return 'tenantReveal';
  return t.type;
};

const LABEL = {
  purchase: { text: 'Points purchase',  bg: '#E6F4EA', fg: '#137333' },
  reveal:   { text: 'Owner contact',     bg: '#EAF2FF', fg: '#1A5DBA' },
  tenantReveal: { text: 'Tenant contact', bg: '#E8F8F5', fg: '#0E7C6B' },
  refund:   { text: 'Refund',            bg: '#E0F2F1', fg: '#00796B' },
  manual:   { text: 'Manual adjustment', bg: '#FFF4D6', fg: '#7A5B00' },
  credit:   { text: 'Credit',            bg: '#E6F4EA', fg: '#137333' },
  deduct:   { text: 'Deduct',            bg: '#FDECEA', fg: '#A53149' },
};

const REFUND_PILL = {
  pending:  { text: 'Refund pending',  bg: '#FFF4D6', fg: '#7A5B00' },
  approved: { text: 'Refund approved', bg: '#E6F4EA', fg: '#137333' },
  rejected: { text: 'Refund rejected', bg: '#FDECEA', fg: '#A53149' },
};

const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return String(d);
  }
};

const PointsHistory = () => {
  const navigate = useNavigate();
  const phoneNumber = localStorage.getItem('phoneNumber') || '';

  const [balance, setBalance] = useState(null);
  const [totals, setTotals]   = useState({ totalEarned: 0, totalSpent: 0, totalPaid: 0 });
  const [txns, setTxns]       = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Refund modal state.
  const [refundFor, setRefundFor]               = useState(null);
  const [refundReason, setRefundReason]         = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundError, setRefundError]           = useState('');

  const fetchAll = async () => {
    if (!phoneNumber) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const API = process.env.REACT_APP_API_URL;
      const [balRes, txnRes, refundRes] = await Promise.all([
        axios.get(`${API}/points-balance/${phoneNumber}`),
        axios.get(`${API}/points-transactions/${phoneNumber}`, { params: { limit: 200 } }),
        axios.get(`${API}/points-refund-requests/${phoneNumber}`, { params: { limit: 200 } })
             .catch(() => ({ data: { requests: [] } })),
      ]);
      setBalance(Number(balRes.data?.balance ?? 0));
      setTotals({
        totalEarned: Number(balRes.data?.totalEarned ?? 0),
        totalSpent:  Number(balRes.data?.totalSpent  ?? 0),
        totalPaid:   Number(balRes.data?.totalPaid   ?? 0),
      });
      setTxns(Array.isArray(txnRes.data?.transactions) ? txnRes.data.transactions : []);
      setRefunds(Array.isArray(refundRes.data?.requests) ? refundRes.data.requests : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load points history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map transactionId → most-relevant refund (pending > approved > rejected)
  // so each contact-reveal row knows whether to show a button or a pill.
  const refundByTxn = useMemo(() => {
    const m = new Map();
    const rank = (s) => (s === 'pending' ? 3 : s === 'approved' ? 2 : 1);
    refunds.forEach((r) => {
      const id = String(r.transactionId);
      const prev = m.get(id);
      if (!prev || rank(r.status) > rank(prev.status)) m.set(id, r);
    });
    return m;
  }, [refunds]);

  // Group transactions by calendar day for a tidy visual list.
  const groups = useMemo(() => {
    const map = new Map();
    for (const t of txns) {
      const key = (t.createdAt || '').slice(0, 10) || 'unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [txns]);

  const openRefund = (t) => {
    setRefundFor(t);
    setRefundReason('');
    setRefundError('');
  };

  const closeRefund = () => {
    if (refundSubmitting) return;
    setRefundFor(null);
    setRefundReason('');
    setRefundError('');
  };

  const submitRefund = async () => {
    if (!refundFor) return;
    if (!refundReason.trim()) {
      setRefundError('Please enter a reason for the refund.');
      return;
    }
    setRefundSubmitting(true);
    setRefundError('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/points-refund-request`, {
        phoneNumber,
        transactionId: refundFor._id,
        reason: refundReason.trim(),
      });
      setRefundFor(null);
      setRefundReason('');
      await fetchAll();
    } catch (e) {
      setRefundError(e?.response?.data?.message || e.message || 'Failed to submit');
    } finally {
      setRefundSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: 500, margin: '0 auto', padding: 0, paddingBottom: 24,
      fontFamily: 'Segoe UI, sans-serif', background: '#F7F7FB', minHeight: '100vh',
    }}>
      {/* Header bar with back + refresh */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#EFEFEF', padding: '10px 12px',
      }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          style={{
            background: '#f0f0f0', border: 'none',
            padding: '8px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
        >
          <FaChevronLeft style={{ color: '#30747F' }} />
        </button>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#222' }}>
          Points History
        </h3>
        <button
          onClick={fetchAll}
          aria-label="Refresh"
          disabled={loading}
          style={{
            background: '#fff', border: '1px solid #ddd', borderRadius: 8,
            padding: '6px 10px', cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#4F4B7E', fontSize: 12, fontWeight: 600,
          }}
        >
          <FaSyncAlt size={11} style={{ animation: loading ? 'ph-spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Balance summary card */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 60%, #FFC857 130%)',
          color: '#fff',
          borderRadius: 16,
          padding: '18px 18px 16px',
          boxShadow: '0 12px 24px rgba(79,75,126,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFE680 0%, #FFD700 45%, #E09F00 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.18)',
            }}>
              <FaCoins size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.9 }}>
                Available balance
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.1, letterSpacing: -0.5 }}>
                  {balance ?? '—'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  pts
                </span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
            marginTop: 10, fontSize: 11.5,
          }}>
            <Stat label="Earned"  value={totals.totalEarned} />
            <Stat label="Spent"   value={totals.totalSpent} />
            <Stat label="Paid"    value={`₹${totals.totalPaid}`} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={() => navigate('/points-plans')}
              style={{
                flex: 1, padding: '10px 12px',
                border: 'none', borderRadius: 10,
                background: '#fff', color: '#4F4B7E',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <FaWallet size={13} /> Buy more points
            </button>
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#444', margin: '6px 4px 10px', letterSpacing: 0.3 }}>
          Recent activity
        </div>

        {loading && (
          <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>Loading…</div>
        )}
        {!loading && error && (
          <div style={{
            padding: 14, borderRadius: 12, fontSize: 13,
            background: '#FDECEA', color: '#A53149', textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        {!loading && !error && txns.length === 0 && (
          <div style={{
            padding: 28, textAlign: 'center',
            background: '#fff', borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              No points activity yet.
            </div>
            <button
              onClick={() => navigate('/points-plans')}
              style={{
                padding: '8px 18px', border: 'none', borderRadius: 20,
                background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Buy your first points pack
            </button>
          </div>
        )}

        {!loading && !error && groups.map(([day, items]) => (
          <div key={day} style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
              textTransform: 'uppercase', color: '#888', margin: '6px 4px 6px',
            }}>
              {day === 'unknown' ? '—' : new Date(day).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </div>
            <div style={{
              background: '#fff', borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              {items.map((t, idx) => {
                const cls = classify(t);
                const tag = LABEL[cls] || { text: cls, bg: '#eee', fg: '#333' };
                const isCredit = t.type === 'credit';
                const isReveal = cls === 'reveal' || cls === 'tenantReveal';
                const refund   = isReveal ? refundByTxn.get(String(t._id)) : null;
                const pill     = refund ? REFUND_PILL[refund.status] : null;

                return (
                  <div
                    key={t._id || idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      borderTop: idx === 0 ? 'none' : '1px solid #F2F2F2',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: isCredit ? '#E6F4EA' : '#FDECEA',
                      color: isCredit ? '#137333' : '#A53149',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isCredit ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          background: tag.bg, color: tag.fg,
                          fontSize: 11, fontWeight: 700,
                          padding: '2px 8px', borderRadius: 10,
                          letterSpacing: 0.3,
                        }}>
                          {tag.text}
                        </span>
                        {t.planName && (
                          <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>
                            {t.planName}
                          </span>
                        )}
                        {pill && (
                          <span style={{
                            background: pill.bg, color: pill.fg,
                            fontSize: 10.5, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 10,
                            letterSpacing: 0.3,
                          }}>
                            {pill.text}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#888', marginTop: 3 }}>
                        {fmtDate(t.createdAt)}
                        {t.rentId != null && (
                          <span>
                            {' '}· {cls === 'tenantReveal' ? 'tenant id' : 'rentId'}{' '}
                            {String(t.rentId)}
                          </span>
                        )}
                        {t.amount && (
                          <span> · ₹{t.amount}</span>
                        )}
                      </div>
                      {isReveal && !refund && (
                        <button
                          onClick={() => openRefund(t)}
                          style={{
                            marginTop: 6,
                            background: '#fff',
                            border: '1px solid #4F4B7E',
                            color: '#4F4B7E',
                            fontSize: 11.5, fontWeight: 700,
                            padding: '4px 10px', borderRadius: 14,
                            cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                          }}
                        >
                          <FaUndo size={10} /> Request refund
                        </button>
                      )}
                    </div>
                    <div style={{
                      textAlign: 'right',
                      color: isCredit ? '#137333' : '#A53149',
                      fontWeight: 800, fontSize: 15,
                      minWidth: 64,
                    }}>
                      {isCredit ? '+' : '−'}{t.points}
                      <div style={{ fontSize: 10, color: '#888', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                        bal {t.balanceAfter}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Refund request modal */}
      {refundFor && (
        <div
          onClick={closeRefund}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 14,
              width: '100%', maxWidth: 420,
              padding: '18px 18px 16px',
              boxShadow: '0 14px 28px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#222' }}>
                Request refund
              </h4>
              <button
                onClick={closeRefund}
                disabled={refundSubmitting}
                aria-label="Close"
                style={{
                  background: 'transparent', border: 'none',
                  cursor: refundSubmitting ? 'not-allowed' : 'pointer',
                  color: '#888',
                }}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div style={{
              background: '#F7F7FB', borderRadius: 10,
              padding: '10px 12px', fontSize: 13, color: '#444',
              marginBottom: 12,
            }}>
              Refund <b>{refundFor.points} pts</b>
              {refundFor.rentId != null && (
                <>
                  {' '}for{' '}
                  {classify(refundFor) === 'tenantReveal' ? 'tenant' : 'property'}{' '}
                  <b>{String(refundFor.rentId)}</b>
                </>
              )}
              ?
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                {fmtDate(refundFor.createdAt)}
              </div>
            </div>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>
              Reason <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => { setRefundReason(e.target.value); if (refundError) setRefundError(''); }}
              placeholder="e.g. Property already sold, wrong details, owner not responding"
              disabled={refundSubmitting}
              style={{
                width: '100%', marginTop: 6,
                padding: 10, fontSize: 13,
                borderRadius: 10,
                border: refundError ? '1px solid #D32F2F' : '1px solid #ddd',
                resize: 'vertical', fontFamily: 'inherit',
              }}
            />

            {refundError && (
              <div style={{
                marginTop: 10,
                padding: '8px 10px', borderRadius: 8,
                background: '#FDECEA', color: '#A53149', fontSize: 12,
              }}>
                {refundError}
              </div>
            )}

            <div style={{
              display: 'flex', gap: 8, marginTop: 14,
            }}>
              <button
                onClick={closeRefund}
                disabled={refundSubmitting}
                style={{
                  flex: 1, padding: '10px 12px',
                  border: '1px solid #ddd', borderRadius: 10,
                  background: '#fff', color: '#444',
                  fontWeight: 700, fontSize: 13,
                  cursor: refundSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitRefund}
                disabled={refundSubmitting}
                style={{
                  flex: 1, padding: '10px 12px',
                  border: 'none', borderRadius: 10,
                  background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                  color: '#fff', fontWeight: 800, fontSize: 13,
                  cursor: refundSubmitting ? 'wait' : 'pointer',
                  opacity: refundSubmitting ? 0.7 : 1,
                }}
              >
                {refundSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ph-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div style={{
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 10,
    padding: '8px 10px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.85 }}>
      {label}
    </div>
    <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{value ?? 0}</div>
  </div>
);

export default PointsHistory;
