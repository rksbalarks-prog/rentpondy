import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/property_card.dart';
import 'property_detail_screen.dart';

/// Every "Quick Sort" destination in the web app.
///
/// Most of these pages fetch the same `/fetch-active-users` feed and then
/// filter or sort it **client-side** — the predicates below are copied
/// verbatim from the corresponding JSX files so the results match exactly.
/// Two of them (`withLocation`, `zeroView`) have their own endpoints.
enum PropertyFilter {
  lowToHigh,
  highToLow,
  newToOld,
  oldToNew,
  withImage,
  houseBelow30L,
  house30to50L,
  plotBelow15L,
  agriculturalLand,
  bankLoan,
  withLocation,
  zeroView,
  recentlyViewed,
  mostViewed,
  matchedOwner,
}

extension PropertyFilterInfo on PropertyFilter {
  String get title => switch (this) {
        PropertyFilter.lowToHigh => 'Price: Low to High',
        PropertyFilter.highToLow => 'Price: High to Low',
        PropertyFilter.newToOld => 'Newest First',
        PropertyFilter.oldToNew => 'Oldest First',
        PropertyFilter.withImage => 'With Photos',
        PropertyFilter.houseBelow30L => 'Houses below ₹30L',
        PropertyFilter.house30to50L => 'Houses ₹30L – ₹50L',
        PropertyFilter.plotBelow15L => 'Plots below ₹15L',
        PropertyFilter.agriculturalLand => 'Agricultural Land',
        PropertyFilter.bankLoan => 'Bank Loan Available',
        PropertyFilter.withLocation => 'Property with Location',
        PropertyFilter.zeroView => 'Not Viewed Yet',
        PropertyFilter.recentlyViewed => 'Recently Viewed',
        PropertyFilter.mostViewed => 'Most Viewed',
        PropertyFilter.matchedOwner => 'Matched Tenants',
      };

  /// True when this filter needs its own endpoint rather than the shared feed.
  bool get hasOwnEndpoint => switch (this) {
        PropertyFilter.withLocation ||
        PropertyFilter.zeroView ||
        PropertyFilter.recentlyViewed ||
        PropertyFilter.mostViewed ||
        PropertyFilter.matchedOwner =>
          true,
        _ => false,
      };
}

/// A property list driven by one [PropertyFilter]. Backs all the `/sort/*`
/// routes plus the land/loan shortcut pages.
class FilteredPropertyScreen extends StatefulWidget {
  const FilteredPropertyScreen({
    super.key,
    required this.filter,
    this.showAppBar = true,
  });

  final PropertyFilter filter;
  final bool showAppBar;

  @override
  State<FilteredPropertyScreen> createState() => _FilteredPropertyScreenState();
}

class _FilteredPropertyScreenState extends State<FilteredPropertyScreen> {
  late final ApiService _api;
  late final String _phone;

  bool _loading = true;
  String? _error;
  List<Property> _items = const [];
  final Map<String, int> _imageCounts = {};

  /// See AllPropertyScreen — coalesces image-count responses into one rebuild
  /// per window instead of a setState per response.
  Timer? _countFlush;

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneDigits;
    _load();
  }

  @override
  void dispose() {
    _countFlush?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final List<Property> source = switch (widget.filter) {
        PropertyFilter.withLocation => await _api.fetchLocatedProperties(),
        PropertyFilter.zeroView => await _api.fetchZeroViewProperties(),
        PropertyFilter.recentlyViewed => await _api.fetchRecentlyViewed(_phone),
        PropertyFilter.mostViewed => await _api.fetchMostViewed(_phone),
        PropertyFilter.matchedOwner => await _api.fetchMatchedForOwner(_phone),
        _ => await _api.fetchActiveProperties(),
      };
      final result = _apply(source);
      if (!mounted) return;
      setState(() {
        _items = result;
        _loading = false;
      });
      _loadImageCounts(result);
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
      final c = await _api.fetchImageCount(p.rentId);
      if (!mounted) return;
      _imageCounts[p.rentId] = c;
      _countFlush ??= Timer(const Duration(milliseconds: 100), () {
        _countFlush = null;
        if (mounted) setState(() {});
      });
    }));
  }

  /// Filter + sort predicates, matching the web pages one-for-one.
  List<Property> _apply(List<Property> source) {
    final list = List<Property>.from(source);
    num price(Property p) => p.price ?? 0;
    String type(Property p) => (p.propertyType ?? '').toLowerCase();
    DateTime created(Property p) =>
        p.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);

    switch (widget.filter) {
      case PropertyFilter.lowToHigh:
        list.sort((a, b) => price(a).compareTo(price(b)));
      case PropertyFilter.highToLow:
        list.sort((a, b) => price(b).compareTo(price(a)));
      case PropertyFilter.newToOld:
        list.sort((a, b) => created(b).compareTo(created(a)));
      case PropertyFilter.oldToNew:
        list.sort((a, b) => created(a).compareTo(created(b)));
      case PropertyFilter.withImage:
        list
          ..retainWhere((p) => p.photos.isNotEmpty)
          ..sort((a, b) => price(b).compareTo(price(a)));
      case PropertyFilter.houseBelow30L:
        list.retainWhere((p) => type(p) == 'house' && price(p) < 3000000);
      case PropertyFilter.house30to50L:
        list.retainWhere((p) =>
            type(p) == 'house' && price(p) >= 3000000 && price(p) <= 5000000);
      case PropertyFilter.plotBelow15L:
        list.retainWhere((p) => type(p) == 'plot' && price(p) < 1500000);
      case PropertyFilter.agriculturalLand:
        list.retainWhere((p) => type(p) == 'agricultural land');
      case PropertyFilter.bankLoan:
        list.retainWhere((p) => (p.bankLoan ?? '').toLowerCase() == 'yes');
      case PropertyFilter.withLocation:
      case PropertyFilter.zeroView:
      case PropertyFilter.recentlyViewed:
      case PropertyFilter.mostViewed:
      case PropertyFilter.matchedOwner:
        break; // already scoped (and ordered) by their endpoint
    }
    return list;
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
        title: Text(widget.filter.title,
            style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 17)),
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
            Text(_error!, textAlign: TextAlign.center),
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
            const Text('No properties found.'),
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
        itemBuilder: (context, i) {
          final p = _items[i];
          return PropertyCard(
            property: p,
            imageCount: _imageCounts[p.rentId] ?? 0,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) =>
                  PropertyDetailScreen(rentId: p.rentId, initial: p),
            )),
          );
        },
      ),
    );
  }
}
