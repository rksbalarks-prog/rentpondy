// Tool registry. Each tool declares an OpenAI function schema plus either:
//   - execute(phone, args)  for READ tools (run immediately), or
//   - proposal(phone, args) for WRITE tools (return an action proposal; the
//     frontend Confirm chip POSTs to the canonical endpoint — the model never
//     writes unilaterally).
//
// `phone` is always the verified session phone injected by the orchestrator.
// Any phoneNumber the model puts in args is ignored.

import { apiGet, apiGetCached } from './httpClient.js';
import config from '../config.js';
import { safeDetail } from '../sanitize.js';
import { getSettingsSync } from '../settings.js';

// ── helpers ──────────────────────────────────────────────────────────────────
const norm = (v) => String(v ?? '').trim().toLowerCase();
const PONDY = ['pondy', 'pondicherry', 'puducherry', 'pudhucherry', 'pondi'];

function cityMatches(prop, wanted) {
  const w = norm(wanted);
  if (!w) return true;
  const hay = [prop.city, prop.area, prop.district].map(norm).join(' ');
  if (PONDY.includes(w) || w.includes('pond') || w.includes('pudu')) {
    return PONDY.some((s) => hay.includes(s));
  }
  return hay.includes(w);
}

function matchProperty(p, f) {
  if (!cityMatches(p, f.city)) return false;
  if (f.area && !norm(p.area).includes(norm(f.area)) && !norm(p.city).includes(norm(f.area))) return false;
  if (f.bedrooms && norm(p.bedrooms) !== norm(f.bedrooms)) return false;
  if (f.propertyType && !norm(p.propertyType).includes(norm(f.propertyType))) return false;
  if (f.rentType && !norm(p.rentType).includes(norm(f.rentType))) return false;
  if (f.propertyMode && !norm(p.propertyMode).includes(norm(f.propertyMode))) return false;
  const rent = Number(p.rentalAmount);
  if (f.minRent != null && (!Number.isFinite(rent) || rent < f.minRent)) return false;
  if (f.maxRent != null && (!Number.isFinite(rent) || rent > f.maxRent)) return false;
  return true;
}

function leanCard(p) {
  return {
    rentId: p.rentId,
    propertyType: p.propertyType,
    propertyMode: p.propertyMode,
    rentType: p.rentType,
    bedrooms: p.bedrooms,
    rent: p.onDemand ? 'On Demand' : p.rentalAmount,
    area: p.area,
    city: p.city,
    furnished: p.furnished,
    totalArea: p.totalArea,
  };
}

// Owner contact is paywalled (points), so the AI must never read what a user
// would have to spend points to see. `safeDetail` is an ALLOWLIST (only known-safe
// display fields survive) plus a recursive PII scrub — the old denylist here
// leaked every phone/PII field it forgot to name (e.g. alternatePhone,
// displayContact, which defaults to the owner's number). See sanitize.js.
const detailCard = safeDetail;

function pickList(data) {
  return data?.users || data?.data || data?.properties || (Array.isArray(data) ? data : []);
}

