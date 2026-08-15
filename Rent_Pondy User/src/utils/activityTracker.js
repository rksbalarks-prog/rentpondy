/**
 * Live activity tracker for the Rent Pondy user app.
 *
 * Records what a visitor does — which page they open and which meaningful
 * action they fire — and ships it to the backend so the admin
 * "Live User Activity" screen can watch it in near real time.
 *
 * Design rules:
 *  - Strictly additive. Nothing else in the app imports this; it hooks itself
 *    onto axios and the browser history from `src/index.js`.
 *  - Never throws, never blocks. Every path is wrapped so a tracking failure
 *    can never break a real user action.
 *  - Batched. Events are queued and flushed every FLUSH_MS (or when the queue
 *    fills / the tab is hidden) so we do not add a request per click.
 *  - Selective. Only page views and the endpoints in ACTION_MAP are recorded;
 *    the app's chatty polling calls (record-views, fetch, counts...) are ignored.
 */

import axios from 'axios';
import { getActiveBase } from './cityBase';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const TRACK_URL = `${API}/track-activity`;

const FLUSH_MS = 4000; // how often the queue is drained
const MAX_QUEUE = 10; // flush immediately once this many events are pending
const SESSION_KEY = 'rp_activity_session';

// Click-tracking guards: React can fire a handler twice and people rage-click,
// so identical clicks inside DEDUPE_MS collapse into one, and a hard ceiling
// stops a stuck finger from flooding the collection.
const CLICK_DEDUPE_MS = 800;
const CLICK_MAX_PER_MIN = 40;

let queue = [];
let timer = null;
let started = false;
let lastPath = '';
let lastClick = { key: '', at: 0 };
let clickWindow = { start: 0, count: 0 };

// ── identity ─────────────────────────────────────────────────────────────────

/** Stable id for this browser tab, so guests can still be followed. */
const sessionId = () => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (e) {
    return 's_anon';
  }
};

/** Logged-in phone number, or '' when browsing as a guest. */
const phone = () => {
  try {
    return localStorage.getItem('phoneNumber') || '';
  } catch (e) {
    return '';
  }
};

const device = () => {
  try {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  } catch (e) {
    return '';
  }
};

// ── page labels ──────────────────────────────────────────────────────────────
// Longest-prefix match against the URL path. Anything unmapped still gets
// recorded, just with the raw path as its label.
const PAGE_LABELS = [
  ['/pondicherry', 'Home (Pondicherry)'],
  ['/chennai', 'Home (Chennai)'],
  ['/home', 'Home'],
  ['/login', 'Login page'],
  ['/web-login', 'Login page (web)'],
  ['/mobileviews', 'Property list'],
  ['/most-viewed', 'Most viewed properties'],
  ['/property-map', 'Property map'],
  ['/details/', 'Property detail'],
  ['/detail/', 'Property detail'],
  ['/add-form', 'Add property (form)'],
  ['/add-property', 'Add property'],
  ['/add-car', 'Add property'],
  ['/add-plan', 'Add plan'],
  ['/add', 'Add property'],
  ['/add-stay', 'Add place to stay'],
  ['/stay/', 'Place to stay detail'],
  ['/exclusive-location', 'Place to stay list'],
  ['/exclusiveDetail', 'Place to stay detail'],
  ['/detail-buyer-assis-interest', 'Tenant assistance — interest'],
  ['/detail-buyer-assistance', 'Tenant assistance detail'],
  ['/edit-buyer-assistance', 'Edit tenant assistance'],
  ['/buyer-plan', 'Tenant plans'],
  ['/pricing-plans', 'Pricing plans'],
  ['/myplan-datas', 'My plan'],
  ['/points-history', 'Points history'],
  ['/points-payment-success', 'Points payment SUCCESS'],
  ['/points-payment-failure', 'Points payment FAILED'],
  ['/payu-points-form', 'Points checkout'],
  ['/payment-success', 'Payment SUCCESS'],
  ['/payment-failure', 'Payment FAILED'],
  ['/payu', 'Payment checkout'],
  ['/loan-property', 'Loan properties'],
  ['/land-property', 'Land properties'],
  ['/plot-below', 'Plots'],
  ['/house-average', 'House averages'],
  ['/messages', 'Messages'],
  ['/notifications', 'Notifications'],
  ['/profile', 'My profile'],
  ['/settings', 'Settings'],
  ['/Construction', 'Construction'],
  ['/tabs', 'My property'],
  ['/', 'Home'],
];

