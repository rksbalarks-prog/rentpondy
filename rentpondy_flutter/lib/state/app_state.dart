import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../l10n/strings.dart';
import '../services/api_service.dart';

/// Global app state — the Flutter equivalent of the web app's Redux
/// `userSlice` + localStorage (`phoneNumber`, `activeBase`).
class AppState extends ChangeNotifier {
  AppState({ApiService? api}) : api = api ?? ApiService();

  final ApiService api;

  static const _kPhone = 'phoneNumber';
  static const _kBase = 'activeBase';
  static const _kLang = 'appLang';

  String? _phoneNumber;
  String _activeBase = 'PY';
  String _lang = kLangEn;
  int? _pointsBalance;
  int _unreadCount = 0;
  bool _initialised = false;

  String? get phoneNumber => _phoneNumber;
  String get activeBase => _activeBase;
  int? get pointsBalance => _pointsBalance;

  /// Current UI language ('en' | 'ta'). Drives the EN/Tamil toggle.
  String get lang => _lang;
  bool get isTamil => _lang == kLangTa;

  /// Drives the red dot on the navbar bell.
  bool get hasUnreadNotifications => _unreadCount > 0;
  bool get isLoggedIn => (_phoneNumber ?? '').isNotEmpty;
  bool get initialised => _initialised;

  /// 10-digit local number (last 10 digits) — used for API params.
  String get phoneDigits {
    final digits = (_phoneNumber ?? '').replaceAll(RegExp(r'\D'), '');
    return digits.length > 10 ? digits.substring(digits.length - 10) : digits;
  }

  String get cityName => _activeBase == 'CH' ? 'Chennai' : 'Pondicherry';

  /// Rehydrate persisted auth + base on startup.
  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _phoneNumber = prefs.getString(_kPhone);
    _activeBase = prefs.getString(_kBase) == 'CH' ? 'CH' : 'PY';
    _lang = prefs.getString(_kLang) == kLangTa ? kLangTa : kLangEn;
    api.activeBase = _activeBase;
    _initialised = true;
    notifyListeners();
    if (isLoggedIn) {
      // ignore: unawaited_futures
      refreshPointsBalance();
      // ignore: unawaited_futures
      refreshUnreadNotifications();
    }
  }

  Future<void> login(String phoneNumber) async {
    _phoneNumber = phoneNumber;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kPhone, phoneNumber);
    notifyListeners();
    // ignore: unawaited_futures
    api.logAppOpen(phoneNumber);
    // ignore: unawaited_futures
    refreshPointsBalance();
    // ignore: unawaited_futures
    refreshUnreadNotifications();
  }

  Future<void> logout() async {
    _phoneNumber = null;
    _pointsBalance = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kPhone);
    notifyListeners();
  }

  Future<void> setActiveBase(String base) async {
    final normalised = base == 'CH' ? 'CH' : 'PY';
    if (normalised == _activeBase) return;
    _activeBase = normalised;
    api.activeBase = normalised;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kBase, normalised);
    notifyListeners();
  }

  /// Switch UI language and persist it. Instant — swaps the static string map.
  Future<void> setLanguage(String lang) async {
    final normalised = lang == kLangTa ? kLangTa : kLangEn;
    if (normalised == _lang) return;
    _lang = normalised;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kLang, normalised);
  }

  /// One-button EN⇄TA flip.
  Future<void> toggleLanguage() =>
      setLanguage(_lang == kLangTa ? kLangEn : kLangTa);

  Future<void> refreshPointsBalance() async {
    if (!isLoggedIn) return;
    final bal = await api.fetchPointsBalance(phoneDigits);
    _pointsBalance = bal;
    notifyListeners();
  }

  Future<void> refreshUnreadNotifications() async {
    if (!isLoggedIn) {
      _unreadCount = 0;
      return;
    }
    _unreadCount = await api.fetchUnreadCount(phoneDigits);
    notifyListeners();
  }

  /// Called after the user opens the notifications list.
  void clearUnreadBadge() {
    if (_unreadCount == 0) return;
    _unreadCount = 0;
    notifyListeners();
  }
}
