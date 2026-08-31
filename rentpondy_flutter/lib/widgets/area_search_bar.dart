import 'package:flutter/material.dart';

import '../l10n/l10n_ext.dart';
import '../theme/app_colors.dart';

/// One row of the suggestion dropdown: an area and the pincode it maps to.
class AreaSuggestion {
  const AreaSuggestion(this.area, this.pincode);

  final String area;
  final String pincode;
}

/// The home-feed area search box, ported from AllProperty.jsx (~5850-6060):
/// a pill-shaped bar with a leading magnifier, a clear "✕", and a dropdown
/// that matches the typed text against BOTH area names and pincodes
/// (so "605" lists every 605xxx area, exactly like the web).
///
/// The widget is presentational — the owning screen holds the query, the
/// suggestion list and the selection, the same way AllProperty.jsx keeps
/// `navbarSearchValue` / `navbarAreaSuggestions` in its own state.
class AreaSearchBar extends StatelessWidget {
  const AreaSearchBar({
    super.key,
    required this.controller,
    required this.focusNode,
    required this.suggestions,
    required this.showSuggestions,
    required this.onChanged,
    required this.onSelect,
    required this.onClear,
    required this.onSubmitted,
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final List<AreaSuggestion> suggestions;
  final bool showSuggestions;
  final ValueChanged<String> onChanged;
  final ValueChanged<AreaSuggestion> onSelect;
  final VoidCallback onClear;
  final VoidCallback onSubmitted;

  @override
  Widget build(BuildContext context) {
    final hasText = controller.text.isNotEmpty;

    return Padding(
      padding: const EdgeInsets.fromLTRB(6, 4, 6, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Pill bar ──────────────────────────────────────────────────
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFFFFFFF), Color(0xFFF0F2FF)],
              ),
              borderRadius: BorderRadius.circular(40),
              border: Border.all(color: const Color(0xFFE0E5FF), width: 1.5),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x1A4F4B7E), // rgba(79,75,126,0.10)
                  blurRadius: 16,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6),
                  child: Icon(Icons.search, size: 20, color: AppColors.primary),
                ),
                Expanded(
                  child: TextField(
                    controller: controller,
                    focusNode: focusNode,
                    onChanged: onChanged,
                    onSubmitted: (_) => onSubmitted(),
                    textInputAction: TextInputAction.search,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.3,
                      color: Color(0xFF111111),
                    ),
                    decoration: InputDecoration(
                      isDense: true,
                      border: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      contentPadding:
                          const EdgeInsets.symmetric(vertical: 12),
                      hintText: context.tr('search.areaHint'),
                      hintStyle: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        letterSpacing: 0.3,
                        color: Color(0xFF9A9AB8),
                      ),
                    ),
                  ),
                ),
                if (hasText)
                  InkWell(
                    onTap: onClear,
                    customBorder: const CircleBorder(),
                    child: const Padding(
                      padding: EdgeInsets.all(6),
                      child: Icon(Icons.close,
                          size: 18, color: Color(0xFFA8A8D8)),
                    ),
                  ),
              ],
            ),
          ),

          // ── Suggestions ───────────────────────────────────────────────
          if (showSuggestions && suggestions.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(top: 4),
              constraints: const BoxConstraints(maxHeight: 260),
              decoration: BoxDecoration(
                color: Colors.white,
                border:
                    Border.all(color: const Color(0xFFE8E8FF), width: 1.5),
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x1F4F4B7E), // rgba(79,75,126,0.12)
                    blurRadius: 24,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: ListView.separated(
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.onDrag,
                itemCount: suggestions.length,
                separatorBuilder: (_, _) =>
                    const Divider(height: 1, color: Color(0xFFF0F0F5)),
                itemBuilder: (_, i) {
                  final s = suggestions[i];
                  return InkWell(
                    onTap: () => onSelect(s),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 18, vertical: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Flexible(
                            child: Text(
                              s.area,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Color(0xFF333333),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '– ${s.pincode}',
                            style: const TextStyle(
                              color: Color(0xFF333333),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
