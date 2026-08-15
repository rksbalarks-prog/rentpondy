// Server-rendered HTML for the SEO layer.
//
// These are real pages, not a cloaked crawler-only variant: the same markup is
// served to Googlebot and to a human who clicks the search result. That keeps us
// on the right side of Google's cloaking rules and means a visitor sees content
// instantly instead of waiting on the React bundle. Every page ends with a
// prominent link into the app (/detail/:rentId) for photos and owner contact.
//
// No external CSS, fonts or scripts — one inline stylesheet keeps these pages
// fast, which is itself a ranking factor.

import config from './seoConfig.js';
import {
  escapeHtml,
  formatRent,
  formatPrice,
  bhkLabel,
  areaLabel,
  localityLabel,
  propertyPath,
  propertyUrl,
  landingPath,
  landingUrl,
  propertyTitle,
  propertyDescription,
  landingTitle,
  landingDescription,
  photoUrl,
  isoDate,
  isSale,
  cityOf,
  clamp,
  slugify,
  titleCaseLocality,
  article,
} from './seoUtils.js';

/* ── styles ───────────────────────────────────────────────────────────── */

const STYLES = `
*{box-sizing:border-box}
body{margin:0;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#1f2330;background:#f7f7fb}
a{color:#4F4B7E;text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
header{background:#4F4B7E;color:#fff;padding:14px 0}
header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
header a{color:#fff;font-weight:700;font-size:20px}
header nav a{font-weight:500;font-size:14px;margin-left:16px}
nav.crumbs{font-size:13px;color:#6b7080;padding:14px 0}
nav.crumbs a{color:#6b7080}
h1{font-size:26px;line-height:1.3;margin:8px 0 6px}
h2{font-size:20px;margin:32px 0 12px}
.sub{color:#5c6274;margin:0 0 18px}
.price{font-size:26px;font-weight:700;color:#1f2330}
.card{background:#fff;border:1px solid #e6e6ef;border-radius:12px;padding:18px;margin-bottom:18px}
.facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin:0;padding:0;list-style:none}
.facts div{background:#f4f4fa;border-radius:8px;padding:10px 12px}
.facts dt{font-size:12px;color:#6b7080;margin:0}
.facts dd{margin:2px 0 0;font-weight:600;font-size:15px}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
.gallery img{width:100%;height:150px;object-fit:cover;border-radius:10px;background:#e9e9f2}
.cta{display:inline-block;background:#4F4B7E;color:#fff;font-weight:600;padding:13px 26px;border-radius:8px;margin-top:6px}
.cta:hover{text-decoration:none;background:#3e3a66}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.item{background:#fff;border:1px solid #e6e6ef;border-radius:12px;overflow:hidden;display:block;color:inherit}
.item:hover{text-decoration:none;border-color:#4F4B7E}
.item img{width:100%;height:170px;object-fit:cover;background:#e9e9f2;display:block}
.item .body{padding:12px 14px}
.item .t{font-weight:600;font-size:15px;margin:0 0 4px}
.item .m{color:#6b7080;font-size:13px;margin:0}
.item .p{font-weight:700;margin:8px 0 0}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.chips a{background:#fff;border:1px solid #dcdce8;border-radius:999px;padding:7px 14px;font-size:14px}
.copy{color:#43485a}
footer{border-top:1px solid #e6e6ef;margin-top:40px;padding:22px 0 40px;color:#6b7080;font-size:13px}
footer a{color:#6b7080;margin-right:14px}
.empty{color:#6b7080;padding:24px 0}
@media(max-width:600px){h1{font-size:21px}.price{font-size:22px}}
`;

/* ── layout ───────────────────────────────────────────────────────────── */

function jsonLdBlock(objects) {
  return objects
    .filter(Boolean)
    .map(
      (o) =>
        `<script type="application/ld+json">${JSON.stringify(o).replace(
          /</g,
          '\\u003c'
        )}</script>`
    )
    .join('\n');
}

function crumbsHtml(crumbs) {
  return crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span>${escapeHtml(c.name)}</span>`
        : `<a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a> &rsaquo; `
    )
    .join('');
}

function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${config.siteUrl}${c.path}`,
    })),
  };
}

