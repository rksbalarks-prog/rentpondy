// Data Added — month-wise report of property records entered into the system.
//
//   GET /PPC/data-added/summary?year=2026[&month=4][&addedBy=][&hideDeleted=1]
//        → per-month counts for the whole year + staff ("Added By") breakdown
//          + the list of years that actually have data + the dropdown options.
//          When `month` is given it also returns `days[]` — the per-day counts
//          that fill the calendar — plus the calendar's shape (daysInMonth,
//          firstWeekday).
//
//   GET /PPC/data-added/list?year=2026&month=4[&day=17][&addedBy=][&q=][&page=1][&limit=50]
//        → the actual rows added in that month (or that single day), newest first.
//
// Reads the existing property collection (AddModel) only — no writes, no new
// collection, no change to any existing route. The `addedBy` field is the staff
// name stamped when a property is saved from the admin panel (blank for
// listings the owner posted themselves from the user app).
//
// City base (All / PY / CH) is applied automatically by cityScopePlugin on both
// find() and aggregate(), so this report always matches the header's city
// selection, exactly like every other admin screen.

const express = require('express');
const router = express.Router();
const AddModel = require('../AddModel');

// India has no DST, so a fixed offset is safe and keeps the range query
// index-friendly (a plain createdAt range instead of a $expr on $month).
const TZ = '+05:30';
const TZ_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Sentinel used by the dropdown for records with no staff name on them
// (i.e. the owner added the property from the user app).
const NOT_SET = '__none__';

const MAX_LIMIT = 500;

/** 1-12, or 0 for "whole year". Anything else is treated as the whole year. */
const cleanMonth = (v) => {
  const m = Number(v) || 0;
  return m >= 1 && m <= 12 ? m : 0;
};

/** 1-31, or 0 for "whole month". Only meaningful alongside a real month. */
const cleanDay = (v) => {
  const d = Number(v) || 0;
  return d >= 1 && d <= 31 ? d : 0;
};

/** How many days the given IST month has (day 0 of the next month). */
const daysInMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * UTC range covering one IST day, one IST month, or the whole IST year —
 * whichever is the narrowest argument supplied. `Date.UTC` rolls the end
 * boundary over month/year ends by itself.
 */
const istRange = (year, month, day) => {
  const mIdx = month ? month - 1 : 0;

  if (month && day) {
    return {
      $gte: new Date(Date.UTC(year, mIdx, day) - TZ_OFFSET_MS),
      $lt: new Date(Date.UTC(year, mIdx, day + 1) - TZ_OFFSET_MS),
    };
  }

  const startMs = Date.UTC(year, mIdx, 1) - TZ_OFFSET_MS;
  const endMs = month ? Date.UTC(year, mIdx + 1, 1) - TZ_OFFSET_MS
                      : Date.UTC(year + 1, 0, 1) - TZ_OFFSET_MS;
  return { $gte: new Date(startMs), $lt: new Date(endMs) };
};

