// Title / description / canonical builders for the React app.
//
// Deliberately mirrors PPC/Seo/seoUtils.js so that the server-rendered page at
// /property/:rentId/:slug and the SPA page at /detail/:rentId describe a listing
// identically — a mismatch there is what makes Google pick the "wrong" title.
// If you change a pattern here, change it there too.

export const SITE_URL = 'https://rentpondy.com';
export const BRAND = 'RentPondy';
export const DEFAULT_IMAGE = `${SITE_URL}/rentpondylogo.png`;

const TITLE_BUDGET = 60;

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function clamp(text, max) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/** Keep the brand suffix intact: use the first candidate that fits. */
function withBrand(candidates) {
  const suffix = ` | ${BRAND}`;
  const room = TITLE_BUDGET - suffix.length;
  const fits = candidates.find((c) => c && c.length <= room);
  return `${fits || clamp(candidates.filter(Boolean).pop() || BRAND, room)}${suffix}`;
}

export function isSale(p = {}) {
  return /sale|sell|buy/i.test(String(p.propertyMode || ''));
}

export function bhkLabel(p = {}) {
  const n = String(p.bedrooms || '').match(/\d+/);
  return n ? `${n[0]} BHK` : '';
}

export function formatPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return '';
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatRent(p = {}) {
  const price = formatPrice(p.rentalAmount);
  if (!price) return 'Price on request';
  return isSale(p) ? price : `${price}/month`;
}

export function areaLabel(p = {}) {
  const n = Number(p.totalArea);
  if (!Number.isFinite(n) || n <= 0) return '';
  return `${n.toLocaleString('en-IN')} ${String(p.areaUnit || 'sq.ft').trim()}`;
}

export function cityName(p = {}) {
  return /chenn?ai|madras/i.test(`${p.city || ''} ${p.district || ''}`)
    ? 'Chennai'
    : 'Pondicherry';
}

/** "amathi nagar" -> "Amathi Nagar", but "R A Puram" / "CIT Colony" untouched. */
export function titleCaseLocality(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .map((w) => (w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/**
 * "Kurumbapet, Pondicherry" — area + city only. `nagar` is left out on purpose;
 * see the note on localityLabel() in PPC/Seo/seoUtils.js.
 */
export function localityLabel(p = {}) {
  const seen = new Set();
  return [p.area, p.city || p.district]
    .map((x) => titleCaseLocality(x))
    .filter(Boolean)
    .filter((x) => {
      const k = x.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .join(', ');
}

/**
 * The crawler-facing URL for a listing. The SPA's own /detail/:rentId route
 * points its canonical here so both URLs consolidate into one indexed page.
 */
export function propertyCanonical(p = {}) {
  const slug = slugify(
    [
      bhkLabel(p),
      p.propertyType,
      isSale(p) ? 'for sale in' : 'for rent in',
      p.area || p.city || p.district,
      cityName(p),
    ]
      .filter(Boolean)
      .join(' ')
  );
  return `${SITE_URL}/property/${p.rentId}/${slug || 'rental-property'}`;
}

export function propertyTitle(p = {}) {
  const head = [bhkLabel(p), p.propertyType || 'Property'].filter(Boolean).join(' ');
  const verb = isSale(p) ? 'for Sale in' : 'for Rent in';
  const where = localityLabel(p) || cityName(p);
  const area = titleCaseLocality(p.area);
  return withBrand([
    `${head} ${verb} ${where} - ${formatRent(p)}`,
    `${head} ${verb} ${where}`,
    // Keep the locality even when "<area>, <city>" will not fit.
    area ? `${head} ${verb} ${area}` : '',
    `${head} ${verb} ${cityName(p)}`,
  ]);
}

export function propertyDescription(p = {}) {
  const facts = [
    bhkLabel(p),
    p.propertyType,
    areaLabel(p),
    p.furnished ? `${p.furnished} furnished` : '',
    p.carParking && p.carParking !== 'No' ? 'car parking' : '',
  ]
    .filter(Boolean)
    .join(', ');
  const where = localityLabel(p) || cityName(p);
  const own = String(p.description || '').replace(/\s+/g, ' ').trim();
  const base = `${facts} ${isSale(p) ? 'for sale' : 'for rent'} in ${where} at ${formatRent(p)}.`;
  return clamp(
    own
      ? `${base} ${own}`
      : `${base} Verified listing on ${BRAND} - view photos and contact the owner directly, no brokerage.`,
    158
  );
}

/** First photo as an absolute URL, matching how the app renders images. */
export function propertyImage(p = {}) {
  const first = (p.photos || [])[0];
  if (!first) return DEFAULT_IMAGE;
  const path = String(first).replace(/\\/g, '/').replace(/^\/+/, '').trim();
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}/PPC/${path}`;
}

/** schema.org RealEstateListing for the SPA detail page. */
export function propertyJsonLd(p = {}) {
  const city = cityName(p);
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyTitle(p).replace(` | ${BRAND}`, ''),
    url: propertyCanonical(p),
    description: propertyDescription(p),
    image: propertyImage(p),
    address: {
      '@type': 'PostalAddress',
      ...(p.area ? { streetAddress: String(p.area) } : {}),
      addressLocality: String(p.city || city),
      addressRegion: String(p.state || (city === 'Chennai' ? 'Tamil Nadu' : 'Puducherry')),
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
            url: propertyCanonical(p),
          },
        }
      : {}),
  };
}

/**
 * Title / description for the app's static marketing and legal pages.
 *
 * These routes render plain components with no <Seo> of their own, so they used
 * to inherit the one hardcoded canonical in public/index.html and told Google
 * "index the homepage instead of me" — while sitemap-pages.xml
 * (PPC/Seo/SeoRouter.js) was submitting them for indexing. That contradiction is
 * what Search Console reports as "Alternate page with proper canonical tag", and
 * it kept every one of these pages out of the index.
 *
 * Keyed by the exact route path; the canonical is derived from the key, so a
 * page listed here is always self-canonical. Consumed by SeoPage.jsx.
 */
export const STATIC_PAGE_SEO = {
  '/plans': {
    title: `Rental Listing Plans & Pricing | ${BRAND}`,
    description:
      'Compare RentPondy plans for property owners — listing duration, number of properties and tenant contacts included. Zero brokerage, pay only for what you post.',
  },
  '/add-form': {
    title: `Post Your Property for Rent - Free | ${BRAND}`,
    description:
      'List your house, apartment, commercial space or land for rent in Pondicherry and Chennai. Add photos, rent and locality in minutes and reach tenants directly.',
  },
  '/about': {
    title: `About Us - Zero Brokerage Rentals | ${BRAND}`,
    description:
      'RentPondy connects property owners in Pondicherry and Chennai directly with tenants — owner-posted listings, real photos and real rent, with no broker in between.',
  },
  '/support': {
    title: `Support & Help Centre | ${BRAND}`,
    description:
      'Need help with a listing, a plan or your RentPondy account? Find answers to common questions and get in touch with the RentPondy support team.',
  },
  '/business': {
    title: `Business Opportunity - Partner With Us | ${BRAND}`,
    description:
      'Partner with RentPondy. Explore business and franchise opportunities with Pondicherry and Chennai’s owner-direct rental property platform.',
  },
  '/privacy-policy': {
    title: `Privacy Policy | ${BRAND}`,
    description:
      'How RentPondy collects, uses, stores and protects your personal information, and the choices you have over your data.',
  },
  '/refund-policy': {
    title: `Refund & Cancellation Policy | ${BRAND}`,
    description:
      'RentPondy’s refund and cancellation terms for listing plans and points purchases, including how to raise a refund request.',
  },
};
