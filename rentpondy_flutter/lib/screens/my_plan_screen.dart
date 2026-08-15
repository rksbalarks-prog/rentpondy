import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../models/user_plan.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// "My Plan" — the user's active subscription plans and, nested under each,
/// the per-rentId payment records. Ports MyPlan.jsx
/// (`GET /plans-by-phone/:phone`).
class MyPlanScreen extends StatefulWidget {
  const MyPlanScreen({super.key});

  @override
  State<MyPlanScreen> createState() => _MyPlanScreenState();
}

class _MyPlanScreenState extends State<MyPlanScreen> {
  late final ApiService _api;
  late final String _phone;

  bool _loading = true;
  String? _error;
  List<UserPlan> _plans = const [];

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneNumber ?? '';
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final plans = await _api.fetchMyPlans(_phone);
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

  String _date(DateTime? d) =>
      d == null ? 'N/A' : DateFormat('d MMM yyyy').format(d.toLocal());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('My Plan',
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

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Padding(
            padding: EdgeInsets.only(bottom: 12),
            child: Text('Current Plans',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF009BC5), fontSize: 20)),
          ),
          if (_plans.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: 40),
              child: Center(child: Text('No active plans.')),
            ),
          for (final plan in _plans) _planCard(plan),
        ],
      ),
    );
  }

  Widget _planCard(UserPlan plan) {
    final entries = plan.entriesFor(_phone);
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 10,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(plan.name ?? 'Plan',
                    style: const TextStyle(
                        color: Color(0xFF007BFF),
                        fontWeight: FontWeight.w600,
                        fontSize: 18)),
              ),
              const Icon(Icons.check_circle, color: Color(0xFF28A745)),
            ],
          ),
          const SizedBox(height: 10),
          _detail('Duration', '${plan.durationDays ?? 'N/A'} days'),
          _detail('Activated on', _date(plan.createdAt)),
          _detail('Featured Ads', plan.featuredAds ?? 'N/A'),
          _detail('Feature Property Limit', plan.featuredMaxCar ?? 'N/A'),
          for (final e in entries) _paymentCard(plan, e),
        ],
      ),
    );
  }

  Widget _detail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text.rich(
        TextSpan(
          text: '$label: ',
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
              color: AppColors.textBlack),
          children: [
            TextSpan(
                text: value,
                style: const TextStyle(
                    fontWeight: FontWeight.normal,
                    color: AppColors.textGrey)),
          ],
        ),
      ),
    );
  }

  Widget _paymentCard(UserPlan plan, PlanPhoneEntry entry) {
    final p = entry.payment;
    return Container(
      margin: const EdgeInsets.only(top: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.35),
              blurRadius: 15,
              offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _detail('RENT ID', entry.rentId ?? 'N/A'),
          if (p == null)
            const Text('No payment data available.',
                style: TextStyle(color: Color(0xFF999999)))
          else ...[
            _detail('PayU Status', p.payuStatus ?? 'N/A'),
            _detail('Amount', '₹${p.amount ?? 'N/A'}'),
            _detail('Txn ID', p.txnId ?? 'N/A'),
            _detail('PayU Date', _date(p.payUDate)),
            _detail('Email', p.email ?? 'N/A'),
            _detail('Expires At',
                p.isPaid ? _date(plan.expiryFor(p)) : 'N/A'),
            if ((p.expiryMessage ?? '').isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(p.expiryMessage!,
                    style: const TextStyle(
                        color: Color(0xFFFFA000),
                        fontWeight: FontWeight.bold)),
              ),
            if (!p.isPaid) ...[
              const Text('Payment not completed',
                  style: TextStyle(
                      color: Color(0xFFFF0000), fontWeight: FontWeight.w500)),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () =>
                      pushRoute(context, '/payu-form', 'Payment'),
                  child: Text(p.payButtonLabel),
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }
}
