import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaHome,
  FaBuilding,
  FaHeart,
  FaBriefcase,
  FaUsers,
  FaArrowRight,
  FaTimes,
} from 'react-icons/fa';
import './OtherProductsPopup.css';

/*
 * "Other products" popup shown right after a successful login.
 * Design adapted from the standalone showcase panels:
 *   - PY  → E:\RPM\pondicherry\web  (Pondicherry Consultancy)
 *   - CH  → E:\RPM\pro              (Chennai Properties)
 * Classes are prefixed `op-` and the CSS is self-contained so it can't clash
 * with the app's Bootstrap / global styles.
 */

const isAndroid = () =>
  typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

// Build an Android `intent:` URL that opens the installed app (by package) and
// falls back to a web URL when the app isn't installed.
const buildAndroidIntentUrl = (webUrl, androidPackage, fallbackUrl) => {
  const hostAndPath = webUrl.replace(/^https?:\/\//, '');
  return (
    `intent://${hostAndPath}#Intent;scheme=https;package=${androidPackage};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl || webUrl)};end`
  );
};

// On Android try the native app first (with a web/store fallback); elsewhere
// just open the page in a new tab.
const openProduct = ({ webUrl, androidPackage, fallbackUrl }) => {
  if (androidPackage && isAndroid()) {
    window.location.href = buildAndroidIntentUrl(webUrl, androidPackage, fallbackUrl);
  } else {
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
};

// Product datasets — mirrored from the reference panels.
const PRODUCTS = {
  PY: {
    eyebrow: 'All about Pondicherry',
    title: 'Pondicherry Consultancy',
    subtitle: 'Rent, Property, Matrimony & Jobs — all in one place',
    items: [
      {
        id: 1,
        label: 'Rent Pondy',
        icon: <FaHome />,
        neonColor: '#FF6B35',
        description: 'Browse rental properties in Pondicherry',
        webUrl: 'https://rentpondy.com/login/pondicherry',
        androidPackage: 'com.apps.rentpondy',
        isSelf: true, // current app — hidden in the popup
      },
      {
        id: 2,
        label: 'Pondy Properties',
        icon: <FaBuilding />,
        neonColor: '#00D4FF',
        description: 'View all properties in Pondicherry',
        webUrl: 'https://ppcpondy.com/login/pondicherry',
        androidPackage: 'com.apps.ppcpondy',
      },
      {
        id: 3,
        label: 'Pondicherry Matrimony',
        icon: <FaHeart />,
        neonColor: '#F472B6',
        description: 'Find your perfect match in Pondicherry',
        webUrl: 'https://pondicherrymatrimony.com/index.php?r=home/welcome',
      },
      {
        id: 4,
        label: 'Pondy Job',
        icon: <FaBriefcase />,
        neonColor: '#34D399',
        description: 'Explore job openings in Pondicherry',
        webUrl: 'https://pondyjob.online',
      },
    ],
  },
  CH: {
    eyebrow: 'Premium Property Suite',
    title: 'Chennai Properties',
    subtitle: 'Rent, Sale, Marriage — all in one place',
    items: [
      {
        id: 1,
        label: 'Rent Chennai',
        icon: <FaHome />,
        neonColor: '#FF6B35',
        description: 'Browse rental properties in Chennai',
        webUrl: 'https://rentpondy.com/login/chennai',
        androidPackage: 'com.apps.rentpondy',
        fallbackUrl: 'https://play.google.com/store/apps/details?id=com.apps.rentpondy',
        isSelf: true, // current app — hidden in the popup
      },
      {
        id: 2,
        label: 'Chennai Properties',
        icon: <FaBuilding />,
        neonColor: '#00D4FF',
        description: 'View all properties in Chennai',
        webUrl: 'https://ppcpondy.com/login/chennai',
        androidPackage: 'com.apps.ppcpondy',
        fallbackUrl: 'https://play.google.com/store/apps/details?id=com.apps.ppcpondy',
      },
      {
        id: 3,
        label: 'Chennai Profiles',
        icon: <FaUsers />,
        neonColor: '#A78BFA',
        description: 'Manage Chennai user profiles',
        webUrl: 'https://chennaiprofile.in',
      },
    ],
  },
};

const IDLE_TIMEOUT_MS = 6000;

const OtherProductsPopup = ({ base = 'PY', onContinue }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const data = PRODUCTS[base] || PRODUCTS.PY;

  // Auto-dismiss after 6s of inactivity: if the user does nothing, continue
  // into the app. Any interaction with the popup resets the countdown.
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (onContinueRef.current) onContinueRef.current();
    }, IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  return (
    <div
      className="op-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onMouseMove={resetIdleTimer}
      onMouseDown={resetIdleTimer}
      onKeyDown={resetIdleTimer}
      onWheel={resetIdleTimer}
      onTouchStart={resetIdleTimer}
      onTouchMove={resetIdleTimer}
    >
      <div className="op-modal">
        {/* Animated background */}
        <div className="op-blob op-blob-1" />
        <div className="op-blob op-blob-2" />
        <div className="op-blob op-blob-3" />
        <div className="op-grid" />

        {/* Close */}
        <button
          type="button"
          className="op-close"
          aria-label="Close and continue"
          onClick={onContinue}
        >
          <FaTimes />
        </button>

        <div className="op-content">
          {/* Header */}
          <header className="op-header">
            <p className="op-eyebrow">✨ Explore our other products</p>
            <h1 className="op-title">
              <span className="op-title-gradient">{data.title}</span>
            </h1>
            <div className="op-accent-line" />
            <p className="op-subtitle">{data.subtitle}</p>
            <p className="op-note">
              You're logged in! 🎉 Along with Rent, we also offer these products —
              tap any to explore. This will continue automatically in a few seconds.
            </p>
          </header>

          {/* Cards — skip the current app (Rent Pondy / Rent Chennai) since the
              user is already in it. */}
          <div className="op-cards">
            {data.items.filter((product) => !product.isSelf).map((product, index) => (
              <div
                key={product.id}
                className={`op-card ${hoveredCard === product.id ? 'op-hovered' : ''}`}
                style={{ '--op-index': index, '--op-neon': product.neonColor }}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => openProduct(product)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${product.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProduct(product);
                  }
                }}
              >
                <div className="op-card-glow" />
                <div
                  className="op-card-gradient-bg"
                  style={{
                    background: `linear-gradient(135deg, ${product.neonColor}25, ${product.neonColor}08)`,
                  }}
                />

                <div className="op-card-inner">
                  <div className="op-card-top-row">
                    <div
                      className="op-icon-wrapper"
                      style={{
                        background: `linear-gradient(135deg, ${product.neonColor}, ${product.neonColor}80)`,
                      }}
                    >
                      <div className="op-icon-inner">{product.icon}</div>
                    </div>

                    <div className="op-card-text">
                      <h3 className="op-card-title">{product.label}</h3>
                      <p className="op-card-description">{product.description}</p>
                    </div>
                  </div>

                  <div className="op-card-footer">
                    <button
                      type="button"
                      className="op-cta"
                      tabIndex={-1}
                      style={{
                        background: `linear-gradient(135deg, ${product.neonColor}, ${product.neonColor}dd)`,
                      }}
                    >
                      <span>Explore</span>
                      <FaArrowRight className="op-arrow" />
                    </button>
                  </div>
                </div>

                <div className="op-shimmer" />
              </div>
            ))}
          </div>

          {/* Continue into the app */}
          <button type="button" className="op-continue" onClick={onContinue}>
            Continue to Rent Pondy
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherProductsPopup;
