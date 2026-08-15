// ClarityTracker.jsx
// ------------------------------------------------------------------
// Renders nothing. Mounted once inside <Router> in App.js so it can
// watch route changes and tell Microsoft Clarity which admin is on
// which screen. Without this the whole dashboard would look like a
// single page to Clarity (it's an SPA — the URL changes but the
// document never reloads).
//
// See src/utils/clarity.js for setup and privacy notes.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { identifyAdmin, setClarityTag, isClarityEnabled } from './utils/clarity';

// "/dashboard/login-report" → "Login Report"
const friendlyPageName = (pathname) => {
  const last = (pathname || '').split('/').filter(Boolean).pop() || 'home';
  return last
    .replace(/[-_.]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const ClarityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isClarityEnabled()) return;

    const path = location.pathname || '/';
    const page = friendlyPageName(path);

    // Re-identify on every navigation: this stamps the page onto the
    // session and picks up the admin right after they log in.
    identifyAdmin(page);
    setClarityTag('page', page);
    setClarityTag('path', path);
  }, [location.pathname]);

  return null;
};

export default ClarityTracker;
