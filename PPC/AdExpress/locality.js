// Turns the free text a classified ad prints into a real area + pincode.
//
// The problem this solves: an ad says "Vinayagamurugan Nagar, Behind ECR Latha
// steel, Lawspet, Pondy" or "சோர்பேட், வில்லியனூர்". Stored as-is that is a
// dead end — the home-feed tickers count by pincode, and area search matches
// area names, so a listing with neither is invisible no matter how good the
// rest of its data is.
//
// So the printed locality is matched against the SAME gazetteer the admin's
// Add Property form uses (PONDY_AREA_PINCODE_MAP in AddProperty.jsx, kept in
// step below), and the ad's own wording is preserved in the address instead of
// being overwritten.
//
// When nothing matches, nothing is invented: the row keeps its printed text and
// is left without a pincode, which is honest and visible, rather than being
// filed under a plausible-looking wrong area.

/**
 * Locality -> pincode. A copy of the admin form's PONDY_AREA_PINCODE_MAP; if
 * that list gains an area, add it here too.
 */
const AREA_PINCODE = {
  Abishegapakkam: '605007',
  Ariyankuppam: '605007',
  Arumbarthapuram: '605110',
  Bahour: '605101',
  Bommaiyarpalayam: '605106',
  Cathedral: '605001',
  'Chinna Kalapet': '605014',
  'Chinna Veerampatinam': '605007',
  Dharmapuri: '605003',
  'Dupleix Nagar': '605001',
  Embalam: '605106',
  'Heritage Town': '605001',
  'IG Square': '605005',
  'Iyyanar Koil': '605013',
  'Jipmer Campus': '605006',
  Kadirkamam: '605009',
  Kalapet: '605014',
  Kanniakoil: '605010',
  Karayamputhur: '605106',
  Karuvadikuppam: '605008',
  Katterikuppam: '605009',
  Kirumampakkam: '605502',
  Koodapakkam: '605502',
  Korkadu: '605501',
  Kottakuppam: '605104',
  'Kottakuppam Puduthurai': '605007',
  Kunichempet: '605006',
  Kuruvinatham: '605007',
  Kurusukuppam: '605012',
  Lawspet: '605008',
  Madukarai: '605107',
  Madagadipet: '605107',
  Manalipet: '605010',
  Manapattu: '605105',
  Mangalam: '605004',
  Mannadipet: '605501',
  Mettupalayam: '605009',
  'MG Road': '605001',
  'Mission Street': '605001',
  Moolakulam: '605010',
  Mudaliarpet: '605004',
  Murungapakkam: '605004',
  Muthialpet: '605003',
  Nallambal: '605006',
  'Natesan Nagar': '605005',
  Nellithope: '605005',
  'Olandai Keerapalayam': '605010',
  Orleanpet: '605001',
  Osudu: '605110',
  Ousteri: '605009',
  'Pillaiyarkuppam (Ariyankuppam)': '605007',
  'Pillaiyarkuppam (Bahour)': '605101',
  'Pondicherry University': '605014',
  'Pudhu Nagar': '605010',
  'Rainbow Nagar': '605011',
  Reddiarpalayam: '605010',
  'Sanjay Gandhi Nagar': '605005',
  Saram: '605013',
  Seedhankuppam: '605005',
  Seliamedu: '605106',
  'Sita Nagar': '605013',
  'Solai Nagar': '605010',
  'Sri Aurobindo Ashram': '605002',
  'Subbaiah Salai': '605001',
  Sultanpet: '605003',
  Thavalakuppam: '605009',
  Thengaithittu: '605004',
  Thondamanatham: '605502',
  Thirubuvanai: '605107',
  Thirukanchi: '605009',
  Thiruthani: '605006',
  Vaithikuppam: '605012',
  Vadhanur: '605111',
  Veerampattinam: '605007',
  Velrampet: '605004',
  Villianur: '605110',
  'White Town': '605001',
};

/**
 * Extra spellings that point at an entry above. Two kinds:
 *   - Tamil names, because a good share of the ads are set in Tamil;
 *   - the spellings the paper actually uses, which differ from the form's.
 * The value must be a key of AREA_PINCODE.
 */
