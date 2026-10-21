// Public, crawler-facing routes. All read-only, all GET.
//
//   GET /robots.txt                          crawl rules + sitemap pointer
//   GET /sitemap.xml                         sitemap index
//   GET /sitemap-pages.xml                   static marketing pages
//   GET /sitemap-locations.xml               city / type / locality landing pages
//   GET /sitemap-properties-:n.xml           property URLs, 5 000 per chunk
//   GET /property/:rentId                    301 -> the slugged URL
//   GET /property/:rentId/:slug              server-rendered property page
//   GET /rent/:city                          city landing page
//   GET /rent/:city/:type                    "house for rent in pondicherry"
//   GET /rent/:city/:type/:area              "house for rent in lawspet pondicherry"
//
// Mounted at the Node root (see ./index.js), so before the nginx change they
// are reachable at https://rentpondy.com/PPC/... and after it at the clean
// https://rentpondy.com/... paths.

import { createHash } from 'crypto';
import express from 'express';
import config from './seoConfig.js';
import {
  getProperty,
  getRetiredProperty,
  getSitemapProperties,
  getLandingProperties,
  getLandingPages,
  getCityTypes,
  getTypeAreas,
} from './seoData.js';
import {
  renderPropertyPage,
  renderLandingPage,
  renderRetiredPage,
  renderNotFound,
} from './seoTemplates.js';
import {
  slugify,
  findCity,
  cityOf,
  titleCaseLocality,
  propertyPath,
  propertyUrl,
  landingPath,
  landingUrl,
  isoDate,
  escapeXml,
  photoUrl,
} from './seoUtils.js';

// Two routers, because they are mounted differently.
//
// `sitemapRouter` (robots.txt + the XML sitemaps) is safe to expose under any
// prefix — nothing else in the backend answers those paths.
//
// `pageRouter` (/property/... and /rent/...) is root-only. Under /PPC those two
// prefixes already belong to the live API — AddRouter's GET /property/:rentId
// (what the app's detail page calls) and GET /rent/property-by-rentId — so
// mounting the pages there would risk shadowing them.
export const sitemapRouter = express.Router();
export const pageRouter = express.Router();

/* ── helpers ──────────────────────────────────────────────────────────── */

function sendHtml(res, html, status = 200) {
  res
    .status(status)
    // Cache at the CDN/browser edge for 10 min, serve stale for an hour while
    // revalidating — a crawler burst must never hammer Mongo.
    .set('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600')
    .type('html')
    .send(html);
}

function sendXml(res, xml) {
  res
    .set('Cache-Control', 'public, max-age=3600')
    .type('application/xml')
    .send(xml);
}

function urlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;
}

function urlEntry({ loc, lastmod, changefreq, priority, images }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    ...(images || []).map(
      (img) => `    <image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`
    ),
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

// <lastmod> for each child sitemap in the index: the moment its list of URLs
// last changed. It used to be "now" on every request, which tells Google
// nothing — so after a night of auto-expiry it kept crawling listings it still
// believed were submitted and reported them as "Not found (404)". An honest
// lastmod lets it re-read the sitemap as soon as listings come or go.
// Only the URL set is hashed: per-URL lastmods move on every page view.
// In memory, so a restart stamps every map "now" once — harmless.
const sitemapStamps = new Map(); // sitemap name -> { sig, at }

function changedAt(name, locs) {
  const sig = createHash('sha1').update(locs.join('\n')).digest('hex');
  const seen = sitemapStamps.get(name);
  if (seen && seen.sig === sig) return seen.at;
  const at = isoDate();
  sitemapStamps.set(name, { sig, at });
  return at;
}

/* ── robots.txt ───────────────────────────────────────────────────────── */

sitemapRouter.get('/robots.txt', (req, res) => {
  res
    .set('Cache-Control', 'public, max-age=86400')
    .type('text/plain')
    .send(
      [
        'User-agent: *',
        'Allow: /',
        // Logged-in / transactional areas: nothing to index, and crawling them
        // wastes crawl budget on a large SPA.
        'Disallow: /my',
        'Disallow: /my-plan',
        'Disallow: /my-profile',
        'Disallow: /myplan-datas',
        'Disallow: /payu',
        'Disallow: /payu-form',
        'Disallow: /payment-success',
        'Disallow: /payment-failure',
        'Disallow: /points-payment-success',
        'Disallow: /points-payment-failure',
        'Disallow: /points-history',
        'Disallow: /web-login',
        'Disallow: /login',
        'Disallow: /tabs',
        'Disallow: /PPC/',
        '',
        `Sitemap: ${config.siteUrl}/sitemap.xml`,
        '',
      ].join('\n')
    );
});

/* ── sitemaps ─────────────────────────────────────────────────────────── */

sitemapRouter.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [properties, landingPages] = await Promise.all([
      getSitemapProperties(),
      getLandingPages(),
    ]);
    const chunks = Math.max(1, Math.ceil(properties.length / config.urlsPerSitemap));

    // Child sitemaps are addressed through whichever prefix this request came
    // in on. In production that is always '' — nginx strips /PPC before Node
    // sees the path, so https://rentpondy.com/PPC/sitemap.xml arrives here as
    // "/sitemap.xml" and the emitted <loc>s are the clean canonical URLs (which
    // start resolving once the nginx block is applied; until then browse the set
    // by hand at /PPC/sitemap-pages.xml etc.). The prefix is kept for a local
    // dev server mounted under /PPC with no nginx in front.
    const prefix = `${config.siteUrl}${req.baseUrl || ''}`;
    const maps = [
      { name: 'sitemap-pages.xml', locs: STATIC_PAGES.map((p) => p.path) },
      {
        name: 'sitemap-locations.xml',
        locs: landingPages.map((p) => landingUrl(p.citySlug, p.typeSlug, p.areaSlug)),
      },
      ...Array.from({ length: chunks }, (_, i) => ({
        name: `sitemap-properties-${i + 1}.xml`,
        locs: properties
          .slice(i * config.urlsPerSitemap, (i + 1) * config.urlsPerSitemap)
          .map(propertyUrl),
      })),
    ];

    sendXml(
      res,
      `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${maps
  .map(
    (m) =>
      `  <sitemap><loc>${escapeXml(`${prefix}/${m.name}`)}</loc><lastmod>${changedAt(
        m.name,
        m.locs
      )}</lastmod></sitemap>`
  )
  .join('\n')}
</sitemapindex>`
    );
  } catch (err) {
    next(err);
  }
});

