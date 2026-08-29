/// Area-wise counts behind the two scrolling tickers on the home feed —
/// "Total Rent Property Available" and "Total Tenants Available".
///
/// The grouping is a straight port of `areaPropertySummary` /
/// `tenantAssistanceSummary` in AllProperty.jsx, and has to stay that way: the
/// same pincode→area names the admin's Search Pincode page uses, the same two
/// combined cards, the same "drop empty areas" rule and the same
/// highest-count-first order. If the web changes, this changes with it.
library;

/// One ticker card: an area, how many listings it has, and the pincode(s) that
/// make it up (a combined card such as "White Town & Pondicherry" has two).
class AreaCard {
  const AreaCard({
    required this.area,
    required this.pincode,
    required this.count,
    required this.codes,
  });

  final String area;

  /// Display key — a single pincode, or "605001 & 605002" for a combined card.
  final String pincode;
  final int count;

  /// Every pincode this card counts, used to filter the tap-through list.
  final List<String> codes;
}

class AreaSummary {
  const AreaSummary({required this.cards, required this.total});

  const AreaSummary.empty() : cards = const [], total = 0;

  final List<AreaCard> cards;
  final int total;

  bool get isEmpty => cards.isEmpty;
}

/// Pondicherry pincode → area name. Mirrors AllProperty.jsx exactly.
const Map<String, String> kPincodeToArea = {
  '605001': 'White Town',
  '605002': 'Pondicherry',
  '605003': 'Muthialpet',
  '605004': 'Mudaliarpet',
  '605005': 'Nellithope',
  '605006': 'Gorimedu',
  '605007': 'Ariyankuppam',
  '605008': 'Lawspet',
  '605009': 'Kadirkamam',
  '605010': 'Moolakulam',
  '605011': 'Rainbow Nagar',
  '605013': 'Saram',
  '605104': 'Kottakuppam',
  '605110': 'Villanur',
};

/// The two cards the web shows as a pair rather than separately.
const List<({List<String> codes, String label})> kCombinedAreas = [
  (codes: ['605001', '605002'], label: 'White Town & Pondicherry'),
  (codes: ['605006', '605009'], label: 'Gorimedu & Kadirkamam'),
];

/// Build the ticker cards from raw per-pincode counts.
///
/// Combined pairs first, then every remaining area, skipping any with no
/// listings, sorted by count descending — identical to the web's `useMemo`.
AreaSummary summariseByArea(Map<String, int> counts) {
  final combinedCodes = <String>{
    for (final pair in kCombinedAreas) ...pair.codes,
  };

  final entries = <AreaCard>[];

  for (final pair in kCombinedAreas) {
    final total = pair.codes.fold<int>(0, (sum, c) => sum + (counts[c] ?? 0));
    if (total > 0) {
      entries.add(AreaCard(
        area: pair.label,
        pincode: pair.codes.join(' & '),
        count: total,
        codes: pair.codes,
      ));
    }
  }

  kPincodeToArea.forEach((code, name) {
    if (combinedCodes.contains(code)) return;
    final count = counts[code] ?? 0;
    if (count > 0) {
      entries.add(
          AreaCard(area: name, pincode: code, count: count, codes: [code]));
    }
  });

  entries.sort((a, b) => b.count.compareTo(a.count));
  final total = entries.fold<int>(0, (sum, e) => sum + e.count);
  return AreaSummary(cards: entries, total: total);
}

/// Pull a pincode out of a listing, trying the same key spellings the web does
/// (the backend is inconsistent about which one it fills).
String? pincodeOf(Map<String, dynamic> json) {
  const keys = [
    'pinCode',
    'pincode',
    'postalCode',
    'zipCode',
    'propertyPincode',
  ];
  for (final k in keys) {
    final v = json[k];
    if (v != null && v.toString().trim().isNotEmpty) return v.toString().trim();
  }
  final address = json['address'];
  if (address is Map) {
    for (final k in ['pincode', 'pinCode']) {
      final v = address[k];
      if (v != null && v.toString().trim().isNotEmpty) {
        return v.toString().trim();
      }
    }
  }
  return null;
}

/// Milliseconds since the epoch for a listing, "higher = newer".
///
/// A port of `recordTs` in AllProperty.jsx. The backend is inconsistent about
/// which date field it fills, so several spellings are tried in turn; when none
/// is present the Mongo ObjectId still carries a creation time in its first
/// 8 hex characters, which is what keeps older imported rows in the right order
/// instead of collapsing to 0 and bunching at the end.
int recordTimestamp(Map<String, dynamic> json) {
  const keys = [
    'createdAt',
    'updatedAt',
    'created_at',
    'updated_at',
    'addedDate',
    'postedDate',
    'uploadedDate',
    'date',
  ];
  for (final k in keys) {
    final v = json[k];
    if (v == null) continue;
    final parsed = DateTime.tryParse(v.toString());
    if (parsed != null) return parsed.millisecondsSinceEpoch;
  }

  final id = (json['_id'] ?? '').toString();
  if (RegExp(r'^[a-fA-F0-9]{24}$').hasMatch(id)) {
    final seconds = int.tryParse(id.substring(0, 8), radix: 16);
    if (seconds != null) return seconds * 1000;
  }
  return 0;
}

/// Newest first — the order the web's area popup uses.
List<Map<String, dynamic>> sortNewestFirst(List<Map<String, dynamic>> rows) {
  final out = [...rows];
  out.sort((a, b) => recordTimestamp(b).compareTo(recordTimestamp(a)));
  return out;
}

/// Count listings per pincode, skipping deleted ones — the web's rule.
Map<String, int> countByPincode(List<Map<String, dynamic>> rows) {
  final counts = <String, int>{};
  for (final row in rows) {
    if (row['isDeleted'] == true) continue;
    final pin = pincodeOf(row);
    if (pin == null) continue;
    counts[pin] = (counts[pin] ?? 0) + 1;
  }
  return counts;
}
