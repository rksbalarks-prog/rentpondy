/**
 * City-base ('PY' = Pondicherry, 'CH' = Chennai) helpers for the user app.
 *
 * The "active base" is whichever city the user is currently browsing. It is
 * derived from the URL (`/pondicherry` -> PY, `/chennai` -> CH), mirrored into
 * localStorage, and read back by the axios interceptor so every API call to
 * the backend automatically carries `?base=PY|CH`.
 */

import axios from 'axios';

export const BASES = ['PY', 'CH'];
const STORAGE_KEY = 'activeBase';

/** URL path for a base. */
export const baseToPath = (base) => (base === 'CH' ? '/chennai' : '/pondicherry');

/** Human-readable city name for a base. */
export const baseToCity = (base) => (base === 'CH' ? 'Chennai' : 'Pondicherry');

/** Derive the base from a URL pathname, or null if the path is not city-specific. */
export const pathToBase = (pathname) => {
  const p = String(pathname || '').toLowerCase();
  if (p.startsWith('/chennai')) return 'CH';
  if (p.startsWith('/pondicherry')) return 'PY';
  return null;
};

/** Read the active base from localStorage. Defaults to 'PY'. */
export const getActiveBase = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'CH' ? 'CH' : 'PY';
  } catch (e) {
    return 'PY';
  }
};

/** Persist the active base ('PY' or 'CH'; anything else is treated as 'PY'). */
export const setActiveBase = (base) => {
  try {
    localStorage.setItem(STORAGE_KEY, base === 'CH' ? 'CH' : 'PY');
  } catch (e) {
    /* ignore storage errors (private mode etc.) */
  }
};

/**
 * Sync the active base from a URL pathname when that path is city-specific.
 * Returns the resulting active base. Call this once on app startup so a direct
 * load / refresh on `/chennai` picks the right base before any data fetch.
 */
export const syncBaseFromPath = (pathname) => {
  const fromPath = pathToBase(pathname);
  if (fromPath) setActiveBase(fromPath);
  return getActiveBase();
};

/**
 * Register a global axios request interceptor that appends `?base=PY|CH` to
 * every request sent to our backend (REACT_APP_API_URL). Idempotent.
 */
let interceptorRegistered = false;
export const registerBaseInterceptor = () => {
  if (interceptorRegistered) return;
  interceptorRegistered = true;

  const API = process.env.REACT_APP_API_URL || '';

  axios.interceptors.request.use((config) => {
    try {
      const url = config.url || '';
      // Only tag calls to our own backend; leave third-party requests untouched.
      if (API && url.startsWith(API)) {
        config.params = { ...(config.params || {}), base: getActiveBase() };
      }
    } catch (e) {
      /* never let the interceptor break a request */
    }
    return config;
  });
};
