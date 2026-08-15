// Read-only data access for the SEO layer.
//
// Every query here is `.lean()` with an explicit projection: SEO pages must
// never leak owner phone numbers, and a crawler hitting the sitemap should not
// pull whole documents out of Mongo.
//
// The city-scope mongoose plugin (utils/cityScopePlugin.js) injects a base
// filter from the request's `?base=`. SEO routes never send one, so these
// queries run unscoped ("ALL") and we filter by city ourselves.

import AddModel from '../AddModel.js';
import config from './seoConfig.js';
import { slugify, findCity, titleCaseLocality } from './seoUtils.js';

/* ── tiny TTL cache ───────────────────────────────────────────────────── */

const cache = new Map(); // key -> { at, ttl, value }

async function cached(key, ttl, producer) {
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && now - hit.at < hit.ttl) return hit.value;
  try {
    const value = await producer();
    cache.set(key, { at: now, ttl, value });
    return value;
  } catch (err) {
    // Serve stale rather than 500 at a crawler — a sitemap that briefly lags is
    // far better than one that errors.
    if (hit) return hit.value;
    throw err;
  }
}

export function clearSeoCache() {
  cache.clear();
}

/* ── shared query pieces ──────────────────────────────────────────────── */

// What a crawler is allowed to see: live listings only.
const PUBLIC_MATCH = {
  status: config.publicStatus,
  isDeleted: { $ne: true },
};

// Fields rendered on SEO pages. `phoneNumber` / `assignedPhoneNumber` /
// `ownerName` / `email` are intentionally absent.
const CARD_FIELDS = {
  _id: 0,
  rentId: 1,
  propertyMode: 1,
  propertyType: 1,
  rentType: 1,
  rentalAmount: 1,
  securityDeposit: 1,
  bedrooms: 1,
  totalArea: 1,
  areaUnit: 1,
  furnished: 1,
  carParking: 1,
  floorNo: 1,
  facing: 1,
  bathrooms: 1,
  attachedBathrooms: 1,
  balconies: 1,
  lift: 1,
  propertyAge: 1,
  availableDate: 1,
  postedBy: 1,
  description: 1,
  area: 1,
  nagar: 1,
  city: 1,
  district: 1,
  state: 1,
  country: 1,
  pinCode: 1,
  photos: 1,
  views: 1,
  createdAt: 1,
  updatedAt: 1,
};

/** Mongo filter fragment restricting to one configured city. */
function cityMatch(city) {
  if (!city) return {};
  const names = [city.slug, city.name, ...city.aliases];
  const rx = new RegExp(names.join('|'), 'i');
  if (city.base === 'CH') return { $or: [{ city: rx }, { district: rx }] };
  // Pondicherry is the platform default: anything not explicitly Chennai.
  const chennai = config.cities.find((c) => c.base === 'CH');
  const chRx = new RegExp([chennai.slug, chennai.name, ...chennai.aliases].join('|'), 'i');
  return { city: { $not: chRx }, district: { $not: chRx } };
}

/* ── queries ──────────────────────────────────────────────────────────── */

/** One property by rentId, or null. Cached briefly so repeat crawls are cheap. */
export function getProperty(rentId) {
  const id = Number(rentId);
  if (!Number.isFinite(id)) return Promise.resolve(null);
  return cached(`property:${id}`, config.cacheTtlMs, () =>
    AddModel.findOne({ rentId: id, ...PUBLIC_MATCH }, CARD_FIELDS).lean()
  );
}

/**
 * Every public property, minimal fields, for the sitemap.
 * Sorted newest-first so today's uploads sit at the top of the first chunk.
 */
