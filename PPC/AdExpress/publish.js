// Publishes staged ads into the live app, and gives each one a picture.
//
// Shared by the Import button on the admin screen and by the nightly cron, so
// both behave identically. Three steps:
//
//   1. shape each ad into a bulk-upload row, filling the handful of fields a
//      newspaper ad never states so the row can land in PreApproved;
//   2. hand the rows to the app's OWN POST /PPC/bulk-upload-properties — same
//      Rent-ID allocation, same completeness gate, same revertable batch;
//   3. draw a details card for each new property and attach it as the photo.
//
// Step 3 writes `photos` directly onto the rows this batch just created, keyed
// by their bulkUploadId. That is the one direct write in the module and it is
// deliberately narrow: the bulk endpoint has no photo field, and putting a
// partial payload through the big edit route risks side effects on fields it
// also owns.
//
// The card is drawn, never the newspaper crop — the crop shows the owner's
// phone number, and the app charges points to reveal a contact.

const fsp = require('fs/promises');
const path = require('path');

const config = require('./config');
const { toBulkUploadRow } = require('./normalize');
const locality = require('./locality');
const geocode = require('./geocode');
const { renderPropertyCard } = require('./cardImage');
const { AdExpressAd } = require('./AdExpressModel');
const AddModel = require('../AddModel');

/**
 * The fields the completeness gate in /bulk-upload-properties insists on, that
 * a classified ad routinely leaves out. Filling them is what puts a row in
 * PreApproved instead of Pending — so they are placeholders, not invention:
 * "Not Specified" and 0 say plainly that the paper did not print the number,
 * and the drawn card shows "Not stated" for the same fields.
 */
function completenessDefaults(ad) {
  const issueDay = ad.issueDate ? new Date(ad.issueDate).toISOString().slice(0, 10) : '';
  return {
    postedBy: config.publishDefaults.postedBy,
    rentType: config.publishDefaults.rentType,
    // When it was advertised is the honest answer to "available from".
    availableDate: issueDay || new Date().toISOString().slice(0, 10),
    floorNo: 'Not Specified',
    bedrooms: 'Not Specified',
    areaUnit: config.publishDefaults.areaUnit,
    totalArea: 0,
  };
}

/**
 * Build the rows to send. `forcePreApproved` fills the gaps; without it a row
 * that the ad left incomplete drops to Pending, which is the safer default for
 * anyone who would rather see the holes.
 */
function buildRows(ads, { defaults = {}, forcePreApproved = true } = {}) {
  return ads.map((ad) => {
    const filled = forcePreApproved ? { ...completenessDefaults(ad), ...defaults } : { ...defaults };
    return toBulkUploadRow(ad, filled);
  });
}

/** Draw one card and write it where the app keeps property photos. */
async function writeCard(ad, rentId) {
  const dir = config.photoDir;
  await fsp.mkdir(dir, { recursive: true });
  const fileName = `adexpress-${rentId}-${Date.now()}.jpg`;
  const filePath = path.join(dir, fileName);
  await fsp.writeFile(filePath, renderPropertyCard(ad, { brand: config.publishDefaults.brand }));
  // Stored the way every other property photo is: a path relative to the
  // backend's working directory.
  return path.join('uploads', fileName);
}

/**
 * Publish a set of staged ads.
 *
 * @param {Array} ads              staged ad documents (already vetted by the caller)
 * @param {object} options         { base, defaults, addedBy, addedByRole, forcePreApproved, trigger }
 * @returns {Promise<object>}      what the bulk endpoint said, plus card counts
 */
/**
 * Teach the locality resolver from the app's own listings.
 *
 * Staff have paired ~350 area names with pincodes over the years — a far wider
 * and more current gazetteer than any list hardcoded here, and in their own
 * vocabulary. Refreshed at most every 10 minutes; a failure is harmless, the
 * curated map still applies.
 */
let learnedAt = 0;
async function primeLocalities() {
  if (Date.now() - learnedAt < 10 * 60 * 1000) return;
  try {
    const pairs = await AddModel.collection
      .find(
        { pinCode: { $nin: [null, ''] }, area: { $nin: [null, '', 'undefined'] } },
        { projection: { area: 1, pinCode: 1 } }
      )
      .toArray();
    locality.learn(pairs);
    learnedAt = Date.now();
  } catch (err) {
    console.error('[AdExpress] could not learn areas from existing listings:', err.message);
  }
}

/**
 * For the handful of ads the gazetteer cannot place, ask public records once
 * and hang the answer on the ad. Rate-limited and cached, so this is a few
 * seconds on a first run and nothing at all thereafter.
 */
async function fillUnknownLocalities(ads) {
  for (const ad of ads) {
    if (locality.resolveArea(ad.locality, ad.address, ad.rawText)) continue;
    const text = ad.locality || ad.address;
    if (!text) continue;
    const found = await geocode.lookup(text);
    if (found) ad.resolvedLocality = { area: found.area, pinCode: found.pinCode };
  }
}

async function publishAds(ads, options = {}) {
  if (!ads.length) return { insertedCount: 0, message: 'Nothing to publish.' };
  await primeLocalities();
  await fillUnknownLocalities(ads);

  const base = String(options.base || config.defaultBase).toUpperCase() === 'CH' ? 'CH' : 'PY';
  const forcePreApproved =
    options.forcePreApproved === undefined ? config.forcePreApproved : !!options.forcePreApproved;
  const rows = buildRows(ads, { defaults: options.defaults || {}, forcePreApproved });

  const response = await fetch(config.importEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rows,
      base,
      addedBy: options.addedBy || 'Adexpress Import',
      addedByRole: options.addedByRole || '',
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || `Bulk upload rejected the rows (HTTP ${response.status}).`);
  }

  // Rows go in ordered, so the Nth ad got the Nth Rent-ID. The phone number is
  // checked against the stored row before anything is attached to it, so a
  // surprise in that ordering can never put a card on the wrong property.
  let cards = 0;
  const created = result.bulkUploadId
    ? await AddModel.collection
        .find({ bulkUploadId: result.bulkUploadId }, { projection: { rentId: 1, phoneNumber: 1 } })
        .sort({ rentId: 1 })
        .toArray()
    : [];

  for (let i = 0; i < created.length && i < ads.length; i++) {
    const row = created[i];
    const ad = ads[i];
    if (!row || !ad || row.phoneNumber !== ad.primaryPhone) continue;
    try {
      const photoPath = await writeCard(ad, row.rentId);
      await AddModel.collection.updateOne(
        { _id: row._id, bulkUploadId: result.bulkUploadId },
        { $set: { photos: [photoPath] } }
      );
      cards += 1;
      ad.importedRentId = row.rentId;
    } catch (err) {
      // A missing picture is not worth losing the lead over.
      console.error('[AdExpress] could not draw a card for rentId', row.rentId, '-', err.message);
    }
  }

  await AdExpressAd.updateMany(
    { _id: { $in: ads.map((a) => a._id) } },
    {
      $set: {
        status: 'imported',
        importedAt: new Date(),
        importedBy: options.addedBy || 'Adexpress Import',
        bulkUploadId: result.bulkUploadId || '',
      },
    }
  );
  // Record which property each ad became, one by one (they differ per ad).
  await Promise.all(
    ads
      .filter((a) => a.importedRentId)
      .map((a) => AdExpressAd.updateOne({ _id: a._id }, { $set: { importedRentId: a.importedRentId } }))
  );

  return { ...result, cards, forcePreApproved, base };
}

module.exports = { publishAds, buildRows, completenessDefaults };
