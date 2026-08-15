import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../l10n/l10n_ext.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// The purple bar at the very top with the "📍 Pondicherry / 📍 Chennai"
/// pill toggle — a 1:1 port of the city switcher in MoblieViews.jsx.
class CitySwitcher extends StatelessWidget {
  const CitySwitcher({super.key});

  static const _bases = ['PY', 'CH'];

  String _label(BuildContext context, String base) =>
      base == 'CH' ? context.tr('city.chennai') : context.tr('city.pondicherry');

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Container(
      color: AppColors.primary,
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          for (final base in _bases) ...[
            _Pill(
              label: _label(context, base),
              active: base == app.activeBase,
              onTap: () => app.setActiveBase(base),
            ),
            if (base != _bases.last) const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: active ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 14),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: Colors.white),
        ),
        child: Text(
          '📍 $label',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: active ? AppColors.primary : Colors.white,
          ),
        ),
      ),
    );
  }
}
