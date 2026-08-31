import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/area_summary.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../services/area_index.dart';
import '../state/app_state.dart';
import '../routes.dart';
import '../theme/app_colors.dart';
import '../widgets/area_marquee.dart';
import '../widgets/area_search_bar.dart';
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

  // ── Area search (AllProperty.jsx `navbarSearchValue` & friends) ─────────
  final TextEditingController _searchCtrl = TextEditingController();
  final FocusNode _searchFocus = FocusNode();

  /// Suggestions come from [AreaIndex] — the bundled table plus the areas the
  /// feed actually uses.
  Map<String, String> _areaIndex = const {};
  List<AreaSuggestion> _suggestions = const [];
  bool _showSuggestions = false;

  /// The applied selection. Both are set together, exactly like the web's
  /// `setFilters({ area, pinCode })`, and both must match for a property to
  /// stay in the list.
  String? _selectedArea;
  String? _selectedPincode;

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _searchFocus.addListener(() {
      if (!_searchFocus.hasFocus && mounted) {
        setState(() => _showSuggestions = false);
      }
    });
    _loadAreaIndex();
    _load();
    _loadTickers();
    _tickerTimer =
        Timer.periodic(const Duration(seconds: 30), (_) => _loadTickers());
  }

  @override
  void dispose() {
    _countFlush?.cancel();
    _tickerTimer?.cancel();
    _searchCtrl.dispose();
    _searchFocus.dispose();
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

  // ── Area search ────────────────────────────────────────────────────────

  /// Seeds [_areaIndex] from the bundled area→pincode table for the active
  /// city. `_load` then folds in the areas the feed actually uses.
  Future<void> _loadAreaIndex() async {
    await AreaIndex.ensureLoaded();
    if (!mounted) return;
    setState(() => _areaIndex = AreaIndex.entries(_base));
  }

  String get _base => context.read<AppState>().activeBase;

  /// Match the typed text against area names AND pincodes, case-insensitive
  /// and partial on both — "law" finds Lawspet, "605" finds every 605xxx area.
  /// Straight port of `handleNavbarSearchChange`.
  void _onSearchChanged(String value) {
    final q = value.trim().toLowerCase();
    if (q.isEmpty) {
      setState(() {
        _suggestions = const [];
        _showSuggestions = false;
      });
      return;
    }
    final hits = _areaIndex.entries
        .where((e) =>
            e.key.toLowerCase().contains(q) || e.value.contains(q))
        .map((e) => AreaSuggestion(e.key, e.value))
        .toList()
      ..sort((a, b) {
        // Names that start with the query first, then alphabetically.
        final ap = a.area.toLowerCase().startsWith(q) ? 0 : 1;
        final bp = b.area.toLowerCase().startsWith(q) ? 0 : 1;
        return ap != bp
            ? ap - bp
            : a.area.toLowerCase().compareTo(b.area.toLowerCase());
      });
    setState(() {
      _suggestions = hits;
      _showSuggestions = hits.isNotEmpty;
    });
  }

  /// Apply a suggestion: fill the box, pin the area+pincode filter, close the
  /// dropdown. `handleNavbarAreaSelect` in the web app.
  void _selectSuggestion(AreaSuggestion s) {
    _searchCtrl.text = s.area;
    _searchFocus.unfocus();
    setState(() {
      _selectedArea = s.area;
      _selectedPincode = s.pincode;
      _suggestions = const [];
      _showSuggestions = false;
    });
  }

  /// Enter with the dropdown open takes the top hit, as the web does with its
  /// keyboard-highlighted row.
  void _submitSearch() {
    if (_suggestions.isNotEmpty) _selectSuggestion(_suggestions.first);
  }

  /// The "✕" — clears the box and drops the filter (`handleClearSearch`).
  void _clearSearch() {
    _searchCtrl.clear();
    _searchFocus.unfocus();
    setState(() {
      _suggestions = const [];
      _showSuggestions = false;
      _selectedArea = null;
      _selectedPincode = null;
    });
  }

  /// The feed narrowed to the selected area. Both area and pincode have to
  /// match exactly (case-insensitive on the name) — same rule as the web's
  /// `areaMatch && pincodeMatch`.
  List<Property> get _visibleProperties {
    final area = _selectedArea;
    if (area == null) return _properties;
    final a = area.toLowerCase();
    final pin = _selectedPincode ?? '';
    return _properties.where((p) {
      if ((p.area ?? '').trim().toLowerCase() != a) return false;
      if (pin.isEmpty) return true;
      return (p.rawStr('pinCode') ?? '').trim() == pin;
    }).toList();
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
      // Every search box in the app suggests from the same index.
      AreaIndex.learnFrom(_base, props);
      setState(() => _areaIndex = AreaIndex.entries(_base));
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

    final visible = _visibleProperties;
    // A picked area with nothing in it — the web pops its "No Property found"
    // modal here; inline reads better on a phone.
    final noMatch = visible.isEmpty && _selectedArea != null;

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        // +1 area search box, +1 exclusive-stays banner, +1 header holding the
        // two area tickers — the same order the web feed uses.
        itemCount: 3 + (noMatch ? 1 : visible.length),
        itemBuilder: (context, i) {
          if (i == 0) {
            return AreaSearchBar(
              controller: _searchCtrl,
              focusNode: _searchFocus,
              suggestions: _suggestions,
              showSuggestions: _showSuggestions,
              onChanged: _onSearchChanged,
              onSelect: _selectSuggestion,
              onClear: _clearSearch,
              onSubmitted: _submitSearch,
            );
          }
          if (i == 1) {
            return MarqueeBanner(
              text: context.tr('feed.marquee'),
              onTap: () => pushRoute(
                  context, '/exclusiveDetail', context.trRead('menu.touristPlace')),
            );
          }
          if (i == 2) return _tickers();
          if (noMatch) return _noMatch();
          final p = visible[i - 3];
          return PropertyCard(
            property: p,
            imageCount: _imageCounts[p.rentId] ?? 0,
            onTap: () => _openDetail(p),
          );
        },
      ),
    );
  }

  /// Empty state for a search that matched nothing, with the way back out.
  Widget _noMatch() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(
        children: [
          Image.asset(Assets.noData, width: 90),
          const SizedBox(height: 10),
          Text(
            context.tr('search.noMatch'),
            style: const TextStyle(color: Color(0xFF666666), fontSize: 15),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.primary,
              side: const BorderSide(color: AppColors.primary),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)),
            ),
            onPressed: _clearSearch,
            child: Text(context.tr('search.showAll')),
          ),
        ],
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
