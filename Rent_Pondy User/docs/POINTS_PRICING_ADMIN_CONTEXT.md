# Points Pricing Module — Admin Panel Context

> Copy this file into your admin-panel repo (e.g. `docs/modules/points-pricing.md`).
> It is the single source of truth for how the **user-facing Rent Pondy app** consumes the points pricing module. The admin panel must not break these contracts.

---

## 1. What this module does

Rent Pondy uses a **points wallet** system to gate owner contact reveal. Users buy a points plan (one-time purchase, paid via PayU), get a balance credited, and each time they unlock an owner's contact the backend deducts `10 points` from that balance.

Admin responsibilities:

1. **CRUD on points plans** (create / list / edit / activate-deactivate / delete).
2. **View users' points balances** and manual credit / debit adjustments (support cases).
3. **View points transactions** (purchase + contact-reveal deductions + manual adjustments).
4. **View pay-later (reserved) purchase requests** and mark them as followed-up / converted.
5. Configure the **contact-reveal cost** (currently hardcoded to `10` on the user app — see §6).

---

## 2. Points plan data model

The user app reads the plan list from `GET /points-plans` and expects an array of this shape:

```ts
type PointsPlan = {
  _id: string;          // stable id, used as planId in payment state
  name: string;         // e.g. "Starter", "Standard", "Pro"
  price: number;        // INR, integer rupees (not paise)
  points: number;       // points credited on successful purchase
  durationDays?: number;// optional — shown as "Valid for N days"
  description?: string; // short marketing line shown under the title
  popular?: boolean;    // optional — if true the card shows a "MOST POPULAR" badge
  active?: boolean;     // admin toggle — inactive plans must NOT be returned to the user app
  sortOrder?: number;   // admin-controlled ordering, ascending
};
```

**Current fallback plans** baked into the user app (used if the API is unreachable):

| _id           | name     | price | points | durationDays | popular |
|---------------|----------|-------|--------|--------------|---------|
| `points-100`  | Starter  | 100   | 100    | 30           | false   |
| `points-200`  | Standard | 200   | 200    | 60           | true    |
| `points-900`  | Pro      | 900   | 1000   | 180          | false   |

The admin must seed these three records (or equivalents) so the live API response matches the fallback shape.

### Cards & gradients
The user app cycles through three preset gradients for the plan cards in the order returned. No gradient field needs to come from the API.

### "MOST POPULAR" badge
The badge is shown if `plan.popular === true` **OR** it is the second card in the list (`index === 1`). Admin should treat `popular` as the canonical flag; ordering is a fallback.

---

## 3. Endpoints the user app calls

All endpoints are on `process.env.REACT_APP_API_URL`. **Path, method, request body, and response shape must be preserved**; the admin panel must implement / respect the same contracts.

### 3.1 List active plans
```
GET /points-plans
→ 200 [ PointsPlan, PointsPlan, ... ]   (only active: true, ordered by sortOrder asc)
```

### 3.2 Get a user's balance
```
GET /points-balance/:phoneNumber
→ 200 { balance: number }
```

### 3.3 Reserve a plan selection (called before PayU redirect and for "Pay Later")
```
POST /select-points-plan
body { phoneNumber, planId, points, amount }
→ 200 { ... }   (response body not consumed by user app)
```

### 3.4 PayU hosted-checkout hash generation (Pay Now)
```
POST /payu/points-payment
body {
  txnid, amount, productinfo, firstname, email, phone,
  planName, planId, points,
  payustatususer: 'pay now',
  planType: 'points',
}
→ 200 { ...PayU hidden fields incl. key, hash }
```
The user app then builds a hidden HTML form to `https://secure.payu.in/_payment` and submits it.

### 3.5 Pay Later persistence
```
POST /payu/points-payment-later
body (same as 3.4, with payustatususer: 'pay later')
→ 200 { ok: true }
```

### 3.6 Credit points on successful payment (PayU redirects to success page, which calls this)
```
POST /points-credit
body { phoneNumber, points, planId, amount, txnId }
→ 200 { balance: number }   // new balance after credit
```

### 3.7 Deduct points on contact reveal
```
POST /points-deduct
body { phoneNumber, points, rentId, reason: 'view-owner-contact' }
→ 200 { success: true, balance: number }
→ 200 { success: false, message: '...' }   // on insufficient balance etc.
```

### 3.8 PayU return URLs
- Success: `/points-payment-success` (frontend) — query params include `mihpayid, amount, firstname, email, phone, status, payUdate, planName, planId, points`.
- Failure: `/points-payment-failure`.

The backend's PayU success callback must redirect to these frontend paths with those query params intact.

---

## 4. User-side flows (what the admin panel must support end-to-end)

