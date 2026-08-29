// Turns the OCR text of one ad box into the same record the vision model used
// to return. Rules, not a model — so it costs nothing and never invents a value.
//
// The rules come from reading the paper rather than from imagination: every
// pattern here was written against real OCR output from the 8 Aug 2026 issue.
// Two of them exist only because the obvious version got a real ad wrong:
//
//   - "RENTAL INCOME PROPERTY FOR SALE" is a SALE. Any rule that keys on the
//     word RENT alone publishes that plot as a rental.
//   - "1 sq.ft Rate: Rs. 7000/-" is a price per square foot, not a 1 sq.ft
//     property. An area rule that ignores the following words reads it as an
//     area of 1.
//
// Anything the rules cannot determine is left null. Downstream, normalizeAd
// turns a null dealType into an issue and the ad goes to a person — which is
// the right outcome, and much better than a confident guess.

const { resolveArea } = require('./locality');

const TAMIL = /[஀-௿]/;

// ── deal type ──────────────────────────────────────────────────────────────
// Weighted signals; the strongest total wins. Tamil is weighted the same as
// English because on a Tamil-set ad it is the only signal there is.
//
// The Tamil patterns are deliberately loose. Tesseract reliably reads the
// stem but sometimes drops or swaps one glyph in the suffix — real observed
// misreads of விற்பனை include "விற்பளை" and "றபனை" — and a strict match would
// throw away an ad the engine actually read correctly enough to classify.
const WANTED_SIGNALS = [
  [/\bWANTED\b/i, 10],
  [/\bREQUIRED\b/i, 8],
  [/தேவை/, 10],
];

const RENT_SIGNALS = [
  [/\bFOR\s+RENT\b/i, 10],
  [/\bTO\s+LET\b/i, 10],
  [/\bFOR\s+LEASE\b/i, 9],
  [/வாடகை/, 10],
  [/வாடக/, 6],
  [/\bRENT\b/i, 3],
];

const SALE_SIGNALS = [
  [/\bFOR\s+SALE\b/i, 10],
  [/\bSALES?\b/i, 4],
  [/விற்பனை/, 10],
  [/விற்?ப[னளணடர]/, 7],   // tolerant of a dropped or swapped suffix glyph
  [/றபனை/, 6],             // observed misread of விற்பனை
  [/விலைக்கு/, 8],          // "for a price" — always a sale
  [/லட்சம்/, 3],            // lakhs quoted: a sale price, not a monthly rent
];

function score(text, signals) {
  let total = 0;
  for (const [re, weight] of signals) if (re.test(text)) total += weight;
  return total;
}

function detectDealType(text) {
  // "RENTAL INCOME ... FOR SALE" — the property produces rent, it does not want
  // a tenant. Take the word RENT out of the running before scoring.
  const forScoring = text.replace(/RENTAL\s+INCOME/gi, ' ');

  const wanted = score(forScoring, WANTED_SIGNALS);
  const rent = score(forScoring, RENT_SIGNALS);
  const sale = score(forScoring, SALE_SIGNALS);

  // Someone looking FOR a place is neither a rental nor a sale listing.
  if (wanted >= 10 && wanted >= Math.max(rent, sale)) return 'wanted';

  if (rent === 0 && sale === 0) return 'unknown';
  if (rent === sale) return 'unknown';
  return rent > sale ? 'rent' : 'sale';
}

// ── phones ─────────────────────────────────────────────────────────────────
// Anchored on how the paper actually prints a number (98765 43210). Grabbing
// any ten digits in a row instead reads one character of noise as a digit and
// slides the window: a printed 70942 20892 came back as 6709422089.
function detectPhones(text) {
  const out = [];
  const push = (d) => {
    if (/^[6-9]\d{9}$/.test(d) && !out.includes(d)) out.push(d);
  };

  for (const m of text.matchAll(/(?<!\d)(\d{5})[\s.\-]+(\d{5})(?!\d)/g)) push(m[1] + m[2]);
  for (const m of text.matchAll(/(?<!\d)(\d{10})(?!\d)/g)) push(m[1]);
  for (const m of text.matchAll(/(?<!\d)(\d{4})[\s.\-]+(\d{3})[\s.\-]+(\d{3})(?!\d)/g)) {
    push(m[1] + m[2] + m[3]);
  }
  return out.slice(0, 6);
}

