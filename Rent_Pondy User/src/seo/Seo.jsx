// Per-page <head> tags for the React app.
//
// react-helmet is already a dependency; this wraps it so every page sets the
// same set of tags in the same order. Without this the whole SPA shares the one
// <title> in public/index.html, and Google indexes every route as
// "RentPondy | Properties".
//
// Usage:
//   <Seo title="..." description="..." canonical="https://rentpondy.com/..." />
//   <Seo {...} jsonLd={propertyJsonLd(property)} image={propertyImage(property)} />

import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_URL, BRAND, DEFAULT_IMAGE } from './seoMeta';

export default function Seo({
  title,
  description,
  canonical,
  image,
  jsonLd,
  // Pages behind a login, payment flows and anything transactional should not
  // be indexed — pass noindex on those.
  noindex = false,
  children,
}) {
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const img = image || DEFAULT_IMAGE;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta
        name="robots"
        content={noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}
      />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={img} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
      {children}
    </Helmet>
  );
}