function layout({ title, description, canonical, image, crumbs, jsonLd, body, robots }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="${escapeHtml(robots || 'index,follow,max-image-preview:large')}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="icon" href="${config.siteUrl}/rentpondylogo.png">
<meta name="theme-color" content="#4F4B7E">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(config.brand)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(image || config.defaultImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image || config.defaultImage)}">
<style>${STYLES}</style>
${jsonLdBlock([...(jsonLd || []), breadcrumbJsonLd(crumbs)])}
</head>
<body>
<header><div class="wrap">
  <a href="/">${escapeHtml(config.brand)}</a>
  <nav>
    <a href="${config.appListingPath}">Browse properties</a>
    <a href="/add-form">Post your property free</a>
  </nav>
</div></header>
<main class="wrap">
<nav class="crumbs">${crumbsHtml(crumbs)}</nav>
${body}
</main>
<footer><div class="wrap">
  <a href="/">Home</a><a href="${config.appListingPath}">All properties</a><a href="/about">About</a><a href="/privacy-policy">Privacy</a><a href="/support">Support</a>
  <p>&copy; ${new Date().getFullYear()} ${escapeHtml(config.brand)} — rental houses, apartments, commercial spaces and land in Pondicherry &amp; Chennai. Owner listings, zero brokerage.</p>
</div></footer>
</body>
</html>`;
}

/* ── property card (used on landing pages) ────────────────────────────── */

function propertyCard(p) {
  const img = photoUrl((p.photos || [])[0]);
  const head = [bhkLabel(p), p.propertyType || 'Property'].filter(Boolean).join(' ');
  const meta = [localityLabel(p), areaLabel(p)].filter(Boolean).join(' · ');
  return `<a class="item" href="${escapeHtml(propertyPath(p))}">
  ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(`${head} for rent in ${localityLabel(p)}`)}" loading="lazy" width="320" height="170">` : ''}
  <div class="body">
    <p class="t">${escapeHtml(head)} ${isSale(p) ? 'for sale' : 'for rent'}</p>
    <p class="m">${escapeHtml(meta)}</p>
    <p class="p">${escapeHtml(formatRent(p))}</p>
  </div>
</a>`;
}

/* ── property page ────────────────────────────────────────────────────── */

const FACTS = [
  ['Property type', (p) => p.propertyType],
  // Kept here because localityLabel() leaves `nagar` out of titles/headings.
  ['Locality', (p) => titleCaseLocality(p.nagar)],
  ['Bedrooms', (p) => bhkLabel(p)],
  ['Built-up area', (p) => areaLabel(p)],
  ['Rent', (p) => formatRent(p)],
  ['Security deposit', (p) => formatPrice(p.securityDeposit)],
  ['Furnishing', (p) => p.furnished],
  ['Floor', (p) => p.floorNo],
  ['Facing', (p) => p.facing],
  ['Car parking', (p) => p.carParking],
  ['Balconies', (p) => p.balconies],
  ['Bathrooms', (p) => p.attachedBathrooms || p.bathrooms],
  ['Lift', (p) => p.lift],
  ['Property age', (p) => p.propertyAge],
  ['Available from', (p) => p.availableDate],
  ['Preferred tenant', (p) => p.rentType],
  ['Posted by', (p) => p.postedBy],
];

function propertyJsonLd(p) {
  const images = (p.photos || []).slice(0, 8).map(photoUrl).filter(Boolean);
  const city = cityOf(p);
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${[bhkLabel(p), p.propertyType].filter(Boolean).join(' ')} ${
      isSale(p) ? 'for sale' : 'for rent'
    } in ${localityLabel(p) || city.name}`,
    url: propertyUrl(p),
    description: propertyDescription(p),
    datePosted: isoDate(p.createdAt),
    dateModified: isoDate(p.updatedAt || p.createdAt),
    ...(images.length ? { image: images } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(p.area ? { streetAddress: String(p.area) } : {}),
      addressLocality: String(p.city || city.name),
      addressRegion: String(p.state || (city.base === 'CH' ? 'Tamil Nadu' : 'Puducherry')),
      ...(p.pinCode ? { postalCode: String(p.pinCode) } : {}),
      addressCountry: 'IN',
    },
    ...(Number(p.rentalAmount) > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: Number(p.rentalAmount),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: propertyUrl(p),
            ...(isSale(p)
              ? {}
              : {
                  priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: Number(p.rentalAmount),
                    priceCurrency: 'INR',
                    unitCode: 'MON',
                  },
                }),
          },
        }
      : {}),
    ...(Number(p.totalArea) > 0
      ? {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: Number(p.totalArea),
            unitText: String(p.areaUnit || 'sq.ft'),
          },
        }
      : {}),
    ...(bhkLabel(p)
      ? { numberOfBedrooms: Number(String(p.bedrooms).match(/\d+/)?.[0] || 0) }
      : {}),
    provider: {
      '@type': 'Organization',
      name: config.brand,
      url: config.siteUrl,
      logo: config.logoUrl,
    },
  };
}