const ALIASES = {
  // Tamil
  'புதுச்சேரி': 'White Town',
  'வில்லியனூர்': 'Villianur',
  'சோர்பேட்': 'Villianur',
  'கூடப்பாக்கம்': 'Koodapakkam',
  'லாஸ்பேட்': 'Lawspet',
  'முதலியார்பேட்': 'Mudaliarpet',
  'முத்தியால்பேட்': 'Muthialpet',
  'ரெட்டியார்பாளையம்': 'Reddiarpalayam',
  'அரியாங்குப்பம்': 'Ariyankuppam',
  'கொட்டக்குப்பம்': 'Kottakuppam',
  'நெல்லித்தோப்பு': 'Nellithope',
  'சாரம்': 'Saram',
  'மூலக்குளம்': 'Moolakulam',
  'கதிர்காமம்': 'Kadirkamam',
  'கோரிமேடு': 'Kadirkamam',
  'தட்டாஞ்சாவடி': 'Nellithope',
  'உழவர்கரை': 'Reddiarpalayam',
  'முருங்கப்பாக்கம்': 'Murungapakkam',
  'முருங்கபாக்கம்': 'Murungapakkam',
  'காரைக்கால்': 'White Town',
  // "Puduvai" is just Pondicherry in Tamil — generic, so it is tried last.
  'புதுவை': 'White Town',
  'புதுவை நகர்': 'White Town',
  // English spellings the paper uses
  Pondy: 'White Town',
  Puducherry: 'White Town',
  Pondicherry: 'White Town',
  Reddiyarpalayam: 'Reddiarpalayam',
  Lawspet: 'Lawspet',
  Thattanchavady: 'Nellithope',
  Uruvaiyar: 'Reddiarpalayam',
  Nainarmandapam: 'Mudaliarpet',
  Kosapalayam: 'Muthialpet',
  Vazhudavur: 'Villianur',
  Ariankuppam: 'Ariyankuppam',
  Anandanagar: 'Reddiarpalayam',
  Vambakeerapalayam: 'Muthialpet',
  Kombakkam: 'Mudaliarpet',
  'Ellaipillaichavady': 'Nellithope',
  'New Saram': 'Saram',
  'Rainbow nagar': 'Rainbow Nagar',
  // "M.G. Road" normalises to "m g road", which no longer matches the map's
  // "MG Road" — spell the spaced form out rather than making normalise() clever.
  'M G Road': 'MG Road',
  // The ads say "Near JIPMER", never "Jipmer Campus".
  JIPMER: 'Jipmer Campus',
  Jipmer: 'Jipmer Campus',
};

