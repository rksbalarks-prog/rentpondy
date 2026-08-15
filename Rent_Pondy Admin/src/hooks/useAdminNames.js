import { useEffect, useState } from 'react';
import axios from 'axios';

/*
 * useAdminNames
 * --------------
 * Fetches the live staff list from the same endpoint the Create Staff – List
 * page uses (`GET /admin-all`) and returns just the `name` strings,
 * de-duplicated and alphabetically sorted.
 *
 *   const { names, loading, refresh } = useAdminNames();
 *
 * - Backed by a module-level cache + in-flight promise so multiple components
 *   mounting at the same time fan out to a single network call.
 * - Listens for the global `admins-updated` event so any code that creates /
 *   edits / deletes a staff entry can `window.dispatchEvent(new Event('admins-updated'))`
 *   to refresh every consumer.
 */

const API = process.env.REACT_APP_API_URL;

let cache = {
  names: [],
  loaded: false,
  promise: null,
};

const fetchOnce = async () => {
  if (cache.loaded) return cache.names;
  if (cache.promise) return cache.promise;

  cache.promise = (async () => {
    try {
      const res = await axios.get(`${API}/admin-all`);
      const list = Array.isArray(res?.data) ? res.data : [];
      const set = new Set();
      list.forEach((u) => {
        const n = String(u?.name || '').trim();
        // Hide the bootstrap superadmin from end-user pickers — it's not a real staff name.
        if (n && n.toLowerCase() !== 'superadminrent') set.add(n);
      });
      cache.names = Array.from(set).sort((a, b) => a.localeCompare(b));
      cache.loaded = true;
      return cache.names;
    } catch (err) {
      // On error, leave `loaded` false so the next mount will retry.
      cache.promise = null;
      throw err;
    }
  })();

  return cache.promise;
};

export default function useAdminNames() {
  const [names, setNames] = useState(cache.names);
  const [loading, setLoading] = useState(!cache.loaded);

  useEffect(() => {
    let cancelled = false;
    if (!cache.loaded) {
      setLoading(true);
      fetchOnce()
        .then((n) => { if (!cancelled) { setNames(n); setLoading(false); } })
        .catch(() => { if (!cancelled) setLoading(false); });
    }
    const onUpdate = () => {
      cache = { names: [], loaded: false, promise: null };
      fetchOnce()
        .then((n) => { if (!cancelled) setNames(n); })
        .catch(() => {});
    };
    window.addEventListener('admins-updated', onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener('admins-updated', onUpdate);
    };
  }, []);

  const refresh = () => {
    cache = { names: [], loaded: false, promise: null };
    return fetchOnce().then(setNames).catch(() => {});
  };

  return { names, loading, refresh };
}
