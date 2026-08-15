import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/my_property_card.dart';
import 'add_property_screen.dart';
import 'property_detail_screen.dart';

/// "My Property" — the logged-in owner's listings, with the Property /
/// Removed / Expired / Add Property tabs from MyProperty.jsx.
///
/// Uses the existing backend routes unchanged:
///   GET /fetch-status-with-payment-rent?phoneNumber=
///   GET /fetch-delete-status-rent?phoneNumber=
///   GET /expired-plans-by-phone-rent?phoneNumber=
enum MyPropertyTab { property, removed, expired }

class MyPropertyScreen extends StatefulWidget {
  const MyPropertyScreen({
    super.key,
    this.showAppBar = true,
    this.initialTab = MyPropertyTab.property,
  });

  final bool showAppBar;
  final MyPropertyTab initialTab;

  @override
  State<MyPropertyScreen> createState() => _MyPropertyScreenState();
}

class _MyPropertyScreenState extends State<MyPropertyScreen> {
  late final ApiService _api;
  late final String _phone;

  late MyPropertyTab _tab = widget.initialTab;
  bool _loading = true;
  String? _error;
  final Map<MyPropertyTab, List<Property>> _cache = {};

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneDigits;
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final list = switch (_tab) {
        MyPropertyTab.property => await _api.fetchMyProperties(_phone),
        MyPropertyTab.removed => await _api.fetchRemovedProperties(_phone),
        MyPropertyTab.expired => await _api.fetchExpiredProperties(_phone),
      };
      if (!mounted) return;
      setState(() {
        _cache[_tab] = list;
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

  void _selectTab(MyPropertyTab tab) {
    if (tab == _tab) return;
    setState(() => _tab = tab);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    final body = Column(
      children: [
        _tabBar(),
        Expanded(child: _body()),
      ],
    );

    if (!widget.showAppBar) return body;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('My Property',
            style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: body,
    );
  }

  /// Pill tab strip — active pill is #4F4B7E with white text (MyProperty.jsx).
  Widget _tabBar() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: Row(
        children: [
          _tabButton('Property', _tab == MyPropertyTab.property,
              () => _selectTab(MyPropertyTab.property)),
          _tabButton(
              'Removed', _tab == MyPropertyTab.removed, () => _selectTab(MyPropertyTab.removed)),
          _tabButton(
              'Expired', _tab == MyPropertyTab.expired, () => _selectTab(MyPropertyTab.expired)),
          _tabButton('Add Property', false, () async {
            final added = await Navigator.of(context).push<bool>(
              MaterialPageRoute(builder: (_) => const AddPropertyScreen()),
            );
            if (added == true) {
              _selectTab(MyPropertyTab.property);
              _load();
            }
          }),
        ],
      ),
    );
  }

  Widget _tabButton(String label, bool active, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: active ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
                color: active ? AppColors.primary : const Color(0xFFDDDDDD)),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: active ? Colors.white : const Color(0xFF555555),
              fontWeight: active ? FontWeight.w600 : FontWeight.w500,
              fontSize: 13,
            ),
          ),
        ),
      ),
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
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.wifi_off, size: 40, color: AppColors.textMuted),
              const SizedBox(height: 8),
              Text(_error!, textAlign: TextAlign.center),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: _load, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }

    final items = _cache[_tab] ?? const <Property>[];
    if (items.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 8),
            const Text('No properties found.'),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 4, 8, 12),
        itemCount: items.length,
        itemBuilder: (context, i) {
          final p = items[i];
          return MyPropertyCard(
            property: p,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) =>
                  PropertyDetailScreen(rentId: p.rentId, initial: p),
            )),
            onEdit: () async {
              final changed = await Navigator.of(context).push<bool>(
                MaterialPageRoute(
                  builder: (_) => AddPropertyScreen(existing: p),
                ),
              );
              if (changed == true) _load();
            },
          );
        },
      ),
    );
  }
}
