import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n/strings.dart';
import '../models/points_plan.dart';
import '../screens/payu_checkout_screen.dart';
import '../screens/points_plans_screen.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// The "Unlock Owner Contact" paywall — a port of the web app's
/// `InsufficientPointsModal.jsx`, animations included:
///
///  * `ip-border-glow`      — drifting rainbow glow around the card
///  * `ip-header-shift`     — the purple→pink header gradient sliding
///  * `ip-title-shimmer`    — gold shimmer sweeping through the title
///  * `ip-sparkle-twinkle`  — six stars twinkling on their own delays
///  * `ip-float` / `ip-coin-halo` / `ip-coin-ring` — the coin badge
///  * `ip-stats-border` / `ip-stats-sweep` / `ip-required-pulse`
///  * `ip-cta-pulse` / `ip-cta-shine`
///
/// Like the web version, "Buy Points Plan" skips the plans page and goes
/// straight to PayU with the ₹100 Starter pack.
///
/// Returns `true` when the user actually bought points, so the caller can
/// retry whatever the paywall interrupted.
Future<bool> showInsufficientPointsModal(
  BuildContext context, {
  required int balance,
  required int cost,
}) async {
  final bought = await showGeneralDialog<bool>(
    context: context,
    barrierDismissible: true,
    barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    barrierColor: Colors.black.withValues(alpha: 0.55),
    transitionDuration: const Duration(milliseconds: 280),
    pageBuilder: (_, _, _) =>
        _InsufficientPointsModal(balance: balance, cost: cost),
    transitionBuilder: (_, anim, _, child) => FadeTransition(
      opacity: anim,
      child: ScaleTransition(
        scale: Tween(begin: 0.88, end: 1.0).animate(
          CurvedAnimation(
            parent: anim,
            curve: Curves.easeOutBack,
            reverseCurve: Curves.easeIn,
          ),
        ),
        child: child,
      ),
    ),
  );
  return bought ?? false;
}

// Web palette (InsufficientPointsModal.jsx).
const _deep = AppColors.primary; // #4F4B7E
const _violet = Color(0xFF764BA2);
const _pink = Color(0xFFF5576C);
const _goldLight = Color(0xFFFFE680);
const _gold = Color(0xFFFFD700);
const _orange = Color(0xFFFFA500);

/// Where each header star sits, how big it is, and its own twinkle timing —
/// the SPARKLES array from the web component, translated to alignments.
const _sparkles = <_SparkleSpec>[
  _SparkleSpec(Alignment(-0.64, -0.84), 10, 0, 2400),
  _SparkleSpec(Alignment(0.56, -0.72), 12, 600, 2800),
  _SparkleSpec(Alignment(-0.80, -0.04), 8, 1100, 2200),
  _SparkleSpec(Alignment(0.72, 0.12), 9, 300, 2600),
  _SparkleSpec(Alignment(-0.56, 0.44), 7, 1400, 2000),
  _SparkleSpec(Alignment(0.00, -0.48), 6, 900, 2300),
];

class _InsufficientPointsModal extends StatefulWidget {
  const _InsufficientPointsModal({required this.balance, required this.cost});

  final int balance;
  final int cost;

  @override
  State<_InsufficientPointsModal> createState() =>
      _InsufficientPointsModalState();
}

