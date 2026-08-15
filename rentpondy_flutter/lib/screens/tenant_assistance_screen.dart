import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../services/area_pincode.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/option_picker_dialog.dart';
import 'buyer_plan_screen.dart';

/// "Tenant Assistance" — a pixel-faithful port of BuyerAssistance.jsx: a single
/// long scrolling form (NOT a wizard) where a tenant posts what they're looking
/// for. Sticky #EFEFEF header ("RENTAL ASSIATANT"), the tenant_assist hero, the
/// live "Required Fields (n/11)" checklist card, the input-card fields with the
/// #4F4B7E icon divider + green check, and the confirm → payment modals.
///
///   POST /add-buyerAssistance-rent          (create)
///   PUT  /update-buyerAssistance-rent/:id   (update)
/// Dropdown options come from the admin-editable `/fetch` config.
class TenantAssistanceScreen extends StatefulWidget {
  const TenantAssistanceScreen({super.key, this.prefill});

  /// Optional seed values from the AI assistant's "Add Tenant Assistance"
  /// hand-off (city / area / min-max price / bedrooms / type / mode / rentType).
  final Map<String, dynamic>? prefill;

  @override
  State<TenantAssistanceScreen> createState() => _TenantAssistanceScreenState();
}

// Web palette.
const _kHeaderBg = Color(0xFFEFEFEF);
const _kChevron = Color(0xFFCDC9F9);
const _kCardShadow = Color(0x1A2668BE); // rgba(38,104,190,0.1)
const _kReqCardBg = Color(0xFFF8F9FF);
const _kCheck = Color(0xFF4CAF50);
const _kErr = Color(0xFFD32F2F);
const _kConfirm = Color(0xFF6CBAAF);

class _TenantAssistanceScreenState extends State<TenantAssistanceScreen> {
  /// The 11 fields the web validates + shows in the checklist card.
  static const _required = <(String, String)>[
    ('state', 'State'),
    ('propertyType', 'Property Type'),
    ('propertyMode', 'Property Mode'),
    ('minPrice', 'Min Amount'),
    ('maxPrice', 'Max Amount'),
    ('phoneNumber', 'Phone'),
    ('rentType', 'Rent Type'),
    ('bedrooms', 'Bedrooms'),
    ('floorNo', 'Floor No'),
    ('area', 'Area'),
    ('pinCode', 'Pin Code'),
  ];

  late final ApiService _api;
  late final AppState _app;

  bool _loading = true;
  bool _submitting = false;
  String? _error;
  String? _message; // success alert
  Map<String, List<String>> _config = {};

  // City / area autocomplete.
  List<String> _cities = [];
  List<String> _areas = [];
  String? _suggestField;
  int _fillVersion = 0;

  final Map<String, dynamic> _form = {'alternatePhoneCountryCode': '+91'};

  @override
  void initState() {
    super.initState();
    _app = context.read<AppState>();
    _api = _app.api;
    _form['phoneNumber'] = _app.phoneDigits;
    _form['city'] = _app.activeBase == 'CH' ? 'Chennai' : 'Pondicherry';
    // Seed from the assistant's "no matching property" hand-off.
    final pf = widget.prefill;
    if (pf != null) {
      for (final k in const [
        'propertyType',
        'propertyMode',
        'minPrice',
        'maxPrice',
        'rentType',
        'bedrooms',
        'area',
        'city',
      ]) {
        final v = pf[k];
        if (v != null && '$v'.trim().isNotEmpty) _form[k] = '$v';
      }
    }
    _init();
  }

