# Admin Detail report (daily Excel)

A **separate** e-mail from [the admin-report PDF](../AdminReportMail/README.md).
That one carries counts; this one carries the **rows behind those counts**, with
phone numbers, as a multi-sheet `.xlsx`.

Sent daily at **08:30 IST** — half an hour after the PDF, so the two never
overlap and a slow run of one cannot delay the other.

## Sheets

| Sheet | Scope | Key columns |
| --- | --- | --- |
| Summary | — | row counts + what each sheet covers, warnings |
| Yesterday Actions | yesterday | action, date/time, **user phone**, **owner phone**, rent id |
| Yesterday Login | yesterday | phone, login date, mode, OTP, role, reported?, conversion |
| Unreported-Unconverted | all time | phone, category, last login, role, conversion |
| Followups `MON YYYY` | **this month only** | type, phone, id, follow-up date, status, admin |
| Bills `MON YYYY` | **this month only** | type, bill no, date, owner phone, amounts, admin |
| Payments | outstanding | bucket, phone, amount, plan, PayU status, txn id |

Follow-ups and Bills are deliberately **monthly, never all-time** — that was the
requirement. Every sheet has a frozen header row and autofilter switched on.

## Reconciliation

`fetchDetail.js` calls the same endpoints as the screen and applies the **same
filters** as `AdminReport.jsx`, so the row counts here reconcile with the PDF's
figures. Verified back-to-back on 2026-08-13:

```
                              PDF     EXCEL
  yesterday actions            21       21   match
  yesterday logins             21       21   match
  unreported (all time)      2567     2567   match
  conversion pending         3685     3685   match
  followups this month        150      150   match
  bills this month             97       97   match
  bill amount this month    14000    14000   match
```

Run them minutes apart and small differences appear — that is live data moving,
not a bug. Two known causes:

- The login list is **de-duplicated to one record per phone**, keeping the newest
  login. Somebody who logged in yesterday *and* today therefore drops out of
  yesterday's count during the day. The screen behaves identically; this is
  copied deliberately, not fixed here.
- Bills and follow-ups are created throughout the day.

## Settings

```ini
ADMIN_EXCEL_MAIL_ENABLED=1
ADMIN_EXCEL_TO=madhankumar7673@gmail.com
ADMIN_EXCEL_CC=
ADMIN_EXCEL_CRON=30 8 * * *
ADMIN_EXCEL_TZ=Asia/Kolkata
ADMIN_EXCEL_TOKEN=            # falls back to ADMIN_REPORT_TOKEN / DATA_ADDED_REPORT_TOKEN
ADMIN_EXCEL_API_BASE=http://127.0.0.1:5005/PPC
```

## Routes

```bash
curl https://rentpondy.com/PPC/PPC/admin-excel-mail/status

# build everything, send nothing — returns the row counts
curl -X POST "https://rentpondy.com/PPC/PPC/admin-excel-mail/send-now?dryRun=1" \
     -H "x-report-token: <token>"

# real send (optionally ?to=someone@else.com)
curl -X POST "https://rentpondy.com/PPC/PPC/admin-excel-mail/send-now" \
     -H "x-report-token: <token>"
```

The prefix appears twice publicly — nginx strips `/PPC` and the router mounts at
`/PPC` inside the app.

## Note on the contents

The workbook contains **customer phone numbers** for every action, login and
bill. It is ~1.4 MB today, dominated by the ~3,700-row backlog sheet. If it ever
approaches Gmail's 25 MB limit the backlog sheet is the one to cap first.
