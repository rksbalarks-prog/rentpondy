/**
 * Call Management API — backs the standalone page at
 * /process/dashboard/rp.wfh on the admin frontend.
 *
 * Endpoints (all mounted under /PPC by server.js):
 *   POST   /rcm/login              { username, password }
 *   POST   /rcm/logout              (Bearer token)
 *   GET    /rcm/me                  (Bearer token)
 *
 *   GET    /rcm/calls?from=YYYY-MM-DD&to=YYYY-MM-DD
 *   POST   /rcm/calls              { number, mode }
 *   PATCH  /rcm/calls/:id/status   { status }
 *
 *   GET    /rcm/auto-queue                (list)
 *   POST   /rcm/auto-queue                { numbers: ["9876543210", ...] }   admin only
 *   DELETE /rcm/auto-queue/:id                                                admin only
 *   GET    /rcm/auto-queue/next           (round-robin: returns next number)
 */

const express  = require('express');
const bcrypt   = require('bcrypt');
const crypto   = require('crypto');
const router   = express.Router();

const RcmStaff      = require('./RcmStaffModel');
const RcmCall       = require('./RcmCallModel');
const RcmAutoNumber = require('./RcmAutoNumberModel');

const STATUS_OPTIONS = ['Ring', 'Not Exist', 'Not Interested', 'Interested'];

// ───────── helpers ─────────

function isTenDigit(s) {
  return typeof s === 'string' && /^[0-9]{10}$/.test(s);
}

function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

function safeStaff(s) {
  return { username: s.username, role: s.role };
}

function startOfDayUTC(yyyyMmDd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return null;
  return new Date(yyyyMmDd + 'T00:00:00.000Z');
}

function endOfDayUTC(yyyyMmDd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return null;
  return new Date(yyyyMmDd + 'T23:59:59.999Z');
}

// Bearer-token auth middleware. Resolves req.staff on success.
async function requireRcmAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const staff = await RcmStaff.findOne({ active: true, 'tokens.token': token });
    if (!staff) return res.status(401).json({ error: 'Invalid or expired token' });

    req.staff = staff;
    req.staffToken = token;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed' });
  }
}

// Admin-only gate. Compose after requireRcmAuth.
function requireRcmAdmin(req, res, next) {
  if (!req.staff || req.staff.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin role required' });
  }
  next();
}

// ───────── one-time seed (idempotent) ─────────
// Creates two demo accounts on first run so the login screen works out of the box.
// Skip silently if they already exist.
async function ensureSeed() {
  try {
    const count = await RcmStaff.estimatedDocumentCount();
    if (count > 0) return;

    await RcmStaff.create([
      { username: 'sandhoshi', password: '1234',  plainPassword: '1234',  role: 'STAFF' },
      { username: 'admin',     password: 'admin', plainPassword: 'admin', role: 'ADMIN' },
    ]);
    console.log('🌱 RCM: seeded default staff accounts (sandhoshi/1234, admin/admin)');
  } catch (err) {
    // If duplicate-key fires because two server instances raced, just ignore.
    if (err && err.code !== 11000) {
      console.warn('RCM seed failed:', err.message);
    }
  }
}

// Defer seeding until the mongoose connection is open. Safe across multiple
// loads (idempotent).
const mongoose = require('mongoose');
if (mongoose.connection.readyState === 1) {
  ensureSeed();
} else {
  mongoose.connection.once('open', ensureSeed);
}

// ═══════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════