// Exported so Microsoft Clarity (utils/clarity.js) can label its page views with
// exactly the same names the admin Live Activity screen shows. Behaviour here is
// unchanged — this only widens the visibility of an existing helper.
export const labelForPath = (path) => {
  const p = String(path || '/');
  let best = null;
  for (const [prefix, label] of PAGE_LABELS) {
    if (p === prefix || p.startsWith(prefix)) {
      if (!best || prefix.length > best[0].length) best = [prefix, label];
    }
  }
  return best ? best[1] : p;
};

// ── action labels ────────────────────────────────────────────────────────────
// endpoint fragment -> [ACTION_CODE, 'Human label'].
// Only these endpoints are recorded; everything else is ignored as noise.
const ACTION_MAP = [
  ['points-deduct', ['CONTACT_VIEW', 'Viewed owner contact (points used)']],
  ['points-balance', null], // silent: polled constantly
  ['points-credit', ['POINTS_CREDIT', 'Points credited']],
  ['points-refund-request', ['POINTS_REFUND', 'Requested points refund']],
  ['select-points-plan', ['PLAN_SELECT', 'Selected a points plan']],
  ['payu-points', ['PAYMENT_START', 'Started points payment']],
  ['payu', ['PAYMENT_START', 'Started payment']],

  ['send-otp', ['OTP_SEND', 'Requested login OTP']],
  ['verify-otp', ['OTP_VERIFY', 'Verified OTP / logged in']],
  ['login-direct', ['LOGIN', 'Logged in']],

  ['add-favorite', ['FAVOURITE_ADD', 'Shortlisted a property']],
  ['remove-favorite', ['FAVOURITE_REMOVE', 'Removed a shortlist']],
  ['send-interests', ['INTEREST_SEND', 'Sent interest to owner']],
  ['remove-interest', ['INTEREST_REMOVE', 'Withdrew interest']],

  ['user-call', ['CALL_OWNER', 'Called the owner']],
  ['contact-send-property', ['CONTACT_SEND', 'Shared contact on a property']],
  ['contact-send', ['CONTACT_SEND', 'Shared contact']],
  ['contact-rent', ['CONTACT_SEND', 'Contacted owner']],

  ['photo-requests', ['PHOTO_REQUEST', 'Requested property photos']],
  ['address-requests', ['ADDRESS_REQUEST', 'Requested property address']],
  ['offers', ['OFFER_RAISE', 'Raised an offer']],

  ['store-data-rent', ['PROPERTY_START', 'Started adding a property']],
  ['update-rent-property', ['PROPERTY_SUBMIT', 'Submitted / updated a property']],
  ['delete-free-property', ['PROPERTY_DELETE', 'Deleted a property']],
  ['undo-delete-free-property', ['PROPERTY_RESTORE', 'Restored a property']],
  ['delete-detail-property', ['PROPERTY_DELETE', 'Deleted a property']],

  ['add-buyerAssistance-rent', ['ASSIST_ADD', 'Submitted tenant assistance']],
  ['update-buyerAssistance-rent', ['ASSIST_UPDATE', 'Updated tenant assistance']],

  ['queue-message', ['MESSAGE_SEND', 'Sent a message']],
  ['send-message', ['MESSAGE_SEND', 'Sent a message']],
];

/** Match a request URL to an action, or null when it is not worth recording. */
const actionForUrl = (url) => {
  const u = String(url || '');
  for (const [fragment, action] of ACTION_MAP) {
    if (u.includes(`/${fragment}`)) return action; // may be null = explicitly silent
  }
  return null;
};

