import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config/api_config.dart';
import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../l10n/strings.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';
import '../widgets/insufficient_points_modal.dart';

/// Single property detail page (`/detail/:rentId`) — a pixel-faithful port of
/// the web app's Details.jsx: sticky #EFEFEF header, image Swiper with the
/// #4F4B7E prev/next chips + counter, Rent_Id badge, mode | type, price +
/// negotiable, price-in-words, "Make an offer" form, the full sectioned
/// overview grid (icon + label + value), and the points-gated owner-contact
/// reveal — which still behaves exactly like the web app:
///
///  1. Already revealed on this page  -> free, no charge.
///  2. Balance API unreachable        -> REFUSE to reveal (never leak).
///  3. balance < 10                   -> "Buy Points" modal.
///  4. POST /points-deduct            -> reveal only when success == true.
///  5. alreadyDeducted == true        -> ask before spending another 10.
///  6. HTTP 402                       -> "Buy Points" modal.
class PropertyDetailScreen extends StatefulWidget {
  const PropertyDetailScreen({
    super.key,
    required this.rentId,
    required this.initial,
  });

  final String rentId;
  final Property initial;

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

// Web palette used by this screen.
const _kHeaderBg = Color(0xFFEFEFEF);
const _kChevron = Color(0xFFCDC9F9);
const _kPriceOrange = Color(0xFFFF5722);
const _kWordsGrey = Color(0xFF8B99A9);
const _kFieldGrey = Colors.grey;
const _kPhotoReq = Color(0xFF34ACD6);
const _kPhotoReqSent = Color(0xFF3F61D8);

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  /// Cost of one owner-contact reveal (POINTS_PER_CONTACT_VIEW in Details.jsx).
  static const int pointsPerContactView = 10;

  final _pageController = PageController();
  final _offerCtrl = TextEditingController();
  late final ApiService _api;
  late final AppState _app;

  late Property _p;
  int _page = 0;
  bool _loadingDetail = true;
  bool _showContact = false;
  bool _busy = false;
  bool _favorite = false;
  bool _interested = false;
  bool _photoRequested = false;