/** Fold case, strip punctuation, squeeze whitespace — for loose comparison. */
const normalise = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[.,/\\()\-–—:;|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// The bare city name is not a locality. It has to be tried LAST, or it wins on
// length alone: "Balaji Nagar, New Saram, Puducherry-13" would resolve to White
// Town, because "puducherry" is a longer string than "new saram".
const GENERIC = new Set(
  [
    'Pondy',
    'Puducherry',
    'Pondicherry',
    'புதுச்சேரி',
    'புதுவை',
    'புதுவை நகர்',
    'காரைக்கால்',
  ].map(normalise)
);

// Longest names first, so "Kottakuppam Puduthurai" wins over "Kottakuppam" and
// "Chinna Veerampatinam" over "Veerampattinam".
const byLength = (a, b) => b.match.length - a.match.length;

const ALL = [
  ...Object.keys(AREA_PINCODE).map((name) => ({ name, match: normalise(name) })),
  ...Object.keys(ALIASES).map((alias) => ({
    name: ALIASES[alias],
    match: normalise(alias),
  })),
];

/**
 * Area names learned from the app's own listings.
 *
 * The curated map above is the admin form's list — good, but only 76 entries.
 * The live database holds ~350 area names already paired with a pincode by
 * staff over the years ("Sedarapet", "Nehru Nagar", "Muthirapalayam" …), which
 * is both wider and their actual vocabulary. Priming from it beats hardcoding
 * pincodes I would otherwise be guessing at.
 */
let LEARNED = [];

/**
 * @param {Array<{area: string, pinCode: string|number}>} pairs
 */
function learn(pairs) {
  const tally = new Map(); // normalised name -> { pin -> count }
  for (const { area, pinCode } of pairs || []) {
    const name = normalise(area);
    const pin = String(pinCode || '').trim();
    if (!name || name === 'undefined' || !/^\d{6}$/.test(pin)) continue;
    if (!tally.has(name)) tally.set(name, new Map());
    const pins = tally.get(name);
    pins.set(pin, (pins.get(pin) || 0) + 1);
  }

  LEARNED = [];
  for (const [name, pins] of tally) {
    if (GENERIC.has(name)) continue; // never let "pondicherry" become specific
    // The pincode most of that area's listings agree on.
    const [pin] = [...pins.entries()].sort((a, b) => b[1] - a[1])[0];
    LEARNED.push({ name: titleCase(name), match: name, pinCode: pin });
  }
  buildTiers();
  return LEARNED.length;
}

/** "nehru nagar" -> "Nehru Nagar", so the stored area reads properly. */
function titleCase(s) {
  return s.replace(/(^|\s)([a-z])/g, (_, sp, c) => sp + c.toUpperCase());
}

let CANDIDATES = [];
let FALLBACK = [];

function buildTiers() {
  const curated = ALL.filter((c) => !GENERIC.has(c.match));
  // Curated entries win ties: they are hand-checked, the learned ones are not.
  const seen = new Set(curated.map((c) => c.match));
  const extra = LEARNED.filter((l) => !seen.has(l.match));
  CANDIDATES = [...curated, ...extra].sort(byLength);
  FALLBACK = ALL.filter((c) => GENERIC.has(c.match)).sort(byLength);
}

buildTiers();

/**
 * Pincode -> the area name we file it under, for the "Pondy-13" shorthand.
 *
 * Several localities share a pincode, so prefer the name the home-feed tickers
 * already use for it (the pincodeToAreaName map in AllProperty.jsx) — that way
 * an imported listing reads "Saram", the name users see on the ticker card,
 * rather than "Iyyanar Koil" which merely happens to sort first.
 */
const TICKER_NAME = {
  '605001': 'White Town',
  '605003': 'Muthialpet',
  '605004': 'Mudaliarpet',
  '605005': 'Nellithope',
  '605007': 'Ariyankuppam',
  '605008': 'Lawspet',
  '605009': 'Kadirkamam',
  '605010': 'Moolakulam',
  '605011': 'Rainbow Nagar',
  '605013': 'Saram',
  '605104': 'Kottakuppam',
  '605110': 'Villianur',
};

const PINCODE_AREA = {};
for (const [pin, name] of Object.entries(TICKER_NAME)) {
  if (name in AREA_PINCODE) PINCODE_AREA[pin] = name;
}
for (const [name, pin] of Object.entries(AREA_PINCODE)) {
  if (!(pin in PINCODE_AREA)) PINCODE_AREA[pin] = name;
}

// These ads habitually end an address with the last two digits of the pincode:
// "Pondy-11", "Puducherry-605 013", "Pondy - 5".
// The city half is written in Tamil as often as in English, so both spellings
// have to be recognised or "பாண்டிச்சேரி-1" is thrown away.
const CITY_WORDS = [
  'pondy',
  'puducherry',
  'pondicherry',
  'pondichery',
  'பாண்டிச்சேரி',
  'புதுச்சேரி',
  'புதுவை',
];
const SUFFIX_RE = new RegExp(
  `(?:${CITY_WORDS.join('|')})\\s*[-–—]?\\s*(?:605\\s*)?(\\d{1,3})\\b`
);

function fromPincodeSuffix(text) {
  const m = SUFFIX_RE.exec(normalise(text));
  if (!m) return null;
  const pin = `605${m[1].padStart(3, '0')}`;
  const area = PINCODE_AREA[pin];
  return area ? { area, pinCode: pin, matched: m[0] } : null;
}

/**
 * Find the area an ad is talking about.
 *
 * Searches the printed locality first, then the fuller address, then the whole
 * ad text — an ad often names its area only in the body ("...Behind ECR Latha
 * steel, Lawspet, Pondy"). The longest matching name wins.
 *
 * @param {...string} texts locality, address, rawText — most specific first
 * @returns {{area: string, pinCode: string, matched: string}|null}
 */
function resolveArea(...texts) {
  const present = texts.filter((t) => normalise(t));

  const scan = (list) => {
    for (const text of present) {
      const hay = normalise(text);
      for (const candidate of list) {
        // Word-boundary-ish check so "saram" does not match inside "kosaram".
        const i = hay.indexOf(candidate.match);
        if (i === -1) continue;
        const before = i === 0 ? ' ' : hay[i - 1];
        const after =
          i + candidate.match.length >= hay.length
            ? ' '
            : hay[i + candidate.match.length];
        if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue;

        return {
          area: candidate.name,
          pinCode: candidate.pinCode || AREA_PINCODE[candidate.name],
          matched: candidate.match,
        };
      }
    }
    return null;
  };

  // A named locality beats everything.
  const specific = scan(CANDIDATES);
  if (specific) return specific;

  // Then the "Pondy-13" shorthand, which is a precise pincode.
  for (const text of present) {
    const bySuffix = fromPincodeSuffix(text);
    if (bySuffix) return bySuffix;
  }

  // Only then the bare city name, which just means "in town".
  return scan(FALLBACK);
}

module.exports = { resolveArea, learn, AREA_PINCODE, ALIASES };
