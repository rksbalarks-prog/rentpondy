/**
 * City-aware helpers for the user-side Add/Edit forms.
 *
 *   getChennaiAreaPincodeMap() - derived from chennaiPincodes.js, memoised.
 *   getDefaultCity()           - pre-fill for the City field based on the
 *                                user's active city scope (CH -> Chennai,
 *                                PY -> Pondicherry).
 *
 * Forms keep their own Pondicherry area->pincode map for PY users, and
 * switch to the Chennai map only when getActiveBase() === 'CH'. That way
 * existing Pondy lists stay byte-identical and we only layer Chennai on top.
 */

import { chennaiPincodeRows } from '../chennaiPincodes';
import { getActiveBase } from './cityBase';

let CHENNAI_MAP_CACHE = null;

/** Area name -> pincode for Chennai. Built once on first use. */
export const getChennaiAreaPincodeMap = () => {
  if (CHENNAI_MAP_CACHE) return CHENNAI_MAP_CACHE;
  const map = {};
  chennaiPincodeRows.forEach((row) => {
    if (!(row.area in map)) map[row.area] = row.pincode;
  });
  CHENNAI_MAP_CACHE = map;
  return map;
};

/** City name to pre-fill on new records, based on the active city scope. */
export const getDefaultCity = (base = getActiveBase()) => {
  if (base === 'CH') return 'Chennai';
  return 'Pondicherry';
};
