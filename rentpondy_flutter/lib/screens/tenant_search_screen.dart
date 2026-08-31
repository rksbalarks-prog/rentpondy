import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../models/tenant_request.dart';
import '../services/api_service.dart';
import '../services/area_index.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/search_field_card.dart';
import 'tenant_list_screen.dart';

/// "Tenant Search" from the SEARCH menu — a port of the Tenant Assistance
/// Search form in FormComponent.jsx: ID, the rental range, mode/type/bedrooms/
/// floor/state as dropdowns, then City and Area typed, and one full-width
/// SEARCH TENANT LIST button.
///
/// Results come from `GET /get-buyerAssistances-rent`, filtered client-side —
/// the same request and the same predicate the web runs.
/// The Tenant Assistance Search criteria and the predicate they run.
///
/// One deviation from the web, deliberate: FormComponent.jsx compares Min/Max
/// Rental against `item.rentalAmount`, a field these records do not carry —
/// `Number(undefined)` is NaN, so both comparisons are always false and the two
/// rental filters never actually filter anything out. Here they test the
/// tenant's own budget instead: a Min Rental of 5000 keeps tenants who would
/// pay at least that much, and a Max Rental of 10000 keeps those whose budget
/// starts at or below it.
class TenantSearchFilters {
  final Map<String, String> values = {};

  /// Compared exactly, case-insensitively — the web's `!==` checks.
  static const exactFields = [
    'propertyMode',
    'propertyType',
    'bedrooms',
    'floorNo',
    'city',
    'state',
    'area',
  ];

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

  bool matches(TenantRequest t) {
    final id = this['id'];
    if (id != null &&
        !(t.rawStr('Ra_Id') ?? '').toLowerCase().contains(id.toLowerCase())) {
      return false;
    }
    for (final key in exactFields) {
      final want = this[key];
      if (want == null) continue;
      final have = (t.rawStr(key) ?? '').trim();
      if (have.toLowerCase() != want.toLowerCase()) return false;
    }
    final min = num.tryParse(this['minPrice'] ?? '');
    if (min != null && (t.maxPrice ?? 0) < min) return false;
    final max = num.tryParse(this['maxPrice'] ?? '');
    if (max != null && (t.minPrice ?? 0) > max) return false;
    return true;
  }
}

class TenantSearchScreen extends StatefulWidget {
  const TenantSearchScreen({super.key});

  @override
  State<TenantSearchScreen> createState() => _TenantSearchScreenState();
}

class _TenantSearchScreenState extends State<TenantSearchScreen> {
  late final ApiService _api;

  Map<String, List<String>> _config = const {};
  final TenantSearchFilters _filters = TenantSearchFilters();
  final Map<String, TextEditingController> _text = {
    'id': TextEditingController(),
    'city': TextEditingController(),
    'area': TextEditingController(),
  };
  bool _showAreaSuggestions = false;
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
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

  void _set(String key, String? value) =>
      setState(() => _filters[key] = value);

  Future<void> _submit() async {
    if (_busy) return;
    setState(() {
      _busy = true;
      _error = null;
      _showAreaSuggestions = false;
    });
    FocusScope.of(context).unfocus();
    try {
      final all = await _api.fetchTenantRequests();
      final results = all.where(_filters.matches).toList();
      if (!mounted) return;
      setState(() => _busy = false);
      if (results.isEmpty) {
        setState(() => _error = 'No matching tenants found.');
        return;
      }
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => TenantListScreen(
          title: 'Tenant Search',
          results: results,
        ),
      ));
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _busy = false;
        _error = 'Error fetching data.';
      });
    }
  }

  Widget _dropdown(String field, String label) => SearchDropdownField(
        field: field,
        label: label,
        options: _config[field] ?? const [],
        value: _filters[field],
        onChanged: (v) => _set(field, v),
      );

  Widget _input(String field, String hint, {TextInputType? keyboard}) =>
      SearchTextField(
        field: field,
        hint: hint,
        controller: _text[field]!,
        keyboard: keyboard,
        onChanged: (v) => _set(field, v),
      );

  @override
  Widget build(BuildContext context) {
    final query = _text['area']!.text;
    final suggestions = _showAreaSuggestions && query.trim().isNotEmpty
        ? AreaIndex.areasMatching(_base, query).take(8).toList()
        : const <String>[];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: Colors.black87),
        titleSpacing: 0,
        title: const Text('Tenant Assistance Search',
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.black87)),
      ),
      body: GestureDetector(
        onTap: () => setState(() => _showAreaSuggestions = false),
        behavior: HitTestBehavior.opaque,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(14, 8, 14, 24),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          children: [
            _input('id', 'ID', keyboard: TextInputType.number),
            _dropdown('minPrice', 'Select Min Rental'),
            _dropdown('maxPrice', 'Select Max Rental'),
            _dropdown('propertyMode', 'Select Property Mode'),
            _dropdown('propertyType', 'Select Property Type'),
            _dropdown('bedrooms', 'Select Bedrooms'),
            _dropdown('floorNo', 'Select Floor No'),
            _dropdown('state', 'Select state'),
            _input('city', 'City'),
            SearchAutocompleteField(
              field: 'area',
              hint: 'area',
              controller: _text['area']!,
              suggestions: suggestions,
              onChanged: (v) => setState(() {
                _set('area', v);
                _showAreaSuggestions = true;
              }),
              onSelected: (v) => setState(() {
                _text['area']!.text = v;
                _set('area', v);
                _showAreaSuggestions = false;
              }),
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDECEA),
                    borderRadius: BorderRadius.circular(6),
                    border: const Border.fromBorderSide(
                        BorderSide(color: Color(0xFFF5C2C0))),
                  ),
                  child: Text(_error!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Color(0xFFB3261E))),
                ),
              ),
            const SizedBox(height: 4),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6)),
                ),
                onPressed: _busy ? null : _submit,
                child: _busy
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Text('SEARCH TENANT LIST',
                        style: TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 15)),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Image.asset(Assets.tenantAssistHero,
                  width: 140, fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const SizedBox.shrink()),
            ),
          ],
        ),
      ),
    );
  }
}
