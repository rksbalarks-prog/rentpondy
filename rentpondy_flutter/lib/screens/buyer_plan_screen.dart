import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import 'payu_checkout_screen.dart';

/// "Tenant Assistant Plans" — the purchase step after a tenant submits an
/// assistance request. Ports the web BuyerPlan.jsx: it lists the active
/// buyer-assistance plans (`GET /buyer-plans-active`) for a specific request
/// (`Ra_Id`); selecting one runs the PayU flow (`/select-buyer-plan` then
/// `/payu/payment-buyer`) inside [PayUCheckoutScreen].
class BuyerPlanScreen extends StatefulWidget {
  const BuyerPlanScreen({super.key, required this.raId});

  /// The submitted assistance request this plan is bought for.
  final int raId;

  @override
  State<BuyerPlanScreen> createState() => _BuyerPlanScreenState();
}

class _BuyerPlanScreenState extends State<BuyerPlanScreen> {
  late final ApiService _api;
  late final AppState _app;

  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> _plans = const [];
  String? _buyingId;

  @override
  void initState() {
    super.initState();
    _app = context.read<AppState>();
    _api = _app.api;
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final plans = await _api.fetchActiveBuyerPlans();
      if (!mounted) return;
      setState(() {
        _plans = plans;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
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

  Future<void> _buy(Map<String, dynamic> plan) async {
    final phone = _app.phoneDigits;
    if (phone.isEmpty) {
      _toast('Please login first', error: true);
      return;
    }
    if (_buyingId != null) return;

    final planId = plan['_id']?.toString() ?? '';
    final planName = plan['planName']?.toString() ?? 'Plan';
    final amount = plan['planAmount']?.toString() ?? '0';
    if (planId.isEmpty) return;

    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Confirm plan'),
        content: Text('Buy "$planName" for ₹$amount?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Continue')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _buyingId = planId);
    try {
      final fields = await _api.initiateBuyerPlanPayment(
        phoneNumber: phone,
        planId: planId,
        planName: planName,
        amount: amount,
        raId: widget.raId,
        nowMillis: DateTime.now().millisecondsSinceEpoch,
      );
      if (!mounted) return;
      final outcome = await Navigator.of(context).push<PayUOutcome>(
        MaterialPageRoute(
          builder: (_) =>
              PayUCheckoutScreen(payuFields: fields, title: planName),
        ),
      );
      if (!mounted) return;
      switch (outcome) {
        case PayUOutcome.success:
          _toast('Payment successful! Plan activated.');
          Navigator.of(context).pop(true);
        case PayUOutcome.failure:
          _toast('Payment failed. Please try again.', error: true);
        case PayUOutcome.cancelled:
        case null:
          break;
      }
    } catch (e) {
      _toast(e.toString(), error: true);
    } finally {
      if (mounted) setState(() => _buyingId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7FB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('Tenant Assistant Plans',
            style: TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.primary));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }
    if (_plans.isEmpty) {
      return const Center(child: Text('No plans available right now.'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _plans.length,
      itemBuilder: (context, i) => _planCard(_plans[i]),
    );
  }

  Widget _planCard(Map<String, dynamic> plan) {
    final planId = plan['_id']?.toString() ?? '';
    final name = plan['planName']?.toString() ?? 'Plan';
    final amount = plan['planAmount']?.toString() ?? '0';
    final validity = plan['planValidity']?.toString();
    final assistants = plan['numberOfAssistants']?.toString();
    final service = plan['serviceType']?.toString();
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.10),
              blurRadius: 12,
              offset: const Offset(0, 4)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.primary, Color(0xFF764BA2)],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700)),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text('₹$amount',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w900)),
                    if (validity != null && validity.isNotEmpty)
                      Text('  / $validity days',
                          style: const TextStyle(
                              color: Colors.white70, fontSize: 13)),
                  ],
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (assistants != null && assistants.isNotEmpty)
                  _feature('$assistants assistant contacts'),
                if (service != null && service.isNotEmpty)
                  _feature(service),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    onPressed: _buyingId == null ? () => _buy(plan) : null,
                    child: Text(
                      _buyingId == planId ? 'Processing…' : 'SELECT PLAN',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 15),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _feature(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          const Icon(Icons.check_circle, size: 16, color: Color(0xFF28A745)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text,
                style:
                    const TextStyle(fontSize: 13, color: AppColors.textBlack)),
          ),
        ],
      ),
    );
  }
}
