import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../models/points_transaction.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// "Points History" — balance + lifetime totals, transactions grouped by day,
/// and a refund request flow on contact-reveal rows. Ports PointsHistory.jsx:
///   GET  /points-balance/:phone
///   GET  /points-transactions/:phone?limit=200
///   GET  /points-refund-requests/:phone?limit=200
///   POST /points-refund-request { phoneNumber, transactionId, reason }
class PointsHistoryScreen extends StatefulWidget {
  const PointsHistoryScreen({super.key});

  @override
  State<PointsHistoryScreen> createState() => _PointsHistoryScreenState();
}

class _PointsHistoryScreenState extends State<PointsHistoryScreen> {
  late final ApiService _api;
  late final String _phone;

  bool _loading = true;
  String? _error;
  PointsSummary _summary = const PointsSummary();
  List<PointsTransaction> _txns = const [];
  Map<String, RefundRequest> _refundByTxn = {};

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
      final results = await Future.wait([
        _api.fetchPointsSummary(_phone),
        _api.fetchPointsTransactions(_phone),
        _api.fetchRefundRequests(_phone),
      ]);
      if (!mounted) return;

      // Keep the highest-ranked refund per transaction (pending > approved > rejected).
      final map = <String, RefundRequest>{};
      for (final r in results[2] as List<RefundRequest>) {
        final prev = map[r.transactionId];
        if (prev == null || r.rank > prev.rank) map[r.transactionId] = r;
      }

      setState(() {
        _summary = results[0] as PointsSummary;
        _txns = results[1] as List<PointsTransaction>;
        _refundByTxn = map;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Could not load points history.';
        _loading = false;
      });
    }
  }

  /// Group by calendar day (YYYY-MM-DD), newest day first.
  List<MapEntry<String, List<PointsTransaction>>> get _groups {
    final map = <String, List<PointsTransaction>>{};
    for (final t in _txns) {
      final key = t.createdAt == null
          ? 'unknown'
          : DateFormat('yyyy-MM-dd').format(t.createdAt!.toLocal());
      map.putIfAbsent(key, () => []).add(t);
    }
    final entries = map.entries.toList()
      ..sort((a, b) => b.key.compareTo(a.key));
    return entries;
  }

  Future<void> _requestRefund(PointsTransaction t) async {
    final reasonCtrl = TextEditingController();
    String? dialogError;

    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Request refund'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('${t.points} points · ${t.label.text}',
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, color: AppColors.textGrey)),
              const SizedBox(height: 12),
              TextField(
                controller: reasonCtrl,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Reason',
                  border: const OutlineInputBorder(),
                  errorText: dialogError,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                if (reasonCtrl.text.trim().isEmpty) {
                  setDialogState(() =>
                      dialogError = 'Please enter a reason for the refund.');
                  return;
                }
                Navigator.pop(context, true);
              },
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );

    if (ok != true) return;
    try {
      await _api.submitRefundRequest(
        phoneNumber: _phone,
        transactionId: t.id,
        reason: reasonCtrl.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Refund request submitted.'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
      ));
      await _load();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(e.toString()),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ));
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
        title: const Text('Points History',
            style: TextStyle(fontSize: 16, color: Colors.black)),
        actions: [
          IconButton(
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh, color: AppColors.primary),
            tooltip: 'Refresh',
          ),
        ],
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
            Text(_error!, style: const TextStyle(color: Color(0xFFA53149))),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }

    final groups = _groups;
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 24),
        children: [
          _summaryCard(),
          const SizedBox(height: 14),
          if (groups.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: 40),
              child: Center(child: Text('No transactions yet.')),
            ),
          for (final g in groups) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 10, 4, 6),
              child: Text(
                _dayHeading(g.key),
                style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textMuted),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2)),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                children: [
                  for (var i = 0; i < g.value.length; i++)
                    _txnRow(g.value[i], first: i == 0),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _dayHeading(String key) {
    if (key == 'unknown') return 'Unknown date';
    final d = DateTime.tryParse(key);
    if (d == null) return key;
    return DateFormat('d MMM yyyy').format(d);
  }

  Widget _summaryCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, Color(0xFF764BA2)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.3),
              blurRadius: 18,
              offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Available balance',
              style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.6)),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text('${_summary.balance}',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      height: 1.1)),
              const SizedBox(width: 6),
              const Text('pts',
                  style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w800)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _stat('Earned', _summary.totalEarned),
              _stat('Spent', _summary.totalSpent),
              _stat('Paid', _summary.totalPaid, isCurrency: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _stat(String label, int value, {bool isCurrency = false}) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(color: Colors.white70, fontSize: 11)),
          const SizedBox(height: 2),
          Text(isCurrency ? '₹$value' : '$value',
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }

  Widget _txnRow(PointsTransaction t, {required bool first}) {
    final label = t.label;
    final refund = t.isReveal ? _refundByTxn[t.id] : null;
    final pill = refund?.pill;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        border: first
            ? null
            : const Border(top: BorderSide(color: Color(0xFFF2F2F2))),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: t.isCredit
                  ? const Color(0xFFE6F4EA)
                  : const Color(0xFFFDECEA),
            ),
            child: Icon(
              t.isCredit ? Icons.arrow_downward : Icons.arrow_upward,
              size: 14,
              color: t.isCredit
                  ? const Color(0xFF137333)
                  : const Color(0xFFA53149),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    _tag(label),
                    if ((t.planName ?? '').isNotEmpty)
                      Text(t.planName!,
                          style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF444444),
                              fontWeight: FontWeight.w600)),
                    if (pill != null) _tag(pill, small: true),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  t.createdAt == null
                      ? '—'
                      : DateFormat('d MMM yyyy, h:mm a')
                          .format(t.createdAt!.toLocal()),
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textMuted),
                ),
                if (t.isReveal && refund == null) ...[
                  const SizedBox(height: 6),
                  SizedBox(
                    height: 28,
                    child: OutlinedButton(
                      onPressed: () => _requestRefund(t),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('Request refund',
                          style: TextStyle(fontSize: 11)),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${t.isCredit ? '+' : '-'}${t.points}',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: t.isCredit
                  ? const Color(0xFF137333)
                  : const Color(0xFFA53149),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tag(PointsLabel l, {bool small = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: l.bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(l.text,
          style: TextStyle(
              color: l.fg,
              fontSize: small ? 10.5 : 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.3)),
    );
  }
}