export function renderPropertyPage(p, related = []) {
  const city = cityOf(p);
  const typeSlugPath = landingPath(city.slug, slugify(p.propertyType));
  const head = [bhkLabel(p), p.propertyType || 'Property'].filter(Boolean).join(' ');
  const where = localityLabel(p) || city.name;
  const images = (p.photos || []).slice(0, 6).map(photoUrl).filter(Boolean);

  const facts = FACTS.map(([label, get]) => {
    const value = get(p);
    return value && String(value).trim() && String(value).trim() !== 'N/A'
      ? `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
      : '';
  })
    .filter(Boolean)
    .join('');

  const body = `
<h1>${escapeHtml(head)} ${isSale(p) ? 'for Sale' : 'for Rent'} in ${escapeHtml(where)}</h1>
<p class="sub">Listing ID ${escapeHtml(p.rentId)} · ${escapeHtml(city.name)}${
    p.pinCode ? ` ${escapeHtml(p.pinCode)}` : ''
  }</p>
<p class="price">${escapeHtml(formatRent(p))}</p>
<p><a class="cta" href="${escapeHtml(config.appDetailPath(p.rentId))}">View all photos &amp; contact owner</a></p>

${images.length ? `<h2>Photos</h2><div class="gallery">${images
    .map(
      (src, i) =>
        `<img src="${escapeHtml(src)}" alt="${escapeHtml(
          `${head} for rent in ${where} - photo ${i + 1}`
        )}" loading="${i === 0 ? 'eager' : 'lazy'}" width="320" height="150">`
    )
    .join('')}</div>` : ''}

<h2>Property details</h2>
<div class="card"><dl class="facts">${facts}</dl></div>

${p.description ? `<h2>About this property</h2><div class="card copy"><p>${escapeHtml(
    clamp(p.description, 1200)
  )}</p></div>` : ''}

<h2>Location</h2>
<div class="card copy"><p>This ${escapeHtml(
    String(p.propertyType || 'property').toLowerCase()
  )} is located in ${escapeHtml(where)}${
    p.pinCode ? `, ${escapeHtml(p.pinCode)}` : ''
  }. Browse more <a href="${escapeHtml(typeSlugPath)}">${escapeHtml(
    p.propertyType || 'properties'
  )} for rent in ${escapeHtml(city.name)}</a>.</p></div>

${related.length ? `<h2>Similar properties for rent in ${escapeHtml(city.name)}</h2>
<div class="grid">${related.map(propertyCard).join('')}</div>` : ''}

<p style="margin-top:28px"><a class="cta" href="${escapeHtml(
    config.appDetailPath(p.rentId)
  )}">Contact the owner on ${escapeHtml(config.brand)}</a></p>`;

  return layout({
    title: propertyTitle(p),
    description: propertyDescription(p),
    canonical: propertyUrl(p),
    image: images[0],
    crumbs: [
      { name: 'Home', path: '/' },
      { name: `${city.name} rentals`, path: landingPath(city.slug) },
      ...(p.propertyType
        ? [
            {
              name: `${p.propertyType} for rent`,
              path: landingPath(city.slug, slugify(p.propertyType)),
            },
          ]
        : []),
      { name: `${head} in ${where}`, path: propertyPath(p) },
    ],
    jsonLd: [propertyJsonLd(p)],
    body,
  });
}

/* ── landing page ─────────────────────────────────────────────────────── */

function listJsonLd({ title, description, canonical, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: propertyUrl(p),
        name: `${[bhkLabel(p), p.propertyType].filter(Boolean).join(' ')} for rent in ${
          localityLabel(p)
        }`,
      })),
    },
  };
}

