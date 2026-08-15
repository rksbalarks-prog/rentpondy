import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../models/tenant_request.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';

/// "Tenant List" — tenants' rental requirements that owners can respond to.
/// Ports BuyerLists.jsx (`GET /get-buyerAssistances-rent`), including the
/// Send Interest / More / Match Prop action row.
class TenantListScreen extends StatefulWidget {
  const TenantListScreen({super.key, this.showAppBar = true});

  final bool showAppBar;

  @override
  State<TenantListScreen> createState() => _TenantListScreenState();
}

class _TenantListScreenState extends State<TenantListScreen> {
  late final ApiService _api;
  late final AppState _app;

  bool _loading = true;
  String? _error;
  List<TenantRequest> _items = const [];
  String? _busyId;

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
      final list = await _api.fetchTenantRequests();
      if (!mounted) return;
      setState(() {
        _items = list;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Failed to load data';
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

  Future<void> _sendInterest(TenantRequest t) async {
    final phone = _app.phoneNumber;
    if (phone == null || phone.isEmpty) return;
    setState(() => _busyId = t.id);
    try {
      await _api.sendTenantInterest(
          phoneNumber: phone, buyerAssistanceId: t.id);
      _toast('Interest sent successfully.');
    } catch (e) {
      _toast(e.toString(), error: true);
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  void _openDetail(TenantRequest t) {
    final phone = _app.phoneNumber;
    if (phone != null && (t.raId ?? '').isNotEmpty) {
      _api.recordTenantView(raId: t.raId!, phoneNumber: phone);
    }
    pushRoute(context, '/detail-buyer-assis/${t.raId}', 'Tenant Requirement');
  }

  @override
  Widget build(BuildContext context) {
    final body = _body();
    if (!widget.showAppBar) return body;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('Tenant List',
            style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: body,
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(color: AppColors.primary),
            SizedBox(height: 12),
            Text('Loading properties...'),
          ],
        ),
      );
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }
    if (_items.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 8),
            const Text('No tenant requirements found.'),
          ],
        ),
      );
    }
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 12),
        itemCount: _items.length,
        itemBuilder: (context, i) => _card(_items[i]),
      ),
    );
  }

  Widget _card(TenantRequest t) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE8E8E8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ---- Header: avatar | divider | id/name/prices ----
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: ClipOval(
                    child: Image.asset(Assets.profile,
                        width: 60, height: 60, fit: BoxFit.cover),
                  ),
                ),
                Container(width: 1, height: 80, color: const Color(0xFF707070)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text('RA ID: ${t.raId ?? 'N/A'}',
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.textMuted)),
                          ),
                          const Icon(Icons.calendar_month,
                              size: 12, color: AppColors.primary),
                          const SizedBox(width: 4),
                          Text(t.shortDate,
                              style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textMuted)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text.rich(
                        TextSpan(
                          text: t.raName ?? 'N/A',
                          style: const TextStyle(
                              fontSize: 16,
                              color: Colors.black,
                              fontWeight: FontWeight.w500),
                          children: const [
                            TextSpan(
                              text: '  | Tenant',
                              style: TextStyle(
                                  fontSize: 12, color: AppColors.textMuted),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Image.asset(Assets.priceMin, width: 13),
                          const SizedBox(width: 6),
                          Text(Formatters.inr(t.minPrice),
                              style: const TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.w500)),
                          const SizedBox(width: 16),
                          Image.asset(Assets.priceMax, width: 13),
                          const SizedBox(width: 6),
                          Text(Formatters.inr(t.maxPrice),
                              style: const TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 6),
          // ---- Scrollable attribute strip, bordered in brand purple ----
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.primary),
              borderRadius: BorderRadius.circular(4),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _attr(Icons.home_outlined, t.propertyMode),
                  _attr(Icons.maps_home_work_outlined, t.propertyType),
                  _attr(Icons.calendar_month, t.paymentType),
                  _attr(Icons.bed_outlined, '${t.bedrooms ?? 'N/A'} BHK'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_outlined,
                  size: 16, color: AppColors.primary),
              const SizedBox(width: 6),
              Expanded(
                child: Text('${t.area ?? 'N/A'}, ${t.city ?? 'N/A'}',
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.call_outlined,
                  size: 12, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(t.maskedPhone,
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 8),
          // ---- Actions ----
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              _actionButton(
                'Send Interest',
                const Color(0xFF3660FF),
                _busyId == t.id ? null : () => _sendInterest(t),
              ),
              const SizedBox(width: 6),
              _actionButton(
                'More',
                const Color(0xFF2F747F),
                () => _openDetail(t),
              ),
              const SizedBox(width: 6),
              _actionButton(
                'Match Prop',
                const Color(0xFF28A745),
                () => pushRoute(context, '/matched-owner', 'Matched Property'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _attr(IconData icon, String? value) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: Row(
        children: [
          Icon(icon, size: 12, color: AppColors.primary),
          const SizedBox(width: 6),
          Text(value == null || value.isEmpty ? 'N/A' : value,
              style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }

  Widget _actionButton(String label, Color color, VoidCallback? onTap) {
    return SizedBox(
      height: 30,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          textStyle: const TextStyle(fontSize: 13),
        ),
        child: Text(label),
      ),
    );
  }
}
