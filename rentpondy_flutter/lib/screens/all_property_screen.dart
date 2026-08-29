import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/area_summary.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../routes.dart';
import '../theme/app_colors.dart';
import '../widgets/area_marquee.dart';
import '../widgets/marquee_banner.dart';
import '../widgets/property_card.dart';
import 'area_listings_screen.dart';
import 'property_detail_screen.dart';

/// "All Property" feed — GET /fetch-active-users, sorted newest-first, each row
/// rendered as a [PropertyCard]. Ports the list portion of PropertyCard.jsx.
class AllPropertyScreen extends StatefulWidget {
  const AllPropertyScreen({super.key});

  @override
  State<AllPropertyScreen> createState() => _AllPropertyScreenState();
}

class _AllPropertyScreenState extends State<AllPropertyScreen> {
  late final ApiService _api;
  bool _loading = true;
  String? _error;
  List<Property> _properties = const [];
  final Map<String, int> _imageCounts = {};

  /// Coalesces the many image-count responses into at most one rebuild per
  /// window, instead of a setState per response (which rebuilt the whole feed
  /// dozens of times during load). Badges still fill in progressively.
  Timer? _countFlush;

  // The two area tickers. Their counts come from their own endpoints and are
  // refreshed on a 30s timer, exactly as AllProperty.jsx does.
  AreaSummary _propertySummary = const AreaSummary.empty();
  AreaSummary _tenantSummary = const AreaSummary.empty();
  List<Map<String, dynamic>> _propertyRows = const [];
  List<Map<String, dynamic>> _tenantRows = const [];
  Timer? _tickerTimer;

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _load();
    _loadTickers();
    _tickerTimer =
        Timer.periodic(const Duration(seconds: 30), (_) => _loadTickers());
  }

  @override
  void dispose() {
    _countFlush?.cancel();
    _tickerTimer?.cancel();
    super.dispose();
  }

  /// Both tickers, fetched side by side. A ticker that fails is simply not
  /// shown — it must never take the property feed down with it.
  Future<void> _loadTickers() async {
    Future<List<Map<String, dynamic>>> safely(
        Future<List<Map<String, dynamic>>> Function() fetch) async {
      try {
        return await fetch();
      } catch (_) {
        return const [];
      }
    }

    final results = await Future.wait([
      safely(_api.fetchAreaPropertyRows),
      safely(_api.fetchTenantAssistanceRows),
    ]);
    if (!mounted) return;
    setState(() {
      _propertyRows = results[0];
      _tenantRows = results[1];
      _propertySummary = summariseByArea(countByPincode(_propertyRows));
      _tenantSummary = summariseByArea(countByPincode(_tenantRows));
    });
  }

  void _openArea(AreaCard card, {required bool tenants}) {
    // Newest first. The API hands these back in no useful order, so without the
    // sort the area list opens on whatever happens to be first — a listing from
    // months ago as easily as this week's.
    final rows = sortNewestFirst((tenants ? _tenantRows : _propertyRows)
        .where((r) => card.codes.contains(pincodeOf(r)))
        .toList());
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => AreaListingsScreen(
        card: card,
        rows: rows,
        tenants: tenants,
      ),
    ));
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final props = await _api.fetchActiveProperties();
      if (!mounted) return;
      setState(() {
        _properties = props;
        _loading = false;
      });
      _loadImageCounts(props);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _loadImageCounts(List<Property> props) async {
    await Future.wait(props.map((p) async {
      final count = await _api.fetchImageCount(p.rentId);
      if (!mounted) return;
      _imageCounts[p.rentId] = count;
      // Batch bursts of responses into a single rebuild per ~100ms.
      _countFlush ??= Timer(const Duration(milliseconds: 100), () {
        _countFlush = null;
        if (mounted) setState(() {});
      });
    }));
  }

  /// The two area tickers, stacked, above the property list. Each disappears
  /// on its own when it has nothing to show — same as the web, which wraps both
  /// blocks in a `cards.length > 0` guard.
  Widget _tickers() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!_propertySummary.isEmpty) ...[
          AreaMarquee(
            title: '🏠 Total Rent Property Available',
            summary: _propertySummary,
            accent: const Color(0xFF203A43),
            tint: const Color(0xFFE6F0F5),
            singularNoun: 'Property',
            pluralNoun: 'Properties',
            onCardTap: (card) => _openArea(card, tenants: false),
          ),
          const SizedBox(height: 10),
        ],
        if (!_tenantSummary.isEmpty) ...[
          AreaMarquee(
            title: '🤝 Total Tenants Available',
            summary: _tenantSummary,
            accent: const Color(0xFF11998E),
            tint: const Color(0xFFEAFFF4),
            singularNoun: 'Tenant',
            pluralNoun: 'Tenants',
            onCardTap: (card) => _openArea(card, tenants: true),
          ),
          const SizedBox(height: 10),
        ],
      ],
    );
  }

  void _openDetail(Property p) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PropertyDetailScreen(rentId: p.rentId, initial: p),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: AppColors.primary),
            const SizedBox(height: 12),
            Text(context.tr('feed.loading')),
          ],
        ),
      );
    }

    if (_error != null) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 40, color: AppColors.textMuted),
            const SizedBox(height: 8),
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(
                onPressed: _load, child: Text(context.tr('common.retry'))),
          ],
        ),
      );
    }

    if (_properties.isEmpty) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 8),
            Text(context.tr('feed.empty')),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
        // +1 exclusive-stays banner, +1 header holding the two area tickers —
        // the same order the web feed uses.
        itemCount: _properties.length + 2,
        itemBuilder: (context, i) {
          if (i == 0) {
            return MarqueeBanner(
              text: context.tr('feed.marquee'),
              onTap: () => pushRoute(
                  context, '/exclusiveDetail', context.trRead('menu.touristPlace')),
            );
          }
          if (i == 1) return _tickers();
          final p = _properties[i - 2];
          return PropertyCard(
            property: p,
            imageCount: _imageCounts[p.rentId] ?? 0,
            onTap: () => _openDetail(p),
          );
        },
      ),
    );
  }
}

class _CenteredMessage extends StatelessWidget {
  const _CenteredMessage({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(child: Padding(padding: const EdgeInsets.all(24), child: child));
  }
}
