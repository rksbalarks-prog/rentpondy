import 'package:flutter/foundation.dart';

/// How far to lift the assistant FAB so it doesn't sit on top of another
/// floating button.
///
/// The assistant is mounted app-wide (MaterialApp.builder), so it can't see
/// which screen is below it. Screens that show their own FAB publish the extra
/// clearance they need here; everything else leaves it at 0 and the assistant
/// keeps its default position.
///
/// Mirrors the web layout, where the assistant is pinned 82px above the
/// floating SEARCH button (`bottom: calc(8% + 82px)` vs `bottom: 8%`).
class AssistantFabSlot {
  const AssistantFabSlot._();

  static final ValueNotifier<double> extraBottom = ValueNotifier<double>(0);

  /// Clearance for the SEARCH button on the All Property feed.
  ///
  /// That button's bottom edge is 80px up (64px bottom nav + its 16px inset),
  /// and the assistant's own default is 92px, so lifting by 70 puts the
  /// assistant at 162px — exactly the web's 82px above the search button.
  static const double searchButton = 70;

  static void set(double value) {
    if (extraBottom.value != value) extraBottom.value = value;
  }
}
