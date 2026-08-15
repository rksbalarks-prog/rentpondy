import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import { initiatePointsPayment } from './PayUPointsPayment/initiatePointsPayment';

const FALLBACK_PLANS = [
  { _id: 'points-100',  name: 'Starter',  price: 100, points: 100,  durationDays: 30, description: 'Great for trying things out' },
  { _id: 'points-200',  name: 'Standard', price: 200, points: 200,  durationDays: 60, description: 'Most common choice', popular: true },
  { _id: 'points-900',  name: 'Pro',      price: 900, points: 1000, durationDays: 180, description: 'Best value — 10% extra points' },
];

export default function PointsPlans() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState(FALLBACK_PLANS);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef(null);
  const cardRefs = useRef([]);

  const phoneNumber = location.state?.phoneNumber || localStorage.getItem('phoneNumber') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/points-plans`);
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setCardData(res.data);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!phoneNumber) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/points-balance/${phoneNumber}`);
        if (!cancelled) setBalance(res.data?.balance ?? 0);
      } catch {
        if (!cancelled) setBalance(0);
      }
    })();
    return () => { cancelled = true; };
  }, [phoneNumber]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        let nearest = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((node, i) => {
          if (!node) return;
          const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
          const dist = Math.abs(nodeCenter - center);
          if (dist < bestDist) { bestDist = dist; nearest = i; }
        });
        setActiveIndex(nearest);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [cardData.length]);

  const goToCard = (index) => {
    const node = cardRefs.current[index];
    const el = scrollerRef.current;
    if (!node || !el) return;
    const target = node.offsetLeft - (el.clientWidth - node.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleBuyPoints = async (card, index) => {
    if (!phoneNumber) {
      setMessage({ text: 'Please login first', type: 'error' });
      navigate('/login');
      return;
    }
    if (loadingIndex !== null) return;

    setLoadingIndex(index);
    try {
      // Skip the confirm popup and the intermediate PayU form — go straight
      // to PayU's hosted page.
      await initiatePointsPayment({
        phoneNumber,
        planName: card.name,
        planId: card._id,
        amount: card.price,
        points: card.points,
      });
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Failed to start payment.';
      setMessage({ text: errMsg, type: 'error' });
      setLoadingIndex(null);
    }
  };

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ];

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0" style={{ overflowX: 'hidden' }}>
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%', overflowX: 'hidden' }}>
        <div className="row g-2 w-100">
          <div className="d-flex align-items-center w-100 p-2" style={{ background: '#EFEFEF' }}>
            <button
              onClick={handleBackNavigation}
              className="pe-5"
              style={{
                backgroundColor: '#f0f0f0',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaChevronLeft style={{ color: '#30747F' }} />
            </button>
            <h3 className="m-0" style={{ fontSize: '16px' }}>Points Plans</h3>
          </div>

          <div className="text-center mb-2 px-3 w-100">
            <p className="lead mb-1 pt-2" style={{ fontSize: '14px', color: '#666', fontWeight: 500, lineHeight: 1.6 }}>
              Buy points to unlock owner contact details. Each contact reveal costs <b>10 points</b>.
            </p>
            {balance !== null && (
              <div
                className="d-inline-block mt-2 px-3 py-2"
                style={{ background: '#EEF0FF', color: '#4F4B7E', borderRadius: 20, fontWeight: 600 }}
              >
                Your balance: {balance} points
              </div>
            )}
          </div>

          {message && (
            <p className="text-bold mt-2" style={{ color: message.type === 'success' ? 'green' : 'red', textAlign: 'center' }}>
              {message.text}
            </p>
          )}

          <style>{`
            .pp-scroller::-webkit-scrollbar { display: none; height: 0; width: 0; }
            .pp-scroller { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          <div className="w-100" style={{ overflow: 'hidden', position: 'relative' }}>
          <div
            ref={scrollerRef}
            className="pp-scroller"
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 14,
              overflowX: 'auto',
              overflowY: 'visible',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              paddingTop: 20,
              paddingBottom: 28,
              paddingLeft: 'max(16px, calc((100% - 240px) / 2))',
              paddingRight: 'max(16px, calc((100% - 240px) / 2))',
              scrollPaddingInline: 'max(16px, calc((100% - 240px) / 2))',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {cardData.map((card, index) => {
              const isActive = activeIndex === index;
              const isPopular = card.popular || index === 1;
              return (
                <div
                  key={card._id || index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  style={{
                    flex: '0 0 240px',
                    width: 240,
                    scrollSnapAlign: 'center',
                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
                    transform: isActive ? 'scale(1)' : 'scale(0.92)',
                    opacity: isActive ? 1 : 0.7,
                    paddingTop: isPopular ? 14 : 0,
                  }}
                >
                  <div
                    className="rounded-4 border-0"
                    style={{
                      position: 'relative',
                      background: gradients[index % gradients.length],
                      padding: 3,
                      borderRadius: 22,
                      boxShadow: isActive ? '0 18px 40px rgba(79,75,126,0.22)' : '0 8px 20px rgba(79,75,126,0.12)',
                      transition: 'box-shadow 0.35s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => goToCard(index)}
                  >
                    {isPopular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(135deg, #FFD27A, #FF8A3D)',
                          color: '#fff',
                          padding: '5px 14px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                          boxShadow: '0 6px 14px rgba(255,138,61,0.45)',
                          whiteSpace: 'nowrap',
                          zIndex: 3,
                        }}
                      >
                        ★ MOST POPULAR
                      </div>
                    )}

                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 19,
                        padding: '22px 20px 20px',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                        <h4 style={{ color: '#2A2750', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: '-0.3px' }}>
                          {card.name}
                        </h4>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.6px',
                            color: '#9D99C2',
                            background: '#F2F1FA',
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}
                        >
                          {card.points} PTS
                        </span>
                      </div>

                      <p style={{ fontSize: 12, color: '#8A87A8', margin: '0 0 14px', fontWeight: 500, lineHeight: 1.4 }}>
                        Reveal {Math.floor((card.points || 0) / 10)} owner contacts
                      </p>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                        <span style={{ fontSize: 14, color: '#4F4B7E', fontWeight: 600 }}>₹</span>
                        <h2
                          style={{
                            fontSize: 36,
                            margin: 0,
                            color: '#2A2750',
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: '-1px',
                          }}
                        >
                          {card.price}
                        </h2>
                        <span style={{ fontSize: 11, color: '#A6A3C2', fontWeight: 500, marginLeft: 4 }}>one time</span>
                      </div>

                      <div
                        style={{
                          background: 'linear-gradient(135deg, rgba(102,126,234,0.06), rgba(245,87,108,0.06))',
                          padding: '10px 12px',
                          borderRadius: 12,
                          marginBottom: 16,
                          border: '1px solid rgba(102,126,234,0.10)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#764ba2' }} />
                          <span style={{ color: '#4F4B7E', fontSize: 12, fontWeight: 600 }}>
                            {card.points} points
                          </span>
                        </div>
                        {card.durationDays && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f5576c' }} />
                            <span style={{ color: '#4F4B7E', fontSize: 12, fontWeight: 600 }}>
                              Valid for {card.durationDays} days
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        style={{
                          width: '100%',
                          background: hoverIndex === index
                            ? 'linear-gradient(135deg, #5b5790 0%, #8459b5 100%)'
                            : 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          border: 'none',
                          borderRadius: 999,
                          padding: '12px 18px',
                          letterSpacing: '0.8px',
                          boxShadow: '0 8px 18px rgba(79,75,126,0.30)',
                          transition: 'all 0.25s ease',
                          cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                          opacity: loadingIndex === index ? 0.7 : 1,
                        }}
                        onClick={(e) => { e.stopPropagation(); handleBuyPoints(card, index); }}
                        disabled={loadingIndex === index}
                      >
                        {loadingIndex === index ? 'Processing…' : 'BUY POINTS'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ gap: 6, marginTop: -6, marginBottom: 16 }}
          >
            {cardData.map((_, i) => (
              <button
                key={i}
                onClick={() => goToCard(i)}
                aria-label={`Go to plan ${i + 1}`}
                style={{
                  width: activeIndex === i ? 22 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: 'none',
                  padding: 0,
                  background: activeIndex === i
                    ? 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)'
                    : '#D8D5E8',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