  Future<void> _init() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        _api.fetchFieldConfig(),
        _api.fetchCities(),
        _api.fetchAreas(),
        AreaPincode.ensureLoaded(),
      ]);
      if (!mounted) return;
      setState(() {
        _config = results[0] as Map<String, List<String>>;
        _cities = results[1] as List<String>;
        _areas = results[2] as List<String>;
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

  bool _filled(String field) {
    final v = _form[field];
    return v != null && '$v'.trim().isNotEmpty;
  }

  int get _filledRequired => _required.where((r) => _filled(r.$1)).length;

  void _toast(String msg, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? Colors.red : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  // ---- Submit flow (validate → confirm → submit → payment) ----
  Future<void> _onSubmit() async {
    final missing = _required.where((r) => !_filled(r.$1)).toList();
    if (missing.isNotEmpty) {
      _showValidationModal(missing.map((r) => r.$2).toList());
      return;
    }
    final min = num.tryParse('${_form['minPrice'] ?? ''}');
    final max = num.tryParse('${_form['maxPrice'] ?? ''}');
    if (min != null && max != null && max < min) {
      _showPriceModal();
      return;
    }
    final go = await _showConfirmModal();
    if (go != true) return;
    await _submit();
  }

  Future<void> _submit() async {
    setState(() => _submitting = true);
    try {
      _form['raName'] ??= _form['tenantName'] ?? 'User';
      final record = await _api.submitTenantAssistance(_form);
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _message = 'Tenant Assistance request added successfully!';
      });
      // The request's Ra_Id is what the plan payment is tied to.
      final raId = int.tryParse('${record?['Ra_Id'] ?? ''}');
      final pay = await _showPaymentModal();
      if (!mounted) return;
      if (pay == true && raId != null) {
        // "Yes, Continue" → buy a tenant-assistance plan (PayU).
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => BuyerPlanScreen(raId: raId)),
        );
      } else {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _submitting = false);
      _toast(e.toString(), error: true);
    }
  }

  // ------------------------------------------------------------------
  // Build
  // ------------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        bottom: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 450),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _header(),
                Expanded(child: _bodyForState()),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _bodyForState() {
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
            OutlinedButton(
                onPressed: _init, child: Text(context.tr('common.retry'))),
          ],
        ),
      );
    }
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Image.asset(Assets.tenantAssistHero,
            width: double.infinity, fit: BoxFit.cover),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              _topButtons(),
              const SizedBox(height: 6),
              const Text('Rent Budget',
                  style: TextStyle(
                      color: AppColors.primary,
                      fontSize: 15,
                      fontWeight: FontWeight.bold)),
              if (_message != null) ...[
                const SizedBox(height: 6),
                Text(_message!,
                    style: const TextStyle(
                        color: Colors.green, fontWeight: FontWeight.bold)),
              ],
              const SizedBox(height: 10),
              _requiredCard(),
              const SizedBox(height: 10),
              _budgetRow(),
              _priceError(),
              _textField('tenantName'),
              _phoneReadonly(),
              _phoneField('alternatePhone', 'alternatePhoneCountryCode'),
              _dropdown('propertyMode', required: true),
              _dropdown('propertyType', required: true),
              _dropdown('rentType', required: true),
              _dropdown('bedrooms', required: true),
              _dropdown('facing'),
              _textField('totalArea', keyboard: TextInputType.number),
              _dropdown('areaUnit'),
              _dropdown('floorNo', required: true),
              _dropdown('requirementType'),
              _dropdown('state', required: true),
              _autoField('city', _cities),
              _autoField('area', _areas, required: true, fillPincode: true),
              _textField('pinCode',
                  required: true, keyboard: TextInputType.number, maxLength: 6),
              _h6('Description'),
              _descriptionField(),
              _h6('My Family Info'),
              _dropdown('familyMembers'),
              _dropdown('foodHabit'),
              _dropdown('jobType'),
              _dropdown('petAllowed'),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _onSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(
                      _submitting ? 'Submitting…' : 'ADD PROPERTY ASSISTANCE',
                      style: const TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ],
    );
  }

  Widget _header() {
    return Container(
      color: _kHeaderBg,
      padding: const EdgeInsets.all(8),
      child: Row(
        children: [
          InkResponse(
            onTap: () => Navigator.of(context).maybePop(),
            child: const Padding(
              padding: EdgeInsets.symmetric(horizontal: 6),
              child: Icon(Icons.chevron_left, color: _kChevron, size: 28),
            ),
          ),
          const Text('RENTAL ASSIATANT',
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black)),
        ],
      ),
    );
  }

  Widget _topButtons() {
    return Row(
      children: [
        Expanded(
          child: Opacity(
            opacity: 0.6,
            child: ElevatedButton(
              onPressed: null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                disabledBackgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5)),
              ),
              child: const Text('Add Tenant list',
                  style: TextStyle(color: Colors.white)),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: ElevatedButton(
            onPressed: () =>
                pushRoute(context, '/buyer-lists', context.trRead('menu.tenantList')),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5)),
            ),
            child: const Text('view Tenant List'),
          ),
        ),
      ],
    );
  }

  // ---- Required Fields (n/11) card ----
  Widget _requiredCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _kReqCardBg,
        border: Border.all(color: AppColors.primary, width: 2),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('📋 Required Fields ($_filledRequired/11)',
              style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 14,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 5,
            mainAxisSpacing: 6,
            crossAxisSpacing: 10,
            children: [
              for (final r in _required)
                Row(
                  children: [
                    Icon(_filled(r.$1) ? Icons.check : Icons.close,
                        size: 16, color: _filled(r.$1) ? _kCheck : _kErr),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(r.$2,
                          style: TextStyle(
                              fontSize: 13,
                              color: _filled(r.$1)
                                  ? _kCheck
                                  : const Color(0xFF999999))),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _budgetRow() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(child: _dropdown('minPrice', required: true)),
        const SizedBox(width: 10),
        Expanded(child: _dropdown('maxPrice', required: true)),
      ],
    );
  }

  Widget _priceError() {
    final min = num.tryParse('${_form['minPrice'] ?? ''}');
    final max = num.tryParse('${_form['maxPrice'] ?? ''}');
    if (min == null || max == null || max >= min) return const SizedBox.shrink();
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: const BoxDecoration(
        color: Color(0xFFFFEBEE),
        border: Border(left: BorderSide(color: _kErr, width: 3)),
        borderRadius: BorderRadius.all(Radius.circular(4)),
      ),
      child: const Text('Max amount cannot be less than min amount.',
          style: TextStyle(color: _kErr, fontSize: 12)),
    );
  }

  Widget _h6(String text) => Padding(
        padding: const EdgeInsets.only(top: 6, bottom: 10),
        child: Text(text,
            style: const TextStyle(
                color: AppColors.primary, fontWeight: FontWeight.bold)),
      );

  // ------------------------------------------------------------------
  // Input-card fields
  // ------------------------------------------------------------------
  Widget _card(
      {required Widget icon, required Widget child, bool filled = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        boxShadow: const [
          BoxShadow(color: _kCardShadow, blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            height: 46,
            decoration: const BoxDecoration(
              border: Border(right: BorderSide(color: AppColors.primary)),
            ),
            child: Center(child: SizedBox(width: 22, height: 22, child: icon)),
          ),
          Expanded(child: child),
          if (filled)
            const Padding(
              padding: EdgeInsets.only(right: 8),
              child: Icon(Icons.check_circle, color: _kCheck, size: 18),
            ),
        ],
      ),
    );
  }

  List<String> _options(String field) {
    var opts = _config[field] ?? const [];
    if (field == 'state' && opts.isNotEmpty) {
      // "Puducherry" is sorted to the top on the web.
      final sorted = [...opts];
      sorted.sort((a, b) {
        final ap = a.toLowerCase().contains('puduch') ? 0 : 1;
        final bp = b.toLowerCase().contains('puduch') ? 0 : 1;
        return ap.compareTo(bp);
      });
      return sorted;
    }
    return opts;
  }

  Widget _dropdown(String field, {bool required = false}) {
    final options = _options(field);
    if (options.isEmpty) {
      return _textField(field,
          required: required,
          keyboard: (field == 'minPrice' || field == 'maxPrice')
              ? TextInputType.number
              : null);
    }
    final value = _form[field]?.toString();
    final filled = value != null && value.isNotEmpty;
    return _card(
      icon: _fieldIcon(field),
      filled: filled,
      child: InkWell(
        onTap: () => _openPicker(field, options),
        child: Container(
          height: 46,
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              Expanded(
                child: Text(filled ? value : _placeholder(field, required),
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                        fontSize: 13,
                        color: filled ? Colors.black87 : Colors.grey)),
              ),
              const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  Widget _textField(
    String field, {
    bool required = false,
    TextInputType? keyboard,
    int? maxLength,
  }) {
    final filled = _filled(field);
    return _card(
      icon: _fieldIcon(field),
      filled: filled,
      child: TextFormField(
        key: ValueKey('$field-$_fillVersion'),
        initialValue: _form[field]?.toString(),
        keyboardType: keyboard,
        maxLength: maxLength,
        inputFormatters:
            keyboard == TextInputType.number || keyboard == TextInputType.phone
                ? [FilteringTextInputFormatter.digitsOnly]
                : null,
        style: const TextStyle(fontSize: 14, color: Colors.black87),
        decoration: InputDecoration(
          hintText: _placeholder(field, required),
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
          isDense: true,
          counterText: '',
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        ),
        onChanged: (v) => setState(() => _form[field] = v),
      ),
    );
  }

  /// A text field with a live suggestions dropdown (city / area) — the web's
  /// `/cities` + `/areas` autocomplete. Selecting an Area also fills Pin Code
  /// from the bundled area→pincode map.
  Widget _autoField(
    String field,
    List<String> source, {
    bool required = false,
    bool fillPincode = false,
  }) {
    final query = '${_form[field] ?? ''}';
    final show = _suggestField == field && query.trim().isNotEmpty;
    final matches = show
        ? source
            .where((s) => s.toLowerCase().contains(query.toLowerCase()))
            .take(8)
            .toList()
        : const <String>[];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _card(
          icon: _fieldIcon(field),
          filled: _filled(field),
          child: TextFormField(
            key: ValueKey('$field-$_fillVersion'),
            initialValue: _form[field]?.toString(),
            style: const TextStyle(fontSize: 14, color: Colors.black87),
            decoration: InputDecoration(
              hintText: _placeholder(field, required),
              hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
              isDense: true,
              border: InputBorder.none,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            onTap: () => setState(() => _suggestField = field),
            onChanged: (v) => setState(() {
              _form[field] = v;
              _suggestField = field;
            }),
          ),
        ),
        if (matches.isNotEmpty)
          // Transform (not a negative margin — Container forbids that) pulls
          // the suggestion list up to sit snug under the input card.
          Transform.translate(
            offset: const Offset(0, -8),
            child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(6),
              boxShadow: const [
                BoxShadow(color: _kCardShadow, blurRadius: 8),
              ],
            ),
            child: Column(
              children: [
                for (final m in matches)
                  InkWell(
                    onTap: () => _selectSuggestion(field, m, fillPincode),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                      decoration: const BoxDecoration(
                        border: Border(
                            bottom: BorderSide(color: Color(0xFFEEEEEE))),
                      ),
                      child: Text(m,
                          style: const TextStyle(color: Colors.black87)),
                    ),
                  ),
              ],
            ),
          ),
          ),
      ],
    );
  }

  void _selectSuggestion(String field, String value, bool fillPincode) {
    setState(() {
      _form[field] = value;
      _suggestField = null;
      if (fillPincode) {
        final pin = AreaPincode.lookup(_app.activeBase, value);
        if (pin != null) _form['pinCode'] = pin;
      }
      _fillVersion++; // reflect the selected value + filled pincode
    });
  }

  Widget _phoneReadonly() {
    return _card(
      icon: _fieldIcon('phoneNumber'),
      filled: true,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Row(
          children: [
            const Text('+91  ',
                style: TextStyle(
                    color: AppColors.primary, fontWeight: FontWeight.w600)),
            Text('${_form['phoneNumber'] ?? ''}',
                style: const TextStyle(color: Colors.black87, fontSize: 14)),
          ],
        ),
      ),
    );
  }

  Widget _phoneField(String field, String codeKey) {
    return _card(
      icon: _fieldIcon(field),
      filled: _filled(field),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text(_form[codeKey]?.toString() ?? '+91',
                style: const TextStyle(
                    color: AppColors.primary, fontWeight: FontWeight.w600)),
          ),
          Expanded(
            child: TextFormField(
              initialValue: _form[field]?.toString(),
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
              ],
              style: const TextStyle(fontSize: 14, color: Colors.black87),
              decoration: InputDecoration(
                hintText: _placeholder(field, false),
                hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                isDense: true,
                border: InputBorder.none,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 4, vertical: 12),
              ),
              onChanged: (v) => setState(() => _form[field] = v),
            ),
          ),
        ],
      ),
    );
  }

  Widget _descriptionField() {
    final len = '${_form['description'] ?? ''}'.length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        _card(
          icon: _fieldIcon('description'),
          child: TextFormField(
            initialValue: _form['description']?.toString(),
            maxLines: 3,
            maxLength: 200,
            style: const TextStyle(fontSize: 14, color: Colors.black87),
            decoration: const InputDecoration(
              hintText: 'Enter your Short Requirement',
              hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
              isDense: true,
              counterText: '',
              border: InputBorder.none,
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
            onChanged: (v) => setState(() => _form['description'] = v),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 4, bottom: 8),
          child: Text('$len/200',
              style: TextStyle(
                  fontSize: 12,
                  color: len >= 200 ? _kErr : Colors.grey)),
        ),
      ],
    );
  }

  String _placeholder(String field, bool required) =>
      '${_label(field)}${required ? ' *' : ''}';

  /// Display order of all fields — mirrors the web so the picker can auto-jump
  /// to the next dropdown after a selection.
  static const _fieldOrder = [
    'minPrice', 'maxPrice', 'tenantName', 'phoneNumber', 'alternatePhone',
    'propertyMode', 'propertyType', 'rentType', 'bedrooms', 'facing',
    'totalArea', 'areaUnit', 'floorNo', 'requirementType', 'state', 'city',
    'area', 'pinCode', 'description', 'familyMembers', 'foodHabit', 'jobType',
    'petAllowed',
  ];

  bool _isDropdown(String field) => _options(field).isNotEmpty;

  String? _nextField(String current) {
    final i = _fieldOrder.indexOf(current);
    return (i >= 0 && i < _fieldOrder.length - 1) ? _fieldOrder[i + 1] : null;
  }

  String? _prevDropdown(int idx) {
    for (var i = idx - 1; i >= 0; i--) {
      if (_isDropdown(_fieldOrder[i])) return _fieldOrder[i];
    }
    return null;
  }

  /// Opens the picker for [field]; selecting jumps to the next dropdown so the
  /// user flows through them, stopping when the next field is a text input.
  Future<void> _openPicker(String field, List<String> options) async {
    var current = field;
    while (mounted) {
      final opts = _options(current);
      if (opts.isEmpty) break;
      final idx = _fieldOrder.indexOf(current);
      final result = await showDialog<PickerResult>(
        context: context,
        barrierColor: Colors.black.withValues(alpha: 0.5),
        builder: (_) => OptionPickerDialog(
          label: _label(current),
          options: opts,
          showPrev: _prevDropdown(idx) != null,
          showSkip: idx >= 0 && idx < _fieldOrder.length - 1,
        ),
      );
      if (!mounted || result == null || result.action == PickerAction.close) {
        break;
      }
      if (result.action == PickerAction.select) {
        setState(() => _form[current] = result.value);
        final next = _nextField(current);
        if (next == null || !_isDropdown(next)) break;
        current = next;
      } else if (result.action == PickerAction.skip) {
        final next = _nextField(current);
        if (next == null || !_isDropdown(next)) break;
        current = next;
      } else {
        final prev = _prevDropdown(_fieldOrder.indexOf(current));
        if (prev == null) break;
        current = prev;
      }
    }
  }

  // ------------------------------------------------------------------
  // Modals
  // ------------------------------------------------------------------
  void _showValidationModal(List<String> missing) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(32),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('⚠️ Please fill mandatory fields',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: AppColors.primary,
                      fontSize: 18,
                      fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              for (final m in missing)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text('• $m', style: const TextStyle(color: _kErr)),
                ),
              const SizedBox(height: 16),
              ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(context.trRead('common.ok'))),
            ],
          ),
        ),
      ),
    );
  }

  void _showPriceModal() {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(32),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('⚠️ Invalid Price Range',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: _kErr, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              const Text('Max amount cannot be less than min amount.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF666666))),
              const SizedBox(height: 16),
              ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(context.trRead('common.ok'))),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool?> _showConfirmModal() {
    return showDialog<bool>(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(32),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Confirm Request',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              const Text(
                  'Do you want to create this Rental Assistance request?',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF666666))),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context, false),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFCCCCCC),
                          foregroundColor: const Color(0xFF333333)),
                      child: Text(context.trRead('common.no')),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context, true),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: _kConfirm,
                          foregroundColor: Colors.white),
                      child: Text(context.trRead('common.yes')),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool?> _showPaymentModal() {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(32),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('💳 Continue Payment Process?',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: const Text('Skip for Now'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context, true),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: _kConfirm,
                          foregroundColor: Colors.white),
                      child: const Text('Yes, Continue'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ------------------------------------------------------------------
  // Field icons + labels
  // ------------------------------------------------------------------
  Widget _fieldIcon(String field) {
    const png = {
      'minPrice': 'Price Mini-01.png',
      'maxPrice': 'Price maxi-01.png',
      'tenantName': 'name.PNG',
      'propertyMode': 'prop_mode.PNG',
      'propertyType': 'prop_type.PNG',
      'rentType': 'rent_type.PNG',
      'bedrooms': 'bed.PNG',
      'facing': 'facing.png',
      'totalArea': 'total_area.png',
      'areaUnit': 'area_unit.png',
      'floorNo': 'floor.PNG',
      'state': 'state.png',
      'city': 'city.PNG',
      'area': 'area.png',
      'familyMembers': 'member.PNG',
      'foodHabit': 'food.png',
      'jobType': 'job.PNG',
      'petAllowed': 'pet.PNG',
    };
    const mat = {
      'phoneNumber': Icons.phone,
      'alternatePhone': Icons.phone_android,
      'requirementType': Icons.tune,
      'pinCode': Icons.pin_drop,
      'description': Icons.description,
    };
    if (png.containsKey(field)) {
      return Image.asset('${Assets.detailIconBase}${png[field]}',
          width: 22, height: 22);
    }
    return Icon(mat[field] ?? Icons.edit_note, color: AppColors.primary, size: 22);
  }

  static String _label(String field) {
    const labels = {
      'minPrice': 'Min Rental Amount',
      'maxPrice': 'Max Rental Amount',
      'tenantName': 'Tenant Name',
      'propertyMode': 'Property Mode',
      'propertyType': 'Property Type',
      'rentType': 'Rent Type',
      'bedrooms': 'Bedrooms',
      'facing': 'Facing',
      'totalArea': 'Total Area',
      'areaUnit': 'Area Unit',
      'floorNo': 'Floor No',
      'requirementType': 'Requirement Type',
      'state': 'State',
      'city': 'City',
      'area': 'Area',
      'pinCode': 'Pin Code',
      'alternatePhone': 'Alternate Phone Number',
      'familyMembers': 'Family Members',
      'foodHabit': 'Food Habit',
      'jobType': 'Job Type',
      'petAllowed': 'Pet Allowed',
    };
    if (labels.containsKey(field)) return labels[field]!;
    final spaced =
        field.replaceAllMapped(RegExp(r'([A-Z])'), (m) => ' ${m.group(1)}');
    return spaced[0].toUpperCase() + spaced.substring(1);
  }
}
