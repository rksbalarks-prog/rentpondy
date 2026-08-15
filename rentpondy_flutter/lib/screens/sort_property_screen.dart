import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import 'filtered_property_screen.dart';

/// "Quick Sort" hub — the menu of sort/filter destinations (SortProperty.jsx).
/// Each row opens [FilteredPropertyScreen] with the matching predicate.
class SortPropertyScreen extends StatelessWidget {
  const SortPropertyScreen({super.key});

  static const _entries = <(IconData, PropertyFilter)>[
    (Icons.arrow_upward, PropertyFilter.lowToHigh),
    (Icons.arrow_downward, PropertyFilter.highToLow),
    (Icons.fiber_new_outlined, PropertyFilter.newToOld),
    (Icons.history, PropertyFilter.oldToNew),
    (Icons.photo_library_outlined, PropertyFilter.withImage),
    (Icons.location_on_outlined, PropertyFilter.withLocation),
    (Icons.visibility_off_outlined, PropertyFilter.zeroView),
    (Icons.account_balance, PropertyFilter.bankLoan),
    (Icons.home_outlined, PropertyFilter.houseBelow30L),
    (Icons.house_outlined, PropertyFilter.house30to50L),
    (Icons.crop_square, PropertyFilter.plotBelow15L),
    (Icons.grass_outlined, PropertyFilter.agriculturalLand),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: const Text('Quick Sort',
            style: TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _entries.length,
        separatorBuilder: (_, _) => const Divider(height: 1),
        itemBuilder: (context, i) {
          final (icon, filter) = _entries[i];
          return ListTile(
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.primary, size: 20),
            ),
            title: Text(filter.title,
                style: const TextStyle(
                    fontSize: 15, fontWeight: FontWeight.w500)),
            trailing: const Icon(Icons.chevron_right,
                color: AppColors.textMuted),
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => FilteredPropertyScreen(filter: filter),
            )),
          );
        },
      ),
    );
  }
}