// ── queue + flush ────────────────────────────────────────────────────────────

const flush = (useBeacon = false) => {
  if (!queue.length || !API) return;
  const events = queue.splice(0, queue.length);
  const payload = JSON.stringify({ events });

  try {
    // On tab close, sendBeacon is the only thing that reliably survives.
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: 'application/json' }));
      return;
    }
    // Plain fetch, deliberately not axios: keeps tracking out of the app's own
    // interceptors so it can never recurse or be re-tracked.
    fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* tracking must never surface an error */
  }
};

const schedule = () => {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    flush();
  }, FLUSH_MS);
};

/**
 * Record one activity event. Safe to call from anywhere in the app.
 *
 *   trackActivity('CONTACT_VIEW', 'Viewed owner contact', { detail: 'RP-1234' });
 */
export const trackActivity = (action, label, extra = {}) => {
  try {
    if (!action || !API) return;
    queue.push({
      action,
      label: label || action,
      detail: extra.detail || '',
      path: extra.path !== undefined ? extra.path : window.location.pathname,
      endpoint: extra.endpoint || '',
      method: extra.method || '',
      status: extra.status || 0,
      ok: extra.ok === undefined ? true : !!extra.ok,
      phone: phone(),
      sessionId: sessionId(),
      base: getActiveBase(),
      device: device(),
      at: new Date().toISOString(),
    });
    if (queue.length >= MAX_QUEUE) flush();
    else schedule();
  } catch (e) {
    /* never break the caller */
  }
};

// ── auto-capture ─────────────────────────────────────────────────────────────

// ── click capture ────────────────────────────────────────────────────────────
// Anything a person can press: real controls first, then the common React
// pattern of a plain <div onClick>. `closest` walks up and returns the NEAREST
// match, so a button inside a card logs the button, not the card.
const CLICK_SELECTOR = [
  'a', 'button', '[role="button"]', 'input[type="submit"]', 'input[type="button"]',
  'label', 'select', 'summary', '[data-track]',
  '.btn', '[class*="btn"]', '[class*="Btn"]', '[class*="button"]', '[class*="Button"]',
  'marquee', '[class*="marquee"]', '[class*="Marquee"]',
  '[class*="card"]', '[class*="Card"]',
  '[class*="tab"]', '[class*="Tab"]',
  '[class*="menu"]', '[class*="Menu"]',
  '[class*="nav"]', '[class*="Nav"]',
].join(',');

// Never store anything that looks like a phone number: owner contacts are the
// paid product, and a click label should not become a back door to them.
const scrub = (s) => String(s).replace(/\d{10,}/g, '#');

/** Best human name for whatever was clicked. */
const labelOfElement = (el) => {
  try {
    const aria = el.getAttribute && el.getAttribute('aria-label');
    const title = el.getAttribute && el.getAttribute('title');
    const alt = el.querySelector && el.querySelector('img[alt]')?.getAttribute('alt');
    let text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length > 60) text = `${text.slice(0, 60)}…`;
    const name = el.getAttribute && (el.getAttribute('name') || el.getAttribute('placeholder'));
    const out = aria || title || text || alt || name || el.id || (el.tagName || '').toLowerCase();
    return scrub(out).slice(0, 80);
  } catch (e) {
    return 'element';
  }
};

/** Short description of the element type, e.g. 'button' / 'link → /detail/12'. */
const kindOfElement = (el) => {
  try {
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'a') {
      const href = el.getAttribute('href') || '';
      return href ? `link → ${scrub(href).slice(0, 80)}` : 'link';
    }
    return tag;
  } catch (e) {
    return '';
  }
};

