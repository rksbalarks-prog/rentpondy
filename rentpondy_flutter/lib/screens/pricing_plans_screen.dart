import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/points_plan.dart';
import '../models/property.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';
import 'payu_checkout_screen.dart';

/// "Pricing Plans" — property subscription/feature plans. Ports AddPlan.jsx +
/// PayUPayment/PayUForm.jsx.
///
/// A plan applies to one specific listing, so selecting a plan first asks which
/// of the user's properties to apply it to (the web app carries a rentId into
/// the PayU form), then runs the real `/payu/payment` → PayU checkout flow.
class PricingPlansScreen extends StatefulWidget {
  const PricingPlansScreen({super.key});

  @override
  State<PricingPlansScreen> createState() => _PricingPlansScreenState();
}

class _PricingPlansScreenState extends State<PricingPlansScreen> {
  late final ApiService _api;
  late final AppState _app;

  bool _loading = true;
  String? _error;
  List<PointsPlan> _plans = const [];
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
      final plans = await _api.fetchActivePlans();
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

  /// Ask which listing this plan should apply to.
  Future<Property?> _pickProperty() async {
    final props = await _api.fetchMyProperties(_app.phoneDigits);
    if (!mounted) return null;
    if (props.isEmpty) {
      final add = await showDialog<bool>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('No property yet'),
          content: const Text(
              'A plan applies to one of your listings. Add a property first, '
              'then choose a plan for it.'),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel')),
            ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Add Property')),
          ],
        ),
      );
      if (add == true && mounted) pushRoute(context, '/add-property', 'Add Property');
      return null;
    }

    return showModalBottomSheet<Property>(
      context: context,
      showDragHandle: true,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(12),
              child: Text('Apply plan to which property?',
                  style: TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 16)),
            ),
            Flexible(
              child: ListView(
                shrinkWrap: true,
                children: [
                  for (final p in props)
                    ListTile(
                      leading: const Icon(Icons.apartment,
                          color: AppColors.primary),
                      title: Text('${p.propertyType ?? 'Property'} · ${p.rentId}'),
                      subtitle: Text(p.locationLine,
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      onTap: () => Navigator.pop(context, p),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _buy(PointsPlan plan) async {
    final phone = _app.phoneNumber;
    if (phone == null || phone.isEmpty) {
      _toast('Please login first', error: true);
      return;
    }
    if (_buyingId != null) return;

    final property = await _pickProperty();
    if (property == null) return;

    setState(() => _buyingId = plan.id);
    try {
      final fields = await _api.initiatePlanPayment(
        phoneNumber: phone,
        plan: plan,
        rentId: property.rentId,
        nowMillis: DateTime.now().millisecondsSinceEpoch,
      );
      if (!mounted) return;
      final outcome = await Navigator.of(context).push<PayUOutcome>(
        MaterialPageRoute(
          builder: (_) =>
              PayUCheckoutScreen(payuFields: fields, title: plan.name),
        ),
      );
      if (!mounted) return;
      switch (outcome) {
        case PayUOutcome.success:
          _toast('Payment successful! Plan activated.');
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
        title: const Text('Pricing Plans',
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
      itemBuilder: (context, i) => _planCard(_plans[i], i),
    );
  }

  Widget _planCard(PointsPlan plan, int index) {
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
                Text(plan.name,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700)),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text('₹${Formatters.inr(plan.price)}',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w900)),
                    if (plan.durationDays != null)
                      Text('  / ${plan.durationDays} days',
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
                if ((plan.featuredAds ?? '').isNotEmpty)
                  _feature('${plan.featuredAds} featured ads'),
                if ((plan.numOfCars ?? '').isNotEmpty)
                  _feature('${plan.numOfCars} listings'),
                if ((plan.packageType ?? '').isNotEmpty)
                  _feature('${plan.packageType} package'),
                if ((plan.description ?? '').isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text(plan.description!,
                      style: const TextStyle(
                          color: AppColors.textGrey, fontSize: 13, height: 1.4)),
                ],
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    onPressed: _buyingId == null ? () => _buy(plan) : null,
                    child: Text(
                      _buyingId == plan.id ? 'Processing…' : 'SELECT PLAN',
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
          const Icon(Icons.check_circle,
              size: 16, color: Color(0xFF28A745)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text,
                style: const TextStyle(
                    fontSize: 13, color: AppColors.textBlack)),
          ),
        ],
      ),
    );
  }
}