// ── READ tools ───────────────────────────────────────────────────────────────
const readTools = {
  search_properties: {
    kind: 'read',
    description:
      'Search live rental listings by filters. Returns lean cards. Use this whenever the user asks to find/see properties.',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City e.g. "Pondicherry" or "Chennai". Pondy synonyms are handled.' },
        area: { type: 'string', description: 'Locality/area e.g. "White Town", "Lawspet".' },
        minRent: { type: 'number', description: 'Minimum monthly rent in INR.' },
        maxRent: { type: 'number', description: 'Maximum monthly rent in INR.' },
        bedrooms: { type: 'string', description: 'Number of bedrooms as a string: "1","2","3","4","5".' },
        propertyType: { type: 'string', description: 'e.g. House, Apartment, Villa, Commercial Building, Shop / Office, Godown, Bachelor Room, Land, Plot.' },
        rentType: { type: 'string', description: 'One of: Monthly, Lease, Weekly, Daily, Family, Fortnightly, Bachelor.' },
        propertyMode: { type: 'string', enum: ['Residential', 'Commercial', 'Rent'], description: 'Residential, Commercial or Rent.' },
        limit: { type: 'number', description: 'Max results to return (default 8, max 15).' },
      },
    },
    async execute(phone, args = {}) {
      const limit = Math.min(Math.max(1, Number(args.limit) || 8), 15);

      // Preferred path once deployed in-process with the DB: the lean indexed
      // endpoint does the filtering/paging in Mongo (fast). Off by default.
      if (config.useLeanSearch) {
        const data = await apiGet('/assistant/search-properties', {
          city: args.city, area: args.area, bedrooms: args.bedrooms,
          propertyType: args.propertyType, rentType: args.rentType,
          propertyMode: args.propertyMode, minRent: args.minRent, maxRent: args.maxRent,
          limit,
        });
        return {
          count: data.count, showing: data.showing, results: data.results || [],
          filtersApplied: args,
        };
      }

      // Default path (works against the live prod API now, and on the VPS): fetch
      // the on-demand active list once (cached) and filter in this Node layer.
      const data = await apiGetCached('/fetch-active-users-on-demand-rent', {});
      const all = pickList(data);
      const filters = {
        city: args.city, area: args.area, bedrooms: args.bedrooms,
        propertyType: args.propertyType, rentType: args.rentType,
        propertyMode: args.propertyMode,
        minRent: args.minRent != null ? Number(args.minRent) : null,
        maxRent: args.maxRent != null ? Number(args.maxRent) : null,
      };
      const matched = all.filter((p) => matchProperty(p, filters));
      return {
        count: matched.length,
        showing: Math.min(limit, matched.length),
        totalActive: all.length,
        filtersApplied: filters,
        results: matched.slice(0, limit).map(leanCard),
      };
    },
  },

  get_property_details: {
    kind: 'read',
    description: 'Get full details for one property by its rentId (owner contact is excluded — that requires points).',
    parameters: {
      type: 'object',
      properties: { rentId: { type: 'number', description: 'The property rentId.' } },
      required: ['rentId'],
    },
    async execute(phone, args = {}) {
      const data = await apiGet(`/property/${encodeURIComponent(args.rentId)}`);
      const prop = data?.property || data?.data || data;
      return { property: detailCard(prop) };
    },
  },

  list_areas: {
    kind: 'read',
    description: 'List known area/locality names, optionally filtered by a search prefix.',
    parameters: {
      type: 'object',
      properties: { search: { type: 'string', description: 'Substring to filter areas.' } },
    },
    async execute(phone, args = {}) {
      const data = await apiGet('/areas', { search: args.search || '' });
      return { areas: (data?.data || []).slice(0, 60) };
    },
  },

  list_cities: {
    kind: 'read',
    description: 'List known city names, optionally filtered by a search prefix.',
    parameters: {
      type: 'object',
      properties: { search: { type: 'string', description: 'Substring to filter cities.' } },
    },
    async execute(phone, args = {}) {
      const data = await apiGet('/cities', { search: args.search || '' });
      return { cities: (data?.data || []).slice(0, 60) };
    },
  },

  get_my_points_balance: {
    kind: 'read',
    description:
      "Get the current user's points balance. ALWAYS call this before helping with owner " +
      "contact: it returns `balance`, the `revealCost` for one owner contact, and " +
      "`hasEnoughPoints` (true if they can afford it now).",
    parameters: { type: 'object', properties: {} },
    async execute(phone) {
      const data = await apiGet(`/points-balance/${encodeURIComponent(phone)}`);
      const balance = Number(data?.balance) || 0;
      const revealCost = getSettingsSync().contactRevealPoints;
      return { ...data, balance, revealCost, hasEnoughPoints: balance >= revealCost };
    },
  },

  get_my_favourites: {
    kind: 'read',
    description: "Get the properties the current user has saved as favourites.",
    parameters: { type: 'object', properties: {} },
    async execute(phone) {
      const data = await apiGet('/get-favorite-owner-rent', { phoneNumber: phone });
      const list = pickList(data);
      return { count: Array.isArray(list) ? list.length : 0, favourites: (list || []).slice(0, 20).map(leanCard) };
    },
  },
};

