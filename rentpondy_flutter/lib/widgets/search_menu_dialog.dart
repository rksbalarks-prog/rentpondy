import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n/l10n_ext.dart';
import '../models/property.dart';
import '../routes.dart';
import '../screens/property_detail_screen.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// The menu the floating SEARCH button opens.
///
/// Ports the web app's search-menu modal (AllProperty.jsx ~8431-8519): a dark
/// scrim over a white card with four actions, dismissed by tapping outside, by
/// CANCEL, or automatically after 5 seconds.
Future<void> showSearchMenu(BuildContext context) {
  return showGeneralDialog<void>(
    context: context,
    // rgba(64, 64, 64, 0.9)
    barrierColor: const Color(0xE6404040),
    barrierDismissible: true,
    barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    // animation: fadeIn 0.3s ease-in-out
    transitionDuration: const Duration(milliseconds: 300),
    transitionBuilder: (context, anim, _, child) => FadeTransition(
      opacity: CurvedAnimation(parent: anim, curve: Curves.easeInOut),
      child: child,
    ),
    pageBuilder: (_, _, _) => const _SearchMenu(),
  );
}

class _SearchMenu extends StatefulWidget {
  const _SearchMenu();

  @override
  State<_SearchMenu> createState() => _SearchMenuState();
}

class _SearchMenuState extends State<_SearchMenu> {
  Timer? _autoClose;

  @override
  void initState() {
    super.initState();
    // "Auto-close search menu after 5 seconds if user doesn't interact."
    _autoClose = Timer(const Duration(seconds: 5), () {
      if (mounted) Navigator.of(context).maybePop();
    });
  }

  @override
  void dispose() {
    _autoClose?.cancel();
    super.dispose();
  }

  void _close() => Navigator.of(context).pop();

  void _go(String route, String titleKey) {
    _close();
    pushRoute(context, route, context.trRead(titleKey));
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32), // Bootstrap .rounded-5 = 2rem
        child: Container(
          width: 350,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _row(
                icon: Icons.home,
                label: context.tr('search.property'),
                onTap: () {
                  _close();
                  showRentIdSearch(context);
                },
              ),
              _row(
                icon: Icons.people,
                label: context.tr('search.tenant'),
                onTap: () => _go('/tenant-search', 'title.tenantAssistant'),
              ),
              _row(
                icon: Icons.sort,
                label: context.tr('search.quickSort'),
                onTap: () => _go('/Sort-Property', 'more.quickSort'),
              ),
              _row(
                icon: Icons.headset_mic,
                label: context.tr('search.assistance'),
                onTap: () => _go('/buyer-assistance', 'title.tenantAssistant'),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6)),
                ),
                onPressed: _close,
                child: Text(
                  context.tr('common.cancel').toUpperCase(),
                  style: const TextStyle(
                      fontSize: 10, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// background #DFDFDF, color #5E5E5E, 600 weight, 15px, icon then label,
  /// left-aligned with ps-3 (12px) — the web's `.btn-light` rows.
  Widget _row({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFDFDFDF),
            foregroundColor: const Color(0xFF5E5E5E),
            elevation: 0,
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
              side: const BorderSide(color: Color(0xFFCFCFCF)),
            ),
          ),
          onPressed: onTap,
          child: Row(
            children: [
              Icon(icon, size: 18),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                      fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// "Search Property" — the web opens a Bootstrap filter modal whose headline
/// field is "SEARCH BY RENT ID". Flutter has no filter sheet, so this ports
/// that lookup: enter a Rent ID, land on the property.
Future<void> showRentIdSearch(BuildContext context) {
  return showDialog<void>(
    context: context,
    builder: (_) => const _RentIdSearchDialog(),
  );
}

class _RentIdSearchDialog extends StatefulWidget {
  const _RentIdSearchDialog();

  @override
  State<_RentIdSearchDialog> createState() => _RentIdSearchDialogState();
}

class _RentIdSearchDialogState extends State<_RentIdSearchDialog> {
  final _ctrl = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final id = _ctrl.text.trim();
    if (id.isEmpty || _busy) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    final api = context.read<AppState>().api;
    final navigator = Navigator.of(context);
    Property? found;
    try {
      found = await api.fetchPropertyDetail(id);
    } catch (_) {
      found = null;
    }
    if (!mounted) return;
    if (found == null) {
      setState(() {
        _busy = false;
        _error = context.trRead('search.notFound');
      });
      return;
    }
    navigator.pop();
    navigator.push(MaterialPageRoute(
      builder: (_) => PropertyDetailScreen(rentId: id, initial: found!),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      title: Text(context.tr('search.byRentId'),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: _ctrl,
            autofocus: true,
            enabled: !_busy,
            textInputAction: TextInputAction.search,
            onSubmitted: (_) => _submit(),
            decoration: InputDecoration(
              hintText: context.tr('search.rentIdHint'),
              isDense: true,
              filled: true,
              fillColor: const Color(0xFFF1F3F5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(_error!,
                style: const TextStyle(color: Color(0xFFD32F2F), fontSize: 12)),
          ],
        ],
      ),
      actions: [
        TextButton(
          onPressed: _busy ? null : () => Navigator.of(context).pop(),
          child: Text(context.tr('common.cancel')),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white),
          onPressed: _busy ? null : _submit,
          child: _busy
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                      strokeWidth: 2, color: Colors.white))
              : Text(context.tr('common.search')),
        ),
      ],
    );
  }
}
