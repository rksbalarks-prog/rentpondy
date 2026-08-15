import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n/strings.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// Compact EN ⇄ த segmented toggle. Highlights the active language; tapping
/// flips the app language instantly (persisted in AppState). Used in the
/// navbar and on the login screen.
class LanguageToggle extends StatelessWidget {
  const LanguageToggle({super.key, this.height = 30, this.onSurface = false});

  /// Pill height.
  final double height;

  /// When true, uses white borders/text for placing over a coloured/photo
  /// background (e.g. the login hero); otherwise the primary purple scheme.
  final bool onSurface;

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final base = onSurface ? Colors.white : AppColors.primary;
    return GestureDetector(
      onTap: app.toggleLanguage,
      child: Container(
        height: height,
        padding: const EdgeInsets.all(2),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: base.withValues(alpha: 0.6)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _seg(kLangShort[kLangEn]!, app.lang == kLangEn, base),
            _seg(kLangShort[kLangTa]!, app.lang == kLangTa, base),
          ],
        ),
      ),
    );
  }

  Widget _seg(String text, bool active, Color base) {
    final activeText = onSurface ? AppColors.primary : Colors.white;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      padding: const EdgeInsets.symmetric(horizontal: 8),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: active ? base : Colors.transparent,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: active ? activeText : base,
        ),
      ),
    );
  }
}
