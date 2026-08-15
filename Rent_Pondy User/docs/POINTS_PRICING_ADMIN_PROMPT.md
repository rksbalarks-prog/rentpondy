# Prompt — Build the Points Pricing admin module

> Use this prompt inside your admin-panel codebase (the one separate from the user app).
> Before sending it, copy `POINTS_PRICING_ADMIN_CONTEXT.md` into that repo (e.g. at `docs/modules/points-pricing.md`) and reference its path in the prompt so Claude can read it.

---

## How to use

1. Paste `POINTS_PRICING_ADMIN_CONTEXT.md` into your admin repo at `docs/modules/points-pricing.md`.
2. Open Claude Code in the admin repo.
3. Paste the prompt below (edit the file path in step 1 of the prompt if you put the context elsewhere).

---

## Prompt to paste

```
Read docs/modules/points-pricing.md first — it is the handoff context from the
user-facing Rent Pondy app. It documents the data model, the HTTP endpoints the
user app already calls, the user flows, and the coupling points that must not
break. Treat that file as authoritative; if anything in my instructions below
conflicts with it, ask me before diverging.

Goal
Build a "Points Pricing" module in this admin panel so ops can manage the plans
and balances that the user app consumes. Scope is CRUD + read-only ledgers; no
changes to the PayU integration itself.

Before you start, please:
1. Read the context doc and summarise, in 5-10 bullets, what the user app
   expects from the backend (endpoints, shapes, idempotency rules). I want to
   confirm we're aligned before you write code.
2. Explore this admin repo and tell me:
   - which UI framework / component library is used (MUI, Ant, Tailwind, etc.),
   - which backend layer (Express route file? Next.js API route? tRPC? separate
     service?) hosts the existing admin endpoints, and the file where a new
     module's routes should live,
   - how auth / admin-role gating is done on existing screens,
   - how an existing similar module (e.g. the regular pricing / plans screen,
     if one exists) is structured — I want the new module to match conventions,
     not invent new ones.
3. Propose a short plan (screens, routes, files you'd add/edit) and wait for my
   OK before implementing.

Deliverables (after I approve the plan)
A. Backend
   - `GET  /admin/points-plans`              list all (incl. inactive) for admin
   - `POST /admin/points-plans`              create
   - `PUT  /admin/points-plans/:id`          edit (cannot change _id)
   - `PATCH /admin/points-plans/:id/active`  toggle active
   - `DELETE /admin/points-plans/:id`        soft-delete (sets active=false)
   - `GET  /admin/points-users?phone=&page=` paginated users + current balance
   - `GET  /admin/points-transactions?...`   ledger: filter by phone, type,
                                             date range, planId
   - `POST /admin/points-adjust`             manual credit/debit with reason
                                             + admin user id; writes a
                                             transaction row of type
                                             'manual-adjust'
   - `GET  /admin/points-paylater?status=`   list pay-later leads
   - `PATCH /admin/points-paylater/:id`      update lead status
   Make sure the existing public endpoint `GET /points-plans` continues to
   return only `active: true` plans sorted by `sortOrder` asc — filter in the
   query, don't rely on the admin screen to do it.
B. Frontend (admin)
   - /admin/points/plans          list + create/edit modal + active toggle +
                                  sortOrder input + popular flag
   - /admin/points/users          search by phone → show balance + recent txns
                                  + "Adjust balance" modal
   - /admin/points/transactions   filterable paginated ledger
   - /admin/points/paylater       leads table with status dropdown
   - /admin/points/settings       numeric input for "points per contact reveal"
                                  (persist to a settings table; see note below)
C. Tests
   - Follow whatever test conventions already exist in this repo. If there are
     no tests, don't invent a framework — just say so.
   - Cover: the public `GET /points-plans` still filters to active-only; create
     endpoint validates `price > 0` and `points > 0`; manual adjust writes a
     transaction and updates balance atomically.

Constraints and gotchas (from the handoff doc — re-read them before coding)
- Plan `_id` is a foreign key in transactions. Reject any edit that tries to
  change it.
- Soft delete by flipping `active=false`, never hard delete plans that have
  transactions pointing to them.
- `POST /points-credit` must be idempotent on `txnId` — if this repo owns the
  implementation, enforce a unique index. If it's owned elsewhere, flag it
  and don't touch it.
- Contact-reveal cost is currently hardcoded to 10 on the user app. The
  Settings screen stores the value but does not yet change the user app's
  behaviour — surface a banner on the settings screen saying "Changing this
  value requires a follow-up release of the user app." Do not silently pretend
  it takes effect.
- Seed the three starter plans listed in the context doc (points-100,
  points-200, points-900) if they don't already exist, so the user app's
  fallback plans match the live data.

Things not to do
- Don't change the PayU form flow, hash generation, or the existing public
  endpoints listed in §3 of the context doc.
- Don't refactor unrelated admin code.
- Don't introduce a new UI library or auth strategy — match what's already in
  the repo.

Output format
- After exploration, post the summary + plan and wait.
- After I approve, implement in small, reviewable commits, pausing after the
  backend is wired up so I can hit the endpoints with curl before you build
  the UI on top.
```
