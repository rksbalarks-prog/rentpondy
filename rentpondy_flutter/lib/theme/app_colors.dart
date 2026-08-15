import 'package:flutter/material.dart';

/// Central colour tokens extracted 1:1 from the React "Rent Pondy User" web app.
/// Keeping them in one place mirrors the inline hex values scattered across the
/// JSX so the Flutter UI stays pixel-faithful.
class AppColors {
  AppColors._();

  /// Brand purple/indigo — the dominant accent (#4F4B7E) used for the navbar
  /// title, active bottom-nav item, buttons, prices, city switcher bar, etc.
  static const Color primary = Color(0xFF4F4B7E);
  static const Color primaryDeep = Color(0xFF383838); // active top-bar underline

  /// Sidebar header teal-green + dropdown accents.
  static const Color teal = Color(0xFF24AD92);
  static const Color tealButton = Color(0xFF6EB7B2);
  static const Color tealButtonHover = Color(0xFF58A09B);
  static const Color dropdownTitle = Color(0xFF019988);
  static const Color green = Color(0xFF28A745);

  /// Page + surface backgrounds.
  static const Color scaffoldGrey = Color(0xFFE5E5E5); // outer app frame
  static const Color white = Color(0xFFFFFFFF);
  static const Color cardBg = Color(0xFFF9F9F9);
  static const Color cardBodyBg = Color(0xFFFAFAFA);

  /// Text tones.
  static const Color textBlack = Color(0xFF000000);
  static const Color textDark = Color(0xFF2F4F4F); // active top-bar label
  static const Color textGrey = Color(0xFF5E5E5E);
  static const Color textMuted = Color(0xFF888888);
  static const Color inactiveGrey = Color(0xFF9E9E9E);

  /// Points / gold accents (navbar points chip).
  static const Color gold = Color(0xFFFFD700);
  static const Color goldDeep = Color(0xFFB5791A);

  /// Misc.
  static const Color orangeRed = Color(0xFFFF4500);
  static const Color danger = Color(0xFFE04A3A);
  static const Color touristOrange = Color(0xFFFF7043);
}