export function getSitemapProperties() {
  return cached('sitemap:properties', config.sitemapCacheTtlMs, () =>
    AddModel.find(PUBLIC_MATCH, {
      _id: 0,
      rentId: 1,
      propertyMode: 1,
      propertyType: 1,
      bedrooms: 1,
      area: 1,
      city: 1,
      district: 1,
      photos: 1,
      updatedAt: 1,
      createdAt: 1,
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean()
  );
}

/**
 * Properties for a landing page, newest first.
 * `type` / `area` are slugs; they are matched against slugified DB values so a
 * new property type added in the admin panel works with no code change.
 */
export function getLandingProperties({ citySlug, typeSlug, areaSlug }) {
  const key = `landing:${citySlug}:${typeSlug || '-'}:${areaSlug || '-'}`;
  return cached(key, config.cacheTtlMs, async () => {
    const city = findCity(citySlug);
    const rows = await AddModel.find(
      { ...PUBLIC_MATCH, ...cityMatch(city) },
      CARD_FIELDS
    )
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    const filtered = rows.filter((r) => {
      if (typeSlug && slugify(r.propertyType) !== typeSlug) return false;
      if (areaSlug && slugify(r.area) !== areaSlug) return false;
      return true;
    });

    return {
      total: filtered.length,
      items: filtered.slice(0, config.landingPageSize),
      priceFrom: filtered.reduce((min, r) => {
        const n = Number(r.rentalAmount);
        return Number.isFinite(n) && n > 0 && (min === 0 || n < min) ? n : min;
      }, 0),
    };
  });
}

/**
 * The landing pages that actually have listings behind them — the taxonomy is
 * derived from live data, so a property type or locality that starts getting
 * uploads automatically earns a page in the sitemap.
 *
 * Returns [{ citySlug, cityName, typeSlug, typeName, areaSlug, areaName, count }]
 * for city, city+type and city+type+area combinations.
 */
export function getLandingPages() {
  return cached('landing:index', config.sitemapCacheTtlMs, async () => {
    const rows = await AddModel.find(PUBLIC_MATCH, {
      _id: 0,
      propertyType: 1,
      area: 1,
      city: 1,
      district: 1,
      updatedAt: 1,
    }).lean();

    const pages = new Map();
    const bump = (page) => {
      const key = `${page.citySlug}|${page.typeSlug || ''}|${page.areaSlug || ''}`;
      const found = pages.get(key);
      if (found) {
        found.count += 1;
        if (page.lastmod > found.lastmod) found.lastmod = page.lastmod;
      } else {
        pages.set(key, { ...page, count: 1 });
      }
    };

    for (const r of rows) {
      const haystack = `${r.city || ''} ${r.district || ''}`.toLowerCase();
      const city =
        config.cities.find(
          (c) => haystack.includes(c.slug) || c.aliases.some((a) => haystack.includes(a))
        ) || config.cities[0];

      const typeName = String(r.propertyType || '').trim();
      // Localities are hand-typed, so the raw values are a mix of "Lawspet" and
      // "pattanur". Normalise for display — these names become the <h1> and
      // <title> of the area landing pages. Matching still uses slugify(), which
      // lowercases, so this cannot break lookups.
      const areaName = titleCaseLocality(r.area);
      const lastmod = r.updatedAt || new Date(0);
      const base = { citySlug: city.slug, cityName: city.name, lastmod };

      bump({ ...base, typeSlug: '', typeName: '', areaSlug: '', areaName: '' });
      if (typeName) {
        bump({ ...base, typeSlug: slugify(typeName), typeName, areaSlug: '', areaName: '' });
        if (areaName) {
          bump({
            ...base,
            typeSlug: slugify(typeName),
            typeName,
            areaSlug: slugify(areaName),
            areaName,
          });
        }
      }
    }

    // A page with a single listing is thin content — Google treats those as
    // low quality. Keep city and city+type pages always; require 2+ for areas.
    return [...pages.values()].filter((p) => !p.areaSlug || p.count >= 2);
  });
}

/** Distinct property types with live listings in a city — used for internal links. */
export async function getCityTypes(citySlug) {
  const pages = await getLandingPages();
  return pages
    .filter((p) => p.citySlug === citySlug && p.typeSlug && !p.areaSlug)
    .sort((a, b) => b.count - a.count);
}

/** Distinct areas with live listings for a city+type — used for internal links. */
export async function getTypeAreas(citySlug, typeSlug) {
  const pages = await getLandingPages();
  return pages
    .filter((p) => p.citySlug === citySlug && p.typeSlug === typeSlug && p.areaSlug)
    .sort((a, b) => b.count - a.count);
}
