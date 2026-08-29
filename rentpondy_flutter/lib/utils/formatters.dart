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

  /// True when a money field carries no real figure. Newspaper-imported
  /// listings store 0 for a rent the advertisement never quoted, and the
  /// backend's schema default is 0 too, so both null and 0 mean "not stated".
  static bool noAmount(num? value) => value == null || value <= 0;

  /// Money for display on a listing: the amount when there is one, otherwise
  /// "Call Owner". Showing "₹ 0" reads as a free property, and "N/A" tells a
  /// tenant nothing about what to do next.
  static String amountOrCallOwner(num? value) =>
      noAmount(value) ? 'Call Owner' : _inr.format(value);

  /// "5 Jun 2025" style short date, or "N/A".
  static String shortDate(DateTime? date) {
    if (date == null) return 'N/A';
    return _shortDate.format(date.toLocal());
  }
}
