import 'package:flutter/material.dart';

import '../l10n/l10n_ext.dart';
import '../theme/app_colors.dart';

/// Item identifiers for the bottom bar, matching BottomNavigation.jsx names.
class BottomNavKeys {
  static const home = 'bottomHome';
  static const property = 'bottomProperty';
  static const add = 'add';
  static const buyer = 'bottomBuyer';
  static const more = 'bottomMore';
}

/// The 5-slot bottom bar with a raised circular "Add" FAB in the centre.
/// Ports BottomNavigation.jsx (active #4F4B7E, inactive #888).
class RpBottomNavigation extends StatefulWidget {
  const RpBottomNavigation({
    super.key,
    required this.activeItem,
    required this.onSelect,
  });

  final String activeItem;
  final ValueChanged<String> onSelect;

  @override
  State<RpBottomNavigation> createState() => _RpBottomNavigationState();
}

class _RpBottomNavigationState extends State<RpBottomNavigation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _fab;

  @override
  void initState() {
    super.initState();
    // fabInnerPulse — 5s loop, lifts early then rests.
    _fab = AnimationController(vsync: this, duration: const Duration(seconds: 5))
      ..repeat();
  }

  @override
  void dispose() {
    _fab.dispose();
    super.dispose();
  }

  double _lift(double t) {
    // 0→-20 by 8%, hold to 20%, back to 0 by 36%, rest.
    if (t < 0.08) return -20 * (t / 0.08);
    if (t < 0.20) return -20;
    if (t < 0.36) return -20 * (1 - (t - 0.20) / 0.16);
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 64,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Row(
            children: [
              _NavItem(
                icon: Icons.home_outlined,
                label: context.tr('nav.home'),
                active: true, // Home is always the active/home tint
                onTap: () => widget.onSelect(BottomNavKeys.home),
              ),
              _NavItem(
                icon: Icons.apartment_outlined,
                label: context.tr('nav.properties'),
                active: widget.activeItem == BottomNavKeys.property,
                onTap: () => widget.onSelect(BottomNavKeys.property),
              ),
              const Expanded(child: SizedBox()), // gap for FAB
              _NavItem(
                icon: Icons.account_circle_outlined,
                label: context.tr('nav.assistant'),
                active: widget.activeItem == BottomNavKeys.buyer,
                onTap: () => widget.onSelect(BottomNavKeys.buyer),
              ),
              _NavItem(
                icon: Icons.more_horiz,
                label: context.tr('nav.more'),
                active: widget.activeItem == BottomNavKeys.more,
                onTap: () => widget.onSelect(BottomNavKeys.more),
              ),
            ],
          ),
          // Raised circular Add button
          Positioned(
            top: -22,
            // The pulsing FAB repaints every frame; keep it off the bottom
            // bar's layer so the nav items don't repaint with it.
            child: RepaintBoundary(
              child: AnimatedBuilder(
              animation: _fab,
              builder: (context, child) => Transform.translate(
                offset: Offset(0, _lift(_fab.value)),
                child: child,
              ),
              child: GestureDetector(
                onTap: () => widget.onSelect(BottomNavKeys.add),
                child: Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 4),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.primary,
                    ),
                    child: const Icon(Icons.add_home_work_outlined,
                        color: Colors.white, size: 30),
                  ),
                ),
              ),
            ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? AppColors.primary : AppColors.textMuted;
    return Expanded(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 24, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: color,
                fontWeight: active ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
