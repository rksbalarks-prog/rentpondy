import React from 'react';
import { FaMapMarkerAlt, FaUmbrellaBeach, FaArrowRight, FaTimes } from 'react-icons/fa';
import './LocalTouristPopup.css';

/*
 * Post-login choice popup: "Local" vs "Tourist".
 *   - Local   → All Property listing for the user's city  (baseToPath → /pondicherry | /chennai)
 *   - Tourist → Tourist Place page                         (/exclusiveDetail)
 *
 * Replaces the old "other products" popup shown after login. Classes are
 * prefixed `lt-` and the CSS is self-contained so it can't clash with the
 * app's Bootstrap / global styles.
 */

const LocalTouristPopup = ({ onLocal, onTourist, onClose }) => {
  const choices = [
    {
      id: 'local',
      icon: <FaMapMarkerAlt />,
      color: '#2E7D32',
      title: 'Local',
      note: '- Commercial - Residential',
      description: 'Rental Properties for House and Businesses',
      cta: 'View All Property',
      onClick: onLocal,
    },
    {
      id: 'tourist',
      icon: <FaUmbrellaBeach />,
      color: '#FF7043',
      title: 'Tourist',
      description: 'Find all the listed tourist property (all types of hotels, resorts, dormitory…)',
      cta: 'Find Place To Stay',
      onClick: onTourist,
    },
  ];

  return (
    <div
      className="lt-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Choose Local or Tourist"
    >
      <div className="lt-modal">
        <button type="button" className="lt-close" aria-label="Close" onClick={onClose}>
          <FaTimes />
        </button>

        <header className="lt-header">
          <h2 className="lt-title">Where would you like to go?</h2>
          <p className="lt-subtitle">You're logged in 🎉 Pick how you want to explore.</p>
        </header>

        <div className="lt-cards">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className="lt-card"
              style={{ '--lt-accent': c.color }}
              onClick={c.onClick}
              aria-label={c.cta}
            >
              <span className="lt-icon" style={{ background: c.color }}>{c.icon}</span>
              <span className="lt-card-body">
                <span className="lt-card-title">
                  {c.title}{c.note && <> <span className="lt-card-note">{c.note}</span></>}
                </span>
                <span className="lt-card-sub">
                  <span className="lt-card-desc">{c.description}</span>
                  <span className="lt-card-cta">
                    <span className="lt-cta-text">{c.cta}</span>
                    <FaArrowRight />
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalTouristPopup;
