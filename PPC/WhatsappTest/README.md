# WhatsApp bulk-send test console

A passcode-gated page for firing a real SmartGrowth AI campaign at a list of
numbers, so credentials / template / delivery can be verified on the live server
without going through an admin screen.

**Live:** <https://rentpondy.com/PPC/whatsapp-test>
**Local:** <http://localhost:5005/whatsapp-test>

## Routes

| Route | Auth | What |
|---|---|---|
| `GET /whatsapp-test` | none | the page (`X-Robots-Tag: noindex`) |
| `GET /whatsapp-test/config` | none | endpoint, template, batch defaults, whether credentials exist — **no secrets** |
| `POST /whatsapp-test/send` | `x-test-key` | validate (dry run) or send |

Mounted at both root and `/PPC` in `server.js`, because nginx's `location /PPC/`
uses a trailing-slash `proxy_pass` that strips the prefix.

## Passcode

```
WHATSAPP_TEST_KEY=...        # PPC/.env — falls back to WA_INTERNAL_API_KEY
```

`pm2 restart server` reloads `.env`; the value is read per request, so no code
change is needed to rotate it.

## Why this does not import `services/whatsapp.js`

Deliberate. A test tool must not change the behaviour of the flows it is
testing, and this module has to be droppable onto a server whose other WhatsApp
wiring is a different vintage — as of 2026-08-19 the live server still runs the
pre-SmartGrowth Meta Cloud API service. The normalise / campaign-name / batching
logic here is a copy of that service's, kept payload-identical. If the two ever
diverge, `services/whatsapp.js` is the source of truth.

## Template-only

The campaign payload carries no message body. Recipients see the approved
template (`templateId`); the "Message text" box on the page is logged
server-side for the audit trail and **never delivered**. See
`../services/WHATSAPP_SMARTGROWTH.md`.

## Safety

- Dry run is the default — the page (and the API, via `dryRun !== false`) sends
  nothing until the toggle is cleared, and a live send needs a confirm.
- Max 10 000 recipients per submission; batch size capped at 1 000 per API call.
- Numbers are normalised, de-duplicated, and invalid ones reported before send.

## Smoke test

```bash
curl -s https://rentpondy.com/PPC/whatsapp-test/config

curl -s -X POST https://rentpondy.com/PPC/whatsapp-test/send \
  -H 'Content-Type: application/json' -H 'x-test-key: YOUR_PASSCODE' \
  -d '{"numbers":"9361546021","campaignName":"smoketest","dryRun":true}'
```
