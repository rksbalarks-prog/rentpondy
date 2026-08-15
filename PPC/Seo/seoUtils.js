// Pure helpers shared by the sitemap builder and the server-rendered pages.
// No database, no express — safe to unit-test or reuse anywhere.

import config from './seoConfig.js';

/* ── text ─────────────────────────────────────────────────────────────── */

/** URL-safe slug: "Land / Plot" -> "land-plot", "Lawspet " -> "lawspet". */
export function slugify(value) {
  // NFKD splits accented letters into base + combining mark; the [^a-z0-9]
  // pass below then drops the marks, so "Pondichéry" -> "pondichery".
  return String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Escape for HTML text/attribute context. Every DB value goes through this. */
export function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape for XML text nodes (sitemap URLs). */
export function escapeXml(value) {
  return escapeHtml(value);
}

/** Collapse whitespace and hard-truncate on a word boundary. */
export function clamp(text, max) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/* ── formatting ───────────────────────────────────────────────────────── */

/** 12000 -> "₹12,000". Returns '' for missing/zero. */
export function formatPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return '';
  return `₹${n.toLocaleString('en-IN')}`;
}

/** Rent is quoted per month; a sale price is quoted flat. */
export function formatRent(property) {
  const price = formatPrice(property.rentalAmount);
  if (!price) return 'Price on request';
  return isSale(property) ? price : `${price}/month`;
}

export function isSale(property) {
  return /sale|sell|buy/i.test(String(property.propertyMode || ''));
}

/** "2 BHK", "" when the DB has no bedroom count (land, commercial). */
export function bhkLabel(property) {
  const raw = String(property.bedrooms || '').trim();
  if (!raw) return '';
  const n = raw.match(/\d+/);
  if (!n) return '';
  return `${n[0]} BHK`;
}

/** "1200 sq.ft" from totalArea + areaUnit. */
export function areaLabel(property) {
  const n = Number(property.totalArea);
  if (!Number.isFinite(n) || n <= 0) return '';
  const unit = String(property.areaUnit || 'sq.ft').trim();
  return `${n.toLocaleString('en-IN')} ${unit}`;
}

/**
 * Capitalise a locality for display: the data is hand-typed, so "amathi nagar"
 * needs fixing — but "R A Puram" and "CIT Colony" must NOT be mangled. Only
 * all-lowercase words are touched.
 */
