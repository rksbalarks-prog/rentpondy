import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/screens/property_search_screen.dart';
import 'package:rent_pondy_user/screens/sort_property_screen.dart';
import 'package:rent_pondy_user/screens/tenant_assistance_screen.dart';
import 'package:rent_pondy_user/screens/tenant_search_screen.dart';
import 'package:rent_pondy_user/state/app_state.dart';
import 'package:rent_pondy_user/widgets/search_menu_dialog.dart';

/// Each row of the floating SEARCH menu has to land on the same screen the web
/// opens — the menu used to dead-end on a Rent-ID-only dialog and on the
/// tenant *request* form.
Future<void> _openMenu(WidgetTester tester) async {
  tester.view.physicalSize = const Size(1000, 3000);
  tester.view.devicePixelRatio = 1.0;
  addTearDown(tester.view.reset);

  await tester.pumpWidget(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: MaterialApp(
        home: Builder(
          builder: (context) => Scaffold(
            body: Center(
              child: ElevatedButton(
                onPressed: () => showSearchMenu(context),
                child: const Text('open'),
              ),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.tap(find.text('open'));
  await tester.pumpAndSettle();
}

Future<void> _tapRow(WidgetTester tester, String label) async {
  await tester.tap(find.text(label));
  // Long enough for the dialog's 300ms fade-out, short of the 5s auto-close.
  await tester.pump(const Duration(milliseconds: 400));
  await tester.pump();
}

void main() {
  testWidgets('the menu lists the four web actions', (tester) async {
    await _openMenu(tester);
    for (final label in [
      'Search Property',
      'Tenant Search',
      'Quick Sort',
      'Property Assistance',
      'CANCEL',
    ]) {
      expect(find.text(label), findsOneWidget, reason: 'missing $label');
    }
  });

  testWidgets('Search Property opens the full filter form', (tester) async {
    await _openMenu(tester);
    await _tapRow(tester, 'Search Property');

    expect(find.byType(PropertySearchScreen), findsOneWidget);
    // The old behaviour: a Rent-ID-only dialog. The Rent ID is now one field
    // among many.
    expect(find.text('SEARCH BY RENT ID'), findsOneWidget);
    expect(find.text('Select Property Mode'), findsOneWidget);
  });

  testWidgets('Tenant Search opens the search form, not the request form',
      (tester) async {
    await _openMenu(tester);
    await _tapRow(tester, 'Tenant Search');

    expect(find.byType(TenantSearchScreen), findsOneWidget);
    expect(find.byType(TenantAssistanceScreen), findsNothing);
    expect(find.text('SEARCH TENANT LIST'), findsOneWidget);
  });

  testWidgets('Quick Sort opens the sort hub', (tester) async {
    await _openMenu(tester);
    await _tapRow(tester, 'Quick Sort');

    expect(find.byType(SortPropertyScreen), findsOneWidget);
    expect(find.text('Price: Low to High'), findsOneWidget);
  });

  testWidgets('Property Assistance opens the tenant request form',
      (tester) async {
    await _openMenu(tester);
    await _tapRow(tester, 'Property Assistance');

    expect(find.byType(TenantAssistanceScreen), findsOneWidget);
  });
}
