const mongoose = require('mongoose');

/**
 * Live user-activity trail for the Rent Pondy *user* app.
 *
 * One document per action a visitor takes (page view, contact reveal, favourite,
 * payment, ...). The admin "Live User Activity" screen polls these newest-first
 * so staff can watch, in near real time, which login number is doing what.
 *
 * Written by the user app via POST /PPC/track-activity (batched, fire-and-forget).
 * Nothing else in the app reads this collection — it is purely observational.
 *
 * Volume note: this collection grows fast, so documents self-delete after
 * ACTIVITY_TTL_DAYS (default 30) via the TTL index at the bottom.
 */

const TTL_DAYS = Number(process.env.ACTIVITY_TTL_DAYS || 30);

const liveActivitySchema = new mongoose.Schema(
  {
    // Logged-in phone number, or '' for a not-logged-in visitor (guest).
    phone: { type: String, default: '', trim: true },
    // Per-browser-tab id so guests can still be followed through a session.
    sessionId: { type: String, default: '', trim: true },

    // Machine code, e.g. PAGE_VIEW / CONTACT_VIEW / FAVOURITE_ADD.
    action: { type: String, required: true, trim: true },
    // Human-readable text shown in the admin table.
    label: { type: String, default: '', trim: true },
    // Anything extra worth showing (property id, plan name, error text...).
    detail: { type: String, default: '' },

    // Where it happened / what it hit.
    path: { type: String, default: '' },
    endpoint: { type: String, default: '' },
    method: { type: String, default: '' },
    status: { type: Number, default: 0 },
    ok: { type: Boolean, default: true },

    // Context.
    base: { type: String, default: 'PY' }, // PY | CH
    device: { type: String, default: '' }, // Mobile | Desktop
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },

    // When the action happened on the client (authoritative for display).
    at: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'live_user_activity' }
);

// Newest-first feed + "everything since X" incremental polling.
liveActivitySchema.index({ at: -1 });
// Per-number drill-down.
liveActivitySchema.index({ phone: 1, at: -1 });
// Session drill-down.
liveActivitySchema.index({ sessionId: 1, at: -1 });
// Auto-purge old rows so the collection cannot grow without bound.
liveActivitySchema.index({ at: 1 }, { expireAfterSeconds: TTL_DAYS * 24 * 60 * 60 });

module.exports = mongoose.model('LiveUserActivity', liveActivitySchema);
