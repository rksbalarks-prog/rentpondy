import 'package:flutter/material.dart';

import '../l10n/l10n_ext.dart';
import '../theme/app_colors.dart';

/// One entry in the horizontal top bar.
class TopBarItem {
  const TopBarItem({
    required this.label,
    this.iconAsset,
    this.iconData,
    this.iconColor,
    this.content,
    this.route,
  });

  /// Translation key (e.g. 'menu.allProperty') — resolved via `context.tr`
  /// when the cell renders.
  final String label;
  final String? iconAsset; // image asset path
  final IconData? iconData; // for e.g. Tourist Place beach icon
  final Color? iconColor;
  final String? content; // switches the in-page content
  final String? route; // pushes a route instead
}

/// The horizontally-scrolling icon menu under the navbar. Active item gets a
/// dark underline + darker label (TopBar.jsx).
class TopBar extends StatelessWidget {
  const TopBar({
    super.key,
    required this.items,
    required this.activeContent,
    required this.onSelect,
    this.onRoute,
  });

  final List<TopBarItem> items;
  final String activeContent;
  final ValueChanged<String> onSelect;
  final ValueChanged<String>? onRoute;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 6,
            offset: const Offset(0, 4),
            spreadRadius: -2,
          ),
        ],
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(10, 8, 18, 0),
        child: Row(
          children: [
            for (final item in items) ...[
              _TopBarCell(
                item: item,
                active: item.content != null && item.content == activeContent,
                onTap: () {
                  if (item.route != null) {
                    onRoute?.call(item.route!);
                  } else if (item.content != null) {
                    onSelect(item.content!);
                  }
                },
              ),
              const SizedBox(width: 8),
            ],
          ],
        ),
      ),
    );
  }
}

class _TopBarCell extends StatelessWidget {
  const _TopBarCell({
    required this.item,
    required this.active,
    required this.onTap,
  });

  final TopBarItem item;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: item.iconData != null
                  ? Icon(item.iconData,
                      size: 24, color: item.iconColor ?? AppColors.touristOrange)
                  : Image.asset(item.iconAsset!, fit: BoxFit.contain),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.only(bottom: 3),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: active ? AppColors.primaryDeep : Colors.transparent,
                    width: 2,
                  ),
                ),
              ),
              child: Text(
                context.tr(item.label),
                style: TextStyle(
                  fontSize: 10,
                  color: active ? AppColors.textDark : Colors.grey,
                  fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
