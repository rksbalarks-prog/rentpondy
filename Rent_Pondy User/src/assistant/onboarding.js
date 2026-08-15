// Guided onboarding flow config (bilingual). The widget runs a small state
// machine: language -> role -> field steps -> finish. Choice steps render quick
// chips; text/number steps use the input box. Enum values match the live data.

export const LANGS = [
  { value: 'en', label: { en: 'English', ta: 'English' } },
  { value: 'ta', label: { en: 'தமிழ்', ta: 'தமிழ்' } },
];

export const ROLES = [
  { value: 'owner', label: { en: '🏠 Owner', ta: '🏠 உரிமையாளர்' }, sub: { en: 'I have a property to rent out', ta: 'வாடகைக்கு விட சொத்து உள்ளது' } },
  { value: 'tenant', label: { en: '🔍 Tenant', ta: '🔍 வாடகைதாரர்' }, sub: { en: 'I am looking for a rental', ta: 'வாடகை வீடு தேடுகிறேன்' } },
];

const MODE = [
  { value: 'Residential', label: { en: 'Residential', ta: 'குடியிருப்பு' } },
  { value: 'Commercial', label: { en: 'Commercial', ta: 'வணிகம்' } },
  { value: 'Rent', label: { en: 'Rent', ta: 'வாடகை' } },
];
const TYPE = [
  { value: 'House', label: { en: 'House', ta: 'வீடு' } },
  { value: 'Apartment', label: { en: 'Apartment', ta: 'அபார்ட்மெண்ட்' } },
  { value: 'Villa', label: { en: 'Villa', ta: 'வில்லா' } },
  { value: 'Commercial Building', label: { en: 'Commercial Bldg', ta: 'வணிக கட்டிடம்' } },
  { value: 'Shop / Office', label: { en: 'Shop / Office', ta: 'கடை / அலுவலகம்' } },
  { value: 'Godown', label: { en: 'Godown', ta: 'கிடங்கு' } },
  { value: 'Bachelor Room', label: { en: 'Bachelor Room', ta: 'தனி அறை' } },
];
const BHK = ['1', '2', '3', '4', '5'].map((n) => ({ value: n, label: { en: `${n} BHK`, ta: `${n} படுக்கை` } }));
const YESNO = [
  { value: 'Yes', label: { en: 'Yes', ta: 'ஆம்' } },
  { value: 'No', label: { en: 'No', ta: 'இல்லை' } },
];

// prompt: question text; type: 'choice'|'text'|'number'; options for choice;
// ph: input placeholder; optional: allow Skip; prefillPhone: default to the user's phone.
export const OWNER_STEPS = [
  { key: 'propertyMode', type: 'choice', options: MODE, q: { en: 'What kind of property is it?', ta: 'இது எந்த வகை சொத்து?' } },
  { key: 'propertyType', type: 'choice', options: TYPE, q: { en: 'Property type?', ta: 'சொத்தின் வகை?' } },
  { key: 'bedrooms', type: 'choice', options: BHK, q: { en: 'How many bedrooms (BHK)?', ta: 'எத்தனை படுக்கை அறைகள் (BHK)?' } },
  { key: 'floorNo', type: 'text', q: { en: 'Which floor? (e.g. Ground, 1st)', ta: 'எந்த மாடி? (எ.கா. தரை, 1வது)' }, ph: { en: 'Floor', ta: 'மாடி' } },
  { key: 'carParking', type: 'choice', options: YESNO, q: { en: 'Car parking available?', ta: 'கார் பார்க்கிங் உள்ளதா?' } },
  { key: 'lift', type: 'choice', options: YESNO, q: { en: 'Lift available?', ta: 'லிப்ட் உள்ளதா?' } },
  { key: 'rentalAmount', type: 'number', q: { en: 'Monthly rent (₹)?', ta: 'மாத வாடகை (₹)?' }, ph: { en: 'e.g. 15000', ta: 'எ.கா. 15000' } },
  { key: 'advanceAmount', type: 'number', q: { en: 'Advance / deposit (₹)?', ta: 'முன்பணம் / டெபாசிட் (₹)?' }, ph: { en: 'e.g. 50000', ta: 'எ.கா. 50000' } },
  { key: 'totalArea', type: 'number', q: { en: 'Total area (sq.ft)?', ta: 'மொத்த பரப்பளவு (சதுர அடி)?' }, ph: { en: 'e.g. 900', ta: 'எ.கா. 900' } },
  { key: 'area', type: 'text', q: { en: 'Which area / locality?', ta: 'எந்த பகுதி?' }, ph: { en: 'e.g. White Town', ta: 'எ.கா. வெள்ளை நகர்' } },
  { key: 'pinCode', type: 'text', q: { en: 'Pincode?', ta: 'பின்கோடு?' }, ph: { en: '6 digits', ta: '6 இலக்கம்' } },
  { key: 'streetName', type: 'text', q: { en: 'Street / address?', ta: 'தெரு / முகவரி?' }, ph: { en: 'Street', ta: 'தெரு' } },
  { key: 'contactPhone', type: 'text', prefillPhone: true, q: { en: 'Best contact number?', ta: 'சிறந்த தொடர்பு எண்?' }, ph: { en: 'Phone', ta: 'தொலைபேசி' } },
];

