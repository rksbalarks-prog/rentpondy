// Central knobs for the SEO layer. Everything the templates / sitemaps need to
// know about the public site lives here so there is exactly one place to change
// when the domain, brand name or default city moves.
//
// Env overrides (all optional — the defaults are the live production values):
//   SEO_SITE_URL     public origin, no trailing slash   (default https://rentpondy.com)
//   SEO_ENABLED      'false' disables the whole layer   (default enabled)
//   SEO_CACHE_TTL_MS in-memory cache TTL in ms          (default 10 min)

const SITE_URL = (process.env.SEO_SITE_URL || 'https://rentpondy.com').replace(/\/+$/, '');

export default {
  enabled: String(process.env.SEO_ENABLED || 'true').toLowerCase() !== 'false',

  siteUrl: SITE_URL,
  brand: 'RentPondy',
  // Shown in Organization JSON-LD and page footers.
  logoUrl: `${SITE_URL}/rentpondylogo.png`,
  defaultImage: `${SITE_URL}/rentpondylogo.png`,

  // Where a visitor is sent when they click through from an SEO page into the
  // React app. `/detail/:rentId` is the app's existing property route.
  appDetailPath: (rentId) => `/detail/${rentId}`,
  appListingPath: '/pondicherry',

  // Cities the platform serves. `base` maps to the PY/CH city-base codes used
  // across the backend (see utils/baseFilter.js).
  cities: [
    { slug: 'pondicherry', name: 'Pondicherry', base: 'PY', aliases: ['puducherry', 'pondy'] },
    { slug: 'chennai', name: 'Chennai', base: 'CH', aliases: ['madras'] },
  ],

  // Sitemaps are chunked; Google's hard limit is 50 000 URLs / 50 MB per file.
  urlsPerSitemap: 5000,

  // In-memory cache TTLs. Property pages change rarely; sitemaps are rebuilt
  // from Mongo so they always contain the properties uploaded today.
  cacheTtlMs: Number(process.env.SEO_CACHE_TTL_MS || 10 * 60 * 1000),
  sitemapCacheTtlMs: 30 * 60 * 1000,

  // Only these statuses are ever exposed to a crawler.
  publicStatus: 'active',

  // Max properties rendered on a landing page (the rest are reachable through
  // the app's own filters).
  landingPageSize: 60,
};
