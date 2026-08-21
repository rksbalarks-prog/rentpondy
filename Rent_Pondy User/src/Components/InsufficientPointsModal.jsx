import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCoins, FaLock, FaRocket, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { initiatePointsPayment } from './PayUPointsPayment/initiatePointsPayment';

// Last-resort plan, used only when /points-config-public cannot be reached.
// Normally the plans shown here are the ones an admin picked on
// Points Pricing > No Points Popup - Plans in the admin panel.
const DEFAULT_STARTER_PLAN = {
  _id: 'points-100',
  name: 'Starter',
  price: 100,
  points: 100,
};

const SPARKLES = [
  { top: '8%',  left: '18%', size: 10, delay: '0s',   duration: '2.4s' },
  { top: '14%', left: '78%', size: 12, delay: '0.6s', duration: '2.8s' },
  { top: '48%', left: '10%', size: 8,  delay: '1.1s', duration: '2.2s' },
  { top: '56%', left: '86%', size: 9,  delay: '0.3s', duration: '2.6s' },
  { top: '72%', left: '22%', size: 7,  delay: '1.4s', duration: '2.0s' },
  { top: '26%', left: '50%', size: 6,  delay: '0.9s', duration: '2.3s' },
];

export default function InsufficientPointsModal({ show, onHide, balance = 0, required = 10 }) {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Plans the admin chose for this popup (Points Pricing > No Points Popup).
  // Empty until the fetch lands; DEFAULT_STARTER_PLAN covers the failure case
  // so the buy button is never dead.
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState('');

  // Fetched each time the popup opens rather than once on mount: the admin can
  // change the selection at any moment, and this is a rare, cheap call.
  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/points-config-public`
        );
        const list = Array.isArray(res.data?.popupPlans) ? res.data.popupPlans : [];
        if (cancelled || !list.length) return;
        setPlans(list);
        setPlanId(String(list[0]._id));
      } catch (err) {
        // Offline or endpoint down — keep the hardcoded starter plan.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [show]);

  const activePlan =
    plans.find((p) => String(p._id) === planId) || plans[0] || DEFAULT_STARTER_PLAN;

  const goToPayU = async () => {
    const phoneNumber = localStorage.getItem('phoneNumber') || '';
    if (!phoneNumber) {
      onHide?.();
      navigate('/login');
      return;
    }
    try {
      setErrorMsg('');
      setPaying(true);
      // Skip the intermediate PayU form — go straight to PayU's hosted page.
      await initiatePointsPayment({
        phoneNumber,
        planName: activePlan.name,
        planId: String(activePlan._id),
        amount: activePlan.price,
        points: activePlan.points,
      });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to start payment.';
      setErrorMsg(msg);
      setPaying(false);
    }
  };

  const goToPlans = () => {
    onHide?.();
    navigate('/points-plans');
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="insufficient-points-modal">
      <Modal.Body style={{ padding: 0, borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
        <div className="ip-border-glow" aria-hidden="true" />

        <div
          className="ip-header"
          style={{
            padding: '26px 20px 22px',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
              filter: 'blur(2px)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -70,
              left: -30,
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              filter: 'blur(2px)',
            }}
          />

          {SPARKLES.map((s, i) => (
            <FaStar
              key={i}
              aria-hidden="true"
              className="ip-sparkle"
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                color: '#FFE680',
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}

          <div className="ip-coin-halo" aria-hidden="true" />

          <div
            className="ip-coin-wrap"
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFE680 0%, #FFD700 45%, #FFA500 100%)',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(255,165,0,0.55), inset 0 -5px 10px rgba(0,0,0,0.15)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <FaCoins size={32} color="#fff" style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))', position: 'relative', zIndex: 2 }} />
            <span className="ip-coin-ring" aria-hidden="true" />
            <span
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#fff',
                color: '#f5576c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                zIndex: 3,
              }}
            >
              <FaLock size={11} />
            </span>
          </div>

          <h4 className="ip-title" style={{ fontWeight: 800, margin: 0, letterSpacing: 0.3, fontSize: 19 }}>
            Unlock Owner Contact
          </h4>
          <p style={{ margin: '4px 0 0', opacity: 0.95, fontSize: 12.5, fontWeight: 500, position: 'relative', zIndex: 2 }}>
            You need points to view this owner's details
          </p>
        </div>

        <div style={{ padding: '18px 20px 20px', background: '#fff', position: 'relative' }}>
          <div className="ip-stats-wrap">
            <div
              className="ip-stats"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 14,
                background: 'linear-gradient(135deg, rgba(102,126,234,0.10), rgba(245,87,108,0.10))',
                borderRadius: 12,
                padding: '11px 14px',
                marginBottom: 14,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10.5, color: '#888', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  Your Balance
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, color: '#4F4B7E', lineHeight: 1.2 }}>{balance} pts</div>
              </div>
              <div style={{ width: 1, height: 30, background: 'rgba(79,75,126,0.2)' }} />
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10.5, color: '#888', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  Required
                </div>
                <div
                  className="ip-required"
                  style={{ fontSize: 19, fontWeight: 800, color: '#f5576c', lineHeight: 1.2 }}
                >
                  {required} pts
                </div>
              </div>
            </div>
          </div>

          {plans.length > 0 ? (
            <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
              {plans.map((p) => {
                const id = String(p._id);
                const on = id === planId;
                // One configured plan is information, not a choice — render it as
                // a plain summary row with nothing to click.
                const selectable = plans.length > 1;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={selectable ? () => setPlanId(id) : undefined}
                    disabled={!selectable}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 12,
                      textAlign: 'left',
                      cursor: selectable ? 'pointer' : 'default',
                      background: on
                        ? 'linear-gradient(135deg, rgba(79,75,126,0.10), rgba(245,87,108,0.10))'
                        : '#FAFAFC',
                      border: on
                        ? '2px solid #4F4B7E'
                        : '1px solid rgba(79,75,126,0.22)',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                    }}
                  >
                    <span>
                      <span
                        style={{
                          display: 'block',
                          fontWeight: 700,
                          fontSize: 13,
                          color: '#2F2C4A',
                        }}
                      >
                        {p.name}
                        {p.popular ? (
                          <span
                            style={{
                              marginLeft: 6,
                              padding: '1px 6px',
                              borderRadius: 20,
                              background: '#FFD700',
                              color: '#5A4500',
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing: 0.3,
                              verticalAlign: 'middle',
                            }}
                          >
                            POPULAR
                          </span>
                        ) : null}
                      </span>
                      <span style={{ fontSize: 11, color: '#777' }}>{p.points} points</span>
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#4F4B7E' }}>
                      ₹{p.price}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#555', fontSize: 12.5, textAlign: 'center', marginBottom: 14, lineHeight: 1.45 }}>
              Pick a points pack and keep exploring properties. Packs start at just <b>₹100</b>.
            </p>
          )}

          <button
            onClick={goToPayU}
            disabled={paying}
            className="ip-cta"
            style={{
              width: '100%',
              padding: '12px 18px',
              border: 'none',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 50%, #f5576c 100%)',
              backgroundSize: '200% 200%',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: 0.3,
              cursor: paying ? 'not-allowed' : 'pointer',
              opacity: paying ? 0.75 : 1,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (paying) return;
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span className="ip-cta-shine" aria-hidden="true" />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <FaRocket />
              <span>
                {paying
                  ? 'Redirecting to PayU…'
                  : `Buy ${activePlan.points} Points · ₹${activePlan.price}`}
              </span>
            </span>
          </button>
          {errorMsg && (
            <p style={{ color: '#DC2626', fontSize: 12, textAlign: 'center', margin: '8px 0 0' }}>
              {errorMsg}
            </p>
          )}

          <button
            onClick={goToPlans}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '10px 18px',
              borderRadius: 12,
              background: '#fff',
              color: '#4F4B7E',
              border: '1px solid rgba(79,75,126,0.35)',
              fontWeight: 700,
              fontSize: 13.5,
              letterSpacing: 0.3,
              cursor: 'pointer',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#F3EEFA';
              e.currentTarget.style.borderColor = '#4F4B7E';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = 'rgba(79,75,126,0.35)';
            }}
          >
            More Plans
          </button>

          <button
            onClick={onHide}
            style={{
              width: '100%',
              marginTop: 4,
              padding: '6px 18px',
              border: 'none',
              borderRadius: 12,
              background: 'transparent',
              color: '#888',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Maybe later
          </button>
        </div>

        <style>{`
          @keyframes ip-border-glow {
            0%   { background-position:   0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position:   0% 50%; }
          }
          @keyframes ip-header-shift {
            0%   { background-position:   0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position:   0% 50%; }
          }
          @keyframes ip-title-shimmer {
            0%   { background-position: -150% center; }
            100% { background-position:  250% center; }
          }
          @keyframes ip-float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-6px); }
          }
          @keyframes ip-coin-ring {
            0%   { transform: scale(1);   opacity: 0.65; }
            100% { transform: scale(1.9); opacity: 0; }
          }
          @keyframes ip-coin-halo {
            0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
            50%      { opacity: 0.95; transform: translate(-50%, -50%) scale(1.12); }
          }
          @keyframes ip-sparkle-twinkle {
            0%, 100% { opacity: 0;    transform: scale(0.4) rotate(0deg); }
            50%      { opacity: 1;    transform: scale(1.1) rotate(180deg); }
          }
          @keyframes ip-stats-sweep {
            0%   { transform: translateX(-120%); }
            60%  { transform: translateX(120%); }
            100% { transform: translateX(120%); }
          }
          @keyframes ip-stats-border {
            0%   { background-position:   0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position:   0% 50%; }
          }
          @keyframes ip-required-pulse {
            0%, 100% { text-shadow: 0 0 0 rgba(245,87,108,0);   transform: scale(1); }
            50%      { text-shadow: 0 0 16px rgba(245,87,108,0.75); transform: scale(1.08); }
          }
          @keyframes ip-cta-pulse {
            0%, 100% {
              box-shadow: 0 10px 22px rgba(79,75,126,0.45), 0 0 0 0 rgba(245,87,108,0.55);
              background-position: 0% 50%;
            }
            50% {
              box-shadow: 0 16px 34px rgba(118,75,162,0.6), 0 0 0 12px rgba(245,87,108,0);
              background-position: 100% 50%;
            }
          }
          @keyframes ip-cta-shine {
            0%   { transform: translateX(-140%) skewX(-20deg); }
            60%  { transform: translateX(260%)  skewX(-20deg); }
            100% { transform: translateX(260%)  skewX(-20deg); }
          }

          .insufficient-points-modal {
            max-width: 380px;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .insufficient-points-modal .modal-content {
            border: none;
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 28px 70px rgba(79,75,126,0.45);
            background: transparent;
          }

          .ip-border-glow {
            position: absolute;
            inset: -2px;
            z-index: 0;
            border-radius: 22px;
            background: linear-gradient(130deg, #FFD700, #f5576c, #764ba2, #4F4B7E, #f5576c, #FFD700);
            background-size: 300% 300%;
            animation: ip-border-glow 6s ease infinite;
            filter: blur(6px);
            opacity: 0.85;
            pointer-events: none;
          }

          .ip-header {
            position: relative;
            z-index: 1;
            background: linear-gradient(135deg, #4F4B7E 0%, #764ba2 45%, #f5576c 100%);
            background-size: 200% 200%;
            animation: ip-header-shift 7s ease infinite;
          }

          .ip-title {
            position: relative;
            z-index: 2;
            background: linear-gradient(90deg, #fff 0%, #FFE680 25%, #fff 50%, #FFE680 75%, #fff 100%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: ip-title-shimmer 3.5s linear infinite;
          }

          .ip-coin-wrap {
            animation: ip-float 2.8s ease-in-out infinite;
          }

          .ip-coin-halo {
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,215,0,0.55) 0%, rgba(255,165,0,0.3) 40%, transparent 70%);
            animation: ip-coin-halo 2.4s ease-in-out infinite;
            z-index: 1;
            pointer-events: none;
          }

          .ip-coin-ring {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid rgba(255,215,0,0.8);
            animation: ip-coin-ring 2.2s ease-out infinite;
            pointer-events: none;
          }

          .ip-sparkle {
            animation-name: ip-sparkle-twinkle;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            filter: drop-shadow(0 0 6px rgba(255,230,128,0.9));
            z-index: 1;
            pointer-events: none;
          }

          .ip-stats-wrap {
            position: relative;
            border-radius: 14px;
            padding: 1.5px;
            margin-bottom: 14px;
            background: linear-gradient(130deg, #E9E4FB, #FDE1E8, #FFF4CC, #E9E4FB);
            background-size: 300% 300%;
            animation: ip-stats-border 5s ease infinite;
          }
          .ip-stats-wrap .ip-stats {
            margin-bottom: 0;
            background: linear-gradient(135deg, #FBF9FF 0%, #FFF6F8 100%);
          }
          .ip-stats::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 45%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.85), transparent);
            animation: ip-stats-sweep 3.2s ease-in-out infinite;
            pointer-events: none;
          }

          .ip-required {
            display: inline-block;
            animation: ip-required-pulse 1.6s ease-in-out infinite;
          }

          .ip-cta {
            animation: ip-cta-pulse 2.2s ease-in-out infinite;
          }
          .ip-cta-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 40%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
            animation: ip-cta-shine 2.4s ease-in-out infinite;
            pointer-events: none;
          }
        `}</style>
      </Modal.Body>
    </Modal>
  );
}