export function renderLandingPage({
  city,
  typeSlug,
  typeName,
  areaSlug,
  areaName,
  items,
  total,
  priceFrom,
  types,
  areas,
}) {
  const canonical = landingUrl(city.slug, typeSlug, areaSlug);
  const title = landingTitle({ cityName: city.name, typeName, areaName, count: total });
  const description = landingDescription({
    cityName: city.name,
    typeName,
    areaName,
    count: total,
    priceFrom,
  });
  const what = typeName || 'Property';
  const where = areaName ? `${areaName}, ${city.name}` : city.name;

  const chips = (links) =>
    links.length
      ? `<ul class="chips">${links
          .map((l) => `<li><a href="${escapeHtml(l.path)}">${escapeHtml(l.label)}</a></li>`)
          .join('')}</ul>`
      : '';

  const body = `
<h1>${escapeHtml(what)} for Rent in ${escapeHtml(where)}</h1>
<p class="sub">${escapeHtml(
    total
      ? `${total} verified listing${total === 1 ? '' : 's'}${
          priceFrom ? ` · from ${formatPrice(priceFrom)}/month` : ''
        }`
      : 'No live listings right now'
  )}</p>

<div class="card copy">
  <p>Looking for ${article(what)} ${escapeHtml(what.toLowerCase())} for rent in ${escapeHtml(
    where
  )}? ${escapeHtml(config.brand)} lists ${escapeHtml(
    String(total || 'new')
  )} owner-posted ${escapeHtml(
    what.toLowerCase()
  )} rentals with real photos, the actual rent and deposit, and the owner's contact — no broker in between. New properties are added every day.</p>
</div>

${types && types.length ? `<h2>Browse by property type in ${escapeHtml(city.name)}</h2>${chips(
    types.map((t) => ({
      path: landingPath(city.slug, t.typeSlug),
      label: `${t.typeName} for rent (${t.count})`,
    }))
  )}` : ''}

${areas && areas.length ? `<h2>Popular localities for ${escapeHtml(
    what.toLowerCase()
  )} rentals in ${escapeHtml(city.name)}</h2>${chips(
    areas.map((a) => ({
      path: landingPath(city.slug, typeSlug, a.areaSlug),
      label: `${a.areaName} (${a.count})`,
    }))
  )}` : ''}

<h2>${escapeHtml(
    total ? `Latest ${what.toLowerCase()} rentals in ${where}` : 'Nothing listed yet'
  )}</h2>
${
  items.length
    ? `<div class="grid">${items.map(propertyCard).join('')}</div>`
    : `<p class="empty">No ${escapeHtml(what.toLowerCase())} is listed in ${escapeHtml(
        where
      )} at the moment. <a href="${config.appListingPath}">Browse all properties</a> or <a href="/add-form">post yours free</a>.</p>`
}

${
  total > items.length
    ? `<p style="margin-top:24px"><a class="cta" href="${config.appListingPath}">See all ${total} listings in ${escapeHtml(
        city.name
      )}</a></p>`
    : ''
}`;

  return layout({
    title,
    description,
    canonical,
    crumbs: [
      { name: 'Home', path: '/' },
      { name: `${city.name} rentals`, path: landingPath(city.slug) },
      ...(typeSlug
        ? [{ name: `${typeName} for rent`, path: landingPath(city.slug, typeSlug) }]
        : []),
      ...(areaSlug
        ? [{ name: areaName, path: landingPath(city.slug, typeSlug, areaSlug) }]
        : []),
    ],
    jsonLd: [listJsonLd({ title, description, canonical, items })],
    // A landing page with nothing on it is thin content — keep it out of the
    // index until listings exist, but let the crawler follow the links.
    robots: items.length ? undefined : 'noindex,follow',
    body,
  });
}

/* ── 404 ──────────────────────────────────────────────────────────────── */

export function renderNotFound(message = 'This listing is no longer available.') {
  return layout({
    title: `Listing not available | ${config.brand}`,
    description: message,
    canonical: `${config.siteUrl}${config.appListingPath}`,
    robots: 'noindex,follow',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Not available', path: config.appListingPath },
    ],
    jsonLd: [],
    body: `<h1>This listing is not available</h1>
<p class="sub">${escapeHtml(message)}</p>
<p>It may have been rented out or removed by the owner.</p>
<p><a class="cta" href="${config.appListingPath}">Browse live rental properties</a></p>`,
  });
}