/** Resolve the clicked node to the thing a person thinks they pressed. */
const clickTarget = (node) => {
  try {
    if (!node || node.nodeType !== 1) return null;
    const match = node.closest(CLICK_SELECTOR);
    if (match) return match;
    // Fallback for <div onClick={...}> with no class hint: a pointer cursor is
    // the strongest signal that something is meant to be pressed.
    const style = window.getComputedStyle(node);
    if (style && style.cursor === 'pointer') return node;
    return null;
  } catch (e) {
    return null;
  }
};

const trackClick = (e) => {
  try {
    const el = clickTarget(e.target);
    if (!el) return;

    // Rate ceiling, reset every minute.
    const now = Date.now();
    if (now - clickWindow.start > 60000) clickWindow = { start: now, count: 0 };
    if (clickWindow.count >= CLICK_MAX_PER_MIN) return;

    const label = labelOfElement(el);
    if (!label) return;

    // Collapse double-fires and rage-clicks.
    const key = `${label}|${window.location.pathname}`;
    if (key === lastClick.key && now - lastClick.at < CLICK_DEDUPE_MS) return;
    lastClick = { key, at: now };
    clickWindow.count += 1;

    trackActivity('CLICK', `Clicked "${label}"`, { detail: kindOfElement(el) });
  } catch (err) {
    /* a click must never be broken by tracking it */
  }
};

const trackSubmit = (e) => {
  try {
    const form = e.target;
    const name = (form?.getAttribute?.('name') || form?.id || '').trim();
    trackActivity('FORM_SUBMIT', name ? `Submitted form "${scrub(name)}"` : 'Submitted a form');
  } catch (err) {
    /* ignore */
  }
};

/** Log a page view, ignoring repeats of the same path. */
const trackPageView = () => {
  try {
    const path = window.location.pathname + window.location.search;
    if (path === lastPath) return;
    lastPath = path;
    trackActivity('PAGE_VIEW', labelForPath(window.location.pathname), { path });
  } catch (e) {
    /* ignore */
  }
};

/**
 * Start tracking. Called once from src/index.js. Idempotent.
 *
 * Hooks:
 *  - history.pushState / replaceState / popstate  -> page views (works with
 *    react-router without touching a single route file)
 *  - axios response + error interceptors          -> mapped API actions
 *  - visibilitychange / pagehide                  -> final flush
 */
export const initActivityTracker = () => {
  if (started || !API) return;
  started = true;

  try {
    // ── page views ──
    const wrap = (fn) =>
      function wrapped(...args) {
        const out = fn.apply(this, args);
        // let react-router finish committing the new URL first
        setTimeout(trackPageView, 0);
        return out;
      };
    window.history.pushState = wrap(window.history.pushState);
    window.history.replaceState = wrap(window.history.replaceState);
    window.addEventListener('popstate', () => setTimeout(trackPageView, 0));
    trackPageView(); // first load

    // ── every press: buttons, links, cards, tabs, marquee, div-with-onClick ──
    // Capture phase, so it is recorded even if the app's own handler stops
    // propagation or unmounts the element.
    document.addEventListener('click', trackClick, true);
    document.addEventListener('submit', trackSubmit, true);

    // ── meaningful API actions ──
    const record = (cfg, status, ok) => {
      try {
        const url = cfg?.url || '';
        if (!url.startsWith(API) || url.startsWith(TRACK_URL)) return;
        const hit = actionForUrl(url);
        if (!hit) return; // unmapped or explicitly silenced
        const [code, label] = hit;
        trackActivity(code, ok ? label : `${label} — failed`, {
          endpoint: url.replace(API, ''),
          method: (cfg?.method || '').toUpperCase(),
          status,
          ok,
        });
      } catch (e) {
        /* ignore */
      }
    };

    axios.interceptors.response.use(
      (response) => {
        record(response.config, response.status, true);
        return response;
      },
      (error) => {
        record(error?.config, error?.response?.status || 0, false);
        return Promise.reject(error);
      }
    );

    // ── make sure nothing is lost when the tab goes away ──
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush(true);
    });
    window.addEventListener('pagehide', () => flush(true));
  } catch (e) {
    /* tracking is best-effort only */
  }
};

export default initActivityTracker;