// ── WRITE tools (proposal only — never executed by the model) ─────────────────
const writeTools = {
  send_interest: {
    kind: 'write',
    description: 'Register the user\'s interest in a property (notifies the owner). Requires confirmation.',
    parameters: {
      type: 'object',
      properties: { rentId: { type: 'number', description: 'The property rentId.' } },
      required: ['rentId'],
    },
    proposal(phone, args = {}) {
      return {
        tool: 'send_interest',
        method: 'POST',
        endpoint: '/send-interests-rent',
        body: { phoneNumber: phone, rentId: args.rentId },
        label: `Send interest on property #${args.rentId}`,
        summary: 'The owner will be notified that you are interested.',
      };
    },
  },

  report_property: {
    kind: 'write',
    description: 'Report a property (e.g. already sold, wrong info, fraud). Requires confirmation.',
    parameters: {
      type: 'object',
      properties: {
        rentId: { type: 'number', description: 'The property rentId.' },
        selectReasons: {
          type: 'string',
          enum: ['Already Sold', 'Wrong Information', 'Not Responding', 'Fraud', 'Duplicate Ads', 'Other'],
          description: 'Preset report reason.',
        },
        reason: { type: 'string', description: 'Optional free-text comment.' },
      },
      required: ['rentId', 'selectReasons'],
    },
    proposal(phone, args = {}) {
      return {
        tool: 'report_property',
        method: 'POST',
        endpoint: '/report-property-rent',
        body: { phoneNumber: phone, rentId: args.rentId, selectReasons: args.selectReasons, reason: args.reason || args.selectReasons },
        label: `Report property #${args.rentId} — ${args.selectReasons}`,
        summary: 'Our team will review this report.',
      };
    },
  },

  request_contact_owner: {
    kind: 'write',
    description: "Reveal the owner's contact for a property. This SPENDS the user's points. Requires confirmation.",
    parameters: {
      type: 'object',
      properties: {
        rentId: { type: 'number', description: 'The property rentId.' },
        points: { type: 'number', description: 'Points to spend (defaults to the configured cost).' },
      },
      required: ['rentId'],
    },
    proposal(phone, args = {}) {
      // /points-deduct rejects a missing/zero `points` with "points must be > 0",
      // so always send a concrete positive cost (the admin-configured reveal price).
      const points = Number(args.points) > 0 ? Number(args.points) : getSettingsSync().contactRevealPoints;
      return {
        tool: 'request_contact_owner',
        method: 'POST',
        endpoint: '/points-deduct',
        body: { phoneNumber: phone, rentId: args.rentId, points, reason: 'view-owner-contact' },
        label: `Reveal owner contact for #${args.rentId}`,
        summary: `This spends ${points} points to unlock the owner's phone number.`,
        spendsMoney: true,
      };
    },
  },
};

