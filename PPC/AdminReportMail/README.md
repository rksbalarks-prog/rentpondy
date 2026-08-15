# Admin report by e-mail (daily PDF)

Sends "Rent Pondy Overall Report - Admin" — the page at
`/process/dashboard/adminreport` — as a PDF every morning, with the headline
figures repeated in the e-mail body so they are readable on a phone.

All seven tabs are included: Yesterday's Actions, Yesterday's Login, Yesterday's
Property, Property Status, Payments, Follow-ups and Bill Report.

## How the numbers are obtained

`fetchReport.js` is a server-side port of `Rent_Pondy Admin/src/AdminReport.jsx`.
It calls the **same 34 endpoints the screen calls**, over `127.0.0.1`, and
applies the same filtering — rather than re-querying Mongo. If someone changes
what a route returns, the PDF changes with the page instead of drifting from it.

No `base` parameter is sent, which `cityScopePlugin` reads as no restriction —
the All Cities view the screen defaults to.

> **Keep in step:** the tab labels, row order and every derivation in
> `fetchReport.js` mirror `AdminReport.jsx`. Change that screen and change this
> too, or the PDF and the page will disagree.

Failures are collected, not fatal: several endpoints legitimately 404 when a
list is empty (`/payments-with-plan/pay-failed-buyer` is the usual one), exactly
as the screen's `safeGet` tolerates. Any that fail are named in an orange banner
in the e-mail and at the end of the PDF, so a low figure is never mistaken for a
real one.

## Why PDFKit and not a headless browser

Screenshotting the real page would be pixel-perfect, but it needs Chromium
(~300 MB, plus native libraries) on the VPS and an authenticated admin session.
PDFKit is pure JavaScript with nothing to compile. The trade-off: tables are
drawn by hand in `reportPdf.js`, so the layout *mirrors* the screen — dark
header row, striped body, grey section bands, highlighted grand total — rather
than being an exact copy of it.

## Files

| File | Role |
| --- | --- |
| `config.js` | Recipients and cadence from `.env` |
| `fetchReport.js` | Calls the 34 endpoints, builds the seven sections |
| `reportPdf.js` | Draws the PDF |
| `reportEmail.js` | Subject, HTML body, plain-text alternative |
| `sendAdminReport.js` | Orchestrates fetch → PDF → e-mail |
| `state.js` | In-memory record of the last run |
| `AdminReportMailRouter.js` | `/admin-report-mail/status`, `/send-now` |
| `index.js` | Arms the cron; exports the router |

SMTP is shared with [the Data Added report](../DataAddedMail/README.md) —
`DataAddedMail/mailer.js` is the single transport for the backend.

## Settings

All optional; the defaults are what production runs.

```ini
ADMIN_REPORT_MAIL_ENABLED=1
ADMIN_REPORT_TO=madhankumar7673@gmail.com
ADMIN_REPORT_CC=
ADMIN_REPORT_CRON=0 8 * * *
ADMIN_REPORT_TZ=Asia/Kolkata
ADMIN_REPORT_TOKEN=            # falls back to DATA_ADDED_REPORT_TOKEN
ADMIN_REPORT_API_BASE=http://127.0.0.1:5005/PPC
ADMIN_REPORT_TIMEOUT_MS=120000
```

The page reports on *yesterday*, so it is sent daily at 08:00 IST — an hour
before the Data Added report, so the two never overlap.

## Routes

```bash
# status
curl https://rentpondy.com/PPC/PPC/admin-report-mail/status

# build everything, send nothing
curl -X POST "https://rentpondy.com/PPC/PPC/admin-report-mail/send-now?dryRun=1" \
     -H "x-report-token: <token>"

# real send
curl -X POST "https://rentpondy.com/PPC/PPC/admin-report-mail/send-now" \
     -H "x-report-token: <token>"
```

The prefix appears twice publicly — nginx strips `/PPC` before proxying and the
router mounts at `/PPC` inside the app. On the VPS itself use a single prefix
against `127.0.0.1:5005`.

A dry run returns the full `figures` object, which is the quickest way to check
the PDF against the live screen without sending anything.