### 4.1 Buying points
1. User hits the insufficient-points modal on a property detail page → presses **Buy Points Plan** → goes to `/payu-points-form` pre-filled with the default Starter plan (`points-100`, ₹100 / 100 pts). The modal also has a **More Plans** button that goes to `/points-plans`.
2. `/points-plans` fetches `GET /points-plans` and renders the active plans.
3. User picks a plan → confirmation modal → `/payu-points-form` with `{ phoneNumber, planName, planId, amount, points }` in router state.
4. **Pay Now** → `POST /select-points-plan` → `POST /payu/points-payment` → HTML form submit to PayU.
5. On success PayU redirects to `/points-payment-success?...`. The success page calls `POST /points-credit`, which **must be idempotent keyed on `txnId`** (otherwise double-crediting).

### 4.2 Contact reveal
1. User opens a rent property detail, clicks "View owner contact".
2. Frontend calls `GET /points-balance/:phone`. If < 10 → shows `InsufficientPointsModal`.
3. If ≥ 10 → calls `POST /points-deduct` with `points: 10, reason: 'view-owner-contact', rentId`. Backend must deduct atomically and write a transaction row.

### 4.3 Pay Later
Admin panel should list these as **leads** (not paid, not credited) with all the entered info so support can follow up.

---

## 5. Admin screens to build (recommended)

1. **Points Plans list** — table of plans with inline toggle for `active`, drag-handle or number input for `sortOrder`, badge for `popular`. Actions: edit, delete (soft-delete recommended — flipping `active=false` is safer than hard delete because existing transactions reference `planId`).
2. **Create / edit plan form** — all fields from §2. Validate `price > 0`, `points > 0`. Warn if changing `_id` (don't allow — it's referenced by historic transactions).
3. **Users → points balance** — search by phone number, show current balance, history of transactions (credits + debits). Button to **manually adjust** balance (opens modal: `+N / -N points`, reason field, admin username recorded).
4. **Transactions ledger** — paginated, filterable by type (`purchase | contact-reveal | manual-adjust | refund`), date range, plan, phone. Each row: timestamp, phone, type, delta, resulting balance, `txnId`/`rentId`/admin-note.
5. **Pay Later leads** — rows from `POST /payu/points-payment-later` with status `new | contacted | converted | dropped`.
6. **Settings** — one numeric input: **points per contact reveal** (default `10`). See §6.

---

## 6. Known coupling points the admin must be aware of

- **Contact reveal cost is hardcoded** in the user app at `src/Components/Details.jsx` as `const POINTS_PER_CONTACT_VIEW = 10`. If the admin panel exposes this as a setting, the user app will need a follow-up PR to fetch it from a config endpoint (e.g. `GET /points-config → { pointsPerContactReveal: 10 }`). Document this in the admin settings screen so no one changes the number expecting the user app to pick it up.
- **Plan `_id` is a stable foreign key** — transactions and PayU `productinfo` refer to it. Never reassign.
- **Fallback plans** (§2) live in [src/Components/PointsPlans.jsx](../src/Components/PointsPlans.jsx) starting at `FALLBACK_PLANS`. They render only if `GET /points-plans` fails. If admin renames / removes `points-100 / points-200 / points-900` the user app still shows the old names when the API is down — not a bug, but worth knowing.
- **Starter plan id `points-100`** is hardcoded in [src/Components/InsufficientPointsModal.jsx](../src/Components/InsufficientPointsModal.jsx) as `DEFAULT_STARTER_PLAN` (used when the user clicks **Buy Points Plan** straight from the modal). If the admin deletes or renames this plan, the "fast buy" path will still send users to PayU with the old id. Either keep `points-100` alive, or open a follow-up PR on the user app to fetch "the cheapest active plan" instead.
- **Idempotency on credit** — `POST /points-credit` is called from a React `useEffect` on the success page. StrictMode / quick navigation can fire it twice. Dedupe in the backend by `txnId` (unique index).
- **Pay Later** writes to `/payu/points-payment-later` but never reaches PayU — admin must not count these towards revenue until marked converted.

---

## 7. Relevant files in the user-app repo (for cross-reference)

- Plans UI: `src/Components/PointsPlans.jsx`
- Insufficient-points popup: `src/Components/InsufficientPointsModal.jsx`
- Payment form: `src/Components/PayUPointsPayment/PayUPointsForm.jsx`
- Success / failure screens: `src/Components/PayUPointsPayment/PaymentSuccessPoints.jsx`, `PaymentFailurePoints.jsx`
- Contact-reveal gate: `src/Components/Details.jsx` (search `POINTS_PER_CONTACT_VIEW`)
- Routes: `src/Components/RouterPage.jsx` (`/points-plans`, `/payu-points-form`, `/points-payment-success`, `/points-payment-failure`)

---

## 8. Open questions / decisions the admin PM should resolve

1. Hard delete vs. soft delete of plans (recommend soft delete via `active=false`).
2. Can points expire (the `durationDays` field is displayed but not currently enforced on the backend — confirm)?
3. Refund flow when PayU refunds a transaction — should points be automatically debited back? (Likely yes: `POST /points-credit` with negative `points`, or a dedicated refund endpoint.)
4. Should manual adjustments appear in the user's transaction history visible to them, or be admin-only?