// Hand-maintained marketing / legal pages that live in the React app.
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  // NOT listed: /pondicherry and /chennai. Both render MobileViews, whose <Seo>
  // canonicalises them to the server-rendered /rent/pondicherry and
  // /rent/chennai — which sitemap-locations.xml already submits. Listing the
  // app URLs here as well asked Google to index a page that points elsewhere,
  // which it reports as "Alternate page with proper canonical tag".
  { path: '/add-form', priority: '0.7', changefreq: 'monthly' },
  { path: '/plans', priority: '0.6', changefreq: 'monthly' },
  { path: '/about', priority: '0.5', changefreq: 'yearly' },
  { path: '/support', priority: '0.5', changefreq: 'yearly' },
  { path: '/business', priority: '0.4', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
];

sitemapRouter.get('/sitemap-pages.xml', (req, res) => {
  sendXml(
    res,
    urlset(
      STATIC_PAGES.map((p) =>
        urlEntry({
          // No <lastmod>: these pages change on a deploy, not on a request, and
          // a date that is always "now" teaches Google to ignore the field.
          loc: `${config.siteUrl}${p.path}`,
          changefreq: p.changefreq,
          priority: p.priority,
        })
      )
    )
  );
});

sitemapRouter.get('/sitemap-locations.xml', async (req, res, next) => {
  try {
    const pages = await getLandingPages();
    sendXml(
      res,
      urlset(
        pages.map((p) =>
          urlEntry({
            loc: landingUrl(p.citySlug, p.typeSlug, p.areaSlug),
            lastmod: isoDate(p.lastmod),
            changefreq: 'daily',
            priority: p.areaSlug ? '0.6' : p.typeSlug ? '0.8' : '0.9',
          })
        )
      )
    );
  } catch (err) {
    next(err);
  }
});

sitemapRouter.get('/sitemap-properties-:n.xml', async (req, res, next) => {
  try {
    const n = Number(req.params.n);
    const properties = await getSitemapProperties();
    const start = (n - 1) * config.urlsPerSitemap;
    if (!Number.isInteger(n) || n < 1 || start >= Math.max(properties.length, 1)) {
      return res.status(404).type('text/plain').send('Not found');
    }
    const slice = properties.slice(start, start + config.urlsPerSitemap);

    sendXml(
      res,
      urlset(
        slice.map((p) =>
          urlEntry({
            loc: propertyUrl(p),
            lastmod: isoDate(p.updatedAt || p.createdAt),
            changefreq: 'weekly',
            priority: '0.7',
            images: (p.photos || []).slice(0, 3).map(photoUrl).filter(Boolean),
          })
        )
      )
    );
  } catch (err) {
    next(err);
  }
});

/* ── property pages ───────────────────────────────────────────────────── */

// Listings still waiting to go live may yet appear, so they stay a plain 404.
const AWAITING_STATUSES = new Set(['pending', 'incomplete']);
const RELATED_LIMIT = 6;

