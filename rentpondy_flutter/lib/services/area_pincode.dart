import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;

/// Area → pincode lookup, ported from the web app's `chennaiPincodes.js` +
/// `PONDY_AREA_PINCODE_MAP` into `assets/data/area_pincode.json`. Used to
/// auto-fill Pin Code when a tenant/owner picks an Area, exactly like the web.
class AreaPincode {
  AreaPincode._();

  static Map<String, String> _ch = const {};
  static Map<String, String> _py = const {};
  static bool _loaded = false;

  static Future<void> ensureLoaded() async {
    if (_loaded) return;
    try {
      final raw = await rootBundle.loadString('assets/data/area_pincode.json');
      final j = jsonDecode(raw) as Map<String, dynamic>;
      _ch = (j['CH'] as Map)
          .map((k, v) => MapEntry(k.toString(), v.toString()));
      _py = (j['PY'] as Map)
          .map((k, v) => MapEntry(k.toString(), v.toString()));
    } catch (_) {
      // Missing/corrupt asset — pincode auto-fill just stays inert.
    }
    _loaded = true;
  }

  /// The whole area → pincode table for [base] ('CH' → Chennai, else
  /// Pondicherry). Backs the home-feed area search box, which needs to list
  /// and filter every known area, not just resolve one.
  static Map<String, String> mapFor(String base) =>
      base == 'CH' ? _ch : _py;

  /// Pincode for [area] in the active base ('CH' → Chennai, else Pondicherry),
  /// case-insensitive, or null when unknown.
  static String? lookup(String base, String area) {
    final map = base == 'CH' ? _ch : _py;
    final a = area.trim();
    final direct = map[a];
    if (direct != null) return direct;
    for (final e in map.entries) {
      if (e.key.toLowerCase() == a.toLowerCase()) return e.value;
    }
    return null;
  }
}
