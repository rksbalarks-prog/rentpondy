import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../services/area_index.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/property_card.dart';
import '../widgets/search_field_card.dart';
import 'property_detail_screen.dart';

/// The two forms behind the SEARCH menu's "Search Property", ported from the
/// `#filterPopup` / `#advancedFilterPopup` modals in AllProperty.jsx.
///
/// Simple carries Rent ID, the price range, mode/type/rent type and the Basic
/// Property Info block; Advanced adds bathrooms, western toilet, car parking,
/// lift, facing, wheelchair access, posted-by and a phone number. Each form
/// links to the other, exactly like "GO TO ADVANCED SEARCH" / "GO TO SIMPLE
/// SEARCH" on the web.
///
/// The web applies the filters to the home feed in place. On a phone that
/// leaves the user staring at a list with no sign of what was applied, so
/// SEARCH here opens a results page instead — same predicate, same data.
enum PropertySearchMode { simple, advanced }

/// The fields both forms share, plus everything Advanced adds. Keys match the
/// backend document so the predicate can read them straight off `raw`.
class PropertySearchFilters {
  final Map<String, String> values = {};

  String? operator [](String key) {
    final v = values[key];
    return (v == null || v.trim().isEmpty) ? null : v.trim();
  }

  void operator []=(String key, String? value) {
    if (value == null || value.trim().isEmpty) {
      values.remove(key);
    } else {
      values[key] = value.trim();
    }
  }

  bool get isEmpty => values.isEmpty;

  /// A short "Mode · Type · Area" line for the results header.
  String get summary {
    final parts = values.entries
        .where((e) => e.value.trim().isNotEmpty)
        .map((e) => e.value.trim())
        .toList();
    return parts.isEmpty ? 'All properties' : parts.join(' · ');
  }

  PropertySearchFilters copy() {
    final c = PropertySearchFilters();
    c.values.addAll(values);
    return c;
  }

  /// The web's `filteredProperties` predicate, field for field:
  /// Rent ID is a substring match, the price range compares against
  /// `rentalAmount`, `streetName` is a substring, and everything else is an
  /// exact case-insensitive match.
  bool matches(Property p) {
    String field(String key) {
      switch (key) {
        case 'area':
          return (p.area ?? '').trim();
        case 'state':
          return (p.state ?? '').trim();
        case 'propertyMode':
          return (p.propertyMode ?? '').trim();
        case 'propertyType':
          return (p.propertyType ?? '').trim();
        case 'bedrooms':
          return (p.bedrooms ?? '').trim();
        case 'floorNo':
          return (p.floorNo ?? '').trim();
        default:
          return (p.rawStr(key) ?? '').trim();
      }
    }

    for (final entry in values.entries) {
      final key = entry.key;
      final want = entry.value.trim();
      if (want.isEmpty) continue;

      if (key == 'id') {
        if (!p.rentId.toLowerCase().contains(want.toLowerCase())) return false;
        continue;
      }
      if (key == 'minPrice') {
        final min = num.tryParse(want);
        if (min != null && (p.price ?? 0) < min) return false;
        continue;
      }
      if (key == 'maxPrice') {
        final max = num.tryParse(want);
        if (max != null && (p.price ?? 0) > max) return false;
        continue;
      }
      if (key == 'streetName') {
        if (!field(key).toLowerCase().contains(want.toLowerCase())) return false;
        continue;
      }
      if (field(key).toLowerCase() != want.toLowerCase()) return false;
    }
    return true;
  }
}

class PropertySearchScreen extends StatefulWidget {
  const PropertySearchScreen({
    super.key,
    this.mode = PropertySearchMode.simple,
    this.initial,
  });

  final PropertySearchMode mode;

  /// Carried across when switching between Simple and Advanced, so nothing the
  /// user already picked is lost.
  final PropertySearchFilters? initial;

  @override
  State<PropertySearchScreen> createState() => _PropertySearchScreenState();
}

