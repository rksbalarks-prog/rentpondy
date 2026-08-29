import 'package:flutter/material.dart';

import '../models/area_summary.dart';
import '../models/property.dart';
import '../theme/app_colors.dart';
import '../widgets/property_card.dart';
import 'property_detail_screen.dart';

/// What opens when a home-feed area ticker card is tapped — the Flutter
/// equivalent of the `selectedPropertyCard` / `selectedTenantCard` popups in
/// AllProperty.jsx: everything in that area, filtered from the rows the ticker
/// already holds, so there is no second round trip.
class AreaListingsScreen extends StatelessWidget {
  const AreaListingsScreen({
    super.key,
    required this.card,
    required this.rows,
    required this.tenants,
  });

  final AreaCard card;

  /// The already-filtered raw rows for this area.
  final List<Map<String, dynamic>> rows;

  /// Tenant requirements when true, properties when false.
  final bool tenants;

  Color get _accent =>
      tenants ? const Color(0xFF11998E) : const Color(0xFF203A43);
  Color get _tint =>
      tenants ? const Color(0xFFEAFFF4) : const Color(0xFFE6F0F5);

  @override
  Widget build(BuildContext context) {
    final noun = rows.length == 1
        ? (tenants ? 'Tenant' : 'Property')
        : (tenants ? 'Tenants' : 'Properties');

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        backgroundColor: _tint,
        foregroundColor: _accent,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(card.area,
                style: TextStyle(
                    color: _accent, fontSize: 16, fontWeight: FontWeight.w800)),
            Text('${rows.length} $noun',
                style: TextStyle(
                    color: _accent.withValues(alpha: 0.8),
                    fontSize: 12,
                    fontWeight: FontWeight.w600)),
          ],
        ),
      ),
      body: rows.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  'Nothing listed in ${card.area} just now.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: AppColors.textMuted),
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: rows.length,
              itemBuilder: (context, i) =>
                  tenants ? _tenantRow(rows[i]) : _propertyRow(context, rows[i]),
            ),
    );
  }

  Widget _propertyRow(BuildContext context, Map<String, dynamic> json) {
    final property = Property.fromJson(json);
    return PropertyCard(
      property: property,
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => PropertyDetailScreen(
            rentId: property.rentId,
            initial: property,
          ),
        ),
      ),
    );
  }

  /// A tenant's requirement. The owner's contact is deliberately NOT shown
  /// here — revealing a tenant number costs points and belongs to the Tenant
  /// List screen that already implements that paywall.
  Widget _tenantRow(Map<String, dynamic> json) {
    String? str(String key) {
      final v = json[key];
      final s = v?.toString().trim();
      return (s == null || s.isEmpty) ? null : s;
    }

    final title = [str('propertyMode'), str('propertyType')]
        .whereType<String>()
        .join(' | ');
    final where = [str('area'), str('city')].whereType<String>().join(', ');
    final budget = str('maxPrice') ?? str('minPrice');

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _accent.withValues(alpha: 0.35)),
        boxShadow: [
          BoxShadow(
            color: _accent.withValues(alpha: 0.12),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.isEmpty ? 'Tenant requirement' : title,
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 15, color: _accent)),
          if (where.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(where,
                  style: const TextStyle(
                      color: AppColors.textGrey, fontSize: 13)),
            ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 14,
            runSpacing: 4,
            children: [
              if (str('bedrooms') != null) _chip('${str('bedrooms')} BHK'),
              if (budget != null) _chip('Budget ₹$budget'),
              if (str('Ra_Id') != null) _chip('ID ${str('Ra_Id')}'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _chip(String text) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: _tint,
          borderRadius: BorderRadius.circular(5),
        ),
        child: Text(text,
            style: TextStyle(
                fontSize: 12, fontWeight: FontWeight.w700, color: _accent)),
      );
}
