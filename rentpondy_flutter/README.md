# Rent Pondy — Flutter

A Flutter port of the **Rent Pondy User** app (originally React / CRA at
`../Rent_Pondy User`). The goal is a 1:1 visual match with the web app while
running natively on Android / iOS (and web).

The web app is large (150+ routes). This project ports it **incrementally** on a
solid, faithful foundation. The core navigation shell and the primary user flow
are fully built; the remaining secondary pages currently render a styled
placeholder (see **Porting status**) so the whole app is navigable end-to-end.

## Running

```bash
flutter pub get
flutter run              # on a connected device / emulator
flutter run -d chrome    # web
```

### Push notifications (Firebase / FCM)

Fully wired but **inert until configured** — the app builds and runs without
`google-services.json` (Firebase init is guarded). To turn push on, follow
`docs/push_notifications.md`: register the Android app
(`com.apps.rent_pondy_user`) in Firebase project **`rentpondy-f0909`** (the same
project the backend service account already uses — so no backend credential
change), drop `google-services.json` into `android/app/`, uncomment the two
`google-services` Gradle lines, and deploy the additive `PPC/fcm/` backend.

### Windows build notes (don't revert these)

This machine has ~7 GB RAM, and Android builds needed three fixes. All are
committed; reverting any one breaks `flutter build apk`:

1. **`android/gradle.properties` → `kotlin.incremental=false`** — the Kotlin
   incremental cache can't close its `.tab` files because the project path
   contains spaces, failing `:shared_preferences_android:compileDebugKotlin`.
