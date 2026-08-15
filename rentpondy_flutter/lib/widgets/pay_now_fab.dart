import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../l10n/strings.dart';
import '../screens/payu_checkout_screen.dart';
import '../state/app_state.dart';

/// Floating "Pay Now" pill — a port of the web app's `PayNow.jsx`.
///
/// The user taps it, types any amount above ₹100, and is handed to PayU's
/// hosted checkout through the same `/payu/payment-buyer` endpoint the web
/// uses. Animations match the CSS: `payNowGlow` (pulsing shadow + expanding
/// ring), `payNowFloat` (gentle bob), and `payNowShimmer` (a skewed highlight
/// sweeping across the pill).
///
/// The web pins this to the bottom-left of the 470px frame; here the caller
/// positions it, so [MainShell] can drop it out of the tree while the drawer is
/// open instead of letting it float over the menu.
class PayNowFab extends StatefulWidget {
  const PayNowFab({super.key});

  @override
  State<PayNowFab> createState() => _PayNowFabState();
}

/// Amount must be strictly greater than this (MIN_AMOUNT on the web).
const int _kMinAmount = 100;

const _kPurple = Color(0xFF7C3AED);
const _kPink = Color(0xFFEC4899);
const _kOrange = Color(0xFFF97316);
const _kTeal = Color(0xFF2F747F); // modal title
const _kBlue = Color(0xFF00ADF2); // modal buttons