// ── money ──────────────────────────────────────────────────────────────────
function toRupees(numText, unit) {
  const n = Number(String(numText).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  const u = String(unit || '').toLowerCase();
  if (u.startsWith('k')) return Math.round(n * 1000);
  if (u.startsWith('l') || u.includes('லட்ச')) return Math.round(n * 100000);
  if (u.startsWith('cr') || u.includes('கோடி')) return Math.round(n * 10000000);
  return Math.round(n);
}

const MONEY = '(?:Rs\\.?|₹|INR)?\\s*([\\d][\\d,.]*)\\s*(K\\b|Lakhs?\\b|Lacs?\\b|Cr\\b|Crores?\\b|லட்சம்|கோடி)?';

// "FOR RENT 3BHK House ..." is not a rent of ₹3. A bare number this close to
// the word RENT is usually the bedroom count or a floor, so a figure only counts
// as a rent when it is either marked as money (Rs / ₹ / K / lakhs) or large
// enough that it cannot be anything else.
function detectRent(text) {
  const re = new RegExp(`\\bRENT\\b[^\\d\\n]{0,18}${MONEY}([^\\n]{0,6})`, 'i');
  const m = text.match(re);
  if (!m) return null;
  if (/^\s*BHK/i.test(m[3] || '')) return null;         // "RENT 3BHK"

  const marked = /Rs\.?|₹|INR/i.test(m[0]) || !!m[2];   // money words or a K/lakh unit
  const value = toRupees(m[1], m[2]);
  if (value == null) return null;
  if (!marked && value < 500) return null;              // a bedroom or a floor

  return value;
}

function detectDeposit(text) {
  const re = new RegExp(`\\b(?:ADVANCE|DEPOSIT|CAUTION)\\b[^\\d\\n]{0,18}${MONEY}`, 'i');
  const m = text.match(re);
  return m ? toRupees(m[1], m[2]) : null;
}

// ── size ───────────────────────────────────────────────────────────────────
// "1 sq.ft Rate: Rs. 7000/-" is a per-square-foot price. Reject a match whose
// following words price it, and reject an implausibly small figure outright.
function detectArea(text) {
  const re = /([\d][\d,.]*)\s*(?:sq\.?\s*\.?\s*(?:ft|feet)|sqft|சதுரடி)([^\n]{0,14})/gi;
  let best = null;

  for (const m of text.matchAll(re)) {
    const trailing = m[2] || '';
    if (/\b(rate|price|per|rs|cost|விலை)\b/i.test(trailing)) continue;

    const n = Number(String(m[1]).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n) || n < 50) continue;   // 1 sq.ft is a rate, not a home
    if (best == null || n > best) best = Math.round(n);
  }
  return best;
}

function detectBedrooms(text) {
  const m = text.match(/(\d)\s*BHK/i);
  return m ? m[1] : null;
}

const WORD_FLOORS = {
  first: '1', second: '2', third: '3', fourth: '4', fifth: '5',
};

function detectFloor(text) {
  if (/GROUND\s*FLOOR|தரை\s*தளம்/i.test(text)) return 'Ground';

  const spelled = text.match(/\b(FIRST|SECOND|THIRD|FOURTH|FIFTH)\s*FLOOR\b/i);
  if (spelled) return WORD_FLOORS[spelled[1].toLowerCase()];

  // "Ist Floor" is how Tesseract reads 1st in this typeface.
  const m = text.match(/\b(?:(\d+)\s*(?:st|nd|rd|th)?|I(?:st)?)\s*FLOOR\b/i);
  if (!m) return null;
  return m[1] ? m[1] : '1';
}

