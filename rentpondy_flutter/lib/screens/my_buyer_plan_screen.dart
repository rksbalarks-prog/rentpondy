import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// "My Tenant Assistant Plan" — the tenant-assistance plans held by this
/// number. Ports MyBuyerPlan.jsx (`GET /get-buyer-plan-by-phone-buyer/:phone`).
class MyBuyerPlanScreen extends StatefulWidget {
  const MyBuyerPlanScreen({super.key});

  @override
  State<MyBuyerPlanScreen> createState() => _MyBuyerPlanScreenState();
}

class _MyBuyerPlanScreenState extends State<MyBuyerPlanScreen> {
  late final ApiService _api;
  late final String _phone;

  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> _plans = const [];

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
      final plans = await _api.fetchBuyerPlans(_phone);
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

  String _date(dynamic v) {
    final d = v == null ? null : DateTime.tryParse(v.toString());
    return d == null ? 'N/A' : DateFormat('d MMM yyyy').format(d.toLocal());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('My Tenant Assistant Plan',
            style: TextStyle(fontSize: 16, color: Colors.black)),
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
      return const Center(child: Text('No assistant plans yet.'));
    }
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          for (final plan in _plans) _card(plan),
        ],
      ),
    );
  }

  Widget _card(Map<String, dynamic> plan) {
    final payment = (plan['paymentData'] as Map?) ?? const {};
    final info = (plan['planInfo'] as Map?) ?? const {};
    final name = info['planName']?.toString() ??
        payment['planName']?.toString() ??
        'Assistant Plan';
    final amount = info['planAmount']?.toString() ??
        payment['amount']?.toString() ??
        '0';
    final status = payment['payustatususer']?.toString() ?? 'unknown';
    final isPaid = status.toLowerCase() == 'paid';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
                child: Text(name,
                    style: const TextStyle(
                        color: Color(0xFF007BFF),
                        fontWeight: FontWeight.w600,
                        fontSize: 18)),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: isPaid
                      ? const Color(0xFF28A745)
                      : const Color(0xFFDC3545),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(isPaid ? 'Paid' : status,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _row('RA ID', '${plan['Ra_Id'] ?? 'N/A'}'),
          _row('Amount', '₹$amount'),
          _row('PayU Date', _date(payment['payUdate'])),
          _row('Expires', _date(payment['expireDate'])),
          if ((payment['expiryMessage']?.toString() ?? '').isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(payment['expiryMessage'].toString(),
                  style: const TextStyle(
                      color: Color(0xFFFFA000),
                      fontWeight: FontWeight.bold)),
            ),
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text.rich(TextSpan(
        text: '$label: ',
        style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: AppColors.textBlack),
        children: [
          TextSpan(
              text: value,
              style: const TextStyle(
                  fontWeight: FontWeight.normal, color: AppColors.textGrey)),
        ],
      )),
    );
  }
}