class _PayNowFabState extends State<PayNowFab> with TickerProviderStateMixin {
  late final AnimationController _glow = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2200),
  )..repeat();
  late final AnimationController _float = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1500),
  )..repeat(reverse: true);
  late final AnimationController _shimmer = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 3200),
  )..repeat();

  /// Pressed-state scale, matching the CSS `:active { scale(0.97) }`.
  bool _pressed = false;

  @override
  void dispose() {
    _glow.dispose();
    _float.dispose();
    _shimmer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final label = AppStrings.tr('payNow.button', context.watch<AppState>().lang);
    return AnimatedBuilder(
      animation: Listenable.merge([_glow, _float]),
      builder: (context, child) {
        // payNowGlow: the shadow swells to 70% of the cycle while a pink ring
        // expands out to 14px and fades, then both settle back.
        final g = _glow.value;
        final ring = math.min(g / 0.7, 1.0);
        final swell = math.sin(math.min(g / 0.7, 1.0) * math.pi);
        return Transform.translate(
          offset: Offset(0, -4 * _float.value),
          child: AnimatedScale(
            scale: _pressed ? 0.97 : 1,
            duration: const Duration(milliseconds: 120),
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(999),
                boxShadow: [
                  BoxShadow(
                    color: _kPurple.withValues(alpha: 0.45 + 0.10 * swell),
                    blurRadius: 18 + 8 * swell,
                    offset: Offset(0, 6 + 4 * swell),
                  ),
                  BoxShadow(
                    color: _kPink.withValues(alpha: 0.55 * (1 - ring)),
                    spreadRadius: 14 * ring,
                  ),
                ],
              ),
              child: child,
            ),
          ),
        );
      },
      child: GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapCancel: () => setState(() => _pressed = false),
        onTapUp: (_) => setState(() => _pressed = false),
        onTap: () => showPayNowSheet(context),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: Stack(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [_kPurple, _kPink, _kOrange],
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('💳', style: TextStyle(fontSize: 17)),
                    const SizedBox(width: 8),
                    Text(
                      label,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ],
                ),
              ),
              // payNowShimmer — travels for the first 60% of the cycle, waits.
              Positioned.fill(
                child: IgnorePointer(
                  child: LayoutBuilder(
                    builder: (_, constraints) => AnimatedBuilder(
                      animation: _shimmer,
                      builder: (_, _) {
                        final t = math.min(_shimmer.value / 0.6, 1.0);
                        return Transform.translate(
                          offset: Offset(
                              constraints.maxWidth * (-1.3 + 3.6 * t), 0),
                          child: Transform(
                            transform: Matrix4.skewX(-0.36),
                            alignment: Alignment.center,
                            child: FractionallySizedBox(
                              alignment: Alignment.centerLeft,
                              widthFactor: 0.35,
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.white.withValues(alpha: 0),
                                      Colors.white.withValues(alpha: 0.55),
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
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Drops every decimal point after the first, mirroring the web's
/// `.replace(/(\..*)\./g, '$1')`, and keeps the caret inside the result.
TextEditingValue _keepOneDecimalPoint(
    TextEditingValue old, TextEditingValue updated) {
  final first = updated.text.indexOf('.');
  if (first < 0) return updated;
  final cleaned = updated.text.substring(0, first + 1) +
      updated.text.substring(first + 1).replaceAll('.', '');
  if (cleaned == updated.text) return updated;
  return TextEditingValue(
    text: cleaned,
    selection: TextSelection.collapsed(
      offset: math.max(0, math.min(updated.selection.end, cleaned.length)),
    ),
  );
}

/// Opens the amount prompt. Exposed so any screen can trigger the same flow.
Future<void> showPayNowSheet(BuildContext context) {
  return showDialog<void>(
    context: context,
    barrierDismissible: true,
    builder: (_) => const _PayNowDialog(),
  );
}

class _PayNowDialog extends StatefulWidget {
  const _PayNowDialog();

  @override
  State<_PayNowDialog> createState() => _PayNowDialogState();
}

class _PayNowDialogState extends State<_PayNowDialog> {
  final _controller = TextEditingController();
  late final AppState _app = context.read<AppState>();

  String _error = '';
  bool _loading = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _t(String key) => AppStrings.tr(key, _app.lang);

  void _close() {
    if (_loading) return; // don't allow closing mid-redirect
    Navigator.of(context).pop();
  }

  Future<void> _pay() async {
    if (_loading) return;
    final amount = num.tryParse(_controller.text.trim());
    if (amount == null) {
      setState(() => _error = _t('payNow.invalid'));
      return;
    }
    if (amount <= _kMinAmount) {
      setState(() => _error =
          _t('payNow.tooLow').replaceFirst('{n}', '$_kMinAmount'));
      return;
    }

    setState(() {
      _loading = true;
      _error = '';
    });
    try {
      final fields = await _app.api.initiateCustomPayment(
        phoneNumber: _app.phoneNumber ?? '',
        amount: amount,
        nowMillis: DateTime.now().millisecondsSinceEpoch,
      );
      if (!mounted) return;

      final navigator = Navigator.of(context);
      final messenger = ScaffoldMessenger.of(context);
      final outcome = await navigator.push<PayUOutcome>(
        MaterialPageRoute(
          builder: (_) => PayUCheckoutScreen(
            payuFields: fields,
            title: _t('payNow.button'),
          ),
        ),
      );
      if (!mounted) return;

      switch (outcome) {
        case PayUOutcome.success:
          navigator.pop();
          messenger.showSnackBar(SnackBar(
            content: Text(_t('payNow.success')),
            backgroundColor: _kTeal,
            behavior: SnackBarBehavior.floating,
          ));
        case PayUOutcome.failure:
          setState(() {
            _loading = false;
            _error = _t('payNow.declined');
          });
        case PayUOutcome.cancelled:
        case null:
          setState(() => _loading = false);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = '$e'.replaceFirst('ApiException: ', '');
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      contentPadding: const EdgeInsets.all(24),
      content: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 340),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              _t('payNow.button'),
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: _kTeal,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _t('payNow.subtitle').replaceFirst('{n}', '$_kMinAmount'),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Color(0xFF666666)),
            ),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFCCCCCC)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Text('₹',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF333333))),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      autofocus: true,
                      enabled: !_loading,
                      keyboardType: const TextInputType.numberWithOptions(
                          decimal: true),
                      // Digits plus at most one decimal point — the same
                      // sanitiser as the web's onChange, which *strips* any
                      // extra dots rather than rejecting the whole edit (so a
                      // pasted "1a2.3.4" still becomes "12.34").
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
                        TextInputFormatter.withFunction(_keepOneDecimalPoint),
                      ],
                      onChanged: (_) {
                        if (_error.isNotEmpty) setState(() => _error = '');
                      },
                      onSubmitted: (_) => _pay(),
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 12),
                        hintText: _t('payNow.hint'),
                      ),
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                ],
              ),
            ),
            if (_error.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  _error,
                  textAlign: TextAlign.center,
                  style:
                      const TextStyle(color: Color(0xFFE53935), fontSize: 12),
                ),
              ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _loading ? null : _close,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _kBlue,
                      side: const BorderSide(color: _kBlue),
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(_t('common.cancel'),
                        style: const TextStyle(fontWeight: FontWeight.w600)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _loading ? null : _pay,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kBlue,
                      disabledBackgroundColor: const Color(0xFF7FD4F7),
                      foregroundColor: Colors.white,
                      disabledForegroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(
                      _loading ? _t('payNow.processing') : _t('payNow.pay'),
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
