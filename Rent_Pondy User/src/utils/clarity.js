/**
 * Microsoft Clarity — public user-site behaviour tracking.
 * ------------------------------------------------------------------
 * Session replays + heatmaps for rentpondy.com (the visitor-facing app).
 * Sessions are tied to the logged-in phone number so a Clarity recording
 * can be lined up with the same person in the admin "Live Activity"
 * screen — page labels come from the SAME map that feeds Live Activity
 * (utils/activityTracker.js), so the two views agree.
 *
 * This is a DIFFERENT Clarity project from the admin panel. The admin app
 * has its own ID in Rent_Pondy Admin/.env; mixing ~12k monthly visitors
 * with a handful of staff sessions would bury the staff data and force
 * every heatmap and metric to be filtered before it meant anything.
 *
 * SETUP
 *   1. Create a SECOND project at https://clarity.microsoft.com
 *      (Settings → Overview → "Clarity project ID").
 *   2. Put it in Rent_Pondy User/.env:
 *         REACT_APP_CLARITY_ID=xxxxxxxxxx
 *   3. `npm run build` and upload (CRA bakes env vars in at build time).
 *
 * With no REACT_APP_CLARITY_ID set, every function is a no-op and no
 * script is downloaded.
 *
 * PRIVACY
 *   Property pages show owner phone numbers. Set the masking mode in the
 *   Clarity dashboard (Settings → Masking); per-element overrides work in
 *   any mode:
 *      data-clarity-mask="true"   → never recorded
 *      data-clarity-unmask="true" → always recorded
 *   Password/OTP inputs are never recorded by Clarity.
 */

import { getActiveBase } from './cityBase';

const CLARITY_ID = (process.env.REACT_APP_CLARITY_ID || '').trim();

/** True when a project ID is configured — nothing runs without one. */
export const isClarityEnabled = () => Boolean(CLARITY_ID);

/** Safe call into the global clarity() queue; never throws. */
const call = (...args) => {
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      window.clarity(...args);
    }
  } catch (e) {
    /* analytics must never break the app */
  }
};

let injected = false;

/**
 * Inject the Clarity tag. Idempotent — safe to call more than once.
 * Called from src/index.js so the very first page view is recorded.
 */
export const initClarity = () => {
  if (!CLARITY_ID || injected || typeof window === 'undefined') return;
  injected = true;

  // Official bootstrap: define the queue stub synchronously so calls made
  // before the tag finishes downloading are replayed once it loads.
  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);

  // Returning visitor with a live login (page refresh) — tag them right away.
  identifyUser();
};

/** Attach a custom tag you can filter recordings by in the Clarity UI. */
export const setClarityTag = (key, value) => {
  if (!CLARITY_ID || value === undefined || value === null || value === '') return;
  call('set', String(key), String(value));
};

/** Record a named custom event (becomes a filterable Smart event). */
export const clarityEvent = (name) => {
  if (!CLARITY_ID || !name) return;
  call('event', String(name));
};

/**
 * Flag this session as high-priority so Clarity keeps the recording even
 * when it is sampling. Worth using on payment / lead flows.
 */
export const clarityUpgrade = (reason) => {
  if (!CLARITY_ID) return;
  call('upgrade', String(reason || 'important'));
};

/**
 * Reduce any stored phone to its last 10 digits.
 *
 * The app writes this key in more than one shape — Login/WebLogin store bare
 * 10 digits, MoblieViews stores `+91XXXXXXXXXX` when it picks the number out of
 * a ?phone= URL. Without normalising, the SAME person shows up in Clarity under
 * two different user_phone values and no filter catches both.
 */
const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : '';
};

/** Logged-in phone number, or '' when browsing as a guest. */
const readPhone = () => {
  try {
    // 'phoneNumber' is what Login.jsx writes; 'ppc_phone' is the older
    // cross-domain handoff key still set by MyAccount.jsx.
    return normalizePhone(
      localStorage.getItem('phoneNumber') ||
        localStorage.getItem('ppc_phone') ||
        ''
    );
  } catch (e) {
    return '';
  }
};

const readDevice = () => {
  try {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  } catch (e) {
    return '';
  }
};

/**
 * Tie the current Clarity session to the logged-in visitor.
 *
 * clarity("identify", customId, customSessionId, customPageId, friendlyName)
 * — customId is hashed by Clarity before storage; friendlyName is what shows
 * in the recordings list. Guests are left unidentified but still recorded,
 * and still get the city/page/device tags below.
 *
 * @param {string} [pageLabel]      friendly page name for this view
 * @param {string} [currentPhone]   authoritative phone from redux. Logging in
 *   does NOT change the URL (RouterPage swaps Login for App at the same path),
 *   so localStorage can still hold the PREVIOUS visitor's number at the moment
 *   this runs. When the caller knows the live value, it wins.
 */
export const identifyUser = (pageLabel, currentPhone) => {
  if (!CLARITY_ID) return;

  const phone =
    currentPhone !== undefined ? normalizePhone(currentPhone) : readPhone();
  if (phone) {
    call('identify', phone, undefined, pageLabel, phone);
    setClarityTag('user_phone', phone);
  }

  setClarityTag('logged_in', phone ? 'yes' : 'guest');
  setClarityTag('city', getActiveBase());
  setClarityTag('device', readDevice());
  setClarityTag('app_version', process.env.REACT_APP_APP_VERSION);
};

const clarityApi = {
  isClarityEnabled,
  initClarity,
  setClarityTag,
  clarityEvent,
  clarityUpgrade,
  identifyUser,
};

export default clarityApi;