// ── type and mode ──────────────────────────────────────────────────────────
// Most specific first: a "COMMERCIAL SPACE" must not be caught by /SPACE/, and
// an "INDEPENDENT HOUSE" must not be caught by /HOUSE/.
const TYPE_RULES = [
  [/INDEPENDENT\s+HOUSE/i, 'Independent House'],
  [/COMMERCIAL\s+SPACE|RETAIL\s+SPACE/i, 'Commercial Space'],
  [/\bGODOWN\b/i, 'Godown'],
  [/\bWAREHOUSE\b/i, 'Warehouse'],
  [/\bAPARTMENT\b|அப்பார்ட்மெண்ட்/i, 'Apartment'],
  [/\bFLAT\b/i, 'Flat'],
  [/\bPORTION\b/i, 'Portion'],
  [/\bPG\b|PAYING\s+GUEST/i, 'PG'],
  [/\bSHOP\b|கடை/i, 'Shop'],
  [/\bOFFICE\b/i, 'Office'],
  [/\bPLOTS?\b|மனை/i, 'Plot'],
  [/\bLAND\b|நிலம்|நிலங்கள்/i, 'Land'],
  [/\bBUILDING\b|கட்டிடம்/i, 'Building'],
  [/\bHOUSES?\b|\bVILLA\b|வீடு|வீடுகள்/i, 'House'],
  [/\bROOMS?\b/i, 'Room'],
  [/\bSHED\b|\bBUILDING\b/i, 'Building'],
];

// Earliest match wins, not first rule. These ads lead with what they are
// selling and mention everything else afterwards: "3BHK House available for
// Rent ... For Residence or Office" is a House, and a rule-ordered scan calls
// it an Office because Office happens to sit higher in the list.
function detectType(text) {
  let best = null;
  for (const [re, name] of TYPE_RULES) {
    const m = text.match(re);
    if (!m) continue;
    if (best === null || m.index < best.index) best = { index: m.index, name };
  }
  return best ? best.name : null;
}

const COMMERCIAL_TYPES = new Set([
  'Shop', 'Office', 'Commercial Space', 'Godown', 'Warehouse',
]);

function detectMode(text, type) {
  if (type && COMMERCIAL_TYPES.has(type)) return 'Commercial';
  if (/\bCOMMERCIAL\b|RESTAURANT|\bGYM\b|\bCAFE\b|SHOWROOM|\bSTUDIO\b|\bRETAIL\b/i.test(text)) {
    return 'Commercial';
  }
  return 'Residential';
}

// ── features ───────────────────────────────────────────────────────────────
const FEATURE_RULES = [
  [/COVERED\s+CAR\s+PARK/i, 'covered car parking'],
  [/CAR\s+PARK/i, 'car parking'],
  [/TWO\s+WHEELER\s+PARK|BIKE\s+PARK/i, 'two wheeler parking'],
  [/\bLIFT\b/i, 'lift'],
  [/FULLY\s+FURNISHED/i, 'fully furnished'],
  [/SEMI\s+FURNISHED/i, 'semi furnished'],
  [/\bFURNISHED\b/i, 'furnished'],
  [/CENTRALI[SZ]ED\s+A\/?C|CENTRAL\s+A\/?C/i, 'centralized a/c'],
  [/\bA\/C\b|AIR\s*CONDITION/i, 'a/c'],
  [/ATTACHED\s+BATH/i, 'attached bathroom'],
  [/\bTOILET\b/i, 'toilet'],
  [/BORE\s*WELL/i, 'borewell'],
  [/\bEAST\s+FACING\b|கிழக்கு\s*பார்த்த/i, 'east facing'],
  [/\bWEST\s+FACING\b|மேற்கு\s*பார்த்த/i, 'west facing'],
  [/\bNORTH\s+FACING\b|வடக்கு\s*பார்த்த/i, 'north facing'],
  [/\bSOUTH\s+FACING\b|தெற்கு\s*பார்த்த/i, 'south facing'],
  [/PPA\s+APPROV|APPROVED\s+PLOT/i, 'PPA approved'],
];

