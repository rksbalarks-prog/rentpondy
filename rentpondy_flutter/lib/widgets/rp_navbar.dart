import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../l10n/l10n_ext.dart';
import '../routes.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import 'language_toggle.dart';

/// Top navigation bar (60px, white) — hamburger + animated "RENT PONDY"
/// house title on the left, points chip + notification bell on the right.
/// Ports Navbar.jsx.
class RpNavbar extends StatelessWidget implements PreferredSizeWidget {
  const RpNavbar({
    super.key,
    required this.onMenuTap,
    required this.onBellTap,
  });

  final VoidCallback onMenuTap;
  final VoidCallback onBellTap;

  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Material(
      color: const Color(0xFFF8F9FA), // bootstrap bg-light
      child: SizedBox(
        height: 60,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              // Hamburger
              InkResponse(
                onTap: onMenuTap,
                radius: 24,
                child: const Icon(Icons.menu, color: Colors.black, size: 26),
              ),
              const SizedBox(width: 10),
              // Animated house title. `Expanded` (not Flexible + Spacer) so the
              // title owns all the leftover width — sharing it with a Spacer
              // squeezed the text until "PONDY" wrapped onto a second line and
              // burst the 60px bar.
              Expanded(child: AnimatedHouseTitle(city: app.cityName)),
              const SizedBox(width: 6),
              // EN ⇄ Tamil one-button toggle.
              const LanguageToggle(),
              const SizedBox(width: 8),
              if (app.isLoggedIn && app.pointsBalance != null) ...[
                _PointsChip(balance: app.pointsBalance!),
                const SizedBox(width: 10),
              ],
              // Bell (red dot while unread notifications exist)
              InkResponse(
                onTap: onBellTap,
                radius: 22,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    const Icon(Icons.notifications_none,
                        color: AppColors.primary, size: 24),
                    if (app.hasUnreadNotifications)
                      Positioned(
                        top: 0,
                        right: 0,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The looping "RENT PONDY / RENT CHENNAI" title with a self-drawing roof line
/// and a gentle scale-glow — a Flutter rendition of NavbarAnimation.css.
class AnimatedHouseTitle extends StatefulWidget {
  const AnimatedHouseTitle({super.key, required this.city});

  /// "Pondicherry" -> shows "PONDY"; "Chennai" -> "CHENNAI".
  final String city;

  @override
  State<AnimatedHouseTitle> createState() => _AnimatedHouseTitleState();
}

class _AnimatedHouseTitleState extends State<AnimatedHouseTitle>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(seconds: 5))
      ..repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  double _roofFactor(double t) {
    // grow 0→1 over first 18%, hold, shrink back over last 8%
    if (t < 0.18) return Curves.easeOutCubic.transform(t / 0.18);
    if (t > 0.92) return 1 - Curves.easeIn.transform((t - 0.92) / 0.08);
    return 1;
  }

  double _scale(double t) {
    // finalGlow: 0.85 → 1.02 → back to 0.85
    if (t < 0.28) return 0.9;
    if (t < 0.38) return 0.9 + 0.12 * ((t - 0.28) / 0.10);
    if (t < 0.92) return 1.0;
    return 1.0 - 0.1 * ((t - 0.92) / 0.08);
  }

  @override
  Widget build(BuildContext context) {
    final second =
        widget.city.toUpperCase() == 'CHENNAI' ? 'CHENNAI' : 'PONDY';
    final titleStyle = GoogleFonts.poppins(
      fontSize: 22,
      fontWeight: FontWeight.w800,
      letterSpacing: 0.4,
      // Pin the line box: Poppins' default leading varies and pushed the
      // two-line column past the 60px bar.
      height: 1.15,
    );
    // Measure the one-line title width so the roof line can match it WITHOUT
    // IntrinsicWidth — IntrinsicWidth over a FractionallySizedBox (the old roof
    // line) throws `input.isFinite` under the FittedBox's unbounded layout,
    // which crashed the whole navbar (and the home column with it).
    final painter = TextPainter(
      text: TextSpan(text: 'RENT $second', style: titleStyle),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    final titleWidth = painter.width;
    // The title repaints every frame; isolate it so it doesn't dirty the rest
    // of the navbar (points chip, bell) on each tick.
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          final t = _c.value;
          // Laid out at its natural one-line size (fixed to the measured text
          // width), then scaled down as a whole if the bar is too narrow.
          return FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: SizedBox(
              width: titleWidth,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Roof line — a fraction of the text width (self-draws in).
                  Container(
                    width: titleWidth * _roofFactor(t).clamp(0.0, 1.0),
                    height: 2,
                    margin: const EdgeInsets.only(bottom: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                  Transform.scale(
                    scale: _scale(t),
                    alignment: Alignment.centerLeft,
                    child: Text.rich(
                      TextSpan(
                        style: titleStyle,
                        children: [
                          const TextSpan(
                            text: 'RENT',
                            style: TextStyle(color: Color(0xFF16A34A)),
                          ),
                          const TextSpan(text: ' '),
                          TextSpan(
                            text: second,
                            style: const TextStyle(color: Color(0xFF0F172A)),
                          ),
                        ],
                      ),
                      maxLines: 1,
                      softWrap: false,
                      overflow: TextOverflow.visible,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

/// Glassy gold "N pts" pill from the header. Simplified from the elaborate
/// CSS chip but keeps the coin + shimmering-gold number + alert dot.
///
/// Tapping it opens Points History, same as the web chip's `onClick`.
class _PointsChip extends StatelessWidget {
  const _PointsChip({required this.balance});

  final int balance;

  String _compact(int n) {
    final abs = n.abs();
    String trim(double v) => v.toStringAsFixed(1).replaceAll(RegExp(r'\.0$'), '');
    if (abs >= 1e9) return '${trim(n / 1e9)}B';
    if (abs >= 1e6) return '${trim(n / 1e6)}M';
    if (abs >= 1e3) return '${trim(n / 1e3)}K';
    return '$n';
  }

  @override
  Widget build(BuildContext context) {
    final historyTitle = context.tr('drawer.pointsHistory');
    return Semantics(
      button: true,
      label: '$balance ${context.tr('points.unit')}. $historyTitle.',
      child: Tooltip(
        message: historyTitle,
        // Opaque so the whole pill is tappable, including the gaps between the
        // coin and the text. An InkWell would splash onto the navbar's Material
        // *behind* this opaque chip, so it would never be seen.
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () => pushRoute(context, '/points-history', historyTitle),
          child: _pill(context),
        ),
      ),
    );
  }

  Widget _pill(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          height: 34,
          padding: const EdgeInsets.only(left: 6, right: 13),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.85)),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFFFFFFFF), Color(0xFFFFF7DC), Color(0xFFEEE8FF)],
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.15),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    center: Alignment(-0.3, -0.4),
                    colors: [
                      Color(0xFFFFF8CC),
                      Color(0xFFFFE680),
                      Color(0xFFFFC43F),
                      Color(0xFFC88F1F),
                    ],
                  ),
                ),
                child: const Center(
                  child: Icon(Icons.paid, size: 14, color: AppColors.goldDeep),
                ),
              ),
              const SizedBox(width: 5),
              Text(
                _compact(balance),
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: AppColors.goldDeep,
                ),
              ),
              const SizedBox(width: 3),
              Text(
                context.tr('points.unit'),
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: AppColors.primary.withValues(alpha: 0.75),
                ),
              ),
            ],
          ),
        ),
        if (balance < 10)
          Positioned(
            top: -5,
            right: -5,
            child: Container(
              width: 17,
              height: 17,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [Color(0xFFFF3B4A), Color(0xFFFF6A83)],
                ),
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: const Center(
                child: Text('!',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w900)),
              ),
            ),
          ),
      ],
    );
  }
}
