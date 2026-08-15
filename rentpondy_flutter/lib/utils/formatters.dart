import 'package:intl/intl.dart';

/// Formatting helpers mirroring the web app's `toLocaleString('en-IN')` and
/// `toLocaleDateString('en-IN', {year, month:'short', day})` usage.
class Formatters {
  Formatters._();

  static final NumberFormat _inr = NumberFormat.decimalPattern('en_IN');
  static final DateFormat _shortDate = DateFormat('d MMM yyyy');

  /// Indian-grouped price string, or "N/A" when null (matches the card).
  static String inr(num? value) {
    if (value == null) return 'N/A';
    return _inr.format(value);
  }

  /// "5 Jun 2025" style short date, or "N/A".
  static String shortDate(DateTime? date) {
    if (date == null) return 'N/A';
    return _shortDate.format(date.toLocal());
  }
}
