// Single entrypoint for the SEO layer. server.js does exactly:
//   import seo from './Seo/index.js';
//   seo.mount(app);
// Everything else is contained in this folder (additive layer — no existing
// route, model or collection is touched).

import config from './seoConfig.js';
import SeoRouter, { sitemapRouter } from './SeoRouter.js';
import { clearSeoCache } from './seoData.js';

function mount(app) {
  if (!config.enabled) {
    console.log('[seo] disabled (SEO_ENABLED=false)');
    return;
  }

  // Node root: the clean https://rentpondy.com/... paths, live once the nginx
  // block in ./nginx.conf.txt is applied.
  app.use(SeoRouter);

  // /PPC alias for the sitemaps only, so the whole set can be verified at
  // https://rentpondy.com/PPC/sitemap.xml *before* touching nginx.
  //
  // Sitemaps only, deliberately: /PPC/property/:rentId and /PPC/rent/... are
  // live API routes (AddRouter.js) that the app itself calls. They are declared
  // earlier in server.js so they would win anyway, but not mounting the page
  // routes here removes the trap entirely.
  app.use('/PPC', sitemapRouter);

  // Admin escape hatch: drop the sitemap/landing caches after a bulk import so
  // the next crawl sees the new listings immediately instead of within 30 min.
  app.post('/PPC/seo/flush-cache', (req, res) => {
    clearSeoCache();
    res.json({ success: true, message: 'SEO cache cleared' });
  });

  console.log(`[seo] mounted sitemap + /property + /rent pages (site=${config.siteUrl})`);
}

export default { mount };
