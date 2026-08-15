import 'package:flutter/material.dart';

/// What the user did in the picker.
enum PickerAction { select, skip, prev, close }

/// Result of an [OptionPickerDialog]: the action + the chosen value (for
/// [PickerAction.select]).
class PickerResult {
  const PickerResult(this.action, [this.value]);
  final PickerAction action;
  final String? value;
}

/// Full-screen dropdown picker used by the property + assistance forms — the
/// Flutter equivalent of the web's `renderDropdown`: a centered white card with
/// a filterable option list, plus **Prev / Skip / Close** so the caller can
/// auto-advance through the fields (selecting an option jumps to the next
/// dropdown, exactly like the web).
///
/// `await showDialog<PickerResult>(...)` resolves to the action taken.
class OptionPickerDialog extends StatefulWidget {
  const OptionPickerDialog({
    super.key,
    required this.label,
    required this.options,
    this.showPrev = false,
    this.showSkip = false,
  });

  final String label;
  final List<String> options;
  final bool showPrev;
  final bool showSkip;

  @override
  State<OptionPickerDialog> createState() => _OptionPickerDialogState();
}

class _OptionPickerDialogState extends State<OptionPickerDialog> {
  String _q = '';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.options
        .where((o) => o.toLowerCase().contains(_q.toLowerCase()))
        .toList();
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 300, maxHeight: 480),
        padding: const EdgeInsets.all(10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Text.rich(TextSpan(
                text: 'Select or Search ',
                style: const TextStyle(color: Colors.grey, fontSize: 15),
                children: [
                  TextSpan(
                      text: widget.label,
                      style: const TextStyle(
                          color: Color(0xFF0B57CF),
                          fontWeight: FontWeight.w500)),
                ],
              )),
            ),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFEEF4FA),
                borderRadius: BorderRadius.circular(25),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      autofocus: true,
                      decoration: const InputDecoration(
                        hintText: 'Filter options...',
                        border: InputBorder.none,
                        isDense: true,
                      ),
                      onChanged: (v) => setState(() => _q = v),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Flexible(
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: filtered.length,
                separatorBuilder: (_, _) =>
                    const Divider(height: 1, color: Color(0xFFD0D7DE)),
                itemBuilder: (_, i) => InkWell(
                  onTap: () => Navigator.pop(
                      context, PickerResult(PickerAction.select, filtered[i])),
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: Text(filtered[i],
                        style: const TextStyle(
                            color: Colors.grey, fontWeight: FontWeight.w300)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                if (widget.showPrev)
                  _chip('Prev',
                      () => Navigator.pop(
                          context, const PickerResult(PickerAction.prev)),
                      bg: const Color(0xFFEAEAF6), fg: const Color(0xFF0B57CF)),
                if (widget.showPrev) const SizedBox(width: 6),
                if (widget.showSkip)
                  _chip('Skip',
                      () => Navigator.pop(
                          context, const PickerResult(PickerAction.skip)),
                      bg: const Color(0xFFEAEAF6), fg: const Color(0xFF0B57CF)),
                const Spacer(),
                _chip('Close',
                    () => Navigator.pop(
                        context, const PickerResult(PickerAction.close)),
                    bg: const Color(0xFF0B57CF), fg: Colors.white),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _chip(String text, VoidCallback onTap,
      {required Color bg, required Color fg}) {
    return TextButton(
      onPressed: onTap,
      style: TextButton.styleFrom(
        backgroundColor: bg,
        foregroundColor: fg,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        minimumSize: Size.zero,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
      child: Text(text),
    );
  }
}
