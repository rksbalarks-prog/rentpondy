// Live Now — the data behind the panel.
//
// Reads the two endpoints the full-page Live User Activity screen already
// uses, so this adds no backend of its own:
//
//   GET /live-activity/online?minutes=N   one row per person, newest action first
//   GET /live-activity/user-flags?phones= paid / property counts for those numbers
//
// The feed is derived from what people DID — the user app records actions and
// sends no heartbeat — so a row says "viewed a property, 40 seconds ago", not
// "is on /detail/123 right now". The difference matters when somebody asks how
// it knows, and the panel's tooltips say so rather than implying a socket.

import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// Refresh while the drawer is open. The source polled at 10s and stopped dead
// when shut, which left the tab's badge frozen at whatever it read on page
// load — worth glancing at, the comment said, except it was hours stale.
// Polling slowly while shut keeps the badge honest without hammering.
export const POLL_OPEN_MS = 10000;
export const POLL_SHUT_MS = 60000;

// Above this, the row is somebody who WAS here rather than somebody who is.
// Five minutes because the app records actions and sends no heartbeat —
// reading one listing for four minutes writes nothing.
export const ONLINE_SECS = 300;

// The windows the dropdown offers. The server clamps `minutes` to 240, so
// nothing beyond four hours is worth offering: the two lists have to agree.
export const WINDOWS = [5, 15, 30, 60, 240];

const K_MINS = 'rpLeadPanelMins';
const K_WHO = 'rpLeadPanelWho';
const K_WHERE = 'rpLeadPanelWhere';

const store = (k, v) => {
  try {
    if (v === undefined) return window.localStorage.getItem(k);
    window.localStorage.setItem(k, v);
    return null;
  } catch (e) {
    return null;
  }
};

// "240 minutes" is a true thing to say and a bad thing to read.
export const winLabel = (m) => {
  const n = parseInt(m, 10) || 0;
  if (n < 60) return `${n} minutes`;
  const h = n / 60;
  return `${h} ${h === 1 ? 'hour' : 'hours'}`;
};

export const ago = (secs) => {
  const s = parseInt(secs, 10) || 0;
  if (s < 45) return 'just now';
  if (s < 90) return '1 min ago';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  const h = Math.floor(s / 3600);
  return `${h} ${h === 1 ? 'hr' : 'hrs'} ago`;
};

// Cosmetic only. The online endpoint groups rows and does not currently carry
// the machine action code, so this falls back to a neutral card rather than
// guessing from free text — `label` is `label || action`, which is sometimes
// the code and sometimes a sentence.
export const toneOf = (action = '') => {
  const a = String(action).toUpperCase();
  if (a.startsWith('CONTACT') || a === 'CALL_OWNER') return 'lp-contact';
  if (a.startsWith('PAYMENT') || a.startsWith('POINTS') || a === 'PLAN_SELECT') return 'lp-payment';
  if (a.startsWith('PROPERTY')) return 'lp-property';
  if (a.startsWith('FAVOURITE') || a.startsWith('INTEREST')) return 'lp-favourite';
  if (a.startsWith('OTP') || a === 'LOGIN') return 'lp-login';
  return 'lp-view';
};

const readWho = () => {
  const who = store(K_WHO);
  if (who === null || who === undefined) return { free: true, paid: true };
  // An empty string is a real answer here — both boxes off — so this tests
  // for null rather than for truth.
  return { free: who.indexOf('F') >= 0, paid: who.indexOf('P') >= 0 };
};

// Web browser vs the Android app. Same "empty string is an answer" rule.
const readWhere = () => {
  const w = store(K_WHERE);
  if (w === null || w === undefined) return { web: true, app: true };
  return { web: w.indexOf('W') >= 0, app: w.indexOf('A') >= 0 };
};