  @override
  void initState() {
    super.initState();
    _p = widget.initial;
    _app = context.read<AppState>();
    _api = _app.api;
    _loadDetail();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _offerCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadDetail() async {
    try {
      final full = await _api.fetchPropertyDetail(widget.rentId);
      if (!mounted) return;
      setState(() {
        _p = full;
        _loadingDetail = false;
      });
    } catch (_) {
      if (mounted) setState(() => _loadingDetail = false);
    }
  }

  /// Context-free translate for async methods / callbacks (reads the captured
  /// [AppState] instead of BuildContext, so no async-gap lint).
  String _t(String key) => AppStrings.tr(key, _app.lang);

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: AppColors.primary,
      behavior: SnackBarBehavior.floating,
    ));
  }

  // ------------------------------------------------------------------
  // Owner contact reveal (points paywall)
  // ------------------------------------------------------------------

  Future<void> _onContactPressed() async {
    if (_showContact) return;
    final phone = _app.phoneNumber;
    if (phone == null || phone.isEmpty) return;

    setState(() => _busy = true);
    try {
      final int balance;
      try {
        balance = await _api.fetchPointsBalanceStrict(phone);
      } catch (_) {
        _toast(_t('detail.balanceVerifyFail'));
        return;
      }

      if (balance < pointsPerContactView) {
        if (mounted) _showInsufficientPoints(balance);
        return;
      }

      final result = await _api.deductPoints(
        phoneNumber: phone,
        points: pointsPerContactView,
        rentId: widget.rentId,
        reason: 'view-owner-contact',
      );

      if (result.insufficient) {
        if (mounted) _showInsufficientPoints(result.balance ?? balance);
        return;
      }
      if (!result.success) {
        _toast(result.message ?? _t('detail.deductFail'));
        return;
      }
      if (result.alreadyDeducted) {
        if (mounted) await _confirmRededuct(result.balance ?? balance);
        return;
      }

      _reveal(result.balance ?? balance - pointsPerContactView);
      _toast(_t('detail.revealed').replaceFirst('{n}', '$pointsPerContactView'));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _confirmRededuct(int balance) async {
    final title = _t('detail.viewAgainTitle');
    final body = _t('detail.viewAgainBody')
        .replaceFirst('{n}', '$pointsPerContactView')
        .replaceFirst('{b}', '$balance');
    final noLabel = _t('common.no');
    final yesLabel =
        _t('detail.yesSpend').replaceFirst('{n}', '$pointsPerContactView');
    final again = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(title),
        content: Text(body),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(noLabel)),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(yesLabel)),
        ],
      ),
    );
    if (again != true) return;

    if (balance < pointsPerContactView) {
      if (mounted) _showInsufficientPoints(balance);
      return;
    }

    final forced = await _api.deductPoints(
      phoneNumber: _app.phoneNumber!,
      points: pointsPerContactView,
      rentId: widget.rentId,
      reason: 'view-owner-contact',
      force: true,
    );
    if (forced.insufficient) {
      if (mounted) _showInsufficientPoints(forced.balance ?? balance);
      return;
    }
    if (!forced.success) {
      _toast(forced.message ?? _t('detail.deductFail'));
      return;
    }
    _reveal(forced.balance ?? balance - pointsPerContactView);
    _toast(_t('detail.revealed').replaceFirst('{n}', '$pointsPerContactView'));
  }

  void _reveal(int newBalance) {
    if (!mounted) return;
    setState(() => _showContact = true);
    _app.refreshPointsBalance();
    final viewer = _app.phoneNumber;
    if (viewer != null && viewer.isNotEmpty) {
      _api.notifyOwnerContactView(
        rentId: widget.rentId,
        viewerPhone: viewer,
        ownerPhone: _p.ownerRealPhone,
      );
    }
  }

  /// The web app's animated "Unlock Owner Contact" paywall. If the user tops up
  /// from inside it, pick the reveal back up where it left off — by then the
  /// original attempt has already unwound and cleared [_busy].
  Future<void> _showInsufficientPoints(int balance) async {
    final bought = await showInsufficientPointsModal(
      context,
      balance: balance,
      cost: pointsPerContactView,
    );
    if (!mounted || !bought) return;
    _toast(_t('ip.pointsAdded'));
    await _onContactPressed();
  }

  // ------------------------------------------------------------------
  // Other actions
  // ------------------------------------------------------------------

  Future<void> _guarded(Future<void> Function() action) async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      await action();
    } catch (e) {
      _toast(e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _toggleFavorite() => _guarded(() async {
        final status = await _api.toggleFavorite(
          phoneNumber: _app.phoneNumber!,
          rentId: widget.rentId,
          add: !_favorite,
        );
        if (!mounted) return;
        setState(() => _favorite = status == 'favorite' ? true : !_favorite);
        _toast(_t(_favorite ? 'detail.addedFav' : 'detail.removedFav'));
      });

  Future<void> _toggleInterest() => _guarded(() async {
        final status = await _api.toggleInterest(
          phoneNumber: _app.phoneNumber!,
          rentId: widget.rentId,
          send: !_interested,
        );
        if (!mounted) return;
        setState(() =>
            _interested = status == 'interestRemoved' ? false : !_interested);
        _toast(_t(_interested
            ? 'detail.interestSentToast'
            : 'detail.interestRemovedToast'));
      });

  Future<void> _requestPhotos() => _guarded(() async {
        await _api.requestPhotos(
            rentId: widget.rentId, requesterPhoneNumber: _app.phoneNumber!);
        if (mounted) setState(() => _photoRequested = true);
        _toast(_t('detail.photoReqOk'));
      });

  Future<void> _requestAddress() => _guarded(() async {
        final msg = await _api.requestAddress(
            rentId: widget.rentId, requesterPhoneNumber: _app.phoneNumber!);
        _toast(msg ?? _t('detail.addressReqOk'));
      });

  Future<void> _report() async {
    final reasons = <(String, String)>[
      ('Wrong information', _t('detail.reasonWrongInfo')),
      ('Already rented / sold', _t('detail.reasonAlreadyGone')),
      ('Fake listing', _t('detail.reasonFake')),
      ('Owner not reachable', _t('detail.reasonUnreachable')),
      ('Other', _t('detail.reasonOther')),
    ];
    final reportTitle = _t('detail.reportTitle');
    final reasonLabel = _t('detail.reportReasonLabel');
    final commentsLabel = _t('detail.reportCommentsLabel');
    final cancelLabel = _t('common.cancel');
    final submitLabel = _t('common.submit');
    String selected = reasons.first.$1;
    final commentCtrl = TextEditingController();

    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(reportTitle),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: selected,
                items: [
                  for (final r in reasons)
                    DropdownMenuItem(value: r.$1, child: Text(r.$2))
                ],
                onChanged: (v) => setDialogState(() => selected = v ?? selected),
                decoration: InputDecoration(labelText: reasonLabel),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: commentCtrl,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: commentsLabel,
                  border: const OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: Text(cancelLabel)),
            ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text(submitLabel)),
          ],
        ),
      ),
    );

    if (ok != true) return;
    await _guarded(() async {
      await _api.reportProperty(
        phoneNumber: _app.phoneNumber!,
        rentId: widget.rentId,
        comment: commentCtrl.text.trim(),
        selectedReason: selected,
      );
      _toast(_t('detail.reportedThanks'));
    });
  }

  Future<void> _submitOffer() async {
    final amt = _offerCtrl.text.trim();
    if (amt.isEmpty) return;
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Text('${_t('detail.offerConfirm')} ₹$amt ?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(_t('common.no'))),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(_t('common.yes'))),
        ],
      ),
    );
    if (ok != true) return;
    if (!mounted) return;
    _toast(_t('detail.offerSent'));
    _offerCtrl.clear();
  }

  Future<void> _dial(String number) async {
    final uri = Uri.parse('tel:$number');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  void _share() {
    Clipboard.setData(
        ClipboardData(text: 'https://rentpondy.com/detail/${_p.rentId}'));
    _toast(_t('detail.linkCopied'));
  }

  void _jump(int dir) {
    final photos = _p.photos;
    final count = photos.isEmpty ? 1 : photos.length;
    final next = (_page + dir).clamp(0, count - 1);
    _pageController.animateToPage(next,
        duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
  }

  // ------------------------------------------------------------------
  // UI
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
                Expanded(
                  child: ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      _gallery(),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 10),
                            _rentIdBadge(),
                            const SizedBox(height: 6),
                            _modeType(),
                            const SizedBox(height: 4),
                            _priceRow(),
                            _priceWords(),
                            const SizedBox(height: 6),
                            _offerSection(),
                            const SizedBox(height: 10),
                            _overviewGrid(),
                            const SizedBox(height: 6),
                            _contactSection(),
                            const SizedBox(height: 16),
                            _actionsRow(),
                            const SizedBox(height: 40),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ---- Sticky header (#EFEFEF) ----
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
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(context.tr('detail.title'),
                    style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Colors.black)),
                Row(
                  children: [
                    InkResponse(
                      onTap: _share,
                      radius: 20,
                      child:
                          const Icon(Icons.share, color: AppColors.primary, size: 20),
                    ),
                    const SizedBox(width: 14),
                    GestureDetector(
                      onTap: _busy ? null : _toggleFavorite,
                      child: Icon(
                          _favorite ? Icons.favorite : Icons.favorite_border,
                          color: _favorite ? Colors.red : AppColors.primary,
                          size: 28),
                    ),
                    const SizedBox(width: 4),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---- Image gallery (Swiper) ----
  Widget _gallery() {
    final photos = _p.photos;
    final hasPhotos = photos.isNotEmpty;
    final count = hasPhotos ? photos.length : 1;
    final dpr = MediaQuery.of(context).devicePixelRatio;
    final decodeW = (MediaQuery.of(context).size.width * dpr).round();
    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 4)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: count,
            onPageChanged: (i) => setState(() => _page = i),
            itemBuilder: (_, i) {
              if (!hasPhotos) {
                return Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(Assets.defaultProperty, fit: BoxFit.contain),
                    _photoRequestButton(),
                  ],
                );
              }
              return CachedNetworkImage(
                imageUrl: ApiConfig.photoUrl(photos[i]),
                fit: BoxFit.cover,
                memCacheWidth: decodeW,
                placeholder: (_, _) => Container(color: const Color(0xFFEDEDED)),
                errorWidget: (_, _, _) =>
                    Image.asset(Assets.defaultProperty, fit: BoxFit.cover),
              );
            },
          ),
          // Prev / next chips (bottom-right).
          Positioned(
            bottom: 0,
            right: 0,
            child: Row(
              children: [
                _navChip('❮', () => _jump(-1)),
                const SizedBox(width: 4),
                _navChip('❯', () => _jump(1)),
              ],
            ),
          ),
          // Counter (bottom-center).
          Positioned(
            bottom: 6,
            left: 0,
            right: 0,
            child: Center(
              child: Text('${_page + 1}/$count',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      shadows: [Shadow(blurRadius: 3, color: Colors.black)])),
            ),
          ),
          if (_loadingDetail)
            const Positioned(
              top: 10,
              left: 10,
              child: SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(
                    strokeWidth: 2, color: Colors.white),
              ),
            ),
        ],
      ),
    );
  }

  Widget _navChip(String glyph, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 60,
        height: 30,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(glyph,
            style: const TextStyle(color: Colors.white, fontSize: 18)),
      ),
    );
  }

  Widget _photoRequestButton() {
    return Positioned(
      bottom: 30,
      right: 10,
      child: GestureDetector(
        onTap: _photoRequested ? null : _requestPhotos,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          color: _photoRequested ? _kPhotoReqSent : _kPhotoReq,
          child: Text(
            _photoRequested
                ? context.tr('detail.photoReqSent')
                : context.tr('detail.photoReq'),
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
        ),
      ),
    );
  }

  // ---- Rent_Id badge ----
  Widget _rentIdBadge() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(5),
        ),
        child: Text('Rent_Id : ${_p.rentId}',
            style: const TextStyle(color: Colors.white, fontSize: 12)),
      ),
    );
  }

  Widget _modeType() {
    final mode = _p.propertyMode ?? '';
    final type = _p.propertyType ?? '';
    return Text('$mode |  $type',
        style: const TextStyle(
            color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16));
  }

  /// Security deposit for display: the figure when one was quoted, otherwise
  /// "Call Owner". Imported newspaper listings store 0 for "not stated".
  String _depositText() {
    final raw = _p.rawStr('securityDeposit');
    final n = raw == null ? null : num.tryParse(raw.replaceAll(RegExp(r'[^\d.]'), ''));
    return Formatters.noAmount(n) ? 'Call Owner' : Formatters.inr(n);
  }

  Widget _priceRow() {
    final negotiable = (_p.negotiation ?? '').toLowerCase() == 'yes';
    // No quoted rent: say what to do instead of showing a rupee sign against
    // nothing. "Negotiable" is meaningless without a figure to negotiate from.
    if (_p.callForRent || Formatters.noAmount(_p.price)) {
      return const Text('Call Owner',
          style: TextStyle(
              color: _kPriceOrange, fontWeight: FontWeight.bold, fontSize: 16));
    }
    return Row(
      children: [
        const Icon(Icons.currency_rupee, size: 18, color: _kPriceOrange),
        Text(Formatters.inr(_p.price),
            style: const TextStyle(
                color: _kPriceOrange,
                fontWeight: FontWeight.bold,
                fontSize: 16)),
        const SizedBox(width: 10),
        Text(negotiable ? 'Negotiable' : 'Non-Negotiable',
            style: const TextStyle(color: AppColors.primary, fontSize: 14)),
      ],
    );
  }

  Widget _priceWords() {
    final words = _indianWords(_p.price);
    if (words.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 2, bottom: 2),
      child: Text(words, style: const TextStyle(color: _kWordsGrey)),
    );
  }

  // ---- Make an offer ----
  Widget _offerSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(context.tr('detail.makeOffer'),
            style:
                const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _offerCtrl,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                decoration: InputDecoration(
                  isDense: true,
                  prefixIcon: const Icon(Icons.currency_rupee,
                      size: 16, color: AppColors.primary),
                  prefixIconConstraints:
                      const BoxConstraints(minWidth: 30, minHeight: 0),
                  hintText: context.tr('detail.makeOffer'),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 10),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(4),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            ElevatedButton(
              onPressed: _submitOffer,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4)),
              ),
              child: Text(context.tr('common.submit')),
            ),
          ],
        ),
      ],
    );
  }

  // ---- Overview grid ----
  Widget _overviewGrid() {
    final fields = _mainFields();
    return LayoutBuilder(builder: (context, c) {
      final half = (c.maxWidth - 12) / 2;
      return Wrap(
        spacing: 12,
        runSpacing: 4,
        children: [
          for (final f in fields)
            if (f.heading)
              SizedBox(width: c.maxWidth, child: _headingRow(f.label))
            else if (f.description)
              SizedBox(width: c.maxWidth, child: _descriptionField(f))
            else
              SizedBox(
                  width: half, child: SizedBox(height: 55, child: _fieldRow(f))),
        ],
      );
    });
  }

  Widget _headingRow(String label) {
    return Padding(
      padding: const EdgeInsets.only(top: 10, bottom: 2),
      child: Text(label,
          style: const TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.bold,
              fontSize: 16)),
    );
  }

  Widget _fieldRow(_DField f) {
    return Row(
      children: [
        SizedBox(width: 28, height: 28, child: Center(child: f.icon)),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(f.label,
                  style: const TextStyle(fontSize: 12, color: _kFieldGrey)),
              Text(f.value?.isNotEmpty == true ? f.value! : 'N/A',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 14,
                      color: _kFieldGrey,
                      fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _descriptionField(_DField f) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 28, height: 28, child: Center(child: f.icon)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(f.value?.isNotEmpty == true ? f.value! : 'N/A',
                style: const TextStyle(
                    fontSize: 14,
                    color: _kFieldGrey,
                    fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  // ---- Contact Info ----
  Widget _contactSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        Text(context.tr('detail.contactInfo'),
            style:
                const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: _busy ? null : _onContactPressed,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: _showContact ? AppColors.primary : Colors.transparent,
              border: Border.all(color: AppColors.primary),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.contact_phone,
                    size: 20,
                    color: _showContact ? Colors.white : AppColors.primary),
                const SizedBox(width: 8),
                Text(context.tr('detail.viewOwnerContactDetails'),
                    style: TextStyle(
                        color:
                            _showContact ? Colors.white : AppColors.primary,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ),
        if (_showContact) ...[
          const SizedBox(height: 12),
          _revealedContact(),
        ],
      ],
    );
  }

  Widget _revealedContact() {
    final primary = _p.displayPhone;
    final alt = _p.alternatePhone;
    final email = _p.rawStr('email');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _headingRow('Rental property address'),
        LayoutBuilder(builder: (context, c) {
          final half = (c.maxWidth - 12) / 2;
          return Wrap(
            spacing: 12,
            runSpacing: 6,
            children: [
              for (final f in _addressFields())
                SizedBox(width: half, child: _fieldRow(f)),
            ],
          );
        }),
        const SizedBox(height: 10),
        _contactRow(Icons.person, 'Name', _p.ownerName),
        if (email != null) _contactRow(Icons.email, 'Email', email),
        if (primary != null) _phoneRow(primary, 'Primary'),
        if (alt != null && alt.isNotEmpty) _phoneRow(alt, 'Alternate'),
      ],
    );
  }

  Widget _contactRow(IconData icon, String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppColors.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(fontSize: 13, color: _kFieldGrey)),
                Text(value?.isNotEmpty == true ? value! : 'N/A',
                    style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: _kFieldGrey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _phoneRow(String number, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          const Icon(Icons.phone, size: 16, color: AppColors.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Text('$label: $number',
                style: const TextStyle(fontSize: 15, color: Colors.black)),
          ),
          TextButton.icon(
            onPressed: () => _dial(number),
            icon: const Icon(Icons.call, size: 16),
            label: Text(context.tr('detail.call')),
          ),
        ],
      ),
    );
  }

  // ---- Actions ----
  Widget _actionsRow() {
    final actions = <(IconData, String, VoidCallback)>[
      (
        _interested ? Icons.star : Icons.star_border,
        context.tr(_interested ? 'detail.interestSent' : 'detail.sendInterest'),
        _toggleInterest
      ),
      (Icons.flag_outlined, context.tr('detail.report'), _report),
      (Icons.photo_library_outlined, context.tr('detail.requestPhotos'),
          _requestPhotos),
      (Icons.location_on_outlined, context.tr('detail.requestAddress'),
          _requestAddress),
    ];
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        for (final a in actions)
          OutlinedButton.icon(
            onPressed: _busy ? null : a.$3,
            icon: Icon(a.$1, size: 18),
            label: Text(a.$2),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.primary,
              side: const BorderSide(color: AppColors.primary),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
          ),
      ],
    );
  }

  // ------------------------------------------------------------------
  // Field data (mirrors propertyDetailsList / mainDetailsList in Details.jsx)
  // ------------------------------------------------------------------

  bool get _excludeFeatures {
    final t = (_p.propertyType ?? '').toLowerCase();
    return t == 'plot' || t == 'land' || t == 'agricultural land';
  }

  Widget _png(String file) =>
      Image.asset('${Assets.detailIconBase}$file', width: 22, height: 22);
  Widget _mat(IconData icon) =>
      Icon(icon, color: AppColors.primary, size: 22);

  List<_DField> _mainFields() {
    final area =
        '${_p.totalArea ?? ''} ${_p.areaUnit ?? ''}'.trim();
    final list = <_DField>[
      _DField.heading('Basic property info'),
      _DField('Property mode', _png('prop_mode.PNG'), _p.propertyMode),
      _DField('Property type', _png('prop_type.PNG'), _p.propertyType),
      _DField('Rent type', _png('rent_type.PNG'), _p.rawStr('rentType')),
      _DField('Total area', _png('total_area.png'), area.isEmpty ? null : area),
      _DField('Negotiation', _png('nego.PNG'), _p.negotiation),
      // A 0 deposit is "not stated", not "no deposit required" — same rule as
      // the rent above, so the tenant is told to ask rather than shown a zero.
      _DField('Security deposit ₹', _png('advance.PNG'), _depositText()),
      _DField('No. of views', _mat(Icons.remove_red_eye), _p.views?.toString()),
    ];
    if (!_excludeFeatures) {
      list.addAll([
        _DField.heading('Property features'),
        _DField('Bedrooms', _png('bed.PNG'), _p.bedrooms),
        _DField('Floor no', _png('floor.PNG'), _p.floorNo),
        _DField('Kitchen', _mat(Icons.countertops), _p.rawStr('kitchen')),
        _DField('Balconies', _mat(Icons.balcony), _p.rawStr('balconies')),
        _DField('Western', _png('western.PNG'), _p.rawStr('western')),
        _DField('Attached', _png('attach.png'), _p.rawStr('attachedBathrooms')),
        _DField('Wheel chair', _mat(Icons.accessible),
            _p.rawStr('wheelChairAvailable')),
        _DField('Car park', _png('parking.png'), _p.rawStr('carParking')),
        _DField('Lift', _png('lift.PNG'), _p.rawStr('lift')),
        _DField('Furnished', _png('furnish.PNG'), _p.rawStr('furnished')),
        _DField('Facing', _png('facing.png'), _p.rawStr('facing')),
        _DField('Property age', _png('age.PNG'), _p.rawStr('propertyAge')),
        _DField('Posted by', _png('posted_by.png'), _p.postedBy),
        _DField('Available date', _png('date.PNG'), _p.rawStr('availableDate')),
        _DField('Posted on', _png('date.PNG'), Formatters.shortDate(_p.createdAt)),
      ]);
    } else {
      list.add(
          _DField('Posted on', _png('date.PNG'), Formatters.shortDate(_p.createdAt)));
    }
    list.addAll([
      _DField.heading('Property description'),
      _DField.desc('Description', _mat(Icons.description), _p.description),
    ]);
    if (!_excludeFeatures) {
      list.addAll([
        _DField.heading('Tenant preferences'),
        _DField('No. of family members', _png('member.PNG'),
            _p.rawStr('familyMembers')),
        _DField('Food habit', _png('food.png'), _p.rawStr('foodHabit')),
        _DField('Job type', _png('job.PNG'), _p.rawStr('jobType')),
        _DField('Pet', _png('pet.PNG'), _p.rawStr('petAllowed')),
      ]);
    }
    return list;
  }

  List<_DField> _addressFields() => [
        _DField('Country', _mat(Icons.public), _p.rawStr('country')),
        _DField('State', _png('state.png'), _p.state),
        _DField('City', _png('city.PNG'), _p.city),
        _DField('District', _mat(Icons.location_city), _p.district),
        _DField('Area', _png('area.png'), _p.area),
        _DField('Nagar', _png('nagar.PNG'), _p.nagar),
        _DField('Street name', _png('street.PNG'), _p.rawStr('streetName')),
        _DField('Door number', _png('door.png'), _p.rawStr('doorNumber')),
        _DField('Pincode', _mat(Icons.pin_drop), _p.rawStr('pinCode')),
        _DField('Lat. & lng.', _mat(Icons.my_location),
            _p.rawStr('locationCoordinates')),
      ];

  // English (Indian) number-to-words for the price subtitle (priceInWords).
  String _indianWords(num? value) {
    if (value == null) return '';
    var n = value.round();
    if (n <= 0) return '';
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
      'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy',
      'Eighty', 'Ninety'
    ];
    String two(int x) => x < 20
        ? ones[x]
        : '${tens[x ~/ 10]}${x % 10 != 0 ? ' ${ones[x % 10]}' : ''}';
    String three(int x) {
      final h = x ~/ 100;
      final r = x % 100;
      return '${h > 0 ? '${ones[h]} Hundred${r > 0 ? ' ' : ''}' : ''}${r > 0 ? two(r) : ''}';
    }

    final crore = n ~/ 10000000;
    n %= 10000000;
    final lakh = n ~/ 100000;
    n %= 100000;
    final thousand = n ~/ 1000;
    n %= 1000;
    final hundred = n;
    final parts = <String>[];
    if (crore > 0) parts.add('${three(crore)} Crore');
    if (lakh > 0) parts.add('${two(lakh)} Lakh');
    if (thousand > 0) parts.add('${two(thousand)} Thousand');
    if (hundred > 0) parts.add(three(hundred));
    return '${parts.join(' ')} Rupees';
  }
}

/// One overview field: a heading, a normal (icon + label + value) row, or the
/// full-width Description row.
class _DField {
  _DField(this.label, this.icon, this.value)
      : heading = false,
        description = false;
  _DField.heading(this.label)
      : icon = null,
        value = null,
        heading = true,
        description = false;
  _DField.desc(this.label, this.icon, this.value)
      : heading = false,
        description = true;

  final String label;
  final Widget? icon;
  final String? value;
  final bool heading;
  final bool description;
}
