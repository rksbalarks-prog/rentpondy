import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/property.dart';
import '../routes.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';
import '../widgets/option_picker_dialog.dart';

/// "Add Property" — a pixel-faithful port of AddProperty.jsx:
///
///  * sticky #EFEFEF header with the light-lavender back chevron + "ADD PROPERTY"
///  * a "Property Management" intro, the #4F4B7E RENT-ID banner, an image
///    picker (pick a primary photo) and a video picker
///  * a **progressive-reveal wizard**: steps 1..5 stack below one another as the
///    user advances (completed steps stay visible — one long scroll), driven by
///    a "Swipe To Save & Continue" slider (no numeric stepper, matching the web)
///  * a "Pre View" step, then Submit
///
/// Wiring is unchanged: `POST /store-data-rent` reserves the rentId, `GET
/// /fetch` fills every dropdown, and `POST /update-rent-property` (multipart)
/// saves each step + the final submit.
class AddPropertyScreen extends StatefulWidget {
  const AddPropertyScreen({super.key, this.existing, this.prefill});

  final Property? existing;

  /// Optional seed values from the AI assistant's "Add Property" hand-off
  /// (propertyType / city / area). Ignored in edit mode.
  final Map<String, dynamic>? prefill;

  @override
  State<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

// Web palette.
const _kHeaderBg = Color(0xFFEFEFEF);
const _kChevron = Color(0xFFCDC9F9);
const _kCardShadow = Color(0x1A2668BE); // rgba(38,104,190,0.1)
const _kCheck = Color(0xFF1DD1A1);

class _AddPropertyScreenState extends State<AddPropertyScreen> {
  // Matches the backend's completeness check so finishing the form always
  // lands the property as PreApproved (status 'complete') in Admin. floorNo is
  // land-hidden, so it's skipped for plot/land/agri types (see _validateStep).
  static const _requiredByStep = <int, List<String>>{
    1: ['propertyMode', 'propertyType', 'rentType', 'rentalAmount', 'totalArea', 'areaUnit'],
    2: ['bedrooms', 'floorNo', 'postedBy', 'availableDate'],
    4: ['state', 'district', 'city', 'area', 'pinCode'],
  };

  static const _landTypes = ['plot', 'land', 'agricultural land'];
  static const _hiddenForLand = [
    'bedrooms', 'floorNo', 'kitchen', 'balconies', 'attachedBathrooms',
    'western', 'carParking', 'lift', 'furnished', 'wheelChairAvailable',
    'familyMembers', 'foodHabit', 'jobType', 'petAllowed', 'doorNumber',
  ];

  late final ApiService _api;
  late final AppState _app;

  /// Current wizard step (1..5) shown one at a time; Back/Next move between.
  int _step = 1;

  /// 'form' or 'preview'.
  String _mode = 'form';

  bool _loading = true;
  bool _saving = false;
  double _uploadProgress = 0;
  String? _rentId;
  String? _error;

  Map<String, List<String>> _config = {};
  final Map<String, dynamic> _form = {
    'country': 'India',
    'countryCode': '+91',
    'alternatePhoneCountryCode': '+91',
    'callForRent': false,
  };
  final List<XFile> _photos = [];
  int _primaryPhoto = 0;
  XFile? _video;

  /// Bumped whenever fields are set programmatically so the keyed
  /// TextFormFields rebuild and show the new values.
  final int _fillVersion = 0;

  bool get _isLand =>
      _landTypes.contains((_form['propertyType'] ?? '').toString().toLowerCase());
  bool get _isEdit => widget.existing != null;