export default function useLiveNow(open) {
  const [rows, setRows] = useState([]);
  const [minutes, setMinutesState] = useState(() => {
    const m = parseInt(store(K_MINS), 10);
    return WINDOWS.indexOf(m) >= 0 ? m : 60;
  });
  const [who, setWhoState] = useState(readWho);
  const [where, setWhereState] = useState(readWhere);
  const [flags, setFlags] = useState({});
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const flagsRef = useRef({}); // phone -> { paid, properties, statuses }
  const seenRef = useRef({}); // keys from the previous refresh
  const firstRef = useRef(true); // a first list is not a list of arrivals
  const busyRef = useRef(false);
  const minutesRef = useRef(minutes);
  minutesRef.current = minutes;

  // Paid/free colouring is cosmetic — never block the feed on it.
  const loadFlags = useCallback(async (list) => {
    try {
      const wanted = Array.from(
        new Set(list.map((r) => r.phone).filter((p) => p && !(p in flagsRef.current)))
      ).slice(0, 200);
      if (!wanted.length) return;

      // Mark in-flight so a fast poll does not ask for the same number twice.
      wanted.forEach((p) => { flagsRef.current[p] = flagsRef.current[p] || null; });

      const res = await axios.get(`${API}/live-activity/user-flags`, {
        params: { phones: wanted.join(',') },
      });
      flagsRef.current = { ...flagsRef.current, ...(res.data?.flags || {}) };
      setFlags({ ...flagsRef.current });
    } catch (e) {
      /* cosmetic */
    }
  }, []);

  const load = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await axios.get(`${API}/live-activity/online`, {
        params: { minutes: minutesRef.current },
      });
      const fresh = res.data?.rows || [];

      const marked = fresh.map((r) => {
        const key = r._id || r.phone || r.sessionId;
        const secs = r.at ? Math.max(0, Math.floor((Date.now() - new Date(r.at).getTime()) / 1000)) : 0;
        return {
          ...r,
          key,
          secs,
          isNew: !firstRef.current && !seenRef.current[key],
        };
      });

      seenRef.current = {};
      marked.forEach((r) => { seenRef.current[r.key] = 1; });
      firstRef.current = false;

      setRows(marked);
      setUpdatedAt(new Date());
      loadFlags(marked);
    } catch (e) {
      // Silent by design: this is an ambient panel, and a dropped poll must
      // never throw a dialog over the page the user is actually working on.
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [loadFlags]);

  // A new window is a fresh list, not a list of new arrivals.
  const setMinutes = useCallback((m) => {
    const n = parseInt(m, 10) || 60;
    firstRef.current = true;
    setMinutesState(n);
    store(K_MINS, String(n));
  }, []);

  // The boxes filter what is already in hand, so ticking one is instant —
  // no request, and no waiting out the poll.
  const setWho = useCallback((next) => {
    setWhoState(next);
    store(K_WHO, `${next.free ? 'F' : ''}${next.paid ? 'P' : ''}`);
  }, []);

  const setWhere = useCallback((next) => {
    setWhereState(next);
    store(K_WHERE, `${next.web ? 'W' : ''}${next.app ? 'A' : ''}`);
  }, []);

  // Refetch whenever the window changes, and on mount so the badge has a
  // number before anybody opens the drawer.
  useEffect(() => { load(); }, [minutes, load]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, open ? POLL_OPEN_MS : POLL_SHUT_MS);
    return () => clearInterval(id);
  }, [open, load]);

  // Coming back to a tab that sat in the background for an hour should not
  // show an hour-old list until the next tick.
  useEffect(() => {
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [load]);

  // Counted before filtering, so the numbers beside the boxes say what is out
  // there rather than what is being shown. Each pair is counted independently,
  // so unticking Paid does not make the App total drop too.
  let nFree = 0;
  let nPaid = 0;
  let nWeb = 0;
  let nApp = 0;
  rows.forEach((r) => {
    if (r.phone && flags[r.phone]?.paid) nPaid += 1; else nFree += 1;
    if (r.platform === 'App') nApp += 1; else nWeb += 1;
  });

  const visible = rows.filter((r) => {
    const paid = !!(r.phone && flags[r.phone]?.paid);
    const isApp = r.platform === 'App';
    return (paid ? who.paid : who.free) && (isApp ? where.app : where.web);
  });

  return {
    rows: visible,
    total: rows.length,
    nFree,
    nPaid,
    nWeb,
    nApp,
    flags,
    minutes,
    setMinutes,
    who,
    setWho,
    where,
    setWhere,
    updatedAt,
    loading,
    reload: load,
  };
}