// ── NAVIGATE tools (proposal only — open an app page; no server write) ─────────
// Like write tools they never execute; the proposal carries a `navigate` route the
// frontend turns into a button. Used to hand the user off to a full app form.
const navTools = {
  offer_tenant_assistance: {
    kind: 'navigate',
    description:
      "Offer to register the user's rental requirement as a Tenant Assistance request. " +
      'Call this ONLY when search_properties found no matching listing (even after relaxing filters), ' +
      'so the user can be alerted when a matching property is posted. Shows an "Add Tenant Assistance" ' +
      'button that opens the tenant-assistance form (prefilled with what they asked for).',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City e.g. "Pondicherry" or "Chennai".' },
        area: { type: 'string', description: 'Locality/area e.g. "White Town", "Lawspet".' },
        minRent: { type: 'number', description: 'Minimum monthly rent in INR.' },
        maxRent: { type: 'number', description: 'Maximum monthly rent in INR.' },
        bedrooms: { type: 'string', description: 'Number of bedrooms as a string: "1".."5".' },
        propertyType: { type: 'string', description: 'e.g. House, Apartment, Villa, Shop / Office.' },
        rentType: { type: 'string', description: 'One of: Monthly, Lease, Weekly, Daily, Family, Fortnightly, Bachelor.' },
        propertyMode: { type: 'string', description: 'Residential, Commercial or Rent.' },
      },
    },
    proposal(phone, args = {}) {
      // Map the assistant's search filters onto the Tenant Assistance form fields.
      const prefill = {
        city: args.city || '',
        area: args.area || '',
        minPrice: args.minRent != null ? String(args.minRent) : '',
        maxPrice: args.maxRent != null ? String(args.maxRent) : '',
        bedrooms: args.bedrooms || '',
        propertyType: args.propertyType || '',
        rentType: args.rentType || '',
        propertyMode: args.propertyMode || '',
      };
      return {
        tool: 'offer_tenant_assistance',
        kind: 'navigate',
        navigate: '/buyer-assistance',
        cta: 'addTenant',
        prefill,
        label: 'Add Tenant Assistance request',
        summary: "Register your requirement — we'll alert you when a matching property is listed.",
        note: 'An "Add Tenant Assistance" button is now shown. Ask the user to tap it to open the form and register their requirement; do NOT claim it is already submitted.',
      };
    },
  },

  offer_add_property: {
    kind: 'navigate',
    description:
      "Offer to post/list the user's OWN property for rent. Call this when the user (as an owner/landlord) " +
      'says they want to add, post, list, put up, advertise, or upload their property/house/room/shop for rent. ' +
      'Shows an "Add Property" button that opens the post-property form.',
    parameters: {
      type: 'object',
      properties: {
        propertyType: { type: 'string', description: 'e.g. House, Apartment, Villa, Shop / Office, Godown.' },
        city: { type: 'string', description: 'City e.g. "Pondicherry" or "Chennai".' },
        area: { type: 'string', description: 'Locality/area e.g. "White Town", "Lawspet".' },
      },
    },
    proposal(phone, args = {}) {
      const prefill = {
        propertyType: args.propertyType || '',
        city: args.city || '',
        area: args.area || '',
      };
      return {
        tool: 'offer_add_property',
        kind: 'navigate',
        navigate: '/add-property',
        cta: 'addProperty',
        prefill,
        label: 'Add / Post your property',
        summary: 'Open the form to list your property for rent.',
        note: 'An "Add Property" button is now shown. Ask the user to tap it to open the post-property form; do NOT claim the property is posted.',
      };
    },
  },

  offer_points_purchase: {
    kind: 'navigate',
    description:
      "Open the Points pricing page so the user can BUY points. Call this whenever the user " +
      "wants an owner's contact/number/phone but does NOT have enough points to unlock it " +
      "(check get_my_points_balance first — hasEnoughPoints is false / balance is 0). Shows a " +
      "prominent 'Buy Points' button. This is the key call-to-action: an owner contact can ONLY " +
      "be unlocked with points.",
    parameters: {
      type: 'object',
      properties: {
        rentId: { type: 'number', description: 'The property the user wanted contact for (optional).' },
      },
    },
    proposal(phone, args = {}) {
      return {
        tool: 'offer_points_purchase',
        kind: 'navigate',
        navigate: '/points-plans',
        cta: 'buyPoints',
        prefill: { rentId: args.rentId != null ? String(args.rentId) : '' },
        label: 'Buy points to unlock owner contact',
        summary: "Owner contacts are unlocked with points. Tap to see the points plans.",
        spendsMoney: false,
        note: 'A "Buy Points" button is now shown. STRONGLY and warmly urge the user to tap it — ' +
          'without points they cannot view any owner contact. Do NOT reveal or promise a number.',
      };
    },
  },
};

const allTools = { ...readTools, ...writeTools, ...navTools };

export function getTool(name) {
  return allTools[name] || null;
}

// Schemas handed to the model. Both read and write tools are advertised; the
// orchestrator decides read=execute vs write=propose.
export function openaiToolSchemas() {
  return Object.entries(allTools).map(([name, t]) => ({
    type: 'function',
    function: { name, description: t.description, parameters: t.parameters },
  }));
}

export { readTools, writeTools, navTools, allTools };
export default { getTool, openaiToolSchemas, readTools, writeTools, navTools, allTools };
