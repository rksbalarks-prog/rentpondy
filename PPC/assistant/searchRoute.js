// Lean, filtered, paginated, indexed property search — the "correct" search
// surface for the assistant when it runs in-process with the DB (VPS deploy).
// Additive route: does NOT touch AddModel.js. It also creates the indexes the
// property collection was missing (join/filter columns) so this query is not a
// full collection scan.
//
// Note (vs the SQL brief): MongoDB, so no EXPLAIN / SQL_CALC_FOUND_ROWS. We use a
// separate lean countDocuments() rather than counting the full result set.

import express from 'express';
import AddModel from '../AddModel.js'; // CommonJS default export

const router = express.Router();

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rx = (s, anchored = false) =>
  anchored ? new RegExp('^' + escapeRegex(s) + '$', 'i') : new RegExp(escapeRegex(s), 'i');

const PROJECTION =
  'rentId propertyType propertyMode rentType bedrooms rentalAmount area city district furnished totalArea onDemand';

function leanCard(p) {
  return {
    rentId: p.rentId,
    propertyType: p.propertyType,
    propertyMode: p.propertyMode,
    rentType: p.rentType,
    bedrooms: p.bedrooms,
    rent: p.onDemand ? 'On Demand' : p.rentalAmount,
    area: p.area,
    city: p.city,
    furnished: p.furnished,
    totalArea: p.totalArea,
  };
}

router.get('/assistant/search-properties', async (req, res) => {
  try {
    const { city, area, bedrooms, propertyType, rentType, propertyMode } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 15);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const q = { status: 'active' };
    if (bedrooms) q.bedrooms = String(bedrooms);
    if (propertyType) q.propertyType = rx(propertyType);
    if (rentType) q.rentType = rx(rentType);
    if (propertyMode) q.propertyMode = rx(propertyMode, true);

    if (city) {
      const c = String(city).toLowerCase();
      if (/pond|pudu|pudh/.test(c)) {
        q.$or = [{ city: /pond|pudu|pudh/i }, { area: /pond|pudu|pudh/i }];
      } else {
        q.$or = [{ city: rx(city) }, { area: rx(city) }, { district: rx(city) }];
      }
    }
    if (area) {
      const areaMatch = [{ area: rx(area) }, { city: rx(area) }];
      if (q.$or) q.$and = [{ $or: q.$or }, { $or: areaMatch }], delete q.$or;
      else q.$or = areaMatch;
    }

    const minRent = Number(req.query.minRent);
    const maxRent = Number(req.query.maxRent);
    if (Number.isFinite(minRent) || Number.isFinite(maxRent)) {
      q.rentalAmount = {};
      if (Number.isFinite(minRent)) q.rentalAmount.$gte = minRent;
      if (Number.isFinite(maxRent)) q.rentalAmount.$lte = maxRent;
    }

    const [items, count] = await Promise.all([
      AddModel.find(q).select(PROJECTION).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      AddModel.countDocuments(q),
    ]);

    res.json({
      success: true,
      count,
      page,
      limit,
      showing: items.length,
      results: items.map(leanCard),
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Create the indexes the search relies on. Idempotent; safe to call at startup.
export async function ensureSearchIndexes() {
  const specs = [
    { status: 1, city: 1, rentalAmount: 1 },
    { status: 1, area: 1 },
    { status: 1, bedrooms: 1 },
    { status: 1, propertyType: 1 },
    { rentId: 1 },
  ];
  const created = [];
  for (const spec of specs) {
    try {
      const name = await AddModel.collection.createIndex(spec);
      created.push(name);
    } catch (e) {
      // Non-fatal: log and continue (e.g. conflicting existing index).
      console.warn('[assistant] index create skipped:', e.message);
    }
  }
  return created;
}

export default router;
