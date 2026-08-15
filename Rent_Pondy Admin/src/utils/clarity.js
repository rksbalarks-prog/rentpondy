/**
 * Microsoft Clarity — admin-side behaviour tracking.
 * ------------------------------------------------------------------
 * Records what the *admin staff* do inside the dashboard: session
 * replays, click/scroll heatmaps, rage-clicks, dead-clicks and JS
 * errors. Every session is tagged with the logged-in admin's name,
 * role and city scope so a recording can be traced back to a person.
 *
 * SETUP
 *   1. Create a project at https://clarity.microsoft.com (free, no
 *      traffic limit) and copy the Project ID from
 *      Settings → Overview → "Clarity project ID".
 *   2. Put it in Rent_Pondy Admin/.env:
 *         REACT_APP_CLARITY_ID=abcd1234ef
 *   3. `npm run build` and upload the build (CRA bakes env vars in at
 *      build time — changing the ID needs a rebuild).
 *
 * With no REACT_APP_CLARITY_ID set, every function here is a no-op and
 * no script is downloaded — so dev/local runs stay clean and nothing
 * breaks if the variable is missing.
 *
 * PRIVACY
 *   The dashboard shows customer PII (names, phone numbers, addresses).
 *   Set the masking mode in the Clarity dashboard under
 *   Settings → Masking:
 *      Strict   – mask all text (safest for this app)
 *      Balanced – default
 *      Relaxed  – mask nothing
 *   Per-element overrides work regardless of mode:
 *      <td data-clarity-mask="true">   → always hidden in replays
 *      <div data-clarity-unmask="true">→ always visible in replays
 *   Password fields are never recorded by Clarity.
 */

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
 * Call this as early as possible (src/index.js) so the login page is
 * recorded too.
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

  // If an admin is already logged in (page refresh), tag the session now.
  identifyAdmin();
};

/** Attach a custom tag you can filter recordings by in the Clarity UI. */
export const setClarityTag = (key, value) => {
  if (!CLARITY_ID || value === undefined || value === null || value === '') return;
  call('set', String(key), String(value));
};

/** Record a named custom event (shows up as a filterable "Smart event"). */
export const clarityEvent = (name) => {
  if (!CLARITY_ID || !name) return;
  call('event', String(name));
};

/**
 * Flag this session as high-priority so Clarity keeps the recording even
 * when it is sampling. Use for rare/important flows (login, deletes).
 */
export const clarityUpgrade = (reason) => {
  if (!CLARITY_ID) return;
  call('upgrade', String(reason || 'important'));
};

/** Read the logged-in admin from localStorage (set by Admin.jsx at login). */
const readAdmin = () => {
  try {
    return {
      name: localStorage.getItem('adminName') || '',
      role: localStorage.getItem('adminRole') || '',
      base: localStorage.getItem('adminBase') || 'ALL',
    };
  } catch (e) {
    return { name: '', role: '', base: 'ALL' };
  }
};

/**
 * Tie the current Clarity session to the logged-in admin.
 *
 * clarity("identify", customId, customSessionId, customPageId, friendlyName)
 * — customId is hashed by Clarity before storage; friendlyName is what you
 * actually see in the recordings list.
 *
 * @param {string} [pageId] optional page identifier for this view
 */
export const identifyAdmin = (pageId) => {
  if (!CLARITY_ID) return;
  const { name, role, base } = readAdmin();
  if (!name) return; // not logged in yet (login screen)

  call('identify', name, undefined, pageId, role ? `${name} (${role})` : name);

  setClarityTag('admin_name', name);
  setClarityTag('admin_role', role);
  setClarityTag('admin_base', base);
  setClarityTag('app_version', process.env.REACT_APP_APP_VERSION);
};

const clarityApi = {
  isClarityEnabled,
  initClarity,
  setClarityTag,
  clarityEvent,
  clarityUpgrade,
  identifyAdmin,
};

export default clarityApi;
