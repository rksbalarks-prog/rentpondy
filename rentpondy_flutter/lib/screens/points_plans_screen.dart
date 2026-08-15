import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/points_plan.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import 'payu_checkout_screen.dart';

/// "Points Plans" — buy points used to unlock owner contacts.
/// Ports PointsPlans.jsx: a horizontal snap carousel of gradient-bordered
/// cards, a MOST POPULAR badge, the balance pill, and dot indicators.
///
/// Buying keeps the existing backend flow intact:
///   POST /select-points-plan   (reserve)
///   POST /payu/points-payment  (get PayU fields)
///   -> PayU hosted checkout in a WebView
class PointsPlansScreen extends StatefulWidget {
  const PointsPlansScreen({super.key});

  @override
  State<PointsPlansScreen> createState() => _PointsPlansScreenState();
}

class _PointsPlansScreenState extends State<PointsPlansScreen> {
  static const _cardWidth = 240.0;

  /// The three gradients the web cards cycle through.
  static const _gradients = <List<Color>>[
    [Color(0xFF667EEA), Color(0xFF764BA2)],
    [Color(0xFFF093FB), Color(0xFFF5576C)],
    [Color(0xFF4FACFE), Color(0xFF00F2FE)],
  ];

  late final ApiService _api;
  late final AppState _app;
  late final PageController _pageController;

  List<PointsPlan> _plans = PointsPlan.fallback;
  int _active = 0;
  int? _buyingIndex;
  int? _balance;

  @override
  void initState() {
    super.initState();
    _app = context.read<AppState>();
    _api = _app.api;
    _pageController =
        PageController(viewportFraction: 0.68, initialPage: 0);
    _load();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final plans = await _api.fetchPointsPlans();
    if (mounted && plans.isNotEmpty) setState(() => _plans = plans);

    final phone = _app.phoneNumber;
    if (phone != null && phone.isNotEmpty) {
      final bal = await _api.fetchPointsBalance(_app.phoneDigits);
      if (mounted) setState(() => _balance = bal ?? 0);
    }
  }

