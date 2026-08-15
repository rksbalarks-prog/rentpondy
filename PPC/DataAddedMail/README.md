# Data Added — scheduled e-mail report

Mails the admin panel's **Data Added** year summary — the same numbers shown on
`/process/dashboard/data-added` — to a fixed recipient list on a cron schedule,
with the *Excel (Year Summary)* spreadsheet attached.

Additive layer: new folder, two new routes, no new collection, no change to
`DataAdded/DataAddedRouter.js` or any existing screen. Three lines were added to
`server.js` (import, `app.use`, `start()` inside `app.listen`).

## Files

| File | Role |
| --- | --- |
| `config.js` | Reads every setting from `.env`, with defaults |
| `reportData.js` | Runs the aggregation (mirrors `/data-added/summary`) |
| `reportExcel.js` | Server-side twin of the *Excel (Year Summary)* button |
| `reportEmail.js` | Subject + HTML body + plain-text alternative |
| `mailer.js` | nodemailer transport, created lazily |
| `sendReport.js` | Orchestrates data → workbook → e-mail → SMTP |
| `state.js` | In-memory record of the last run |
| `DataAddedMailRouter.js` | `/data-added-mail/status`, `/data-added-mail/send-now` |
| `index.js` | Arms the cron; exports the router |
| `sample-email.html` | Open in a browser to see what recipients get |

## Setup

The feature stays **asleep** until the SMTP settings exist — the server logs one
line at boot and carries on.

This block is present in **both** the local and the VPS `PPC/.env` as of
2026-08-12. They are separate files — never upload the local one over the
production one, or you will wipe the live secrets. On the VPS the block was
appended, leaving all 63 pre-existing keys untouched; the pre-change copy is
kept at `.env.bak-dataaddedmail`.

`nodemailer` has zero dependencies, so it was copied into `node_modules/`
directly rather than by running `npm install` against the production tree, and
`package.json` was edited in place to record it.

```ini
# ── Data Added e-mail report ─────────────────────────────────────────────
DATA_ADDED_REPORT_ENABLED=1
DATA_ADDED_REPORT_TO=madhankumar7673@gmail.com
DATA_ADDED_REPORT_CC=
DATA_ADDED_REPORT_CRON=0 9 1 * *
DATA_ADDED_REPORT_TZ=Asia/Kolkata
DATA_ADDED_REPORT_BASE=ALL
DATA_ADDED_REPORT_HIDE_DELETED=0
DATA_ADDED_REPORT_TOKEN=pick-a-long-random-string

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=1
SMTP_USER=bbgmicrosoftclarity@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=Rent Pondy Reports <bbgmicrosoftclarity@gmail.com>
```

Then restart: `pm2 restart server`. The boot log should read

```
[DataAddedMail] armed — "0 9 1 * *" Asia/Kolkata, 1 recipient(s), base ALL
```

### Gmail credentials

`SMTP_PASS` is **not** the account password — Gmail rejects those. Sign in as
`bbgmicrosoftclarity@gmail.com`, turn on 2-Step Verification if it is off, then
generate an [App Password](https://myaccount.google.com/apppasswords) and paste
the 16 characters with the spaces removed.

Check the credentials before trusting the schedule:

```bash
node -e "require('dotenv/config');require('./DataAddedMail/mailer.js').verify().then(()=>console.log('SMTP OK')).catch(e=>console.error('SMTP FAILED:',e.message))"
```

Any other provider works too: Zoho `smtp.zoho.in:465`, Brevo
`smtp-relay.brevo.com:587`, or the VPS's own MTA on `localhost:25` (leave
`SMTP_USER`/`SMTP_PASS` set to anything non-empty only if it actually
authenticates — otherwise the layer treats it as unconfigured).

Deliverability note: mail sent as `@rentpondy.com` from a Gmail relay will land
in spam unless SPF/DKIM say it may. Sending **from** the Gmail account itself
(`SMTP_FROM` = `SMTP_USER`) avoids that entirely.

## Cadence

`DATA_ADDED_REPORT_CRON` is a standard 5-field expression, evaluated in
`DATA_ADDED_REPORT_TZ` (IST by default).

| Expression | Meaning |
| --- | --- |
| `0 9 1 * *` | 09:00 on the 1st of each month *(default)* |
| `0 9 * * 1` | 09:00 every Monday |
| `0 21 * * *` | 21:00 every day |
| `0 9 1 1 *` | 09:00 on 1 January only |

The mail always covers the **current calendar year to date**. Sent on the 1st,
the month that just closed is highlighted in the table and named in the subject.

## Routes

```
GET  /PPC/data-added-mail/status
```
Reports whether the schedule is armed, the cadence, masked recipients and the
last run's outcome. Never echoes credentials.

```
POST /PPC/data-added-mail/send-now
```
Sends immediately. Requires `DATA_ADDED_REPORT_TOKEN`, passed as the
`x-report-token` header or `?token=`. Optional: `?year=2025`, `?base=PY`,
`?to=someone@else.com`, `?dryRun=1` (builds everything, sends nothing).

Publicly the prefix appears **twice** — nginx strips `/PPC` before proxying, and
the router is mounted at `/PPC` inside the app, so `https://rentpondy.com/PPC` +
`/PPC/data-added-mail/…`. Same quirk as `ASSISTANT_API_BASE`. A single `/PPC`
returns 404.

```bash
# prove the pipeline without sending
curl -X POST "https://rentpondy.com/PPC/PPC/data-added-mail/send-now?dryRun=1" \
     -H "x-report-token: <token>"

# real send, to the configured recipients
curl -X POST "https://rentpondy.com/PPC/PPC/data-added-mail/send-now" \
     -H "x-report-token: <token>"

# on the VPS itself, straight to node (single prefix)
curl -X POST "http://127.0.0.1:5005/PPC/data-added-mail/send-now" \
     -H "x-report-token: <token>"
```

Leaving `DATA_ADDED_REPORT_TOKEN` blank disables `/send-now` entirely; the cron
still runs.

## Keeping it honest

`reportData.js` re-runs the same `$match` / `$group` shapes as
`DataAdded/DataAddedRouter.js` → `/data-added/summary`, because a cron tick has
no request to read a query string from. **Change one and change the other**, or
the e-mail and the screen will drift apart.

City scope comes from `cityScopePlugin` via `runWithBase()`, so
`DATA_ADDED_REPORT_BASE=PY` produces exactly what the admin header's
Pondicherry selection shows; `ALL` leaves the query unscoped.