2. **`android/gradle.properties` → `-Xmx2G -XX:MaxMetaspaceSize=1G`** (down from
   the template's 8G/4G) — otherwise the native compiler dies with
   `ninja: fatal: CreateProcess: The paging file is too small`.
3. **`pubspec.yaml` → `dependency_overrides: path_provider_android: 2.2.17`** —
   2.3.x uses JNI bindings that force a full NDK/CMake clang+ninja native
   compile every build (OOM here). 2.2.x is pure Kotlin, no NDK. path_provider
   is only transitive (`cached_network_image` → `flutter_cache_manager`).

If builds turn flaky, `android\gradlew --stop` reclaims ~1.8 GB of leftover
daemon memory.

## Design system (matches the web app 1:1)

| Token | Value | Where |
|-------|-------|-------|
| Primary purple | `#4F4B7E` | navbar title, buttons, prices, active nav, city bar |
| Sidebar teal | `#24AD92` | drawer header |
| Page frame grey | `#E5E5E5` | outer app frame (mobile-first, max-width 470) |
| Card bg | `#F9F9F9` / `#FAFAFA` | property cards |
| Text | `#000` / `#5E5E5E` / `#888` | title / body / muted |
| Font | **Inter** (via `google_fonts`) | everywhere |

All tokens live in `lib/theme/app_colors.dart` + `lib/theme/app_theme.dart`.
Images were copied verbatim from the web app's `src/Assets` into
`assets/images/` and are referenced through `lib/constants/assets.dart`.

## Architecture

```
lib/
  main.dart                 # runApp + AuthGate (login vs shell, from stored phone)
  config/api_config.dart    # base URL (https://rentpondy.com/PPC/PPC) + image host
  constants/assets.dart     # typed asset paths
  models/property.dart      # Property model (fetch-active-users shape)
  services/api_service.dart # REST client — always sends ?base=PY|CH
  state/app_state.dart      # ChangeNotifier: phone (persisted), city base, points
  theme/                    # colours + Inter theme
  utils/formatters.dart     # en-IN price + short date
  widgets/
    city_switcher.dart      # purple Pondicherry/Chennai pill bar
    rp_navbar.dart          # hamburger + animated RENT PONDY + points chip + bell
    top_bar.dart            # horizontal scrolling icon menu
    bottom_navigation.dart  # 5 slots + raised centre Add FAB
    property_card.dart      # list card (image + camera/eye tags + details)
    app_drawer.dart         # left sidebar menu
  screens/
    login_screen.dart       # phone -> OTP -> shell
    main_shell.dart         # city switcher, navbar, top bar, content, bottom nav
    all_property_screen.dart# "All Property" feed
    property_detail_screen.dart
    more_screen.dart        # More hub grid
    placeholder_screen.dart # styled stand-in for not-yet-ported pages
```

State management is `provider` (`AppState`), mirroring the web app's Redux
`userSlice` + `localStorage` (`phoneNumber`, `activeBase`). Every API request
carries `?base=PY|CH`, replicating the axios interceptor in the web app's
`utils/cityBase.js`.

## Backend

Points at production: `https://rentpondy.com/PPC/PPC` (from the web `.env`).
Endpoints used so far: `/fetch-active-users`, `/uploads-count`,
`/points-balance/:phone`, `/send-otp-rent`, `/verify-otp-rent`,
`/user/direct-verified-users-rent`, `/log-app-open`.

## Porting status

**Done (native):**

- **Login** — phone + OTP, direct-verified skip, resend timer.
- **Home shell** — city switcher, animated navbar (points chip + bell with
  unread dot), top-bar menu, bottom nav + FAB, side drawer.
- **All Property** feed + card.
- **My Property** — Property / Removed / Expired tabs, paid/pending card styling.
- **Notifications** — All + Admin tabs, mark-read (mirrored to prefs like the
  web app's localStorage), delete-by-timestamp, tap-through routing.
- **Property Detail** — photo gallery, overview, description, and the full
  action set: **points-gated owner-contact reveal**, favourite, send/remove
  interest, report, request photos, request address.
- **Points Plans** — snap carousel of gradient plan cards, MOST POPULAR badge,
  balance pill, dot indicators; buying runs the real
  `/select-points-plan` → `/payu/points-payment` → PayU hosted checkout flow.
- **Points History** — balance + lifetime totals, transactions grouped by day
  with the web app's category classification, and the refund-request flow.
- **Tenant List** — tenants' rental requirements with the Send Interest /
  More / Match Prop actions (also the `topMBuyerList` tab in the shell).
- **My Plan** — active plans with nested per-rentId PayU payment records,
  expiry calculation and the Pay Now / Continue to Pay CTA.
- **My Profile** — create/update name, email, address against the signed-in
  mobile (`404` on fetch switches the form into create mode).
- **Leads** (one screen, two feeds) — tenants who **shortlisted** or **sent
  interest** on your properties, enriched with PayU status and the admin
  property message; tap a number to dial.
- **Info pages** — About, Refund Policy, Privacy Policy, Terms & Conditions,
  Shipping & Delivery.
- **Add / Edit Property** — 6-step form; reserves a rentId on open
  (`/store-data-rent`), drives every dropdown from `/fetch`, enforces the same
  per-step required fields, hides room fields for Plot/Land/Agricultural Land,
  and submits multipart with photos to `/update-rent-property`. Passing an
  `existing` property switches it to edit mode (pencil icon on My Property).
- **Quick Sort** hub + 12 filtered lists — price asc/desc, newest/oldest,
  with-photos, with-location, not-viewed, bank-loan, houses &lt;₹30L and
  ₹30–50L, plots &lt;₹15L, agricultural land.
- **Contact Us / Our Support** — call/email shortcuts plus the `POST /contactUs`
  form (OurSupport.jsx posts to the same endpoint, so it reuses this screen).
- **FAQ** — the six categories from `FAQ.jsx`, as expandable rows.
- **Owner Menu / Tenant Menu** — the two dashboard hubs (SideMenuScreen), a
  navigation grid to every owner/tenant sub-screen.
- **Pricing Plans** — property subscription plans (`/active-plans`); selecting
  one asks which listing to apply it to, then runs `/payu/payment` → PayU.
- **Business Opportunity** — the promo image page.
- **Most Viewed / Matched Tenants / Recently Viewed** — extra
  `FilteredPropertyScreen` feeds; **Removed / Expired** open the matching
  My Property tab via `initialTab`.

### Known blockers on what's left

- **Property Map** (`PropertyMap.jsx`, 5,033 lines) needs the Google Maps SDK
  and an **Android/iOS API key**, which the web app supplies via its own key.
  Wire `google_maps_flutter` + a key before porting.
- **Buyer Assistance** (`BuyerAssistance.jsx`, 6,563 lines) is the tenant
  requirement form — the last large form, structurally similar to Add Property
  (`/add-buyerAssistance-rent`).
- **Groom / Bride** pages are static promos in the web app with no endpoint.

Most sort pages reuse the shared `/fetch-active-users` feed and filter
**client-side**; the predicates in `FilteredPropertyScreen` are copied verbatim
from the individual JSX files so results match. Only `withLocation` and
`zeroView` have their own endpoints.

### Info pages are CMS-driven — don't hardcode copy

Those five pages fetch admin-authored HTML from `GET /get-text/:type` and render
it verbatim (`dangerouslySetInnerHTML` on the web). `CmsPageScreen` does the
same in a WebView, so editing the text in the admin panel updates the app with
no rebuild. Known types: `aboutUs`, `refundPolicy`, `privacyPolicy`,
`terms&conditions`, `shiping&Delivery`.

### A note on two web screens

`MyShortlistedProperty.jsx` and `MySentInterest.jsx` contain **no API calls at
all** in the web app — no axios import, no fetch; they render from empty local
state, so those pages always show nothing. Rather than reproduce empty screens,
their menu entries route to the real owner-side favourite / interest feeds
(`LeadsScreen`). Revisit if the intent was tenant-side data instead.

### PayU checkout

`PayUCheckoutScreen` hosts PayU inside a WebView. The backend returns form
fields containing a server-computed hash, so they must be **POSTed** — the
screen replays the web app's trick of auto-submitting a hidden form, then
watches for the backend's `surl` / `furl` to decide success vs failure. Nothing
about the payment backend changed.

**Placeholder (styled stand-in, route preserved):** everything else —
Plans/Points, Tenant Assistant, Owner/Tenant menus, Tourist Place, sort/filter
pages, policies, etc. Each opens `PlaceholderScreen(title, routePath)` so the
navigation graph is complete.

### The contact paywall (get this right)

`PropertyDetailScreen` reproduces `Details.jsx`'s reveal rules exactly. Do not
loosen them — the web app's comments note that being lenient here is what let
the paywall leak:

1. Already revealed on this page -> free, no charge.
2. `/points-balance` unreachable -> **refuse to reveal**.
3. balance &lt; 10 -> "Buy Points" modal.
4. Reveal **only** when `/points-deduct` returns `success == true`.
5. `alreadyDeducted == true` -> ask before spending another 10 (`force: true`).
6. HTTP 402 -> "Buy Points" modal.

### Adding a real screen

The backend is **never modified** — reuse the endpoint the React screen already
calls (see `docs/api_endpoints.md` for all 265 of them).

1. Add the endpoint method to `lib/services/api_service.dart`.
2. Build the widget under `lib/screens/`.
3. Add **one `case`** to `screenForRoute()` in `lib/routes.dart` — the drawer,
   the More grid and the shell all route through it, so that single line swaps
   the placeholder for the real screen everywhere at once.
