# WhatsApp — SmartGrowth AI campaign API

The only WhatsApp integration in this backend. It replaced the Meta Cloud API
(`graph.facebook.com`), Wasender (`wasenderapi`) and OneMSG paths, all of which
have been deleted.

## The API

```bash
curl --request POST 'https://newapp.smartgrowthai.com/send/campaign' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_PASSWORD_OR_TOKEN' \
  --data '{
    "templateId": "1625325505557221",
    "apiCode": "YOUR_API_CODE",
    "campaignName": "testaugust",
    "phoneNumbers": ["919361546021"]
  }'
```

## ⚠ It is template-only

The payload has **no message body**. What a recipient sees is whatever the
approved template (`templateId`) says — the free-form text the old providers
accepted can no longer be transmitted.

Every call site still passes its composed text; that text is now **audit-log /
DB only** (it still appears in `PM`, `PMBulk` and `BulkWhatsapp` records and in
the server log). To vary the wording per flow, get another template approved and
point that flow at it with its own env var.

Affected flows whose wording no longer reaches the recipient:

| Flow | File | Template env var |
|---|---|---|
| Daily admin report (3 parts, 08:00 IST) | `messageRoutes.js` | `SMARTGROWTH_REPORT_TEMPLATE_ID` |
| Queue notifications (interest, contact, …) | `messageRoutes.js` | `SMARTGROWTH_NOTIFY_TEMPLATE_ID` |
| Tenant/owner "matched" notice | `BuyerAssistance/BuyerAssistanceRouter.js` | `SMARTGROWTH_NOTIFY_TEMPLATE_ID` |
| New-admin-created notice | `Admin/AdminRouter.js` | `SMARTGROWTH_NOTIFY_TEMPLATE_ID` |
| Admin single send | `PmWhatsapp/PMRouter.js` | `SMARTGROWTH_NOTIFY_TEMPLATE_ID` |
| Admin bulk campaigns | `PmBulkWhatsapp/PmBulkRouter.js`, `BulkWhatsapp/BulkWhatsappRouter.js` | `SMARTGROWTH_BULK_TEMPLATE_ID` |

## Setup

Fill these two in `PPC/.env`, then restart (`pm2 restart server`):

```
SMARTGROWTH_TOKEN=          # your password / API token → Authorization: Bearer
SMARTGROWTH_API_CODE=       # your assigned API code    → JSON body
```

Everything else has a working default — see `.env.example` for the full list
(`SMARTGROWTH_API_URL`, `SMARTGROWTH_TEMPLATE_ID`, the per-flow template
overrides, `SMARTGROWTH_BATCH_SIZE`, `SMARTGROWTH_BATCH_DELAY_MS`,
`SMARTGROWTH_TIMEOUT_MS`, `SMARTGROWTH_UNIQUE_CAMPAIGN_NAMES`).

Credentials are read at **call time**, so a `pm2 restart server` (which reloads
`.env`) always picks up the latest values.

## Using it from code

```js
// CommonJS routers
const whatsapp = require("../services/whatsapp");
// ESM files
import whatsapp from "./services/whatsapp.js";

await whatsapp.sendCampaign({
  phoneNumbers: ["9361546021", "+91 93615-46021"], // normalised + de-duped
  campaignName: "testaugust",                      // timestamp suffix appended
  templateId: whatsapp.TEMPLATES.bulk(),           // optional
});
```

`sendCampaign` throws when credentials are missing, when no number survives
normalisation, or when the API returns non-2xx (the provider's body is on
`err.response.data`).

`normalizePhone` accepts a bare 10-digit Indian number and prefixes `91`;
anything outside 11–15 digits after cleaning is dropped.

`sendText(to, message)` / `sendTemplate(to, templateId)` remain as thin
compatibility shims over `sendCampaign`.

## Campaign names

`buildCampaignName` slugs the name and appends a UTC timestamp
(`testaugust` → `testaugust20260818053939`) so each send is traceable in the
SmartGrowth dashboard. If SmartGrowth only accepts campaign names that were
pre-registered there, set `SMARTGROWTH_UNIQUE_CAMPAIGN_NAMES=0` and the slug is
sent as-is.

## Batching

The API takes an array of numbers, so bulk flows send one call per
`SMARTGROWTH_BATCH_SIZE` (default 500) recipients rather than one call per
number, pausing `SMARTGROWTH_BATCH_DELAY_MS` between calls. A chunk's outcome is
applied to every record it covered.

## HTTP routes

Both are mounted at root **and** under `/PPC`, and both require the
`x-api-key: $WA_INTERNAL_API_KEY` header.

| Route | Body |
|---|---|
| `GET  /api/whatsapp-status` | — (no auth; reports `configured`, endpoint, default template) |
| `POST /api/send-whatsapp` | `{ to \| phoneNumbers[], campaignName?, templateId? }` |
| `POST /api/send-whatsapp-campaign` | `{ phoneNumbers[], campaignName?, templateId? }` |

Existing admin endpoints (`/PPC/send-text`, `/PPC/send-bulk-text`,
`/PPC/send-message`, `/PPC/api/bulk-whatsapp/*`) keep their request shapes and
now route through this service.

## Smoke test

```bash
node -e "require('./services/whatsapp').sendCampaign({phoneNumbers:['919361546021'],campaignName:'testaugust'}).then(r=>console.log(r)).catch(e=>console.log(e.response?.status, e.response?.data))"
```

A `401 {"message":"You are not authorized to access this resource"}` means the
request shape is right and the token/apiCode are wrong or unset.