class _InsufficientPointsModalState extends State<_InsufficientPointsModal>
    with TickerProviderStateMixin {
  /// The pack "Buy Points Plan" buys outright — DEFAULT_STARTER_PLAN on the web
  /// (points-100 / Starter / ₹100 / 100 pts), which is our first fallback plan.
  static final PointsPlan _starter = PointsPlan.fallback.first;

  late final AppState _app = context.read<AppState>();

  final List<AnimationController> _all = [];
  late final AnimationController _borderGlow = _loop(6000);
  late final AnimationController _headerShift = _loop(7000);
  late final AnimationController _titleShimmer = _loop(3500);
  late final AnimationController _coinFloat = _loop(1400, pingPong: true);
  late final AnimationController _coinHalo = _loop(1200, pingPong: true);
  late final AnimationController _coinRing = _loop(2200);
  late final AnimationController _statsBorder = _loop(5000);
  late final AnimationController _statsSweep = _loop(3200);
  late final AnimationController _requiredPulse = _loop(800, pingPong: true);
  late final AnimationController _ctaPulse = _loop(1100, pingPong: true);
  late final AnimationController _ctaShine = _loop(2400);

  bool _paying = false;
  String _error = '';

  /// A controller that runs forever. [pingPong] halves nothing — pass the
  /// half-period, since one there-and-back counts as a full CSS cycle.
  AnimationController _loop(int ms, {bool pingPong = false}) {
    final c = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: ms),
    )..repeat(reverse: pingPong);
    _all.add(c);
    return c;
  }

  @override
  void dispose() {
    for (final c in _all) {
      c.dispose();
    }
    super.dispose();
  }

  String _t(String key) => AppStrings.tr(key, _app.lang);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  /// Straight to PayU's hosted page with the Starter pack — no plans screen in
  /// between, exactly like `goToPayU` on the web.
  Future<void> _buyStarter() async {
    if (_paying) return;
    final phone = _app.phoneNumber;
    if (phone == null || phone.isEmpty) {
      setState(() => _error = _t('ip.loginFirst'));
      return;
    }

    setState(() {
      _paying = true;
      _error = '';
    });
    try {
      final fields = await _app.api.initiatePointsPayment(
        phoneNumber: phone,
        plan: _starter,
        nowMillis: DateTime.now().millisecondsSinceEpoch,
      );
      if (!mounted) return;

      final navigator = Navigator.of(context);
      final outcome = await navigator.push<PayUOutcome>(
        MaterialPageRoute(
          builder: (_) =>
              PayUCheckoutScreen(payuFields: fields, title: 'Buy Points'),
        ),
      );
      if (!mounted) return;

      switch (outcome) {
        case PayUOutcome.success:
          await _app.refreshPointsBalance();
          if (mounted) navigator.pop(true);
        case PayUOutcome.failure:
          setState(() {
            _paying = false;
            _error = _t('ip.paymentFailed');
          });
        case PayUOutcome.cancelled:
        case null:
          setState(() => _paying = false);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _paying = false;
          _error = '$e';
        });
      }
    }
  }

  void _morePlans() {
    final navigator = Navigator.of(context);
    navigator.pop(false);
    navigator.push(
      MaterialPageRoute(builder: (_) => const PointsPlansScreen()),
    );
  }

  // ------------------------------------------------------------------
  // Build
  // ------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 380),
            child: Material(
              color: Colors.transparent,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // .ip-border-glow — inset -2px, blurred, drifting.
                  Positioned(
                    left: -3,
                    right: -3,
                    top: -3,
                    bottom: -3,
                    child: IgnorePointer(child: _glow()),
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: _deep.withValues(alpha: 0.45),
                          blurRadius: 70,
                          offset: const Offset(0, 28),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(22),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [_header(), _body()],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _glow() {
    return AnimatedBuilder(
      animation: _borderGlow,
      builder: (_, _) => ImageFiltered(
        imageFilter: ui.ImageFilter.blur(sigmaX: 6, sigmaY: 6),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: const [_gold, _pink, _violet, _deep, _pink, _gold],
              tileMode: TileMode.mirror,
              transform: _SlideGradient(_borderGlow.value),
            ),
          ),
        ),
      ),
    );
  }

  // ── Header ────────────────────────────────────────────────────────────

  Widget _header() {
    return AnimatedBuilder(
      animation: _headerShift,
      builder: (_, child) => Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(20, 26, 20, 22),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: const [_deep, _violet, _pink, _violet, _deep],
            tileMode: TileMode.mirror,
            transform: _SlideGradient(_headerShift.value),
          ),
        ),
        child: child,
      ),
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          // The two soft blobs bleeding off the header corners.
          Positioned(top: -76, right: -76, child: _blob(140, 0.10)),
          Positioned(bottom: -92, left: -50, child: _blob(130, 0.07)),
          for (final s in _sparkles)
            Positioned.fill(
              child: Align(alignment: s.at, child: _Sparkle(spec: s)),
            ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _coin(),
              const SizedBox(height: 14),
              _shimmerTitle(),
              const SizedBox(height: 4),
              Text(
                _t('ip.subtitle'),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.95),
                  fontSize: 12.5,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _blob(double size, double alpha) => ImageFiltered(
        imageFilter: ui.ImageFilter.blur(sigmaX: 2, sigmaY: 2),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withValues(alpha: alpha),
          ),
        ),
      );

  /// The floating gold coin: pulsing halo, expanding ring, lock badge.
  Widget _coin() {
    return SizedBox(
      height: 84,
      width: 84,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          // .ip-coin-halo — 140px, so it has to be positioned: a non-positioned
          // Stack child is capped at the Stack's own 84px.
          Positioned(
            left: -28,
            right: -28,
            top: -28,
            bottom: -28,
            child: AnimatedBuilder(
              animation: _coinHalo,
              builder: (_, _) {
                final t = _coinHalo.value;
                return Transform.scale(
                  scale: 1 + 0.12 * t,
                  child: Opacity(
                    opacity: 0.55 + 0.40 * t,
                    child: const DecoratedBox(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            Color(0x8CFFD700),
                            Color(0x4DFFA500),
                            Color(0x00FFA500),
                          ],
                          stops: [0.0, 0.4, 0.7],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // .ip-coin-ring — scales out and fades, forever.
          Positioned(
            left: -1,
            right: -1,
            top: -1,
            bottom: -1,
            child: AnimatedBuilder(
              animation: _coinRing,
              builder: (_, _) {
                final t = _coinRing.value;
                return Transform.scale(
                  scale: 1 + 0.9 * t,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: _gold.withValues(alpha: 0.64 * (1 - t)),
                        width: 2,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // .ip-coin-wrap — bobs up and down.
          AnimatedBuilder(
            animation: _coinFloat,
            builder: (_, child) => Transform.translate(
              offset: Offset(0, -6 * _coinFloat.value),
              child: child,
            ),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 78,
                  height: 78,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [_goldLight, _gold, _orange],
                      stops: [0.0, 0.45, 1.0],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _orange.withValues(alpha: 0.55),
                        blurRadius: 30,
                        offset: const Offset(0, 12),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: SizedBox(
                      width: 34,
                      height: 30,
                      child: CustomPaint(painter: _CoinStackPainter()),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -4,
                  right: -4,
                  child: Container(
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.lock, size: 12, color: _pink),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// .ip-title — white text with a gold highlight sweeping left to right.
  Widget _shimmerTitle() {
    final title = _t('ip.title');
    return AnimatedBuilder(
      animation: _titleShimmer,
      builder: (_, child) => ShaderMask(
        blendMode: BlendMode.srcIn,
        shaderCallback: (bounds) => LinearGradient(
          colors: const [
            Colors.white,
            _goldLight,
            Colors.white,
            _goldLight,
            Colors.white,
          ],
          transform: _SlideGradient(-1.5 + 4.0 * _titleShimmer.value),
        ).createShader(bounds),
        child: child,
      ),
      child: Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 19,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.3,
        ),
      ),
    );
  }

  // ── Body ──────────────────────────────────────────────────────────────

  Widget _body() {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _stats(),
          const SizedBox(height: 14),
          _pitch(),
          const SizedBox(height: 14),
          _cta(),
          if (_error.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                _error,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFFDC2626), fontSize: 12),
              ),
            ),
          const SizedBox(height: 10),
          _morePlansButton(),
          const SizedBox(height: 4),
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            style: TextButton.styleFrom(
              minimumSize: const Size(double.infinity, 34),
              foregroundColor: AppColors.textMuted,
            ),
            child: Text(
              _t('detail.maybeLater'),
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// The balance | required panel: gradient-animated border, a light sweep
  /// crossing it, and the required figure pulsing red.
  Widget _stats() {
    return AnimatedBuilder(
      animation: _statsBorder,
      builder: (_, child) => Container(
        padding: const EdgeInsets.all(1.5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: const [
              Color(0xFFE9E4FB),
              Color(0xFFFDE1E8),
              Color(0xFFFFF4CC),
              Color(0xFFE9E4FB),
            ],
            tileMode: TileMode.mirror,
            transform: _SlideGradient(_statsBorder.value),
          ),
        ),
        child: child,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12.5),
        child: Stack(
          children: [
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFFBF9FF), Color(0xFFFFF6F8)],
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _statCell(
                    _t('ip.yourBalance'),
                    '${widget.balance} ${_t('ip.pts')}',
                    _deep,
                  ),
                  Container(
                    width: 1,
                    height: 30,
                    margin: const EdgeInsets.symmetric(horizontal: 14),
                    color: _deep.withValues(alpha: 0.2),
                  ),
                  _statCell(
                    _t('ip.requiredLabel'),
                    '${widget.cost} ${_t('ip.pts')}',
                    _pink,
                    pulse: true,
                  ),
                ],
              ),
            ),
            // .ip-stats::before — the white sweep.
            Positioned.fill(
              child: IgnorePointer(
                child: _Sweep(
                  animation: _statsSweep,
                  widthFactor: 0.45,
                  alpha: 0.85,
                  from: -1.2,
                  to: 1.2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statCell(String label, String value, Color color,
      {bool pulse = false}) {
    final valueText = Text(
      value,
      style: TextStyle(
        fontSize: 19,
        fontWeight: FontWeight.w800,
        color: color,
        height: 1.2,
      ),
    );
    return Flexible(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label.toUpperCase(),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 10.5,
              color: AppColors.textMuted,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.4,
            ),
          ),
          if (!pulse)
            valueText
          else
            // .ip-required — grows and glows on a 1.6s beat.
            AnimatedBuilder(
              animation: _requiredPulse,
              builder: (_, _) {
                final t = _requiredPulse.value;
                return Transform.scale(
                  scale: 1 + 0.08 * t,
                  child: Text(
                    value,
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                      color: color,
                      height: 1.2,
                      shadows: [
                        Shadow(
                          color: _pink.withValues(alpha: 0.75 * t),
                          blurRadius: 16 * t,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _pitch() {
    final parts = _t('ip.pitch').split('{p}');
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(text: parts.first),
          const TextSpan(
            text: '₹100',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          if (parts.length > 1) TextSpan(text: parts[1]),
        ],
      ),
      textAlign: TextAlign.center,
      style: const TextStyle(
        color: Color(0xFF555555),
        fontSize: 12.5,
        height: 1.45,
      ),
    );
  }

  /// .ip-cta — gradient that drifts, shadow that breathes, shine that sweeps.
  Widget _cta() {
    return AnimatedBuilder(
      animation: _ctaPulse,
      builder: (_, child) {
        final t = _ctaPulse.value;
        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: const [_deep, _violet, _pink, _violet, _deep],
              tileMode: TileMode.mirror,
              transform: _SlideGradient(t * 0.5),
            ),
            boxShadow: [
              BoxShadow(
                color: Color.lerp(
                  _deep.withValues(alpha: 0.45),
                  _violet.withValues(alpha: 0.60),
                  t,
                )!,
                blurRadius: 22 + 12 * t,
                offset: Offset(0, 10 + 6 * t),
              ),
              // The expanding ring the CSS draws with a 0 → 12px spread.
              BoxShadow(
                color: _pink.withValues(alpha: 0.55 * (1 - t)),
                spreadRadius: 12 * t,
              ),
            ],
          ),
          child: child,
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          children: [
            Positioned.fill(
              child: IgnorePointer(
                child: _Sweep(
                  animation: _ctaShine,
                  widthFactor: 0.40,
                  alpha: 0.55,
                  from: -1.4,
                  to: 2.6,
                  skew: -0.36,
                ),
              ),
            ),
            TextButton(
              onPressed: _paying ? null : _buyStarter,
              style: TextButton.styleFrom(
                minimumSize: const Size(double.infinity, 46),
                padding: const EdgeInsets.symmetric(horizontal: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                foregroundColor: Colors.white,
                disabledForegroundColor: Colors.white.withValues(alpha: 0.75),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_paying)
                    const SizedBox(
                      width: 15,
                      height: 15,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  else
                    const Icon(Icons.rocket_launch, size: 16),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      _paying ? _t('ip.redirecting') : _t('ip.buyPlan'),
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _morePlansButton() {
    return OutlinedButton(
      onPressed: _paying ? null : _morePlans,
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(double.infinity, 42),
        foregroundColor: _deep,
        side: BorderSide(color: _deep.withValues(alpha: 0.35)),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: Text(
        _t('ip.morePlans'),
        style: const TextStyle(
          fontSize: 13.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------
// Animation helpers
// ----------------------------------------------------------------------

/// Slides a gradient sideways by [dx] bounds-widths — the Flutter equivalent of
/// animating CSS `background-position` on an oversized gradient.
class _SlideGradient extends GradientTransform {
  const _SlideGradient(this.dx);

  final double dx;

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) =>
      Matrix4.translationValues(bounds.width * dx, 0, 0);
}

/// A translucent band that sweeps across its parent and then waits — the
/// `ip-stats-sweep` / `ip-cta-shine` keyframes, which both travel for the first
/// 60% of the cycle and hold for the rest.
class _Sweep extends StatelessWidget {
  const _Sweep({
    required this.animation,
    required this.widthFactor,
    required this.alpha,
    required this.from,
    required this.to,
    this.skew = 0,
  });

  final Animation<double> animation;
  final double widthFactor;
  final double alpha;
  final double from;
  final double to;
  final double skew;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) => AnimatedBuilder(
        animation: animation,
        builder: (_, _) {
          final t = math.min(animation.value / 0.6, 1.0);
          return Transform.translate(
            offset: Offset(constraints.maxWidth * (from + (to - from) * t), 0),
            child: Transform(
              transform: Matrix4.skewX(skew),
              alignment: Alignment.center,
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: widthFactor,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withValues(alpha: 0),
                        Colors.white.withValues(alpha: alpha),
                        Colors.white.withValues(alpha: 0),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _SparkleSpec {
  const _SparkleSpec(this.at, this.size, this.delayMs, this.durationMs);

  final Alignment at;
  final double size;
  final int delayMs;
  final int durationMs;
}

/// One header star: fades in while growing and spinning half a turn, then back
/// out — `ip-sparkle-twinkle`, on this star's own delay and period.
class _Sparkle extends StatefulWidget {
  const _Sparkle({required this.spec});

  final _SparkleSpec spec;

  @override
  State<_Sparkle> createState() => _SparkleState();
}

class _SparkleState extends State<_Sparkle>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: widget.spec.durationMs ~/ 2),
  );

  /// This star's `animation-delay`, so the six don't twinkle in lockstep.
  Timer? _start;

  @override
  void initState() {
    super.initState();
    _start = Timer(
      Duration(milliseconds: widget.spec.delayMs),
      () => _c.repeat(reverse: true),
    );
  }

  @override
  void dispose() {
    _start?.cancel();
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, _) {
        final t = _c.value;
        return Opacity(
          opacity: t,
          child: Transform.rotate(
            angle: math.pi * t,
            child: Transform.scale(
              scale: 0.4 + 0.7 * t,
              child: Icon(
                Icons.star,
                size: widget.spec.size,
                color: _goldLight,
                shadows: [
                  Shadow(
                    color: _goldLight.withValues(alpha: 0.9),
                    blurRadius: 6,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

/// The stacked-coins glyph inside the badge (FaCoins on the web — Material has
/// no equivalent, so it is three ellipses).
class _CoinStackPainter extends CustomPainter {
  const _CoinStackPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final fill = Paint()..color = Colors.white;
    final edge = Paint()
      ..color = _orange.withValues(alpha: 0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    const rows = 3;
    final coinW = size.width * 0.78;
    final coinH = size.height * 0.34;
    final step = (size.height - coinH) / (rows - 1);

    // Bottom-up so each coin overlaps the one beneath it.
    for (var i = rows - 1; i >= 0; i--) {
      final rect = Rect.fromLTWH(
        (size.width - coinW) / 2 + (i.isOdd ? size.width * 0.11 : 0),
        i * step,
        coinW,
        coinH,
      );
      canvas.drawOval(rect, fill);
      canvas.drawOval(rect, edge);
    }
  }

  @override
  bool shouldRepaint(covariant _CoinStackPainter oldDelegate) => false;
}
