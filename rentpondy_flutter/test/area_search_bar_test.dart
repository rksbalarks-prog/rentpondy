import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/state/app_state.dart';
import 'package:rent_pondy_user/widgets/area_search_bar.dart';

/// Drives [AreaSearchBar] with the same matching rule the home feed uses, so
/// the test covers what a user actually does: type, see hits, pick one.
class _Harness extends StatefulWidget {
  const _Harness({required this.index, required this.onSelect});

  final Map<String, String> index;
  final ValueChanged<AreaSuggestion> onSelect;

  @override
  State<_Harness> createState() => _HarnessState();
}

class _HarnessState extends State<_Harness> {
  final _ctrl = TextEditingController();
  final _focus = FocusNode();
  List<AreaSuggestion> _hits = const [];
  bool _show = false;

  void _onChanged(String value) {
    final q = value.trim().toLowerCase();
    setState(() {
      _hits = q.isEmpty
          ? const []
          : widget.index.entries
              .where((e) =>
                  e.key.toLowerCase().contains(q) || e.value.contains(q))
              .map((e) => AreaSuggestion(e.key, e.value))
              .toList();
      _show = _hits.isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AreaSearchBar(
      controller: _ctrl,
      focusNode: _focus,
      suggestions: _hits,
      showSuggestions: _show,
      onChanged: _onChanged,
      onSelect: (s) {
        _ctrl.text = s.area;
        setState(() {
          _hits = const [];
          _show = false;
        });
        widget.onSelect(s);
      },
      onClear: () {
        _ctrl.clear();
        setState(() {
          _hits = const [];
          _show = false;
        });
      },
      onSubmitted: () {},
    );
  }
}

Future<void> _pump(WidgetTester tester, _Harness harness) async {
  await tester.pumpWidget(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: MaterialApp(home: Scaffold(body: harness)),
    ),
  );
  await tester.pump();
}

void main() {
  const index = {
    'Lawspet': '605008',
    'White Town': '605001',
    'Mylapore': '600004',
  };

  testWidgets('typing an area name lists matching suggestions',
      (tester) async {
    await _pump(tester, _Harness(index: index, onSelect: (_) {}));

    await tester.enterText(find.byType(TextField), 'law');
    await tester.pump();

    expect(find.text('Lawspet'), findsOneWidget);
    expect(find.text('– 605008'), findsOneWidget);
    expect(find.text('White Town'), findsNothing);
  });

  testWidgets('a partial pincode matches every area under it', (tester) async {
    await _pump(tester, _Harness(index: index, onSelect: (_) {}));

    await tester.enterText(find.byType(TextField), '605');
    await tester.pump();

    expect(find.text('Lawspet'), findsOneWidget);
    expect(find.text('White Town'), findsOneWidget);
    expect(find.text('Mylapore'), findsNothing);
  });

  testWidgets('picking a suggestion reports it and closes the dropdown',
      (tester) async {
    AreaSuggestion? picked;
    await _pump(
      tester,
      _Harness(index: index, onSelect: (s) => picked = s),
    );

    await tester.enterText(find.byType(TextField), 'white');
    await tester.pump();
    await tester.tap(find.text('White Town'));
    await tester.pump();

    expect(picked?.area, 'White Town');
    expect(picked?.pincode, '605001');
    // Dropdown gone; the name stays in the box.
    expect(find.text('– 605001'), findsNothing);
    expect(
      tester.widget<TextField>(find.byType(TextField)).controller?.text,
      'White Town',
    );
  });

  testWidgets('the clear button empties the box', (tester) async {
    await _pump(tester, _Harness(index: index, onSelect: (_) {}));

    await tester.enterText(find.byType(TextField), 'law');
    await tester.pump();
    await tester.tap(find.byIcon(Icons.close));
    await tester.pump();

    expect(
      tester.widget<TextField>(find.byType(TextField)).controller?.text,
      isEmpty,
    );
    expect(find.text('Lawspet'), findsNothing);
  });
}
