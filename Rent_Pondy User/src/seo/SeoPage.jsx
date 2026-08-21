// Canonical + title/description wrapper for the app's static pages.
//
// The marketing / legal routes (/plans, /about, /privacy-policy, ...) render
// components that were written long before the SEO layer and have no <Seo> of
// their own. Rather than editing each of them, the route wraps them here:
//
//   <Route path='/plans' element={<SeoPage path='/plans'><PricingPlans /></SeoPage>} />
//
// The canonical is derived from `path`, so a wrapped page is always
// self-canonical and can finally be indexed on its own. See STATIC_PAGE_SEO in
// ./seoMeta.js for why that matters.

import React from 'react';
import Seo from './Seo';
import { SITE_URL, STATIC_PAGE_SEO } from './seoMeta';

export default function SeoPage({ path, children }) {
  const meta = STATIC_PAGE_SEO[path];

  // An unlisted path is not an error — render the page untouched and let it
  // self-canonicalise, exactly as it did before.
  if (!meta) return <>{children}</>;

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        canonical={`${SITE_URL}${path}`}
      />
      {children}
    </>
  );
}
