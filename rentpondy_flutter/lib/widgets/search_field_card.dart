import 'package:flutter/material.dart';

import '../constants/assets.dart';
import '../theme/app_colors.dart';
import 'option_picker_dialog.dart';

/// rgba(38, 104, 190, 0.1) — the `.input-card` shadow used on every search
/// field in the web modals.
const Color kSearchCardShadow = Color(0x1A2668BE);
const Color kSearchCheck = Color(0xFF4CAF50);

/// The white `.input-card` row shared by every field in the Search Property /
/// Advanced Search / Tenant Assistance Search forms: a left icon box divided
/// from the input by a #4F4B7E rule, and a green check once the field is set.
class SearchFieldCard extends StatelessWidget {
  const SearchFieldCard({
    super.key,
    required this.field,
    required this.child,
    this.filled = false,
  });

  final String field;
  final Widget child;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(6),
        boxShadow: const [
          BoxShadow(
              color: kSearchCardShadow, blurRadius: 10, offset: Offset(0, 4)),
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
            child: Center(child: searchFieldIcon(field)),
          ),
          Expanded(child: child),
          if (filled)
            const Padding(
              padding: EdgeInsets.only(right: 8),
              child: Icon(Icons.check_circle, color: kSearchCheck, size: 18),
            ),
        ],
      ),
    );
  }
}

/// The same PNG icons the web puts in each field's left box, falling back to a
/// Material glyph where the app has no matching asset.
Widget searchFieldIcon(String field) {
  const png = {
    'id': 'id.PNG',
    'minPrice': 'Price Mini-01.png',
    'maxPrice': 'Price maxi-01.png',
    'propertyMode': 'prop_mode.PNG',
    'propertyType': 'prop_type.PNG',
    'rentType': 'rent_type.PNG',
    'bedrooms': 'bed.PNG',
    'floorNo': 'floor.PNG',
    'state': 'state.png',
    'city': 'city.PNG',
    'area': 'area.png',
    'facing': 'facing.png',
    'attachedBathrooms': 'attach.png',
    'lift': 'lift.PNG',
    'postedBy': 'posted_by.png',
    'phoneNumber': 'phone.PNG',
  };
  const mat = {
    'pinCode': Icons.pin_drop,
    'western': Icons.wc,
    'carParking': Icons.directions_car,
    'wheelChairAvailable': Icons.accessible,
  };
  final asset = png[field];
  if (asset != null) {
    return Image.asset('${Assets.detailIconBase}$asset', width: 22, height: 22);
  }
  return Icon(mat[field] ?? Icons.edit_note, color: AppColors.primary, size: 22);
}

/// A field whose value is picked from the admin-editable `/fetch` options.
/// Tapping opens the app's standard [OptionPickerDialog].
class SearchDropdownField extends StatelessWidget {
  const SearchDropdownField({
    super.key,
    required this.field,
    required this.label,
    required this.options,
    required this.value,
    required this.onChanged,
  });

  final String field;

  /// Placeholder shown while empty, e.g. "Select minPrice".
  final String label;
  final List<String> options;
  final String? value;
  final ValueChanged<String?> onChanged;

  Future<void> _pick(BuildContext context) async {
    final result = await showDialog<PickerResult>(
      context: context,
      builder: (_) => OptionPickerDialog(label: label, options: options),
    );
    if (result?.action == PickerAction.select) onChanged(result!.value);
  }

  @override
  Widget build(BuildContext context) {
    final v = value;
    final filled = v != null && v.isNotEmpty;
    return SearchFieldCard(
      field: field,
      filled: filled,
      child: InkWell(
        onTap: options.isEmpty ? null : () => _pick(context),
        child: Container(
          height: 46,
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  filled ? v : label,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                      fontSize: 14,
                      color: filled ? Colors.black87 : Colors.grey),
                ),
              ),
              if (filled)
                InkWell(
                  onTap: () => onChanged(null),
                  child: const Icon(Icons.close, size: 16, color: Colors.grey),
                )
              else
                const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}

/// A plain typed field (Rent ID, State, City, Phone Number).
class SearchTextField extends StatelessWidget {
  const SearchTextField({
    super.key,
    required this.field,
    required this.hint,
    required this.controller,
    required this.onChanged,
    this.keyboard,
  });

  final String field;
  final String hint;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final TextInputType? keyboard;

  @override
  Widget build(BuildContext context) {
    return SearchFieldCard(
      field: field,
      filled: controller.text.trim().isNotEmpty,
      child: TextField(
        controller: controller,
        keyboardType: keyboard,
        onChanged: onChanged,
        style: const TextStyle(fontSize: 14, color: Colors.black87),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
          isDense: true,
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 13),
        ),
      ),
    );
  }
}

/// A typed field with a suggestion list underneath — Area and Pincode.
/// Selecting a row calls [onSelected], which is where Area fills in Pincode.
class SearchAutocompleteField extends StatelessWidget {
  const SearchAutocompleteField({
    super.key,
    required this.field,
    required this.hint,
    required this.controller,
    required this.suggestions,
    required this.onChanged,
    required this.onSelected,
    this.keyboard,
  });

  final String field;
  final String hint;
  final TextEditingController controller;

  /// Already filtered by the owning screen; empty hides the list.
  final List<String> suggestions;
  final ValueChanged<String> onChanged;
  final ValueChanged<String> onSelected;
  final TextInputType? keyboard;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SearchTextField(
          field: field,
          hint: hint,
          controller: controller,
          onChanged: onChanged,
          keyboard: keyboard,
        ),
        if (suggestions.isNotEmpty)
          // Transform, not a negative margin — Container forbids those.
          Transform.translate(
            offset: const Offset(0, -8),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              constraints: const BoxConstraints(maxHeight: 220),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(6),
                boxShadow: const [
                  BoxShadow(color: kSearchCardShadow, blurRadius: 8),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: ListView.separated(
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: suggestions.length,
                separatorBuilder: (_, _) =>
                    const Divider(height: 1, color: Color(0xFFF0F0F0)),
                itemBuilder: (_, i) => InkWell(
                  onTap: () => onSelected(suggestions[i]),
                  child: Container(
                    width: double.infinity,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
                    child: Text(suggestions[i],
                        style: const TextStyle(color: Colors.black87)),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

/// The section headings inside the modals ("Basic Property Info").
class SearchSectionHeading extends StatelessWidget {
  const SearchSectionHeading(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: 4, bottom: 10),
        child: Text(text,
            style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
                fontSize: 17)),
      );
}

/// The outlined action buttons at the foot of each modal (CLEAR / SEARCH /
/// GO TO ADVANCED SEARCH / HOME).
class SearchActionButton extends StatelessWidget {
  const SearchActionButton({
    super.key,
    required this.label,
    required this.color,
    required this.onPressed,
    this.borderWidth = 2,
  });

  final String label;
  final Color color;
  final VoidCallback onPressed;
  final double borderWidth;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        foregroundColor: color,
        backgroundColor: Colors.white,
        side: BorderSide(color: color, width: borderWidth),
        padding: const EdgeInsets.symmetric(vertical: 13),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      ),
      onPressed: onPressed,
      child: Text(label,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
    );
  }
}
