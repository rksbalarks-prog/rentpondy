// The ONLY path from the assistant to data. Every tool calls the app's own REST
// endpoints through here (config.apiBase). The AI never touches Mongo, and it can
// only reach what these endpoints expose. The caller's phone is injected by the
// tools SERVER-SIDE (from the verified session) — it is never taken from model args.

import axios from 'axios';
import config from '../config.js';

const http = axios.create({
  baseURL: config.apiBase,
  timeout: 30000, // the on-demand list endpoint can be slow (~1.5 MB, flaky on prod)
  headers: { Accept: 'application/json' },
  // base=ALL means the city-scope plugin applies no restriction (see server.js).
  params: { base: 'ALL' },
});

export async function apiGet(path, params = {}) {
  const res = await http.get(path, { params });
  return res.data;
}

export async function apiPost(path, body = {}) {
  const res = await http.post(path, body);
  return res.data;
}

// In-memory cache for the heavy list endpoint. Because prod intermittently stalls
// on it, this cache is also a resilience layer: on a fetch failure we serve the
// last good copy (stale) rather than failing the whole search. One retry first.
const _cache = new Map();
export async function apiGetCached(path, params = {}, ttlMs = 300000, now = Date.now()) {
  const key = path + '?' + JSON.stringify(params);
  const hit = _cache.get(key);
  if (hit && now - hit.at < ttlMs) return hit.data;

  try {
    const data = await apiGet(path, params);
    _cache.set(key, { at: now, data });
    return data;
  } catch (e1) {
    try {
      const data = await apiGet(path, params); // retry once
      _cache.set(key, { at: now, data });
      return data;
    } catch (e2) {
      if (hit) return hit.data; // serve stale rather than break the assistant
      throw e2;
    }
  }
}

export default { apiGet, apiPost, apiGetCached };