/** Shared filter builder so the cards and the table can never disagree. */
const buildMatch = (req, year, month, day) => {
  const match = { createdAt: istRange(year, month, day) };

  const addedBy = String(req.query.addedBy || '').trim();
  if (addedBy === NOT_SET) {
    match.$or = [{ addedBy: '' }, { addedBy: null }, { addedBy: { $exists: false } }];
  } else if (addedBy) {
    match.addedBy = addedBy;
  }

  // Optional: drop the soft-deleted rows from the count.
  if (String(req.query.hideDeleted || '') === '1') {
    match.isDeleted = { $ne: true };
    match.status = { $ne: 'delete' };
  }

  return match;
};

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── SUMMARY ───────────────────────────────────────────────────────────────────
// Month cards for one year, plus the "Added By" breakdown for the current scope
// (the whole year, or just `month` when the detail view asks for it).
router.get('/data-added/summary', async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = cleanMonth(req.query.month); // 0 = whole year

    const yearMatch = buildMatch(req, year, 0);
    const scopeMatch = month ? buildMatch(req, year, month) : yearMatch;

    const [monthRows, dayRows, staffRows, optionRows, yearRows] = await Promise.all([
      // Per-month totals for the selected year, split staff-added vs user-added.
      AddModel.aggregate([
        { $match: yearMatch },
        {
          $group: {
            _id: { $month: { date: '$createdAt', timezone: TZ } },
            count: { $sum: 1 },
            staff: { $sum: { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$addedBy', ''] } }, 0] }, 1, 0] } },
          },
        },
      ]),

      // Per-day totals — only needed once a month is open (calendar view).
      month
        ? AddModel.aggregate([
            { $match: scopeMatch },
            {
              $group: {
                _id: { $dayOfMonth: { date: '$createdAt', timezone: TZ } },
                count: { $sum: 1 },
                staff: { $sum: { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$addedBy', ''] } }, 0] }, 1, 0] } },
              },
            },
          ])
        : Promise.resolve([]),

      // Who added the records inside the current scope.
      AddModel.aggregate([
        { $match: scopeMatch },
        { $group: { _id: { $ifNull: ['$addedBy', ''] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Dropdown options: every name that has ever been stamped on a record,
      // so switching year/month never empties the picker.
      AddModel.aggregate([
        { $match: { addedBy: { $nin: ['', null] } } },
        { $group: { _id: '$addedBy' } },
        { $sort: { _id: 1 } },
      ]),

      // Years that actually have data, for the year picker.
      AddModel.aggregate([
        { $group: { _id: { $year: { date: '$createdAt', timezone: TZ } } } },
        { $sort: { _id: -1 } },
      ]),
    ]);

    const byMonth = new Map(monthRows.map((r) => [r._id, r]));
    const months = MONTH_LABELS.map((label, i) => {
      const row = byMonth.get(i + 1);
      const count = row?.count || 0;
      const staff = row?.staff || 0;
      return { month: i + 1, label, short: label.slice(0, 3), count, staff, user: count - staff };
    });

    const total = months.reduce((sum, m) => sum + m.count, 0);
    const staffTotal = months.reduce((sum, m) => sum + m.staff, 0);

    // Calendar for the open month: one entry per real day, plus the weekday the
    // 1st falls on so the grid can be padded correctly.
    let days = [];
    let firstWeekday = 0;
    if (month) {
      const byDay = new Map(dayRows.map((r) => [r._id, r]));
      const dim = daysInMonth(year, month);
      firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = Sunday
      days = Array.from({ length: dim }, (_, i) => {
        const d = i + 1;
        const row = byDay.get(d);
        const count = row?.count || 0;
        const staff = row?.staff || 0;
        return {
          day: d,
          weekday: new Date(Date.UTC(year, month - 1, d)).getUTCDay(),
          count,
          staff,
          user: count - staff,
        };
      });
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from(
      new Set([
        ...yearRows.map((r) => r._id).filter((y) => y && y > 2000 && y < 2200),
        currentYear,
        year,
      ])
    ).sort((a, b) => b - a);

    res.json({
      success: true,
      year,
      month: month || null,
      years,
      total,
      staffTotal,
      userTotal: total - staffTotal,
      scopeTotal: staffRows.reduce((sum, r) => sum + r.count, 0),
      months,
      days,
      daysInMonth: month ? daysInMonth(year, month) : 0,
      firstWeekday,
      monthLabel: month ? MONTH_LABELS[month - 1] : '',
      staff: staffRows.map((r) => ({
        name: String(r._id || '').trim() || 'Not Set (User Added)',
        value: String(r._id || '').trim() || NOT_SET,
        count: r.count,
      })),
      addedByOptions: optionRows
        .map((r) => String(r._id || '').trim())
        .filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── MONTH / DAY DETAIL LIST ───────────────────────────────────────────────────
router.get('/data-added/list', async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = cleanMonth(req.query.month);
    // A day only narrows the range when it exists in the month asked for —
    // e.g. day=31 in February is ignored rather than silently spilling into March.
    const rawDay = cleanDay(req.query.day);
    const day = month && rawDay && rawDay <= daysInMonth(year, month) ? rawDay : 0;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || 50));

    const match = buildMatch(req, year, month, day);

    const q = String(req.query.q || '').trim();
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      const search = [
        { phoneNumber: rx },
        { assignedPhoneNumber: rx },
        { ownerName: rx },
        { city: rx },
        { area: rx },
        { propertyType: rx },
        { addedBy: rx },
        { createdBy: rx },
      ];
      if (/^\d+$/.test(q)) search.push({ rentId: Number(q) });

      // `match.$or` may already hold the "Added By: Not Set" clause — keep both
      // conditions by moving them under $and.
      if (match.$or) {
        match.$and = [{ $or: match.$or }, { $or: search }];
        delete match.$or;
      } else {
        match.$or = search;
      }
    }

    const projection = [
      'rentId', 'phoneNumber', 'assignedPhoneNumber', 'ownerName', 'propertyType',
      'propertyMode', 'rentType', 'rentalAmount', 'city', 'area', 'pinCode',
      'status', 'addedBy', 'addedByRole', 'createdBy', 'planName', 'base',
      'views', 'isDeleted', 'createdAt',
    ].join(' ');

    const [rows, total] = await Promise.all([
      AddModel.find(match)
        .select(projection)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AddModel.countDocuments(match),
    ]);

    res.json({
      success: true,
      year,
      month: month || null,
      day: day || null,
      monthLabel: month ? MONTH_LABELS[month - 1] : '',
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
