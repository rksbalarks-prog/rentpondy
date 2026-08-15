# Weekly database backup by e-mail

Mails the newest MongoDB archive to the configured recipients once a week, as a
`.archive.gz` attachment.

It **does not dump the database**. `/root/vps-backup.sh` already runs a
read-only `mongodump` every night at 02:30 IST, size-checks the result and keeps
the newest 7 archives in `/root/backups`. This script picks the most recent of
those up and posts it — so there is no second dump against the live database,
and nothing is ever mailed that the backup script has not already validated.

## Why it is not part of the express app

The archives live in `/root/backups`, which the `rentpondy` user that owns the
pm2 process cannot read. So this is a one-shot script run from **root's**
crontab, not a `node-cron` job inside `server.js`. It shares only the SMTP
transport (`../DataAddedMail/mailer.js`) and the credentials in `PPC/.env`.

## Setup

SMTP is already configured for [the Data Added report](../DataAddedMail/README.md).
These keys are optional — the defaults are what production runs:

```ini
BACKUP_MAIL_ENABLED=1
BACKUP_MAIL_TO=madhankumar7673@gmail.com
BACKUP_MAIL_CC=
BACKUP_MAIL_DIR=/root/backups
BACKUP_MAIL_MAX_MB=20
BACKUP_MAIL_MAX_AGE_HOURS=48
BACKUP_MAIL_LOG=/root/backups/backup-email.log
```

Cron entry, appended to root's crontab (which is Sentora-managed — **append
only, never rewrite**):

```cron
# RentPondy weekly DB backup by e-mail - runs after the 02:30 nightly dump
0 3 * * 0 /usr/bin/node /home/rentpondy/public_html/PPC/BackupMail/backupEmail.js >/dev/null 2>&1
```

## Running it by hand

```bash
# check everything without sending
node /home/rentpondy/public_html/PPC/BackupMail/backupEmail.js --dry-run

# send now
node /home/rentpondy/public_html/PPC/BackupMail/backupEmail.js

# send somewhere else, once
BACKUP_MAIL_TO=you@example.com node /home/rentpondy/public_html/PPC/BackupMail/backupEmail.js
```

Exit code is `0` on a healthy send, `1` on any alert. Every run appends to
`/root/backups/backup-email.log`.

## What it sends

| Situation | Result | Exit |
| --- | --- | --- |
| Healthy archive | Archive attached, with size, timestamp and the tail of `backup.log` | 0 |
| Archive older than `MAX_AGE_HOURS` | Still attached, subject prefixed **STALE** — the nightly dump has probably stopped | 0 |
| Archive over `MAX_MB` | **Not** attached; alert naming the file and an `scp` command to fetch it | 1 |
| No archive at all | Alert saying where it looked | 1 |

Silence is never treated as success — every failure path sends mail.

## Size headroom

Archives were ~5.8 MB in August 2026, growing roughly 0.1 MB/day. Gmail rejects
anything over 25 MB, so `BACKUP_MAIL_MAX_MB=20` leaves the guard tripping well
before Gmail does. At the current rate that is a year or two away; when it gets
close, move to uploading the archive to cloud storage and mailing a link
instead of raising the cap.

## Restoring

```bash
mongorestore --uri="<MONGO_URI>" --archive=rentpondy-RentPondyPPC-<date>.archive.gz --gzip --drop
```

`--drop` replaces existing collections. Restore into a scratch database name
first if you are not completely certain.