function titleCaseLocality(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .map((w) => (w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/**
 * Human locality line: "Kurumbapet, Pondicherry".
 *
 * Deliberately area + city only. `nagar` is left out — it is a third, often
 * hand-typed component ("Kurumbapet, amathi nagar, Pondicherry") that pushes the
 * string past the 60-char title budget, which used to make the title fall all
 * the way back to the bare city and lose the locality keyword entirely. That
 * keyword is the whole point ("house for rent in kurumbapet"). The nagar is
 * still shown in the property fact list, so no information is lost.
 *
 * Door number and street are omitted on purpose — the exact address sits behind
 * the app's contact flow.
 */
export function localityLabel(property) {
  const seen = new Set();
  return [property.area, property.city || property.district]
    .map((p) => titleCaseLocality(p))
    .filter(Boolean)
    .filter((p) => {
      const k = p.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .join(', ');
}

/** Just the locality, no city — the shortest form that still ranks locally. */
export function areaOnlyLabel(property) {
  return titleCaseLocality(property.area || '');
}

/**
 * "a" or "an" for a property type. Types are admin-entered, so this has to cope
 * with whatever is in the dropdown — "Apartment", "Office Space", "Independent
 * House". Vowel-letter test is enough here; there is no "hour"/"university"
 * style exception among property types.
 */
export function article(word) {
  return /^[aeiou]/i.test(String(word || '').trim()) ? 'an' : 'a';
}

export { titleCaseLocality };

/* ── city helpers ─────────────────────────────────────────────────────── */

/** Resolve a URL slug (or alias) to a configured city, or null. */
export function findCity(slug) {
  const s = slugify(slug);
  return (
    config.cities.find((c) => c.slug === s || c.aliases.includes(s)) || null
  );
}

/** Which configured city does this property belong to? Falls back to the first. */
export function cityOf(property) {
  const haystack = `${property.city || ''} ${property.district || ''}`.toLowerCase();
  const match = config.cities.find(
    (c) => haystack.includes(c.slug) || c.aliases.some((a) => haystack.includes(a))
  );
  return match || config.cities[0];
}

/* ── canonical URLs ───────────────────────────────────────────────────── */

/**
 * Keyword-rich property URL:
 *   /property/1042/2-bhk-house-for-rent-in-lawspet-pondicherry
 * The rentId is the only part that is looked up — the slug is decorative and a
 * stale slug still resolves (and 301s to the current one).
 */
export function propertyPath(property) {
  const bits = [
    bhkLabel(property),
    property.propertyType,
    isSale(property) ? 'for sale in' : 'for rent in',
    property.area || property.city || property.district,
    cityOf(property).name,
  ];
  const slug = slugify(bits.filter(Boolean).join(' '));
  return `/property/${property.rentId}/${slug || 'rental-property'}`;
}

export function propertyUrl(property) {
  return `${config.siteUrl}${propertyPath(property)}`;
}

/** /rent/pondicherry | /rent/pondicherry/house | /rent/pondicherry/house/lawspet */
export function landingPath(citySlug, typeSlug, areaSlug) {
  return (
    `/rent/${citySlug}` +
    (typeSlug ? `/${typeSlug}` : '') +
    (typeSlug && areaSlug ? `/${areaSlug}` : '')
  );
}

export function landingUrl(citySlug, typeSlug, areaSlug) {
  return `${config.siteUrl}${landingPath(citySlug, typeSlug, areaSlug)}`;
}

/* ── titles & descriptions ────────────────────────────────────────────── */

// Google truncates the SERP title around 60 characters. The brand suffix must
// survive that cut, so titles are assembled from a most- to least-detailed list
// of candidates and the first one that fits wins — never a hard chop that eats
// "| RentPondy".
const TITLE_BUDGET = 60;

function withBrand(candidates) {
  const suffix = ` | ${config.brand}`;
  const room = TITLE_BUDGET - suffix.length;
  const fits = candidates.find((c) => c && c.length <= room);
  return `${fits || clamp(candidates.filter(Boolean).pop() || config.brand, room)}${suffix}`;
}

/**
 * Property page title, built to match how people actually search:
 *   "2 BHK House for Rent in Lawspet, Pondicherry | RentPondy"
 */
export function propertyTitle(property) {
  const head = [bhkLabel(property), property.propertyType || 'Property']
    .filter(Boolean)
    .join(' ');
  const verb = isSale(property) ? 'for Sale in' : 'for Rent in';
  const where = localityLabel(property) || cityOf(property).name;
  const city = cityOf(property).name;
  const area = areaOnlyLabel(property);
  const price = formatRent(property);

  return withBrand([
    `${head} ${verb} ${where} - ${price}`,
    `${head} ${verb} ${where}`,
    // Keep the locality even when "<area>, <city>" will not fit — searches are
    // for "house for rent in kurumbapet" far more than for the bare city.
    area ? `${head} ${verb} ${area}` : '',
    `${head} ${verb} ${city}`,
  ]);
}

export function propertyDescription(property) {
  const facts = [
    bhkLabel(property),
    property.propertyType,
    areaLabel(property),
    property.furnished ? `${property.furnished} furnished` : '',
    property.carParking && property.carParking !== 'No' ? 'car parking' : '',
  ]
    .filter(Boolean)
    .join(', ');

  const where = localityLabel(property) || cityOf(property).name;
  const verb = isSale(property) ? 'for sale' : 'for rent';
  const own = String(property.description || '').replace(/\s+/g, ' ').trim();

  const base = `${facts} ${verb} in ${where} at ${formatRent(property)}.`;
  return clamp(
    own ? `${base} ${own}` : `${base} Verified listing on ${config.brand} - view photos and contact the owner directly, no brokerage.`,
    158
  );
}

/**
 * Landing page title:
 *   "House for Rent in Pondicherry - 128 Verified Listings | RentPondy"
 */
export function landingTitle({ cityName, typeName, areaName, count }) {
  const what = typeName ? `${typeName} for Rent` : 'Property for Rent';
  const where = areaName ? `${areaName}, ${cityName}` : cityName;
  const n = count ? `${count} ` : '';
  return withBrand([
    `${what} in ${where} - ${n}Verified Listings`,
    `${what} in ${where} - ${n}Listings`,
    `${what} in ${where}`,
  ]);
}

export function landingDescription({ cityName, typeName, areaName, count, priceFrom }) {
  const what = typeName ? `${typeName.toLowerCase()}s` : 'rental properties';
  const where = areaName ? `${areaName}, ${cityName}` : cityName;
  const n = count ? `${count} verified ` : '';
  const from = priceFrom ? ` Rent starts from ${formatPrice(priceFrom)}/month.` : '';
  return clamp(
    `Find ${n}${what} for rent in ${where}.${from} Owner listings with photos, real rent and direct contact - zero brokerage on ${config.brand}.`,
    158
  );
}

/** ISO-8601 date for <lastmod> / dateModified. */
export function isoDate(value) {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/**
 * Absolute URL for a stored photo.
 *
 * Photos are saved as `uploads/<file>` (path.join, so Windows-authored rows can
 * carry backslashes) and the React app renders them as
 * `https://rentpondy.com/PPC/uploads/<file>` — mirrored here so crawlers and
 * social previews resolve exactly the same image.
 */
export function photoUrl(photo) {
  const p = String(photo || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  return `${config.siteUrl}/PPC/${p}`;
}
