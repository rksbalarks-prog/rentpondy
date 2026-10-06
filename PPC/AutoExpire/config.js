// Auto-expire settings. Every value has a default, so nothing is required in
// .env; the job starts in DRY-RUN mode and only reports what it would expire
// until AUTO_EXPIRE_MODE=live (or the /auto-expire/mode switch) turns it on.

const int = (v, fallback) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const list = (v, fallback) => {
  const items = String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
  return items.length ? items : fallback;
};

const MODES = ['off', 'dry-run', 'live'];
const modeOf = (v) => {
  const m = String(v || '').trim().toLowerCase();
  return MODES.includes(m) ? m : 'dry-run';
};

module.exports = {
  MODES,
  modeOf,

  // Starting mode. A mode saved through POST /auto-expire/mode overrides it.
  mode: modeOf(process.env.AUTO_EXPIRE_MODE),

  // 03:00 IST, clear of the 02:30 backup, 02:40 Adexpress check and the
  // Saturday 16:30 Adexpress import.
  cron: process.env.AUTO_EXPIRE_CRON || '0 3 * * *',
  timezone: process.env.AUTO_EXPIRE_TZ || 'Asia/Kolkata',

  days: {
    general: int(process.env.AUTO_EXPIRE_GENERAL_DAYS, 90), // user + admin uploads
    adex: int(process.env.AUTO_EXPIRE_ADEX_DAYS, 30), // Adexpress imports
    assistance: int(process.env.AUTO_EXPIRE_ASSIST_DAYS, 90), // Tenant Assistance
  },

  // Statuses that count as a live record. Properties: Approved = 'active',
  // PreApproved = 'complete', the Pending page = 'incomplete', plus the rare
  // 'pending'. Tenant Assistance: Approved / Pending, and the two values
  // /send-interest-rent overwrites a live record's ra_status with.
  propertyStatuses: list(process.env.AUTO_EXPIRE_PROPERTY_STATUSES, ['active', 'complete', 'incomplete', 'pending']),
  assistanceStatuses: list(process.env.AUTO_EXPIRE_ASSIST_STATUSES, ['raActive', 'raPending', 'rent-assistance-interest', 'rent-interest-tried']),

  // A featured listing is a paid upgrade; keep it unless told otherwise.
  protectFeatured: !/^(0|false|no)$/i.test(String(process.env.AUTO_EXPIRE_PROTECT_FEATURED || '')),

  // Safety valve: never expire more than this many records of one kind in a
  // single run. A bad date parse cannot wipe the site in one night.
  maxPerRun: int(process.env.AUTO_EXPIRE_MAX_PER_RUN, 1000),

  // Shown on the Expired page (raExpiredBy) and in the property's `reason`.
  actor: process.env.AUTO_EXPIRE_ACTOR || 'Auto Expire',

  // Required for POST /auto-expire/run-now and /auto-expire/mode.
  token: process.env.AUTO_EXPIRE_TOKEN || '',
};