function detectFeatures(text) {
  const out = [];
  for (const [re, name] of FEATURE_RULES) {
    if (re.test(text) && !out.includes(name)) out.push(name);
  }
  return out.slice(0, 12);
}

// ── is this even a property ad? ────────────────────────────────────────────
// The boxes on these pages also carry jobs, matrimony, vehicles and tuition.
// The model used to reject those; now a rule has to.
const NOT_PROPERTY = [
  /MATRIMON|திருமண|BRIDE|GROOM/i,
  /\bVACANC(?:Y|IES)\b|\bJOB\b|வேலை\s*வாய்ப்/i,
  /\bTUITION\b|\bCOACHING\b|\bADMISSION\b/i,
  /\bCAR\s+FOR\s+SALE\b|\bBIKE\b|\bSCOOTY\b|\bAUTO\s+FOR\s+SALE\b/i,
  /\bWANTED\b\s+(?:DRIVER|STAFF|SALES|TEACHER|NURSE|COOK|WORKER)/i,
];

// ── locality ───────────────────────────────────────────────────────────────
// resolveArea deliberately falls back to White Town / 605001 when an ad only
// says "Pondicherry", because for area resolution that is the best guess for
// "somewhere in town". For THIS field it is wrong: `locality` means the area
// the ad actually named, and letting the fallback through would file a
// Murungapakkam plot under White Town. So a match on the bare city name is
// treated as no locality, and the later area resolution does its own job
// unchanged.
const CITY_ONLY = new Set([
  'pondicherry', 'puducherry', 'pondy', 'cuddalore',
  'புதுச்சேரி', 'புதுவை', 'புதுவை நகர்', 'காரைக்கால்', 'கடலூர்',
]);

function detectLocality(text) {
  const hit = resolveArea(text);
  if (!hit || !hit.area) return null;
  if (CITY_ONLY.has(String(hit.matched || '').trim().toLowerCase())) return null;
  return hit.area;
}

function looksLikeProperty(text, type, dealType) {
  for (const re of NOT_PROPERTY) if (re.test(text)) return false;
  // A property word, or a deal word plus something to deal in.
  if (type) return true;
  return dealType === 'rent' || dealType === 'sale';
}

// ── main ───────────────────────────────────────────────────────────────────

/**
 * @param {string} ocrText  the text of ONE ad box
 * @returns {object|null}   the same shape the vision model returned, or null
 *                          when the box is not a property ad
 */
function extractFields(ocrText) {
  const text = String(ocrText || '').trim();
  if (text.length < 8) return null;

  const flat = text.replace(/\s+/g, ' ').trim();

  const dealType = detectDealType(flat);
  const propertyType = detectType(flat);

  if (!looksLikeProperty(flat, propertyType, dealType)) return null;

  const tamilChars = (flat.match(/[஀-௿]/g) || []).length;
  const latinChars = (flat.match(/[A-Za-z]/g) || []).length;
  const language =
    tamilChars && latinChars > 3 ? 'mixed' : tamilChars ? 'ta' : 'en';

  // The headline is the first line the engine read, which on this layout is the
  // bold heading almost every time.
  const headline = (text.split('\n').find((l) => l.trim().length > 2) || '').trim();

  return {
    dealType,
    headline: headline.slice(0, 200),
    phones: detectPhones(flat),
    rentAmount: dealType === 'rent' ? detectRent(flat) : null,
    deposit: detectDeposit(flat),
    bedrooms: detectBedrooms(flat),
    propertyMode: detectMode(flat, propertyType),
    propertyType,
    locality: detectLocality(flat),
    address: null,        // the printed address is inside rawText; normalize.js
                          // strips numbers from anything public anyway
    areaSqft: detectArea(flat),
    floorNo: detectFloor(flat),
    features: detectFeatures(flat),
    language,
    rawText: flat.slice(0, 2000),
  };
}

module.exports = {
  extractFields,
  detectDealType,
  detectPhones,
  detectRent,
  detectArea,
  detectType,
  detectFloor,
  TAMIL,
};
