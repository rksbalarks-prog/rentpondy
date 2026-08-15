# SEO layer

Makes RentPondy listings findable on Google for queries like *"rental house
pondicherry"*, *"commercial property for rent pondicherry"*, *"2 bhk house for
rent lawspet"* — and keeps up automatically as properties are uploaded daily.

Entirely **additive**: new folder, new routes, no existing route, model,
collection or admin screen touched.

---

## The problem this solves

The user app is a Create React App single-page app served as static files. Every
route returned the same `<title>RentPondy | Properties</title>` and an empty
`<div id="root">`; the content only appeared after a 2.19 MB JS bundle executed.
There was no sitemap, so Google had no way to discover a listing at all, and
nothing told it that `/detail/1042` was a 2 BHK house in Lawspet at ₹12,000.

## What now exists

| URL | Served by | Purpose |
| --- | --- | --- |
| `/robots.txt` | Node | Crawl rules + sitemap pointer |
| `/sitemap.xml` | Node | Index of the sitemaps below |
| `/sitemap-pages.xml` | Node | Static pages (home, /pondicherry, /about, …) |
| `/sitemap-locations.xml` | Node | Every city / type / locality landing page that has listings |
| `/sitemap-properties-N.xml` | Node | Every live listing, 5 000 per file, with image entries |
| `/property/:rentId/:slug` | Node | **Server-rendered property page** |
| `/rent/:city` | Node | e.g. `/rent/pondicherry` |
| `/rent/:city/:type` | Node | e.g. `/rent/pondicherry/commercial` |
| `/rent/:city/:type/:area` | Node | e.g. `/rent/pondicherry/house/lawspet` |
| everything else | React build | Unchanged |

Plus, inside the React app:

- `src/seo/Seo.jsx` — per-route `<head>` tags via react-helmet (already a dependency)
- `src/seo/seoMeta.js` — title/description/JSON-LD builders, mirroring `seoUtils.js`
- Wired into `App.js` (home), `Components/MoblieViews.jsx` (city feed) and
  `Components/Details.jsx` (property detail)

### These are real pages, not a crawler-only variant

Googlebot and a human clicking the search result get identical HTML. That keeps
us clear of Google's cloaking rules, and a visitor sees the listing immediately
instead of waiting on the bundle. Each page ends with a CTA into the app
(`/detail/:rentId`) for the photo gallery and owner contact.

### Nothing private is exposed

`seoData.js` projects an explicit field list. `phoneNumber`,
`assignedPhoneNumber`, `ownerName` and `email` are never selected, so they cannot
reach a template. Only `status: 'active'` and `isDeleted != true` documents are
ever rendered or listed.

---

## Deployment

### 1. Backend

Upload the `Seo/` folder and the modified `server.js` (two added lines: the
`import seo from './Seo/index.js'` and the `seo.mount(app)` call), then:

```bash
pm2 restart server
pm2 logs server --lines 20   # expect: [seo] mounted sitemap + /property + /rent pages
```

Verify before touching nginx — the sitemaps are aliased under `/PPC`:

```bash
curl -s https://rentpondy.com/PPC/sitemap.xml | head
curl -s https://rentpondy.com/PPC/sitemap-properties-1.xml | grep -c '<url>'
curl -s https://rentpondy.com/PPC/sitemap-locations.xml  | grep -c '<url>'
```

The `<loc>` values inside are the clean canonical URLs (`/property/...`,
`/rent/...`) and stay broken until step 2 — that is expected. Browse the child
sitemaps by hand at `/PPC/sitemap-pages.xml` etc. in the meantime.

**Do not submit the sitemap to Search Console until step 2 is done** — every URL
in it would resolve to the empty React shell, and Google penalises that.

### 2. nginx

Apply the block in [`nginx.conf.txt`](./nginx.conf.txt) — it routes the five
public path patterns to Node. Until this is done the clean URLs fall through to
the React shell.

### 3. Frontend

`npm run build` in `Rent_Pondy User`, upload `build/`.

### 4. Google Search Console

1. Add and verify the `rentpondy.com` property.
2. Submit `https://rentpondy.com/sitemap.xml`.
3. Use **URL Inspection → Request indexing** on `/rent/pondicherry/house` and one
   `/property/...` page to prime the crawl.

Indexing is not instant — expect first pages within days and meaningful ranking
over 4–12 weeks.

---

## How the daily uploads flow through

Nothing to run. `seoData.js` queries MongoDB directly, so a property that goes
`active` today is in `/sitemap-properties-1.xml` (sorted newest-first) and on its
landing page as soon as the cache turns over.

- Sitemaps / landing-page index: 30 min cache
- Individual property + landing pages: 10 min cache

New property types and localities need no code change — the landing-page
taxonomy is derived from live data, so the first time two properties are listed
in a new locality, that locality gets its own page in the sitemap. (Areas need
2+ listings; a one-listing page is thin content and Google penalises it.)

To flush immediately after a bulk import:

```bash
curl -X POST https://rentpondy.com/PPC/PPC/seo/flush-cache
```

---

## Configuration

`seoConfig.js`, all overridable by env var in `PPC/.env`:

| Var | Default | Meaning |
| --- | --- | --- |
| `SEO_SITE_URL` | `https://rentpondy.com` | Public origin, no trailing slash |
| `SEO_ENABLED` | `true` | `false` unmounts the whole layer |
| `SEO_CACHE_TTL_MS` | `600000` | Page cache TTL |

---

## Files

| File | Role |
| --- | --- |
| `seoConfig.js` | Domain, brand, cities, cache TTLs, page sizes |
| `seoUtils.js` | Slugs, titles, descriptions, URLs, price/area formatting — pure, no DB |
| `seoData.js` | Mongo reads with projections + TTL cache; derives the landing-page taxonomy |
| `seoTemplates.js` | HTML for property / landing / 404 pages, incl. JSON-LD |
| `SeoRouter.js` | `sitemapRouter` (root + `/PPC`) and `pageRouter` (root only) |
| `index.js` | `seo.mount(app)` — the only thing `server.js` calls |
| `nginx.conf.txt` | The nginx block, with apply + rollback + verify steps |

### Why two routers

`/PPC/property/:rentId` and `/PPC/rent/property-by-rentId` are **existing live
API routes** in `AddRouter.js` — the app's own detail page calls the first one.
So `pageRouter` is mounted at the root only; only `sitemapRouter` gets the
`/PPC` alias.

---

## Keep in sync

`src/seo/seoMeta.js` (React) intentionally duplicates the title / description /
canonical logic in `seoUtils.js` (Node). Both describe the same listing, and a
mismatch is what makes Google pick a title you did not write. **Change one,
change the other.**
