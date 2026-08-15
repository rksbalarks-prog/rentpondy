import 'package:flutter/material.dart';

/// A horizontally-scrolling "running text" banner — the Flutter equivalent of
/// the web app's CSS `@keyframes exclusiveStayMarquee` (translateX 0 → -50% on a
/// duplicated string, looping linearly).
///
/// The text is measured, laid out twice back-to-back, and translated by exactly
/// one copy's width so the loop is seamless.
class MarqueeBanner extends StatefulWidget {
  const MarqueeBanner({
    super.key,
    required this.text,
    this.onTap,
    this.gradient = const LinearGradient(
      colors: [Color(0xFFFF7043), Color(0xFFFF9800)],
    ),
    this.textStyle = const TextStyle(
      color: Colors.white,
      fontWeight: FontWeight.w700,
      fontSize: 14,
      letterSpacing: 0.3,
    ),
    this.duration = const Duration(seconds: 18),
    this.gap = 48,
    this.margin = const EdgeInsets.fromLTRB(4, 4, 4, 10),
    this.verticalPadding = 9,
  });

  final String text;
  final VoidCallback? onTap;
  final Gradient gradient;
  final TextStyle textStyle;

  /// Time for one full copy to scroll past — matches the CSS `18s linear`.
  final Duration duration;

  /// Space after each copy (the web app's `paddingRight: 48px`).
  final double gap;
  final EdgeInsets margin;
  final double verticalPadding;

  @override
  State<MarqueeBanner> createState() => _MarqueeBannerState();
}

class _MarqueeBannerState extends State<MarqueeBanner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(vsync: this, duration: widget.duration)..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Width of one copy of the text + its trailing gap, so we can translate by
  /// exactly that and loop without a visible jump.
  double _copyWidth() {
    final painter = TextPainter(
      text: TextSpan(text: widget.text, style: widget.textStyle),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    return painter.width + widget.gap;
  }

  @override
  Widget build(BuildContext context) {
    final copyWidth = _copyWidth();

    return Padding(
      padding: widget.margin,
      child: GestureDetector(
        onTap: widget.onTap,
        // Isolate the perpetually-scrolling text onto its own layer so it does
        // not repaint the property list it sits above.
        child: RepaintBoundary(
          child: Container(
          height: widget.verticalPadding * 2 + widget.textStyle.fontSize! + 4,
          decoration: BoxDecoration(
            gradient: widget.gradient,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFFF7043).withValues(alpha: 0.35),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          clipBehavior: Clip.hardEdge,
          // OverflowBox lets the two-copy row take its natural (wide) width
          // instead of being clamped to the banner — otherwise the text would
          // be truncated and there'd be nothing to scroll.
          child: OverflowBox(
            alignment: Alignment.centerLeft,
            minWidth: 0,
            maxWidth: double.infinity,
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Transform.translate(
                  offset: Offset(-_controller.value * copyWidth, 0),
                  child: child,
                );
              },
              // Two copies back-to-back → seamless loop.
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _copy(),
                  _copy(),
                ],
              ),
            ),
          ),
        ),
        ),
      ),
    );
  }

  Widget _copy() => Padding(
        padding: EdgeInsets.only(right: widget.gap),
        child: Text(widget.text, maxLines: 1, style: widget.textStyle),
      );
}