export const TENANT_STEPS = [
  { key: 'propertyMode', type: 'choice', options: MODE, q: { en: 'What are you looking for?', ta: 'நீங்கள் எதைத் தேடுகிறீர்கள்?' } },
  { key: 'propertyType', type: 'choice', options: TYPE, q: { en: 'Property type?', ta: 'சொத்தின் வகை?' } },
  { key: 'minPrice', type: 'number', q: { en: 'Minimum budget (₹/month)?', ta: 'குறைந்தபட்ச பட்ஜெட் (₹/மாதம்)?' }, ph: { en: 'e.g. 5000', ta: 'எ.கா. 5000' } },
  { key: 'maxPrice', type: 'number', q: { en: 'Maximum budget (₹/month)?', ta: 'அதிகபட்ச பட்ஜெட் (₹/மாதம்)?' }, ph: { en: 'e.g. 15000', ta: 'எ.கா. 15000' } },
  { key: 'bedrooms', type: 'choice', options: BHK, q: { en: 'How many bedrooms?', ta: 'எத்தனை படுக்கை அறைகள்?' } },
  { key: 'floorNo', type: 'text', optional: true, q: { en: 'Preferred floor? (optional)', ta: 'விருப்ப மாடி? (விருப்பம்)' }, ph: { en: 'Any', ta: 'ஏதேனும்' } },
  { key: 'area', type: 'text', q: { en: 'Which area / locality?', ta: 'எந்த பகுதி?' }, ph: { en: 'e.g. Lawspet', ta: 'எ.கா. லாஸ்பேட்' } },
  { key: 'pinCode', type: 'text', optional: true, q: { en: 'Pincode? (optional)', ta: 'பின்கோடு? (விருப்பம்)' }, ph: { en: '6 digits', ta: '6 இலக்கம்' } },
];

export const FIELD_LABEL = {
  propertyMode: { en: 'Mode', ta: 'வகை' },
  propertyType: { en: 'Type', ta: 'வகை' },
  bedrooms: { en: 'BHK', ta: 'BHK' },
  floorNo: { en: 'Floor', ta: 'மாடி' },
  carParking: { en: 'Car park', ta: 'கார் பார்க்' },
  lift: { en: 'Lift', ta: 'லிப்ட்' },
  rentalAmount: { en: 'Rent ₹', ta: 'வாடகை ₹' },
  advanceAmount: { en: 'Advance ₹', ta: 'முன்பணம் ₹' },
  totalArea: { en: 'Area (sqft)', ta: 'பரப்பு (சதுர அடி)' },
  area: { en: 'Area', ta: 'பகுதி' },
  pinCode: { en: 'Pincode', ta: 'பின்கோடு' },
  streetName: { en: 'Street', ta: 'தெரு' },
  contactPhone: { en: 'Phone', ta: 'தொலைபேசி' },
  minPrice: { en: 'Min ₹', ta: 'குறைந்த ₹' },
  maxPrice: { en: 'Max ₹', ta: 'அதிக ₹' },
};

export const L = {
  chooseLang: { en: 'Welcome! Choose your language / மொழியைத் தேர்ந்தெடுக்கவும்', ta: 'வணக்கம்! மொழியைத் தேர்ந்தெடுக்கவும்' },
  chooseRole: { en: 'Are you an owner or a tenant?', ta: 'நீங்கள் உரிமையாளரா அல்லது வாடகைதாரரா?' },
  skip: { en: 'Skip', ta: 'தவிர்' },
  ownerDone: { en: 'Thanks! Here are your property details — our team will contact you to publish it with photos.', ta: 'நன்றி! உங்கள் சொத்து விவரங்கள் இதோ — புகைப்படங்களுடன் வெளியிட எங்கள் குழு உங்களைத் தொடர்பு கொள்ளும்.' },
  ownerSaveFail: { en: 'Saved locally, but could not reach the server. Please try again.', ta: 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' },
  tenantSearching: { en: 'Great! Let me find matching rentals for you…', ta: 'சரி! உங்களுக்கு பொருத்தமான வீடுகளைத் தேடுகிறேன்…' },
};

export function buildTenantQuery(a, lang) {
  const parts = [];
  parts.push(a.propertyMode || '');
  parts.push(a.propertyType || 'property');
  if (a.bedrooms) parts.push(`${a.bedrooms} BHK`);
  let s = `Find ${parts.filter(Boolean).join(' ')}`.trim();
  if (a.area) s += ` in ${a.area}`;
  if (a.pinCode) s += ` (pincode ${a.pinCode})`;
  if (a.minPrice || a.maxPrice) s += `, budget ₹${a.minPrice || 0} to ₹${a.maxPrice || 'any'}`;
  if (a.floorNo && !/any/i.test(a.floorNo)) s += `, floor ${a.floorNo}`;
  s += '.';
  return s;
}
