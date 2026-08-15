import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import 'strings.dart';

/// Ergonomic localization access from any build method:
///
///   Text(context.tr('nav.home'))
///
/// Reading `AppState` with `listen: true` subscribes the calling widget to the
/// language toggle, so flipping EN⇄TA rebuilds it instantly.
extension L10nContext on BuildContext {
  /// Current language code ('en' | 'ta'). Subscribes the caller (listen: true),
  /// so it must be used inside a build method.
  String get lang => Provider.of<AppState>(this).lang;

  /// Translate a key using the current language. Use inside `build` — it
  /// subscribes to the language toggle so the widget rebuilds on switch.
  String tr(String key) => AppStrings.tr(key, lang);

  /// Same as [tr] but WITHOUT subscribing — safe to call from event handlers,
  /// async methods and dialog builders where `listen: true` would throw.
  String trRead(String key) =>
      AppStrings.tr(key, Provider.of<AppState>(this, listen: false).lang);

  /// True when the app is currently showing Tamil (subscribes; build-only).
  bool get isTamil => AppStrings.isTamil(lang);
}
