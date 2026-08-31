import '../models/property.dart';
import 'area_pincode.dart';

/// The area → pincode list every search box suggests from.
///
/// Two sources, merged:
///  * the bundled table in `assets/data/area_pincode.json` (what the web's
///    hard-coded `areaPincodeMap` holds), and
///  * the areas the live feed actually uses.
///
/// The second source matters: the bundled table reaches roughly a fifth of the
/// active listings, because plenty of them sit in areas it never had ("White
/// Town", "Heritage Town", "IG Square", and spellings like "Reddiarpalayam"
/// against the table's "Reddiyarpalayam"). Suggesting only from the table
/// hands the user names that match nothing.
class AreaIndex {
  AreaIndex._();

  static final Map<String, Map<String, String>> _learned = {};

  static Future<void> ensureLoaded() => AreaPincode.ensureLoaded();

  /// Fold the areas of a freshly loaded feed into the index for [base].
  /// Rows with a blank/placeholder area or a non-6-digit pincode are skipped —
  /// they would only produce suggestions that lead nowhere.
  static void learnFrom(String base, Iterable<Property> properties) {
    final into = _learned.putIfAbsent(base, () => {});
    for (final p in properties) {
      final area = (p.area ?? '').trim();
      final pin = (p.rawStr('pinCode') ?? '').trim();
      if (area.isEmpty || area == '-' || area.toLowerCase() == 'null') continue;
      if (!RegExp(r'^\d{6}$').hasMatch(pin)) continue;
      into.putIfAbsent(area, () => pin);
    }
  }

  /// Everything known for [base], bundled table first.
  static Map<String, String> entries(String base) =>
      {...AreaPincode.mapFor(base), ...?_learned[base]};

  /// Area names matching [query] (substring, case-insensitive), names that
  /// start with the query first. Ports `handleAreaInputChange`.
  static List<String> areasMatching(String base, String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return const [];
    final hits = entries(base).keys
        .where((a) => a.toLowerCase().contains(q))
        .toList()
      ..sort((a, b) {
        final ap = a.toLowerCase().startsWith(q) ? 0 : 1;
        final bp = b.toLowerCase().startsWith(q) ? 0 : 1;
        return ap != bp ? ap - bp : a.toLowerCase().compareTo(b.toLowerCase());
      });
    return hits;
  }

  /// Distinct pincodes matching [query] (partial). Ports
  /// `handlePincodeInputChange`.
  static List<String> pincodesMatching(String base, String query) {
    final q = query.trim();
    if (q.isEmpty) return const [];
    final hits = entries(base).values.where((p) => p.contains(q)).toSet().toList()
      ..sort();
    return hits;
  }

  /// Pincode for an area name, case-insensitive.
  static String? pincodeOfArea(String base, String area) {
    final map = entries(base);
    final direct = map[area];
    if (direct != null) return direct;
    final a = area.trim().toLowerCase();
    for (final e in map.entries) {
      if (e.key.toLowerCase() == a) return e.value;
    }
    return null;
  }
}