  @override
  void initState() {
    super.initState();
    _app = context.read<AppState>();
    _api = _app.api;
    _form['phoneNumber'] = _app.phoneDigits;
    _form['city'] = _app.activeBase == 'CH' ? 'Chennai' : 'Pondicherry';
    // Seed from the assistant hand-off (new listings only).
    final pf = widget.prefill;
    if (pf != null && !_isEdit) {
      for (final k in const ['propertyType', 'city', 'area']) {
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
      final config = await _api.fetchFieldConfig();
      final rentId = _isEdit
          ? widget.existing!.rentId
          : await _api.reserveRentId(_app.phoneDigits);
      if (!mounted) return;
      setState(() {
        _config = config;
        _rentId = rentId;
        if (_isEdit) _prefill(widget.existing!);
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

  void _prefill(Property p) {
    void put(String k, Object? v) {
      if (v != null && '$v'.isNotEmpty) _form[k] = '$v';
    }

    for (final e in p.raw.entries) {
      if (e.value != null && '${e.value}'.isNotEmpty) _form[e.key] = e.value;
    }
    put('rentalAmount', p.price);
    _step = 1; // start editing from the first step with values prefilled
  }

  void _toast(String msg, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: error ? Colors.red : AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  bool _validateStep(int step) {
    final required = _requiredByStep[step] ?? const [];
    final missing = required.where((f) {
      if (_isLand && _hiddenForLand.contains(f)) return false;
      final v = _form[f];
      return v == null || '$v'.trim().isEmpty;
    }).toList();
    if (missing.isEmpty) return true;
    _showErrors(missing.map(_label).toList());
    return false;
  }

  void _showErrors(List<String> missing) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          padding: const EdgeInsets.all(30),
          constraints: const BoxConstraints(maxWidth: 400),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFDC3545), width: 2),
          ),
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
                  child: Text('• $m',
                      style: const TextStyle(color: Color(0xFFD32F2F))),
                ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text(context.trRead('common.ok')),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// "Next" — validate the current step, save its fields (multipart, fields
  /// only; photos go with the final submit), then advance to the next step or
  /// the preview.
  Future<void> _next() async {
    if (!_validateStep(_step)) return;
    if (_rentId == null) {
      _toast('No property id was reserved. Please reopen the form.', error: true);
      return;
    }
    setState(() {
      _saving = true;
      _uploadProgress = 0;
    });
    try {
      await _api.submitProperty(
        fields: {..._form, 'rentId': _rentId},
        photoPaths: const [],
      );
      if (!mounted) return;
      setState(() {
        _saving = false;
        if (_step < 5) {
          _step++;
        } else {
          _mode = 'preview';
        }
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _saving = false);
      _toast(e.toString(), error: true);
    }
  }

  Future<void> _finalSubmit() async {
    if (_rentId == null) return;
    setState(() {
      _saving = true;
      _uploadProgress = 0.05;
    });
    try {
      await _api.submitProperty(
        fields: {..._form, 'rentId': _rentId, 'selectedPhoto': '$_primaryPhoto'},
        photoPaths: _photos.map((x) => x.path).toList(),
      );
      if (!mounted) return;
      setState(() => _saving = false);
      await showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(_isEdit ? 'Property Updated' : 'Property Added'),
          content: Text(
              '${_isEdit ? 'Your property has been updated.' : 'Your property has been submitted.'}\n\nRENT ID: $_rentId'),
          actions: [
            ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text(context.trRead('common.ok'))),
          ],
        ),
      );
      if (!mounted) return;
      // The web shows the pricing plans next.
      Navigator.of(context).pop(true);
      pushRoute(context, '/add-plan', context.trRead('drawer.pricingPlans'));
    } catch (e) {
      if (!mounted) return;
      setState(() => _saving = false);
      _toast(e.toString(), error: true);
    }
  }

  Future<void> _pickPhotos() async {
    try {
      final picked = await ImagePicker().pickMultiImage(imageQuality: 75);
      if (picked.isNotEmpty && mounted) {
        setState(() => _photos.addAll(picked));
      }
    } catch (_) {
      _toast('Could not pick images.', error: true);
    }
  }

  Future<void> _pickVideo() async {
    try {
      final v = await ImagePicker().pickVideo(source: ImageSource.gallery);
      if (v != null && mounted) setState(() => _video = v);
    } catch (_) {
      _toast('Could not pick video.', error: true);
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
            constraints: const BoxConstraints(maxWidth: 500),
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
    if (_mode == 'preview') return _preview();
    return _form_();
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
          Text(_isEdit ? 'EDIT PROPERTY' : 'ADD PROPERTY',
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black)),
        ],
      ),
    );
  }

  // ---- Form (step wizard: one step at a time, Back / Next) ----
  Widget _form_() {
    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 30),
          children: [
            // The Property Management intro + images/video live on step 1.
            if (_step == 1) ...[
              _sectionH4('Property Management', color: const Color(0xFF0A0A0A)),
              _rentIdBanner(),
              const SizedBox(height: 12),
              _imagesSection(),
              const SizedBox(height: 12),
              _videoSection(),
              const SizedBox(height: 8),
            ],
            _stepBody(_step),
            const SizedBox(height: 16),
            _navButtons(),
            const SizedBox(height: 30),
          ],
        ),
        if (_saving) _uploadOverlay(),
      ],
    );
  }

  Widget _stepBody(int s) => switch (s) {
        1 => _step1(),
        2 => _step2(),
        3 => _step3(),
        4 => _step4(),
        _ => _step5(),
      };

  Widget _navButtons() {
    return Row(
      children: [
        if (_step > 1) ...[
          Expanded(
            child: OutlinedButton(
              onPressed: _saving ? null : () => setState(() => _step--),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: const Text('Back',
                  style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(width: 12),
        ],
        Expanded(
          flex: 2,
          child: ElevatedButton(
            onPressed: _saving ? null : _next,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: Text(_step < 5 ? 'Next' : 'Preview',
                style: const TextStyle(fontWeight: FontWeight.w700)),
          ),
        ),
      ],
    );
  }

  Widget _sectionH4(String text, {Color color = AppColors.primary}) => Padding(
        padding: const EdgeInsets.only(top: 10, bottom: 10),
        child: Text(text,
            style: TextStyle(
                color: color, fontWeight: FontWeight.bold, fontSize: 16)),
      );

  Widget _rentIdBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      color: AppColors.primary,
      child: Text('RENT-ID: ${_rentId ?? '…'}',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
    );
  }

  // ---- Images (web "Upload Your Property Images" card) ----
  Widget _imagesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Property Images',
            style: TextStyle(
                color: AppColors.primary,
                fontSize: 24,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        _uploadCard(
          onTap: _pickPhotos,
          circleIcon: true,
          icon: Icons.add_a_photo,
          label: 'Upload Your Property Images',
        ),
        if (_photos.isNotEmpty) ...[
          const SizedBox(height: 12),
          const Text('Uploaded Photos',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              for (var i = 0; i < _photos.length; i++)
                SizedBox(
                  width: 96,
                  height: 96,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(6),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(File(_photos[i].path),
                              width: 84, height: 84, fit: BoxFit.cover),
                        ),
                      ),
                      // Primary-photo radio (top-left), like the web.
                      Positioned(
                        left: 0,
                        top: 0,
                        child: GestureDetector(
                          onTap: () => setState(() => _primaryPhoto = i),
                          child: Container(
                            decoration: const BoxDecoration(
                                color: Colors.white, shape: BoxShape.circle),
                            child: Icon(
                              i == _primaryPhoto
                                  ? Icons.radio_button_checked
                                  : Icons.radio_button_unchecked,
                              size: 20,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                      ),
                      // Remove (top-right).
                      Positioned(
                        right: 0,
                        top: 0,
                        child: GestureDetector(
                          onTap: () => setState(() {
                            _photos.removeAt(i);
                            if (_primaryPhoto >= _photos.length) {
                              _primaryPhoto = 0;
                            }
                          }),
                          child: Container(
                            decoration: const BoxDecoration(
                                color: Colors.white, shape: BoxShape.circle),
                            child: const Icon(Icons.cancel,
                                size: 20, color: Color(0xFFF22952)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ],
      ],
    );
  }

  // ---- Video (web "Upload Property Video" card) ----
  Widget _videoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionH4('Property Video'),
        _uploadCard(
          onTap: _pickVideo,
          circleIcon: false,
          icon: Icons.movie_creation,
          label: 'Upload Property Video (Auto-compressed to ~200KB)',
        ),
        if (_video != null) ...[
          const SizedBox(height: 12),
          const Text('Selected Video:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(color: _kCardShadow, blurRadius: 10, offset: Offset(0, 4)),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.play_circle_fill,
                    color: Color(0xFF2E86E4), size: 30),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(_video!.name,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Colors.grey)),
                ),
                GestureDetector(
                  onTap: () => setState(() => _video = null),
                  child: const Icon(Icons.cancel,
                      size: 20, color: Color(0xFFF22952)),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  /// The web upload card: full-width white box (radius 20, blue-tinted shadow)
  /// with a blue #2E86E4 icon (circle for photos, square for video) + label.
  Widget _uploadCard({
    required VoidCallback onTap,
    required bool circleIcon,
    required IconData icon,
    required String label,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 60),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: const [
            BoxShadow(color: _kCardShadow, blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                color: const Color(0xFF2E86E4),
                shape: circleIcon ? BoxShape.circle : BoxShape.rectangle,
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 10),
            Flexible(
              child: Text(label,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey)),
            ),
          ],
        ),
      ),
    );
  }

  // ---- Steps ----
  Widget _step1() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionH4('Property OverView'),
          _dropdown('propertyMode', required: true),
          _dropdown('propertyType', required: true),
          _dropdown('rentType', required: true),
          _dropdown('negotiation'),
          if (_form['callForRent'] != true)
            _textField('rentalAmount',
                required: true, keyboard: TextInputType.number),
          _wordsUnder('rentalAmount'),
          _checkbox('callForRent', 'Call Owner (price on request)'),
          _textField('securityDeposit', keyboard: TextInputType.number),
          _textField('totalArea', required: true, keyboard: TextInputType.number),
          _dropdown('areaUnit', required: true),
        ],
      );

  Widget _step2() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionH4('Basic Property Info'),
          if (!_isLand) ...[
            _dropdown('bedrooms', required: true),
            _dropdown('floorNo', required: true),
            _dropdown('kitchen'),
            _dropdown('balconies'),
            _dropdown('attachedBathrooms'),
            _dropdown('western'),
            _dropdown('carParking'),
            _dropdown('lift'),
            _dropdown('furnished'),
            _dropdown('wheelChairAvailable'),
          ],
          _dropdown('facing'),
          _dropdown('propertyAge'),
          _dropdown('postedBy', required: true),
          _dropdown('availableDate', required: true),
        ],
      );

  Widget _step3() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionH4('Property Description'),
          _textField('description', maxLines: 4, maxLength: 200),
          if (!_isLand) ...[
            _sectionH4('Tenant Preferences'),
            _dropdown('familyMembers'),
            _dropdown('foodHabit'),
            _dropdown('jobType'),
            _dropdown('petAllowed'),
          ],
        ],
      );

  Widget _step4() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionH4('Property Address'),
          _textField('country', enabled: false),
          _dropdownOrText('state', required: true),
          _dropdownOrText('district', required: true),
          _textField('city', required: true),
          _textField('area', required: true),
          _textField('nagar'),
          _textField('streetName'),
          if (!_isLand)
            _textField('doorNumber', keyboard: TextInputType.number),
          _textField('pinCode', required: true, keyboard: TextInputType.number, maxLength: 6),
          _textField('locationCoordinates'),
        ],
      );

  Widget _step5() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionH4('Owner Details'),
          _textField('ownerName'),
          _textField('email', keyboard: TextInputType.emailAddress),
          _phoneField('phoneNumber', 'countryCode'),
          _phoneField('alternatePhone', 'alternatePhoneCountryCode'),
          _dropdown('bestTimeToCall'),
        ],
      );

  // ------------------------------------------------------------------
  // Field widgets (the web "input-card" pattern)
  // ------------------------------------------------------------------

  Widget _card({required Widget icon, required Widget child, bool filled = false}) {
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

  Widget _dropdown(String field, {bool required = false}) {
    final options = _config[field] ?? const [];
    if (options.isEmpty) return _textField(field, required: required);
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

  /// A dropdown when the backend has options, else a plain text field.
  Widget _dropdownOrText(String field, {bool required = false}) {
    final options = _config[field] ?? const [];
    return options.isEmpty
        ? _textField(field, required: required)
        : _dropdown(field, required: required);
  }

  Widget _textField(
    String field, {
    bool required = false,
    TextInputType? keyboard,
    int maxLines = 1,
    int? maxLength,
    bool enabled = true,
  }) {
    final filled = (_form[field]?.toString().isNotEmpty) ?? false;
    return _card(
      icon: _fieldIcon(field),
      filled: filled,
      child: TextFormField(
        key: ValueKey('$field-$_fillVersion'),
        initialValue: _form[field]?.toString(),
        enabled: enabled,
        keyboardType: keyboard,
        maxLines: maxLines,
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
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        ),
        onChanged: (v) => setState(() => _form[field] = v),
      ),
    );
  }

  Widget _phoneField(String field, String codeKey) {
    final filled = (_form[field]?.toString().isNotEmpty) ?? false;
    return _card(
      icon: _fieldIcon(field),
      filled: filled,
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text(_form[codeKey]?.toString() ?? '+91',
                style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
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

  Widget _checkbox(String field, String label) {
    final v = _form[field] == true;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => setState(() => _form[field] = !v),
        child: Row(
          children: [
            Icon(v ? Icons.check_box : Icons.check_box_outline_blank,
                color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            Expanded(
                child: Text(label, style: const TextStyle(color: Colors.grey))),
          ],
        ),
      ),
    );
  }

  Widget _wordsUnder(String field) {
    final n = num.tryParse('${_form[field] ?? ''}');
    if (n == null || n <= 0) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text('₹ ${Formatters.inr(n)}',
          style: const TextStyle(color: Color(0xFF8B99A9), fontSize: 12)),
    );
  }

  String _placeholder(String field, bool required) =>
      '${_label(field)}${required ? ' *' : ''}';

  // ---- Dropdown picker chain (web renderDropdown auto-advance) ----
  /// Opens the picker for [field]; on select it jumps to the next dropdown in
  /// the step, so the user rattles through all the dropdowns without reopening.
  /// Stops when the next field is a text input (matching the web).
  Future<void> _openPicker(String field, List<String> options) async {
    final order = _stepFields(_step);
    var current = field;
    while (mounted) {
      final opts = _config[current] ?? const <String>[];
      if (opts.isEmpty) break;
      final idx = order.indexOf(current);
      final result = await showDialog<PickerResult>(
        context: context,
        barrierColor: Colors.black.withValues(alpha: 0.5),
        builder: (_) => OptionPickerDialog(
          label: _label(current),
          options: opts,
          showPrev: _prevDropdown(order, idx) != null,
          showSkip: idx >= 0 && idx < order.length - 1,
        ),
      );
      if (!mounted || result == null || result.action == PickerAction.close) {
        break;
      }
      if (result.action == PickerAction.select) {
        setState(() => _form[current] = result.value);
        final next = _nextField(order, current);
        if (next == null || !_isDropdown(next)) break;
        current = next;
      } else if (result.action == PickerAction.skip) {
        final next = _nextField(order, current);
        if (next == null || !_isDropdown(next)) break;
        current = next;
      } else {
        // prev
        final prev = _prevDropdown(order, order.indexOf(current));
        if (prev == null) break;
        current = prev;
      }
    }
  }

  /// Ordered field names for [step] (dropdowns + text), filtered for land types
  /// — mirrors the web's `dropdownFieldOrder`.
  List<String> _stepFields(int step) {
    final all = switch (step) {
      1 => const ['propertyMode', 'propertyType', 'rentType', 'negotiation',
          'rentalAmount', 'securityDeposit', 'totalArea', 'areaUnit'],
      2 => const ['bedrooms', 'floorNo', 'kitchen', 'balconies',
          'attachedBathrooms', 'western', 'carParking', 'lift', 'furnished',
          'wheelChairAvailable', 'facing', 'propertyAge', 'postedBy',
          'availableDate'],
      3 => const ['description', 'familyMembers', 'foodHabit', 'jobType',
          'petAllowed'],
      4 => const ['country', 'state', 'district', 'city', 'area', 'nagar',
          'streetName', 'doorNumber', 'pinCode', 'locationCoordinates'],
      _ => const ['ownerName', 'email', 'phoneNumber', 'alternatePhone',
          'bestTimeToCall'],
    };
    return all
        .where((f) => !(_isLand && _hiddenForLand.contains(f)))
        .toList();
  }

  bool _isDropdown(String field) => (_config[field] ?? const []).isNotEmpty;

  String? _nextField(List<String> order, String current) {
    final i = order.indexOf(current);
    return (i >= 0 && i < order.length - 1) ? order[i + 1] : null;
  }

  String? _prevDropdown(List<String> order, int idx) {
    for (var i = idx - 1; i >= 0; i--) {
      if (_isDropdown(order[i])) return order[i];
    }
    return null;
  }

  // ---- Upload overlay ----
  Widget _uploadOverlay() {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withValues(alpha: 0.5),
        alignment: Alignment.center,
        child: Container(
          width: 260,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Uploading Property Data',
                  style: TextStyle(
                      color: AppColors.primary, fontWeight: FontWeight.bold)),
              const SizedBox(height: 14),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  minHeight: 8,
                  value: _uploadProgress == 0 ? null : _uploadProgress,
                  backgroundColor: const Color(0xFFE0E0E0),
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ------------------------------------------------------------------
  // Preview
  // ------------------------------------------------------------------
  Widget _preview() {
    final rows = <(String, String)>[
      ('Property mode', '${_form['propertyMode'] ?? ''}'),
      ('Property type', '${_form['propertyType'] ?? ''}'),
      ('Rent type', '${_form['rentType'] ?? ''}'),
      ('Total area', '${_form['totalArea'] ?? ''} ${_form['areaUnit'] ?? ''}'),
      ('Bedrooms', '${_form['bedrooms'] ?? ''}'),
      ('Floor no', '${_form['floorNo'] ?? ''}'),
      ('Facing', '${_form['facing'] ?? ''}'),
      ('Posted by', '${_form['postedBy'] ?? ''}'),
      ('State', '${_form['state'] ?? ''}'),
      ('District', '${_form['district'] ?? ''}'),
      ('City', '${_form['city'] ?? ''}'),
      ('Area', '${_form['area'] ?? ''}'),
      ('Pincode', '${_form['pinCode'] ?? ''}'),
      ('Owner name', '${_form['ownerName'] ?? ''}'),
    ];
    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 30),
          children: [
            if (_photos.isNotEmpty)
              SizedBox(
                height: 200,
                child: PageView(
                  children: [
                    for (final p in _photos)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.file(File(p.path), fit: BoxFit.cover),
                      ),
                  ],
                ),
              ),
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.currency_rupee, size: 22, color: AppColors.primary),
                Text(Formatters.inr(num.tryParse('${_form['rentalAmount'] ?? ''}')),
                    style: const TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 26)),
                const SizedBox(width: 10),
                Text(
                    (_form['negotiation'] ?? '').toString().toLowerCase() == 'yes'
                        ? 'Negotiable'
                        : 'Non-Negotiable',
                    style: const TextStyle(color: _kChevron, fontSize: 14)),
              ],
            ),
            const SizedBox(height: 10),
            for (final r in rows)
              if (r.$2.trim().isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      SizedBox(
                          width: 140,
                          child: Text(r.$1,
                              style: const TextStyle(
                                  color: Colors.grey, fontSize: 13))),
                      Expanded(
                          child: Text(r.$2,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87))),
                    ],
                  ),
                ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                OutlinedButton(
                  onPressed: () => setState(() => _mode = 'form'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF1882F6),
                    side: const BorderSide(color: Color(0xFF1882F6), width: 2),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25)),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  ),
                  child: const Text('EDIT'),
                ),
                ElevatedButton(
                  onPressed: _saving ? null : _finalSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF007BFF),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25)),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 36, vertical: 10),
                  ),
                  child: Text(_saving ? 'Submitting…' : 'Submit'),
                ),
              ],
            ),
          ],
        ),
        if (_saving) _uploadOverlay(),
      ],
    );
  }

  // ------------------------------------------------------------------
  // Field icons + labels
  // ------------------------------------------------------------------
  Widget _fieldIcon(String field) {
    const png = {
      'propertyMode': 'prop_mode.PNG',
      'propertyType': 'prop_type.PNG',
      'rentType': 'rent_type.PNG',
      'negotiation': 'nego.PNG',
      'rentalAmount': 'amount.png',
      'securityDeposit': 'advance.PNG',
      'totalArea': 'total_area.png',
      'areaUnit': 'area_unit.png',
      'bedrooms': 'bed.PNG',
      'floorNo': 'floor.PNG',
      'western': 'western.PNG',
      'attachedBathrooms': 'attach.png',
      'carParking': 'parking.png',
      'lift': 'lift.PNG',
      'furnished': 'furnish.PNG',
      'facing': 'facing.png',
      'propertyAge': 'age.PNG',
      'postedBy': 'posted_by.png',
      'availableDate': 'date.PNG',
      'familyMembers': 'member.PNG',
      'foodHabit': 'food.png',
      'jobType': 'job.PNG',
      'petAllowed': 'pet.PNG',
      'state': 'state.png',
      'area': 'area.png',
      'city': 'city.PNG',
      'nagar': 'nagar.PNG',
      'streetName': 'street.PNG',
      'doorNumber': 'door.png',
      'ownerName': 'name.PNG',
      'email': 'email.PNG',
    };
    const mat = {
      'kitchen': Icons.countertops,
      'balconies': Icons.balcony,
      'wheelChairAvailable': Icons.accessible,
      'description': Icons.description,
      'country': Icons.public,
      'district': Icons.location_city,
      'pinCode': Icons.pin_drop,
      'locationCoordinates': Icons.my_location,
      'phoneNumber': Icons.phone,
      'alternatePhone': Icons.phone_android,
      'bestTimeToCall': Icons.access_time,
      'callForRent': Icons.call,
    };
    if (png.containsKey(field)) {
      return Image.asset('${Assets.detailIconBase}${png[field]}',
          width: 22, height: 22);
    }
    return Icon(mat[field] ?? Icons.edit_note, color: AppColors.primary, size: 22);
  }

  static String _label(String field) {
    const labels = {
      'propertyMode': 'Property Mode',
      'propertyType': 'Property Type',
      'rentType': 'Rent Type',
      'rentalAmount': 'Rental Amount',
      'securityDeposit': 'Security Deposit',
      'totalArea': 'Total Area',
      'areaUnit': 'Area Unit',
      'bedrooms': 'Bedrooms',
      'floorNo': 'Floor No',
      'attachedBathrooms': 'Attached Bathrooms',
      'carParking': 'Car Parking',
      'wheelChairAvailable': 'Wheel Chair',
      'propertyAge': 'Property Age',
      'postedBy': 'Posted By',
      'availableDate': 'Available From',
      'familyMembers': 'Family Members',
      'foodHabit': 'Food Habit',
      'jobType': 'Job Type',
      'petAllowed': 'Pet Allowed',
      'streetName': 'Street Name',
      'doorNumber': 'Door Number',
      'pinCode': 'Pin Code',
      'locationCoordinates': 'Latitude & Longitude',
      'ownerName': 'Owner Name',
      'phoneNumber': 'Phone Number',
      'alternatePhone': 'Alternate Phone',
      'bestTimeToCall': 'Best Time To Call',
    };
    if (labels.containsKey(field)) return labels[field]!;
    final spaced =
        field.replaceAllMapped(RegExp(r'([A-Z])'), (m) => ' ${m.group(1)}');
    return spaced[0].toUpperCase() + spaced.substring(1);
  }
}