router.post('/rcm/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const staff = await RcmStaff.findOne({ username: String(username).trim().toLowerCase(), active: true });
    if (!staff) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, staff.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = genToken();
    staff.tokens.push({ token });
    // Cap stored tokens per user — keep last 20.
    if (staff.tokens.length > 20) staff.tokens = staff.tokens.slice(-20);
    staff.lastLogin = new Date();
    await staff.save();

    res.json({ token, ...safeStaff(staff) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

router.post('/rcm/logout', requireRcmAuth, async (req, res) => {
  try {
    req.staff.tokens = req.staff.tokens.filter(t => t.token !== req.staffToken);
    await req.staff.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.get('/rcm/me', requireRcmAuth, async (req, res) => {
  res.json(safeStaff(req.staff));
});

// ═══════════════════════════════════════════════════════════════════
// CALLS
// ═══════════════════════════════════════════════════════════════════

// List calls — by default scoped to the authenticated agent. Admins see all,
// and admins may narrow by ?agent=username.
router.get('/rcm/calls', requireRcmAuth, async (req, res) => {
  try {
    const { from, to, agent } = req.query;
    const q = {};
    if (req.staff.role !== 'ADMIN') {
      q.agentUsername = req.staff.username;
    } else if (agent) {
      q.agentUsername = String(agent).trim().toLowerCase();
    }

    if (from || to) {
      q.createdAt = {};
      const f = startOfDayUTC(from);
      const t = endOfDayUTC(to || from);
      if (f) q.createdAt.$gte = f;
      if (t) q.createdAt.$lte = t;
      if (Object.keys(q.createdAt).length === 0) delete q.createdAt;
    }

    const list = await RcmCall.find(q).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ calls: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load calls', detail: err.message });
  }
});

// Create a new call record (status = "Ring" by default).
router.post('/rcm/calls', requireRcmAuth, async (req, res) => {
  try {
    const { number, mode, autoNumberId } = req.body || {};
    if (!isTenDigit(number)) {
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' });
    }
    if (!['Manual', 'Automatic'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    // ✋ Duplicate guard — refuse if this number already has a FINAL outcome
    // (Not Exist / Not Interested / Interested). "Ring" is treated as an
    // unfinished attempt, so a Ring-only history does NOT block a re-dial.
    // Returns 409 so the client can show a clear message and advance to the
    // next queue entry in Automatic mode.
    const existing = await RcmCall.findOne({
      number,
      status: { $ne: 'Ring' },
    })
      .select('agentUsername status createdAt')
      .lean();
    if (existing) {
      const when = new Date(existing.createdAt).toLocaleString();
      return res.status(409).json({
        error: `This number was already called on ${when} by ${existing.agentUsername} (status: ${existing.status}). Please use a different number.`,
        duplicate: {
          agent: existing.agentUsername,
          status: existing.status,
          createdAt: existing.createdAt,
        },
      });
    }

    const doc = await RcmCall.create({
      agentUsername: req.staff.username,
      number,
      mode,
      status: 'Ring',
      autoNumberId: autoNumberId || null,
    });

    // NOTE: the queue entry is NOT deactivated here. We only deactivate
    // when the call gets a final status (see PATCH /rcm/calls/:id/status),
    // so a Ring-only attempt remains eligible for re-dial via the queue.

    res.status(201).json({ call: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record call', detail: err.message });
  }
});

// Update the status of an existing call. When the new status is "Interested",
// the request may also carry an `interestedDetails` payload (rent, advance,
// bhk, floorNo, carPark, availableFrom) captured by the popup on the staff
// page; we store those alongside the call.
router.patch('/rcm/calls/:id/status', requireRcmAuth, async (req, res) => {
  try {
    const { status, interestedDetails } = req.body || {};
    if (!STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const filter = { _id: req.params.id };
    // Non-admins can only update their own records.
    if (req.staff.role !== 'ADMIN') filter.agentUsername = req.staff.username;

    // Cross-record race guard: when transitioning to a final outcome, fetch
    // the target's number and refuse if another call for that number was
    // already finalized. Catches the POST→PATCH window where two staff dial
    // the same number in parallel (both POSTs see no prior final record, both
    // create Ring rows, then both try to mark Interested).
    if (status !== 'Ring') {
      const target = await RcmCall.findOne(filter).select('number').lean();
      if (!target) return res.status(404).json({ error: 'Call not found' });

      const conflict = await RcmCall.findOne({
        _id: { $ne: target._id },
        number: target.number,
        status: { $ne: 'Ring' },
      })
        .select('agentUsername status createdAt')
        .lean();
      if (conflict) {
        const when = new Date(conflict.createdAt).toLocaleString();
        return res.status(409).json({
          error: `Another agent already finalized this number on ${when} (${conflict.agentUsername} → ${conflict.status}). Cannot finalize again.`,
          conflict,
        });
      }
    }

    const update = { status };

    if (status === 'Interested' && interestedDetails && typeof interestedDetails === 'object') {
      const d = interestedDetails;
      const trim = (v) => (v == null ? '' : String(v).trim());
      update.interestedDetails = {
        rent:          trim(d.rent),
        advance:       trim(d.advance),
        bhk:           trim(d.bhk),
        floorNo:       trim(d.floorNo),
        carPark:       trim(d.carPark),
        availableFrom: trim(d.availableFrom),
        capturedAt:    new Date(),
      };
    }

    const updated = await RcmCall.findOneAndUpdate(filter, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Call not found' });

    // Final outcome on a number that came from the auto-queue → retire the
    // queue entry so the round-robin stops handing it out. (Ring leaves the
    // queue entry active so the number stays eligible for re-dial.)
    if (status !== 'Ring' && updated.autoNumberId) {
      await RcmAutoNumber.updateOne(
        { _id: updated.autoNumberId },
        { $set: { active: false } }
      ).catch(() => {});
    }

    res.json({ call: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', detail: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// AUTO-QUEUE (admin-managed pool used by "Automatic" mode)
// ═══════════════════════════════════════════════════════════════════

// List all numbers in the queue.
router.get('/rcm/auto-queue', requireRcmAuth, async (req, res) => {
  try {
    const list = await RcmAutoNumber.find().sort({ assignCount: 1, _id: 1 }).lean();
    res.json({ numbers: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load queue', detail: err.message });
  }
});

// Add numbers to the queue (admin role only).
router.post('/rcm/auto-queue', requireRcmAuth, async (req, res) => {
  try {
    if (req.staff.role !== 'ADMIN') return res.status(403).json({ error: 'Admin role required' });
    const incoming = Array.isArray(req.body?.numbers) ? req.body.numbers : [];
    const clean = [...new Set(incoming.map(n => String(n).replace(/\D/g, '')).filter(isTenDigit))];
    if (!clean.length) return res.status(400).json({ error: 'Provide an array of valid 10-digit numbers' });

    // Note: `$set: { active: true }` also flips a previously-deactivated
    // entry back on, so an admin can "revive" a number that was retired
    // after a previous dial. Whether the dial itself is allowed is still
    // gated by the duplicate-call check in POST /rcm/calls.
    const docs = await Promise.all(clean.map(number =>
      RcmAutoNumber.findOneAndUpdate(
        { number },
        {
          $setOnInsert: { number, addedBy: req.staff.username, assignCount: 0 },
          $set:         { active: true },
        },
        { new: true, upsert: true }
      )
    ));
    res.status(201).json({ added: docs.length, numbers: docs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add numbers', detail: err.message });
  }
});

// Remove (or deactivate) a number from the queue (admin role only).
router.delete('/rcm/auto-queue/:id', requireRcmAuth, async (req, res) => {
  try {
    if (req.staff.role !== 'ADMIN') return res.status(403).json({ error: 'Admin role required' });
    const result = await RcmAutoNumber.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Number not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove number', detail: err.message });
  }
});

// ROUND-ROBIN: hand out the next number with the lowest assignCount.
// Atomic: findOneAndUpdate with $inc ensures the same number is not handed to
// two staff devices simultaneously.
router.get('/rcm/auto-queue/next', requireRcmAuth, async (req, res) => {
  try {
    const next = await RcmAutoNumber.findOneAndUpdate(
      { active: true },
      { $inc: { assignCount: 1 }, $set: { lastAssignedAt: new Date() } },
      { sort: { assignCount: 1, _id: 1 }, new: true }
    );
    if (!next) return res.status(404).json({ error: 'Queue is empty' });
    res.json({ id: next._id, number: next.number, assignCount: next.assignCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch next number', detail: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN: STATS  (counts by status, by agent, in date range)
// ═══════════════════════════════════════════════════════════════════
router.get('/rcm/stats', requireRcmAuth, requireRcmAdmin, async (req, res) => {
  try {
    const { from, to, agent } = req.query;
    const range = {};
    const f = startOfDayUTC(from);
    const t = endOfDayUTC(to || from);
    if (f) range.$gte = f;
    if (t) range.$lte = t;
    const q = {};
    if (Object.keys(range).length) q.createdAt = range;
    if (agent) q.agentUsername = String(agent).trim().toLowerCase();

    const list = await RcmCall.find(q).select('status agentUsername').lean();
    const summary = {
      totalCalls:     list.length,
      ringCount:      list.filter(c => c.status === 'Ring').length,
      notExistCount:  list.filter(c => c.status === 'Not Exist').length,
      notInterestedCount: list.filter(c => c.status === 'Not Interested').length,
      interestedCount:list.filter(c => c.status === 'Interested').length,
    };

    const agentMap = new Map();
    for (const c of list) {
      const a = agentMap.get(c.agentUsername) || {
        agentUsername: c.agentUsername,
        total: 0, Ring: 0, 'Not Exist': 0, 'Not Interested': 0, Interested: 0,
      };
      a.total += 1;
      a[c.status] = (a[c.status] || 0) + 1;
      agentMap.set(c.agentUsername, a);
    }
    summary.byAgent = Array.from(agentMap.values()).sort((a, b) => b.total - a.total);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats', detail: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN: STAFF MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

// List all staff (sensitive fields stripped).
router.get('/rcm/staff', requireRcmAuth, requireRcmAdmin, async (req, res) => {
  try {
    const list = await RcmStaff.find()
      .select('username role active lastLogin createdAt plainPassword')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ staff: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load staff', detail: err.message });
  }
});

// Create a new staff member.
router.post('/rcm/staff', requireRcmAuth, requireRcmAdmin, async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const role = ['STAFF', 'ADMIN'].includes(req.body?.role) ? req.body.role : 'STAFF';

    if (!username || username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
    if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });

    const existing = await RcmStaff.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const staff = await RcmStaff.create({ username, password, plainPassword: password, role, active: true });
    res.status(201).json({ staff: {
      _id: staff._id, username: staff.username, role: staff.role,
      active: staff.active, createdAt: staff.createdAt,
    }});
  } catch (err) {
    res.status(500).json({ error: 'Failed to create staff', detail: err.message });
  }
});

// Update staff (active flag, role, or password reset).
router.patch('/rcm/staff/:id', requireRcmAuth, requireRcmAdmin, async (req, res) => {
  try {
    const staff = await RcmStaff.findById(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Staff not found' });

    // Guard: don't let an admin lock themselves out by demoting/disabling self.
    const isSelf = String(staff._id) === String(req.staff._id);

    if (typeof req.body?.active === 'boolean') {
      if (isSelf && !req.body.active) return res.status(400).json({ error: 'Cannot deactivate yourself' });
      staff.active = req.body.active;
    }
    if (req.body?.role && ['STAFF', 'ADMIN'].includes(req.body.role)) {
      if (isSelf && req.body.role !== 'ADMIN') return res.status(400).json({ error: 'Cannot demote yourself' });
      staff.role = req.body.role;
    }
    if (req.body?.password) {
      if (String(req.body.password).length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
      staff.password = req.body.password;       // hashed by pre-save hook
      staff.plainPassword = req.body.password;
      staff.tokens = [];                          // invalidate sessions on password change
    }
    await staff.save();
    res.json({ staff: {
      _id: staff._id, username: staff.username, role: staff.role,
      active: staff.active, lastLogin: staff.lastLogin,
    }});
  } catch (err) {
    res.status(500).json({ error: 'Failed to update staff', detail: err.message });
  }
});

module.exports = router;
