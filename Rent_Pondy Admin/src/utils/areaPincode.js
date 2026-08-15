/**
 * City-aware helpers for the admin Add/Edit forms.
 *
 *   getChennaiAreaPincodeMap() - derived from chennaiPincodes.js, memoised.
 *   getDefaultCity()           - pre-fill for the City field based on the
 *                                admin's base (CH -> Chennai, PY -> Pondicherry,
 *                                ALL -> empty so existing behaviour is kept).
 *
 * Forms keep their own Pondicherry area->pincode map for PY/ALL admins, and
 * switch to the Chennai map only when getAdminBase() === 'CH'. That way
 * existing Pondy lists stay byte-identical and we only layer Chennai on top.
 */

import { chennaiPincodeRows } from '../chennaiPincodes';
import { getAdminBase } from './adminBase';

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

/** City name to pre-fill on new records, based on the admin's scope. */
export const getDefaultCity = (base = getAdminBase()) => {
  if (base === 'CH') return 'Chennai';
  if (base === 'PY') return 'Pondicherry';
  return '';
};