  void _toast(String msg, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? Colors.red : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  Future<void> _buy(PointsPlan plan, int index) async {
    final phone = _app.phoneNumber;
    if (phone == null || phone.isEmpty) {
      _toast('Please login first', error: true);
      return;
    }
    if (_buyingIndex != null) return;

    setState(() => _buyingIndex = index);
    try {
      final fields = await _api.initiatePointsPayment(
        phoneNumber: phone,
        plan: plan,
        nowMillis: DateTime.now().millisecondsSinceEpoch,
      );
      if (!mounted) return;

      final outcome = await Navigator.of(context).push<PayUOutcome>(
        MaterialPageRoute(
          builder: (_) => PayUCheckoutScreen(
            payuFields: fields,
            title: 'Buy Points',
          ),
        ),
      );
      if (!mounted) return;

      switch (outcome) {
        case PayUOutcome.success:
          _toast('Payment successful! Points added.');
          await _app.refreshPointsBalance();
          await _load();
        case PayUOutcome.failure:
          _toast('Payment failed. Please try again.', error: true);
        case PayUOutcome.cancelled:
        case null:
          break;
      }
    } catch (e) {
      _toast(e.toString(), error: true);
    } finally {
      if (mounted) setState(() => _buyingIndex = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: Color(0xFF30747F)),
        title: const Text('Points Plans',
            style: TextStyle(fontSize: 16, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: Column(
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(16, 12, 16, 4),
                child: Text.rich(
                  TextSpan(
                    text:
                        'Buy points to unlock owner contact details. Each contact reveal costs ',
                    children: [
                      TextSpan(
                          text: '10 points',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      TextSpan(text: '.'),
                    ],
                  ),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF666666),
                      fontWeight: FontWeight.w500,
                      height: 1.6),
                ),
              ),
              if (_balance != null)
                Container(
                  margin: const EdgeInsets.only(top: 8, bottom: 4),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF0FF),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text('Your balance: $_balance points',
                      style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600)),
                ),
              Expanded(
                child: Center(
                  child: SizedBox(
                    height: 400,
                    child: PageView.builder(
                      controller: _pageController,
                      itemCount: _plans.length,
                      onPageChanged: (i) => setState(() => _active = i),
                      itemBuilder: (context, i) => _planCard(_plans[i], i),
                    ),
                  ),
                ),
              ),
              _dots(),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _planCard(PointsPlan plan, int index) {
    final isActive = _active == index;
    final isPopular = plan.popular || index == 1;
    final gradient = _gradients[index % _gradients.length];

    return AnimatedScale(
      scale: isActive ? 1.0 : 0.92,
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeOutBack,
      child: AnimatedOpacity(
        opacity: isActive ? 1 : 0.7,
        duration: const Duration(milliseconds: 350),
        child: Center(
          child: SizedBox(
            width: _cardWidth,
            child: Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.topCenter,
              children: [
                // Gradient border = 3px padding around a white inner card.
                Container(
                  margin: const EdgeInsets.only(top: 14),
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: gradient,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary
                            .withValues(alpha: isActive ? 0.22 : 0.12),
                        blurRadius: isActive ? 40 : 20,
                        offset: Offset(0, isActive ? 18 : 8),
                      ),
                    ],
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(19),
                    ),
                    padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
                    child: _cardBody(plan, index),
                  ),
                ),
                if (isPopular)
                  Positioned(
                    top: 2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 5),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFFD27A), Color(0xFFFF8A3D)],
                        ),
                        borderRadius: BorderRadius.circular(999),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFF8A3D)
                                .withValues(alpha: 0.45),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: const Text('★ MOST POPULAR',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.8)),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _cardBody(PointsPlan plan, int index) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Expanded(
              child: Text(plan.name,
                  style: const TextStyle(
                      color: Color(0xFF2A2750),
                      fontWeight: FontWeight.w700,
                      fontSize: 22,
                      letterSpacing: -0.3)),
            ),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFF2F1FA),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text('${plan.points} PTS',
                  style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.6,
                      color: Color(0xFF9D99C2))),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text('Reveal ${plan.revealCount} owner contacts',
            style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF8A87A8),
                fontWeight: FontWeight.w500,
                height: 1.4)),
        const SizedBox(height: 14),
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            const Text('₹',
                style: TextStyle(
                    fontSize: 14,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600)),
            const SizedBox(width: 6),
            Text('${plan.price}',
                style: const TextStyle(
                    fontSize: 36,
                    color: Color(0xFF2A2750),
                    fontWeight: FontWeight.w800,
                    height: 1,
                    letterSpacing: -1)),
            const SizedBox(width: 6),
            const Text('one time',
                style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFFA6A3C2),
                    fontWeight: FontWeight.w500)),
          ],
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF667EEA).withValues(alpha: 0.06),
                const Color(0xFFF5576C).withValues(alpha: 0.06),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
                color: const Color(0xFF667EEA).withValues(alpha: 0.10)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _bullet(const Color(0xFF764BA2), '${plan.points} points'),
              if (plan.durationDays != null) ...[
                const SizedBox(height: 6),
                _bullet(const Color(0xFFF5576C),
                    'Valid for ${plan.durationDays} days'),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, Color(0xFF764BA2)],
              ),
              borderRadius: BorderRadius.circular(999),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.30),
                  blurRadius: 18,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: TextButton(
              onPressed:
                  _buyingIndex == null ? () => _buy(plan, index) : null,
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999)),
              ),
              child: Text(
                _buyingIndex == index ? 'Processing…' : 'BUY POINTS',
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _bullet(Color dot, String text) {
    return Row(
      children: [
        Container(
          width: 5,
          height: 5,
          decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(text,
              style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }

  Widget _dots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        for (var i = 0; i < _plans.length; i++)
          GestureDetector(
            onTap: () => _pageController.animateToPage(i,
                duration: const Duration(milliseconds: 350),
                curve: Curves.easeOutCubic),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutBack,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: _active == i ? 22 : 7,
              height: 7,
              decoration: BoxDecoration(
                gradient: _active == i
                    ? const LinearGradient(
                        colors: [AppColors.primary, Color(0xFF764BA2)])
                    : null,
                color: _active == i ? null : const Color(0xFFD8D5E8),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
          ),
      ],
    );
  }
}
