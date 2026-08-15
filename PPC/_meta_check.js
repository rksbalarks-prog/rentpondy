// Temporary: validate Meta WhatsApp Cloud API credentials (read-only, sends nothing)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const axios = require('axios');

const v = process.env.META_API_VERSION || 'v21.0';
const id = process.env.META_PHONE_NUMBER_ID;
const token = process.env.META_WHATSAPP_TOKEN;

(async () => {
  console.log(`Checking phone number id ${id} on ${v} ...`);
  try {
    const r = await axios.get(`https://graph.facebook.com/${v}/${id}`, {
      params: { fields: 'display_phone_number,verified_name,quality_rating,code_verification_status,platform_type' },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('\n✅ CREDENTIALS VALID. Phone number details:');
    console.log(JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log('\n❌ ERROR  (HTTP ' + (e.response?.status || '?') + ')');
    console.log(JSON.stringify(e.response?.data || e.message, null, 2));
  }
})();
