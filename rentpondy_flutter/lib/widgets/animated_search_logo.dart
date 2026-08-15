import 'dart:async';

import 'package:flutter/material.dart';

/// The floating cyan SEARCH button.
///
/// A port of the web app's `AnimatedSearchLogo` (AnimatedSearchLogo.jsx +
/// .css). It idles as a blue circle with a magnifier, then every 6s rises 8px,
/// brightens to cyan with a glow, and swaps the icon for the word "SEARCH"
/// before settling back. Values below mirror that CSS — keep the two in step.
///
/// The CSS back-out easing `cubic-bezier(.34, 1.56, .64, 1)` overshoots past
/// its target, which is what produces the `searchTextPulse` 0.5 -> 1.2 -> 1
/// bounce; a single implicit animation on that curve reproduces it, so no
/// explicit controller is needed here.
class AnimatedSearchLogo extends StatefulWidget {
  const AnimatedSearchLogo({super.key, required this.onTap});

  final VoidCallback onTap;

  @override
  State<AnimatedSearchLogo> createState() => _AnimatedSearchLogoState();
}

class _AnimatedSearchLogoState extends State<AnimatedSearchLogo> {
  static const _idleBlue = Color(0xFF0099FF);
  static const _activeCyan = Color(0xFF00D4FF);

  /// cubic-bezier(0.34, 1.56, 0.64, 1)
  static const _backOut = Cubic(0.34, 1.56, 0.64, 1.0);

  bool _isAnimating = false;
  bool _showText = false;

  Timer? _initial;
  Timer? _cycle;
  Timer? _textOn;
  Timer? _reset;

  @override
  void initState() {
    super.initState();
    // Mirrors the JS driver: first run after 3s, then every 6s (3s idle + 3s
    // showing). Text appears 300ms into each run and clears at 3s.
    _initial = Timer(const Duration(seconds: 3), _run);
    _cycle = Timer.periodic(const Duration(seconds: 6), (_) => _run());
  }

  void _run() {
    if (!mounted) return;
    setState(() => _isAnimating = true);
    _textOn = Timer(const Duration(milliseconds: 300), () {
      if (mounted) setState(() => _showText = true);
    });
    _reset = Timer(const Duration(milliseconds: 3000), () {
      if (!mounted) return;
      setState(() {
        _showText = false;
        _isAnimating = false;
      });
    });
  }

  @override
  void dispose() {
    _initial?.cancel();
    _cycle?.cancel();
    _textOn?.cancel();
    _reset?.cancel();
    super.dispose();
  }

  /// The CSS shrinks the circle on small viewports (65px <=768, 60px <=480).
  double get _diameter {
    final w = MediaQuery.of(context).size.width;
    if (w <= 480) return 60;
    if (w <= 768) return 65;
    return 70;
  }

  double get _labelSize {
    final w = MediaQuery.of(context).size.width;
    if (w <= 480) return 9;
    if (w <= 768) return 10;
    return 11;
  }

  @override
  Widget build(BuildContext context) {
    final d = _diameter;
    return GestureDetector(
      onTap: widget.onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 600),
        curve: _backOut,
        width: d,
        height: d,
        transform: Matrix4.translationValues(0, _isAnimating ? -8 : 0, 0),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: _isAnimating ? _activeCyan : _idleBlue,
          boxShadow: _isAnimating
              // 0 0 25px rgba(0,212,255,.7), 0 0 50px rgba(0,212,255,.4)
              ? [
                  BoxShadow(
                      color: _activeCyan.withValues(alpha: 0.7),
                      blurRadius: 25),
                  BoxShadow(
                      color: _activeCyan.withValues(alpha: 0.4),
                      blurRadius: 50),
                ]
              // 0 4px 12px rgba(0,0,0,.15) — the keyframe's 0% state
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [_icon(), _label()],
        ),
      ),
    );
  }

  /// hide-icon: opacity 0, scale .6, rotateZ(-15deg)
  Widget _icon() {
    return AnimatedOpacity(
      opacity: _showText ? 0 : 1,
      duration: const Duration(milliseconds: 400),
      curve: _backOut,
      child: AnimatedScale(
        scale: _showText ? 0.6 : 1,
        duration: const Duration(milliseconds: 400),
        curve: _backOut,
        child: AnimatedRotation(
          turns: _showText ? -15 / 360 : 0,
          duration: const Duration(milliseconds: 400),
          curve: _backOut,
          child: const Icon(Icons.search, color: Colors.white, size: 24),
        ),
      ),
    );
  }

  /// hide-text: opacity 0, scale .5, rotateZ(15deg); the back-out curve gives
  /// the show transition its 1.2 overshoot.
  Widget _label() {
    return AnimatedOpacity(
      opacity: _showText ? 1 : 0,
      duration: const Duration(milliseconds: 400),
      curve: _backOut,
      child: AnimatedScale(
        scale: _showText ? 1 : 0.5,
        duration: const Duration(milliseconds: 500),
        curve: _backOut,
        child: AnimatedRotation(
          turns: _showText ? 0 : 15 / 360,
          duration: const Duration(milliseconds: 400),
          curve: _backOut,
          child: Text(
            'SEARCH',
            style: TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.w700,
              fontSize: _labelSize,
              letterSpacing: 0.8,
            ),
          ),
        ),
      ),
    );
  }
}
