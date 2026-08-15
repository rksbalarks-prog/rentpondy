// Temporary: send a test WhatsApp message via Meta Cloud API.
// Usage:  node _meta_send_test.js <recipientNumberWithCountryCode> [template|text]
//   default mode = template  -> sends the pre-approved "hello_world" template
//   mode = text              -> sends free-form text (only works inside 24h window)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const axios = require('axios');

const v = process.env.META_API_VERSION || 'v21.0';
const id = process.env.META_PHONE_NUMBER_ID;
const token = process.env.META_WHATSAPP_TOKEN;

const to = (process.argv[2] || '').replace(/\D/g, '');
const mode = process.argv[3] || 'template';

if (!to) { console.log('Provide a recipient number, e.g. node _meta_send_test.js 919944244409'); process.exit(1); }

const body = mode === 'text'
  ? { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'text',
      text: { preview_url: false, body: 'Rent Pondy Meta API test ✅' } }
  : { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'template',
      template: { name: 'hello_world', language: { code: 'en_US' } } };

(async () => {
  console.log(`Sending ${mode} message to ${to} ...`);
  try {
    const r = await axios.post(`https://graph.facebook.com/${v}/${id}/messages`, body, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    console.log('\n✅ SENT.');
    console.log(JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log('\n❌ ERROR  (HTTP ' + (e.response?.status || '?') + ')');
    console.log(JSON.stringify(e.response?.data || e.message, null, 2));
  }
})();
