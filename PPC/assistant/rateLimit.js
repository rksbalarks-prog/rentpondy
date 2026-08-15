// Per-user sliding-window rate limiter (in-memory). Buckets keyed by user + kind.
// chat ~30/5min, voice ~40/5min (configurable). Single-process; for the current
// single-pm2-process deployment this is sufficient.

import config from './config.js';
import { getSettingsSync } from './settings.js';

const buckets = new Map(); // `${key}:${kind}` -> number[] (timestamps)

export function checkRate(key, kind, now = Date.now()) {
  const s = getSettingsSync(); // admin-editable limits (fall back to env config)
  const limit = kind === 'voice' ? s.rateVoice : s.rateChat;
  const windowMs = config.rate.windowMs;
  const id = `${key}:${kind}`;

  const arr = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    const retryAfterMs = windowMs - (now - arr[0]);
    buckets.set(id, arr);
    return { ok: false, retryAfterMs, limit, remaining: 0 };
  }
  arr.push(now);
  buckets.set(id, arr);
  return { ok: true, retryAfterMs: 0, limit, remaining: limit - arr.length };
}

export default { checkRate };