// A listing that has left the public set — mostly the nightly auto-expire. An
// expired or deleted one answers 410 Gone: the honest "this was here and has
// gone", which Google drops from its index faster than a 404. Either way the
// visitor gets similar live listings (same type + locality, then same type,
// then the city) instead of a dead end.
async function sendRetired(req, res) {
  const old = await getRetiredProperty(req.params.rentId);
  if (!old) return sendHtml(res, renderNotFound(), 404);

  const citySlug = cityOf(old).slug;
  const typeSlug = slugify(old.propertyType);
  const areaSlug = slugify(old.area);
  const tiers = [
    typeSlug && areaSlug ? { typeSlug, areaSlug } : null,
    typeSlug ? { typeSlug } : null,
    {},
  ].filter(Boolean);

  const related = [];
  for (const tier of tiers) {
    if (related.length >= RELATED_LIMIT) break;
    const { items } = await getLandingProperties({ citySlug, ...tier });
    for (const p of items) {
      if (related.length >= RELATED_LIMIT) break;
      if (!related.some((r) => r.rentId === p.rentId)) related.push(p);
    }
  }

  const awaiting =
    !old.isDeleted && AWAITING_STATUSES.has(String(old.status || '').toLowerCase());
  return sendHtml(res, renderRetiredPage(old, related), awaiting ? 404 : 410);
}

async function handleProperty(req, res, next) {
  try {
    const property = await getProperty(req.params.rentId);
    if (!property) {
      return await sendRetired(req, res);
    }

    // Canonical slug enforcement: a stale or hand-typed slug 301s to the
    // current one so Google only ever indexes a single URL per listing.
    const wanted = propertyPath(property);
    const actual = `/property/${property.rentId}/${req.params.slug || ''}`.replace(/\/$/, '');
    if (actual !== wanted) {
      return res.redirect(301, wanted);
    }

    // A few more listings from the same city keep the crawler moving through
    // the site and give the page genuine internal links.
    const { items } = await getLandingProperties({
      citySlug: cityOf(property).slug,
      typeSlug: slugify(property.propertyType),
    });
    const related = items.filter((p) => p.rentId !== property.rentId).slice(0, 6);

    sendHtml(res, renderPropertyPage(property, related));
  } catch (err) {
    next(err);
  }
}

pageRouter.get('/property/:rentId', handleProperty);
pageRouter.get('/property/:rentId/:slug', handleProperty);

/* ── landing pages ────────────────────────────────────────────────────── */

async function handleLanding(req, res, next) {
  try {
    const city = findCity(req.params.city);
    if (!city) return sendHtml(res, renderNotFound('Unknown city.'), 404);

    // Canonicalise the city alias: /rent/puducherry -> /rent/pondicherry.
    if (slugify(req.params.city) !== city.slug) {
      return res.redirect(
        301,
        `/rent/${city.slug}${req.params.type ? `/${req.params.type}` : ''}${
          req.params.area ? `/${req.params.area}` : ''
        }`
      );
    }

    const typeSlug = req.params.type ? slugify(req.params.type) : '';
    const areaSlug = req.params.area ? slugify(req.params.area) : '';

    const [{ items, total, priceFrom }, types, areas] = await Promise.all([
      getLandingProperties({ citySlug: city.slug, typeSlug, areaSlug }),
      getCityTypes(city.slug),
      typeSlug ? getTypeAreas(city.slug, typeSlug) : Promise.resolve([]),
    ]);

    // Recover the human-readable names from live data rather than title-casing
    // the slug, so "1-bhk-house" renders as the admin actually spelled it.
    const typeName =
      types.find((t) => t.typeSlug === typeSlug)?.typeName ||
      (typeSlug ? items[0]?.propertyType || '' : '');
    const areaName =
      areas.find((a) => a.areaSlug === areaSlug)?.areaName ||
      (areaSlug ? titleCaseLocality(items[0]?.area) : '');

    // A type or locality that has run out of listings (expired, rented out) is
    // sent one level up — "house for rent in lawspet" -> "house for rent in
    // pondicherry". 302, not 301: the page returns once listings do, and a
    // browser would cache a 301 forever.
    if (typeSlug && !typeName) return res.redirect(302, landingPath(city.slug));
    if (areaSlug && !areaName) return res.redirect(302, landingPath(city.slug, typeSlug));

    sendHtml(
      res,
      renderLandingPage({
        city,
        typeSlug,
        typeName,
        areaSlug,
        areaName,
        items,
        total,
        priceFrom,
        // On an area page the type chips are noise; show sibling areas instead.
        types: areaSlug ? [] : types,
        areas: areaSlug ? [] : areas,
      })
    );
  } catch (err) {
    next(err);
  }
}

pageRouter.get('/rent/:city', handleLanding);
pageRouter.get('/rent/:city/:type', handleLanding);
pageRouter.get('/rent/:city/:type/:area', handleLanding);

/* ── errors ───────────────────────────────────────────────────────────── */

// Never leak a stack trace to a crawler, and never return a 200 for a broken
// page — a soft 404 tells Google the page is fine when it is not.
function seoErrorHandler(err, req, res, next) {
  console.error('[seo] render failed:', err && err.message);
  if (res.headersSent) return next(err);
  res
    .status(503)
    .set('Retry-After', '120')
    .type('html')
    .send(renderNotFound('We could not load this page right now. Please try again shortly.'));
}

sitemapRouter.use(seoErrorHandler);
pageRouter.use(seoErrorHandler);

// Everything, for the root mount.
const router = express.Router();
router.use(sitemapRouter);
router.use(pageRouter);

export default router;
