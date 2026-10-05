// Can this admin see the lead panels?
//
// The panels show the same live phone numbers and activity as the full-page
// Live User Activity screen, which is gated on the permission of that name in
// both Dashboard's route table and the sidebar. Mounting the panels on every
// page without the same gate would hand that data to roles explicitly denied
// it — so they answer to the same key.
//
// Reads the `rolePermissions` cache the Sidebar already writes, and listens to
// the same `permissionsUpdated` event it does, so a permission change reaches
// the panels without a reload. Only fetches for itself when there is no cache
// to read (first login), which keeps this from doubling the request.
//
// Fails CLOSED: hidden until the permission is known. `can()` in the Sidebar
// defaults open while loading, which is right for a nav item that would
// otherwise flicker, and wrong for an ambient panel that would flash live
// customer numbers at somebody not allowed to see them.

import { useEffect, useState } from 'react';
import axios from 'axios';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export const LEAD_PANEL_PERMISSION = 'Live User Activity';

const allowedFrom = (perms, role) => {
  if (!Array.isArray(perms) || !role) return [];
  const rp = perms.find((p) => p.role === role);
  return rp?.viewedFiles?.map((f) => String(f).trim()) || [];
};

export default function useLeadPanelPermission() {
  const [allowed, setAllowed] = useState(null); // null = not known yet

  useEffect(() => {
    const adminRole = localStorage.getItem('adminRole');
    if (!adminRole) {
      setAllowed(false);
      return undefined;
    }

    let alive = true;
    const apply = (perms) => {
      if (!alive) return;
      setAllowed(allowedFrom(perms, adminRole).includes(LEAD_PANEL_PERMISSION));
    };

    let hadCache = false;
    try {
      const cached = localStorage.getItem('rolePermissions');
      if (cached) {
        apply(JSON.parse(cached));
        hadCache = true;
      }
    } catch (e) {
      /* unreadable cache is the same as no cache */
    }

    // Only when the Sidebar has not already cached it for us.
    if (!hadCache) {
      axios
        .get(`${API}/get-role-permissions`)
        .then((res) => apply(res.data))
        .catch(() => { if (alive) setAllowed(false); });
    }

    const onUpdate = (e) => apply(e.detail);
    window.addEventListener('permissionsUpdated', onUpdate);

    return () => {
      alive = false;
      window.removeEventListener('permissionsUpdated', onUpdate);
    };
  }, []);

  return allowed === true;
}
