import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/app_notification.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// Notifications list. Ports Notification.jsx:
///   GET    /get-user-notifications?phoneNumber=      (All)
///   GET    /notifications/:phone                     (Admin)
///   PUT    /mark-single-notification-read/:id
///   DELETE /delete-notification-by-time  { createdAt }
///
/// Locally-read ids are also mirrored into SharedPreferences, the same way the
/// web app keeps them in localStorage.
class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  static const _readKey = 'readNotifications';

  late final ApiService _api;
  late final String _phone;

  bool _adminTab = false;
  bool _loading = true;
  String? _error;
  List<AppNotification> _items = const [];
  Set<String> _readIds = {};

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneDigits;
    _load();
  }

  Future<Set<String>> _loadReadIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_readKey) ?? const []).toSet();
  }

  Future<void> _saveReadId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final ids = (prefs.getStringList(_readKey) ?? <String>[]).toSet()..add(id);
    await prefs.setStringList(_readKey, ids.toList());
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      _readIds = await _loadReadIds();
      final list = _adminTab
          ? await _api.fetchAdminNotifications(_phone)
          : await _api.fetchNotifications(_phone);
      if (!mounted) return;
      setState(() {
        // Merge server isRead with locally-remembered read ids.
        _items = list
            .map((n) => n.isRead || _readIds.contains(n.id)
                ? n.copyWith(isRead: true)
                : n)
            .toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = context.trRead('notif.error');
        _loading = false;
      });
    }
  }

  Future<void> _open(AppNotification n) async {
    // Optimistically mark read locally, then tell the backend.
    setState(() {
      _items = _items
          .map((e) => e.id == n.id ? e.copyWith(isRead: true) : e)
          .toList();
    });
    await _saveReadId(n.id);
    try {
      await _api.markNotificationRead(n.id);
    } catch (_) {/* non-blocking, matches web behaviour */}

    if (!mounted) return;
    final route = n.targetRoute;
    if (route != null) {
      pushRoute(context, route, _titleForRoute(route));
    }
  }

  String _titleForRoute(String route) {
    if (route.startsWith('/details/')) return context.trRead('detail.title');
    if (route == '/my-plan') return context.trRead('drawer.myPlan');
    if (route == '/matched-buyer') return context.trRead('notif.matchedBuyer');
    if (route == '/Buyer-List-Filter') return context.trRead('menu.tenantList');
    return context.trRead('title.rentPondy');
  }

  Future<void> _confirmDelete(AppNotification n) async {
    final confirmMsg = context.trRead('notif.deleteConfirm');
    final cancelLabel = context.trRead('common.cancel');
    final deleteLabel = context.trRead('common.delete');
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Text(confirmMsg),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(cancelLabel)),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(deleteLabel)),
        ],
      ),
    );
    if (ok != true || n.createdAt == null) return;

    final iso = n.createdAt!.toUtc().toIso8601String();
    try {
      await _api.deleteNotificationByTime(iso);
      if (!mounted) return;
      setState(() =>
          _items = _items.where((e) => e.createdAt != n.createdAt).toList());
      _banner(context.trRead('notif.deleted'), success: true);
    } catch (_) {
      if (!mounted) return;
      _banner(context.trRead('notif.deleteFail'), success: false);
    }
  }

  void _banner(String text, {required bool success}) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(text,
          style: TextStyle(
              color: success
                  ? const Color(0xFF155724)
                  : const Color(0xFF721C24))),
      backgroundColor:
          success ? const Color(0xFFD4EDDA) : const Color(0xFFF8D7DA),
      behavior: SnackBarBehavior.floating,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text(context.tr('title.notifications'),
            style: const TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: Column(
            children: [
              _tabs(),
              if (_phone.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Text.rich(TextSpan(
                    text: context.tr('notif.forLabel'),
                    children: [
                      TextSpan(
                          text: _phone,
                          style:
                              const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  )),
                ),
              Expanded(child: _body()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _tabs() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 4),
      child: Row(
        children: [
          Expanded(
            child: _tabButton(context.tr('notif.showAll'), !_adminTab, () {
              setState(() => _adminTab = false);
              _load();
            }),
          ),
          Expanded(
            child: _tabButton(context.tr('notif.admin'), _adminTab, () {
              setState(() => _adminTab = true);
              _load();
            }),
          ),
        ],
      ),
    );
  }

  Widget _tabButton(String label, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: active ? const Color(0xFFF9FAFC) : Colors.transparent,
          border: active ? null : Border.all(color: const Color(0xFFCCCCCC)),
          boxShadow: active
              ? [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2))
                ]
              : null,
        ),
        child: Text(label,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.black, fontSize: 13)),
      ),
    );
  }

  Widget _body() {
    if (_loading) {
      return Center(child: Text(context.tr('common.loading')));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!,
                style: const TextStyle(color: Color(0xFFDC3545)),
                textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(
                onPressed: _load, child: Text(context.tr('common.retry'))),
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
            Text(context.tr('notif.empty')),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(12, 4, 12, 16),
        itemCount: _items.length,
        itemBuilder: (context, i) => _card(_items[i]),
      ),
    );
  }

  Widget _card(AppNotification n) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => _open(n),
        child: Container(
          decoration: BoxDecoration(
            color: n.isRead ? const Color(0xFFF9FAFC) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: n.isRead
                ? Border.all(color: const Color(0xFFE0E0E0))
                : Border.all(color: const Color(0xFFEEEEEE)),
            boxShadow: n.isRead
                ? [
                    BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 4,
                        offset: const Offset(0, 2))
                  ]
                : null,
          ),
          child: Stack(
            children: [
              Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipOval(
                      child: Image.asset(Assets.logo,
                          width: 50, height: 50, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if ((n.rentId ?? '').isNotEmpty)
                            Text('RENT ID: ${n.rentId}',
                                style: const TextStyle(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14)),
                          if ((n.type ?? '').isNotEmpty)
                            Text('${context.tr('notif.typeLabel')} ${n.type}',
                                style: const TextStyle(
                                    color: Colors.black87, fontSize: 13)),
                          Text(n.message,
                              style: const TextStyle(
                                  color: AppColors.textGrey, fontSize: 13)),
                          const SizedBox(height: 2),
                          Text(
                            n.createdAt == null
                                ? ''
                                : DateFormat('d/M/yyyy, h:mm:ss a')
                                    .format(n.createdAt!.toLocal()),
                            style: const TextStyle(
                                color: AppColors.textMuted, fontSize: 11),
                          ),
                          const SizedBox(height: 2),
                          Text(context.tr(n.isRead ? 'notif.read' : 'notif.unread'),
                              style: const TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                  ],
                ),
              ),
              // Delete "×"
              Positioned(
                top: 8,
                right: 8,
                child: GestureDetector(
                  onTap: () => _confirmDelete(n),
                  child: Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 3)
                      ],
                    ),
                    child: const Center(
                      child: Text('×',
                          style: TextStyle(
                              fontSize: 18,
                              height: 1,
                              color: Color(0xFF555555))),
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
