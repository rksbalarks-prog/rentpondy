// The lead panels — a rail of tabs down the right edge of every admin page,
// each opening a drawer over whatever screen you are on.
//
// Ported from PM_Matri_Admin, where this is five panels mounted from the PHP
// layout. This is the shell plus the first of them (Live Now); a second panel
// is one entry in PANELS below and one component, because the rail measures
// nothing and stacks with flexbox.
//
// Only one drawer is open at a time — they occupy the same strip of screen, so
// one has to give way — and which one was left open survives a refresh.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

import LiveNowPanel from './LiveNowPanel';
import useLiveNow from './useLiveNow';
import useLeadPanelPermission from './useLeadPanelPermission';
import './leadPanels.css';

const K_OPEN = 'rpLeadPanelOpen';
const K_FOLDED = 'rpLeadPanelsFolded';

const store = (k, v) => {
  try {
    if (v === undefined) return window.localStorage.getItem(k);
    window.localStorage.setItem(k, v);
    return null;
  } catch (e) {
    return null;
  }
};

// Adding a panel: one entry here, one component, nothing else.
const PANELS = [{ id: 'live', label: 'LIVE NOW' }];

const LeadPanelsInner = () => {
  const [folded, setFolded] = useState(() => store(K_FOLDED) === '1');
  // A drawer restored open while the rail is folded would have no tab to shut
  // it by, so the fold wins on the way in.
  const [openId, setOpenId] = useState(() =>
    (store(K_FOLDED) === '1' ? null : store(K_OPEN) || null));
  const [beat, setBeat] = useState(false);

  const live = useLiveNow(openId === 'live');
  const count = live.rows.length;
  const prevCount = useRef(count);
  const filled = useRef(false); // has a real payload landed yet?

  // A quiet pulse when the number grows, so a glance at the edge of the
  // screen is worth taking. Never on the first fill — going from an empty
  // list to the list is not an arrival, and a badge that pulses every page
  // load is a badge nobody reads.
  useEffect(() => {
    if (live.loading) return undefined;
    if (!filled.current) {
      filled.current = true;
      prevCount.current = count;
      return undefined;
    }
    if (count > prevCount.current) {
      setBeat(true);
      const id = setTimeout(() => setBeat(false), 950);
      prevCount.current = count;
      return () => clearTimeout(id);
    }
    prevCount.current = count;
    return undefined;
  }, [count, live.loading]);

  // Written straight rather than through an updater: these also touch
  // localStorage, and an updater has to stay pure.
  const toggle = useCallback((id) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    store(K_OPEN, next || '');
  }, [openId]);

  const close = useCallback(() => {
    setOpenId(null);
    store(K_OPEN, '');
  }, []);

  const fold = useCallback(() => {
    const next = !folded;
    setFolded(next);
    store(K_FOLDED, next ? '1' : '0');
    // A folded rail with a drawer still open would leave the drawer with no
    // tab to shut it by.
    if (next) close();
  }, [folded, close]);

  // Escape shuts the drawer, the way every other overlay in the admin does —
  // unless a dialog opened FROM the drawer is on top of it, in which case
  // Escape belongs to that dialog and closing the drawer underneath would
  // dismiss both at once.
  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('.modal.show')) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId, close]);

  const countFor = (id) => (id === 'live' ? count : 0);

  return (
    <>
      <div className={`lp-rail${openId ? ' lp-rail-shifted' : ''}`}>
        <button
          type="button"
          className="lp-toggle"
          onClick={fold}
          title={folded ? 'Show the lead panels' : 'Hide the lead panels'}
          aria-label={folded ? 'Show the lead panels' : 'Hide the lead panels'}
        >
          {folded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {folded
          ? null
          : PANELS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`lp-tab${beat && p.id === 'live' ? ' lp-beat' : ''}`}
                onClick={() => toggle(p.id)}
                aria-expanded={openId === p.id}
                title={`${p.label} — ${countFor(p.id)} right now`}
              >
                <span className="lp-count">{countFor(p.id)}</span>
                {p.label}
              </button>
            ))}
      </div>

      <LiveNowPanel open={openId === 'live'} onClose={close} live={live} />
    </>
  );
};

// The gate is a separate component on purpose: the polling lives in the inner
// one, so a role without the permission never mounts it and never asks the
// server for anything.
const LeadPanels = () => (useLeadPanelPermission() ? <LeadPanelsInner /> : null);

export default LeadPanels;
