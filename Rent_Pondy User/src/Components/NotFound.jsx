// Catch-all page for URLs the router does not know.
//
// Replaces the bare <div>Nopage</div> that the "*" route used to render. That
// screen is what a visitor saw after clicking the Google result for
// "rent pondy" — Google had the legacy /index.html URL indexed, nginx served
// the SPA shell for it, and React Router fell through to the catch-all.
//
// /index.html itself is now redirected (nginx 301, plus a <Navigate> route in
// RouterPage), so this page is only for genuinely unknown paths: old links,
// typos, removed pages. It is noindex so Google drops these URLs instead of
// treating them as thin content.
//
// Note: Components/Nopage.jsx is intentionally left alone — Main.jsx still uses
// it as the default case of its tab-content switch, where full-page 404 markup
// and a noindex tag would be wrong.

import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';

const BRAND = '#4F4B7E';

const linkStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  margin: '6px',
  borderRadius: 8,
  border: `1px solid ${BRAND}`,
  color: BRAND,
  background: '#fff',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 500,
};

const primaryLinkStyle = {
  ...linkStyle,
  color: '#fff',
  background: BRAND,
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <Seo
        title="Page not found | RentPondy"
        description="This page could not be found. Browse houses, apartments, commercial spaces and land for rent in Pondicherry and Chennai on RentPondy."
        canonical="https://rentpondy.com/"
        noindex
      />

      <img
        src="/rentpondylogo.png"
        alt="RentPondy"
        width={72}
        height={72}
        style={{ marginBottom: 20 }}
      />

      <div style={{ fontSize: 56, fontWeight: 700, color: BRAND, lineHeight: 1 }}>404</div>

      <h1 style={{ fontSize: 20, fontWeight: 600, margin: '14px 0 8px', color: '#1f2937' }}>
        This page could not be found
      </h1>

      <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 420, margin: '0 0 22px' }}>
        The link may be old or mistyped. The properties are all still here — pick a city below.
      </p>

      <div>
        <Link to="/" style={primaryLinkStyle}>
          Go to home
        </Link>
        <Link to="/pondicherry" style={linkStyle}>
          Rentals in Pondicherry
        </Link>
        <Link to="/chennai" style={linkStyle}>
          Rentals in Chennai
        </Link>
      </div>
    </div>
  );
}
