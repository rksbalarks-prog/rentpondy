import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback, useRef,
} from 'react';
import axios from 'axios';

/*
 * FollowupContext
 * ----------------
 * Loads the two follow-up lists once for the whole dashboard and exposes a
 * pair of phone-number Sets (owner / tenant). Components like <PhoneCell />
 * use these Sets to colour the number red (no follow-up) or green
 * (follow-up exists) and to drive double-click navigation.
 *
 * - Backed by a module-level cache so the lists survive component remounts
 *   while the user clicks around the dashboard.
 * - `refresh()` is called automatically after a navigation that may have
 *   created a follow-up (the create pages call window.dispatchEvent(
 *   new Event('followups-updated')) on success — see CreateFollowUp /
 *   CreateBuyerFollowUp).
 */

const API = process.env.REACT_APP_API_URL;

// Normalize phone: strip non-digits and any leading country code.
// We compare the trailing 10 digits so "+91 9876543210", "91-98765 43210"
// and "9876543210" all collapse to the same key.
export const normalizePhone = (raw) => {
  if (raw === null || raw === undefined) return '';
  const digits = String(raw).replace(/\D+/g, '');
  if (!digits) return '';
  return digits.length > 10 ? digits.slice(-10) : digits;
};

// Module-level cache so we don't refetch on every page navigation.
let cache = {
  ownerPhones: new Set(),
  tenantPhones: new Set(),
  noResponsePhones: new Set(),
  visitorPhones: new Set(),
  loaded: false,
  promise: null,
};

const fetchOnce = async () => {
  if (cache.loaded) return cache;
  if (cache.promise) return cache.promise;

  cache.promise = (async () => {
    const safeGet = (url) => axios.get(url).then(r => r.data).catch(() => null);
    const [ownerRes, tenantRes, noResponseRes, visitorRes] = await Promise.all([
      safeGet(`${API}/followup-list`),
      safeGet(`${API}/followup-list-buyer`),
      safeGet(`${API}/noresponse-followup-list`),
      safeGet(`${API}/visitor-followup-list`),
    ]);

    const collectPhones = (res) => {
      const set = new Set();
      const arr = Array.isArray(res?.data) ? res.data : [];
      arr.forEach((f) => {
        const p = normalizePhone(f?.phoneNumber || f?.phone);
        if (p) set.add(p);
      });
      return set;
    };

    const ownerPhones = collectPhones(ownerRes);
    const tenantPhones = collectPhones(tenantRes);
    const noResponsePhones = collectPhones(noResponseRes);
    const visitorPhones = collectPhones(visitorRes);

    cache = { ownerPhones, tenantPhones, noResponsePhones, visitorPhones, loaded: true, promise: null };
    return cache;
  })();

  return cache.promise;
};

const Ctx = createContext({
  ownerPhones: new Set(),
  tenantPhones: new Set(),
  noResponsePhones: new Set(),
  visitorPhones: new Set(),
  loaded: false,
  refresh: () => {},
  hasFollowup: () => false,
});

export const FollowupProvider = ({ children }) => {
  const [state, setState] = useState({
    ownerPhones: cache.ownerPhones,
    tenantPhones: cache.tenantPhones,
    noResponsePhones: cache.noResponsePhones,
    visitorPhones: cache.visitorPhones,
    loaded: cache.loaded,
  });

  // Track mount so we don't setState after unmount during the initial fetch.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    const c = await fetchOnce();
    if (!mountedRef.current) return;
    setState({
      ownerPhones: new Set(c.ownerPhones),
      tenantPhones: new Set(c.tenantPhones),
      noResponsePhones: new Set(c.noResponsePhones),
      visitorPhones: new Set(c.visitorPhones),
      loaded: true,
    });
  }, []);

  const refresh = useCallback(async () => {
    cache = { ownerPhones: new Set(), tenantPhones: new Set(), noResponsePhones: new Set(), visitorPhones: new Set(), loaded: false, promise: null };
    await load();
  }, [load]);

  useEffect(() => {
    if (!state.loaded) load();
    const onUpdate = () => refresh();
    window.addEventListener('followups-updated', onUpdate);
    return () => window.removeEventListener('followups-updated', onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasFollowup = useCallback((phone, type) => {
    const p = normalizePhone(phone);
    if (!p) return false;
    if (type === 'owner') return state.ownerPhones.has(p);
    if (type === 'tenant') return state.tenantPhones.has(p);
    if (type === 'noresponse') return state.noResponsePhones.has(p);
    if (type === 'visitor') return state.visitorPhones.has(p);
    // fallback (e.g. type 'any'): any bucket counts as "has follow-up"
    return state.ownerPhones.has(p) || state.tenantPhones.has(p) || state.noResponsePhones.has(p) || state.visitorPhones.has(p);
  }, [state]);

  const value = useMemo(() => ({
    ownerPhones: state.ownerPhones,
    tenantPhones: state.tenantPhones,
    noResponsePhones: state.noResponsePhones,
    visitorPhones: state.visitorPhones,
    loaded: state.loaded,
    refresh,
    hasFollowup,
  }), [state, refresh, hasFollowup]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useFollowups = () => useContext(Ctx);
