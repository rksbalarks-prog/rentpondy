import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// App-wide theme. The web app uses `Inter, sans-serif` everywhere, so we base
/// the whole text theme on Google Fonts' Inter to match weights and metrics.
class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final base = ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.white,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
      ),
    );

    return base.copyWith(
      textTheme: GoogleFonts.interTextTheme(base.textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.white,
        foregroundColor: AppColors.textBlack,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      splashFactory: InkRipple.splashFactory,
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.inter(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }

  /// Convenience helper so screens can pull an Inter TextStyle inline
  /// (mirrors the many `fontFamily: "Inter, sans-serif"` uses in the JSX).
  static TextStyle inter({
    double? size,
    FontWeight? weight,
    Color? color,
    double? letterSpacing,
    double? height,
  }) {
    return GoogleFonts.inter(
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: letterSpacing,
      height: height,
    );
  }
}
