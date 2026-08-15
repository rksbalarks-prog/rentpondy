// Single entrypoint for the assistant. server.js does exactly:
//   import assistant from './assistant/index.js';
//   assistant.mount(app);
// Everything else is contained in this folder (additive layer).

import config from './config.js';
import AssistantRouter from './AssistantRouter.js';
import searchRoute, { ensureSearchIndexes } from './searchRoute.js';
import adminLeadRoute from './adminLeadRoute.js';
import adminChatHistoryRoute from './adminChatHistoryRoute.js';
import adminGuardrailRoute from './adminGuardrailRoute.js';
import adminSettingsRoute from './adminSettingsRoute.js';
import { getSettings } from './settings.js';
import { apiGetCached } from './tools/httpClient.js';

// Keep the heavy property-list cache warm so the first search is fast and a flaky
// prod response never blocks the assistant (stale copy is served on failure).
function warmSearchCache() {
  apiGetCached('/fetch-active-users-on-demand-rent', {})
    .then((d) => {
      const n = (d?.users || d?.data || []).length;
      console.log(`[assistant] search cache warmed (${n} listings)`);
    })
    .catch((e) => console.warn('[assistant] cache warm failed:', e.message));
}

function mount(app) {
  if (!config.enabled) {
    console.log('[assistant] disabled (ASSISTANT_ENABLED=false)');
    return;
  }

  // Lean indexed search endpoint -> /PPC/assistant/search-properties. Used
  // in-process after deploy; harmless otherwise. Also ensures the search indexes.
  app.use('/PPC', searchRoute);

  // Admin lead management (open, like the rest of the admin API) ->
  // /PPC/assistant/admin/owner-leads
  app.use('/PPC', adminLeadRoute);

  // Admin AI chat history (per-user tokens + downloadable transcript) ->
  // /PPC/assistant/admin/chat-history
  app.use('/PPC', adminChatHistoryRoute);

  // Admin guardrail visibility (read-only) — logged manipulation attempts + the
  // auto-learned attack patterns -> /PPC/assistant/admin/guardrail-*
  app.use('/PPC', adminGuardrailRoute);

  // Admin live settings (enable/disable, points cost, rate/budget, prompt & rules)
  // -> /PPC/assistant/admin/settings. Warm the cache so the first request is fast.
  app.use('/PPC', adminSettingsRoute);
  getSettings(true).catch(() => {});

  // Assistant API surface.
  app.use('/api/assistant', AssistantRouter);

  // Create indexes in the background — never blocks startup.
  ensureSearchIndexes()
    .then((idx) => console.log(`[assistant] search indexes ensured (${idx.length})`))
    .catch((e) => console.warn('[assistant] index ensure failed:', e.message));

  // Warm the search cache now, then refresh within the 5-min TTL so it never
  // expires during normal use. best-effort, non-blocking.
  if (!config.useLeanSearch) {
    warmSearchCache();
    const timer = setInterval(warmSearchCache, 4 * 60 * 1000);
    if (timer.unref) timer.unref();
  }

  console.log(
    `[assistant] mounted /api/assistant (provider=${config.provider}, apiBase=${config.apiBase}, leanSearch=${config.useLeanSearch})`
  );
}

export default { mount };