class _PropertySearchScreenState extends State<PropertySearchScreen> {
  late final ApiService _api;
  late PropertySearchFilters _filters;

  Map<String, List<String>> _config = const {};
  final Map<String, TextEditingController> _text = {};
  String? _suggestField;
  int _clearVersion = 0;

  /// Rent ID, State, Area, Pincode and Phone Number are typed, not picked.
  static const _textFields = ['id', 'state', 'area', 'pinCode', 'phoneNumber'];

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _filters = widget.initial?.copy() ?? PropertySearchFilters();
    for (final f in _textFields) {
      _text[f] = TextEditingController(text: _filters[f] ?? '');
    }
    _loadConfig();
    AreaIndex.ensureLoaded();
  }

  @override
  void dispose() {
    for (final c in _text.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _loadConfig() async {
    final config = await _api.fetchFieldConfig();
    if (!mounted) return;
    setState(() => _config = config);
  }

  String get _base => context.read<AppState>().activeBase;

  bool get _advanced => widget.mode == PropertySearchMode.advanced;

  void _set(String key, String? value) =>
      setState(() => _filters[key] = value);

  void _clearAll() {
    setState(() {
      _filters = PropertySearchFilters();
      for (final c in _text.values) {
        c.clear();
      }
      _suggestField = null;
      _clearVersion++;
    });
  }

  void _search() {
    Navigator.of(context).pushReplacement(MaterialPageRoute(
      builder: (_) => PropertySearchResultsScreen(filters: _filters.copy()),
    ));
  }

  /// Swap between the two forms, keeping what has been filled in.
  void _switchMode() {
    Navigator.of(context).pushReplacement(MaterialPageRoute(
      builder: (_) => PropertySearchScreen(
        mode: _advanced
            ? PropertySearchMode.simple
            : PropertySearchMode.advanced,
        initial: _filters.copy(),
      ),
    ));
  }

  /// "HOME" — back to the feed, however deep the user has gone.
  void _home() => Navigator.of(context).popUntil((r) => r.isFirst);

  Widget _dropdown(String field, String label) => SearchDropdownField(
        field: field,
        label: label,
        options: _config[field] ?? const [],
        value: _filters[field],
        onChanged: (v) => _set(field, v),
      );

  Widget _input(String field, String hint, {TextInputType? keyboard}) =>
      SearchTextField(
        key: ValueKey('$field-$_clearVersion'),
        field: field,
        hint: hint,
        controller: _text[field]!,
        keyboard: keyboard,
        onChanged: (v) => _set(field, v),
      );

  /// Area and Pincode both suggest from [AreaIndex]; picking an Area fills in
  /// its Pincode, as `handleAreaSelect` does on the web.
  Widget _auto(String field, String hint) {
    final query = _text[field]!.text;
    final show = _suggestField == field && query.trim().isNotEmpty;
    final suggestions = !show
        ? const <String>[]
        : (field == 'area'
                ? AreaIndex.areasMatching(_base, query)
                : AreaIndex.pincodesMatching(_base, query))
            .take(8)
            .toList();

    return SearchAutocompleteField(
      key: ValueKey('$field-$_clearVersion'),
      field: field,
      hint: hint,
      controller: _text[field]!,
      keyboard: field == 'pinCode' ? TextInputType.number : null,
      suggestions: suggestions,
      onChanged: (v) => setState(() {
        _filters[field] = v;
        _suggestField = field;
      }),
      onSelected: (v) => setState(() {
        _text[field]!.text = v;
        _filters[field] = v;
        if (field == 'area') {
          final pin = AreaIndex.pincodeOfArea(_base, v);
          if (pin != null) {
            _text['pinCode']!.text = pin;
            _filters['pinCode'] = pin;
          }
        }
        _suggestField = null;
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        title: Text(_advanced ? 'Advanced Search' : 'Search Property',
            style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.black87)),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.black54),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
      body: GestureDetector(
        onTap: () => setState(() => _suggestField = null),
        behavior: HitTestBehavior.opaque,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(14, 8, 14, 24),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          children: [
            _input('id', 'SEARCH BY RENT ID', keyboard: TextInputType.number),
            _dropdown('minPrice', 'Select minPrice'),
            _dropdown('maxPrice', 'Select maxPrice'),
            _dropdown('propertyMode', 'Select Property Mode'),
            _dropdown('propertyType', 'Select Property Type'),
            _dropdown('rentType', 'Select rent Type'),
            const SearchSectionHeading('Basic Property Info'),
            _dropdown('bedrooms', 'Select bedrooms'),
            _dropdown('floorNo', 'Select floorNo'),
            if (_advanced) ...[
              _dropdown('attachedBathrooms', 'Select attachedBathrooms'),
              _dropdown('western', 'Select western'),
              _dropdown('carParking', 'Select carParking'),
              _dropdown('lift', 'Select lift'),
              _dropdown('facing', 'Select facing'),
              _dropdown('wheelChairAvailable', 'Select wheelChairAvailable'),
              _dropdown('postedBy', 'Select postedBy'),
            ],
            _input('state', 'State'),
            _auto('area', 'Area'),
            _auto('pinCode', 'Pincode'),
            if (_advanced) ...[
              const SearchSectionHeading('Mobile Number'),
              _input('phoneNumber', 'Phone Number',
                  keyboard: TextInputType.phone),
            ],
            const SizedBox(height: 6),
            Row(
              children: [
                Expanded(
                  child: SearchActionButton(
                    label: 'CLEAR',
                    color: const Color(0xFFD32F2F),
                    onPressed: _clearAll,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: SearchActionButton(
                    label: 'SEARCH',
                    color: const Color(0xFF4CAF50),
                    onPressed: _search,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SearchActionButton(
              label:
                  _advanced ? 'GO TO SIMPLE SEARCH' : 'GO TO ADVANCED SEARCH',
              color: _advanced ? AppColors.primary : const Color(0xFF666666),
              onPressed: _switchMode,
            ),
            const SizedBox(height: 12),
            SearchActionButton(
              label: 'HOME',
              color: const Color(0xFF666666),
              onPressed: _home,
            ),
          ],
        ),
      ),
    );
  }
}

/// What SEARCH lands on: the active feed narrowed by [filters].
class PropertySearchResultsScreen extends StatefulWidget {
  const PropertySearchResultsScreen({super.key, required this.filters});

  final PropertySearchFilters filters;

  @override
  State<PropertySearchResultsScreen> createState() =>
      _PropertySearchResultsScreenState();
}

class _PropertySearchResultsScreenState
    extends State<PropertySearchResultsScreen> {
  late final ApiService _api;
  bool _loading = true;
  String? _error;
  List<Property> _results = const [];

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final all = await _api.fetchActiveProperties();
      if (!mounted) return;
      AreaIndex.learnFrom(context.read<AppState>().activeBase, all);
      setState(() {
        _results = all.where(widget.filters.matches).toList();
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

  void _openDetail(Property p) {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => PropertyDetailScreen(rentId: p.rentId, initial: p),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Search Results',
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87)),
            Text(
              _loading
                  ? widget.filters.summary
                  : '${_results.length} match${_results.length == 1 ? '' : 'es'} · ${widget.filters.summary}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textMuted),
            ),
          ],
        ),
      ),
      body: _body(),
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
            const Icon(Icons.wifi_off, size: 40, color: AppColors.textMuted),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(_error!, textAlign: TextAlign.center),
            ),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }
    if (_results.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 10),
            const Text('No Match Found',
                style: TextStyle(color: Color(0xFF666666), fontSize: 16)),
            const SizedBox(height: 12),
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                shape:
                    RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Change filters'),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: _results.length,
      itemBuilder: (_, i) => PropertyCard(
        property: _results[i],
        onTap: () => _openDetail(_results[i]),
      ),
    );
  }
}
