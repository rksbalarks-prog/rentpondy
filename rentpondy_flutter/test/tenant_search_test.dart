import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/models/tenant_request.dart';
import 'package:rent_pondy_user/screens/tenant_search_screen.dart';
import 'package:rent_pondy_user/state/app_state.dart';

TenantRequest _t(Map<String, dynamic> overrides) => TenantRequest.fromJson({
      '_id': 't1',
      'Ra_Id': 1024,
      'propertyMode': 'Residential',
      'propertyType': 'House',
      'bedrooms': '2',
      'floorNo': '1st Floor',
      'city': 'Pondicherry',
      'state': 'Puducherry',
      'area': 'Lawspet',
      'minPrice': '5000',
      'maxPrice': '10000',
      ...overrides,
    });

void main() {
  group('TenantSearchFilters.matches', () {
    test('an empty filter keeps everything', () {
      expect(TenantSearchFilters().matches(_t({})), isTrue);
    });

    test('ID is a substring match on Ra_Id', () {
      final f = TenantSearchFilters()..['id'] = '102';
      expect(f.matches(_t({'Ra_Id': 1024})), isTrue);
      expect(f.matches(_t({'Ra_Id': 77})), isFalse);
    });

    test('mode / type / bedrooms / floor / city / state / area match exactly',
        () {
      final f = TenantSearchFilters()
        ..['propertyType'] = 'house'
        ..['city'] = 'Pondicherry'
        ..['floorNo'] = '1st Floor';
      expect(f.matches(_t({})), isTrue);
      expect(f.matches(_t({'city': 'Chennai'})), isFalse);
      expect(f.matches(_t({'floorNo': '2nd Floor'})), isFalse);
    });

    test('Min Rental keeps tenants whose budget reaches it', () {
      final f = TenantSearchFilters()..['minPrice'] = '8000';
      // Budget 5000-10000 tops out above 8000 -> a match.
      expect(f.matches(_t({})), isTrue);
      // Budget 2000-6000 never reaches 8000.
      expect(f.matches(_t({'minPrice': '2000', 'maxPrice': '6000'})), isFalse);
    });

    test('Max Rental keeps tenants whose budget starts at or below it', () {
      final f = TenantSearchFilters()..['maxPrice'] = '6000';
      expect(f.matches(_t({})), isTrue);
      // Budget starts at 9000, above the ceiling.
      expect(f.matches(_t({'minPrice': '9000', 'maxPrice': '15000'})), isFalse);
    });

    test('every filled field has to match (AND, not OR)', () {
      final f = TenantSearchFilters()
        ..['propertyType'] = 'House'
        ..['area'] = 'Mudaliarpet';
      expect(f.matches(_t({})), isFalse);
    });
  });

  group('TenantSearchScreen', () {
    testWidgets('shows the web form\'s fields and the search button',
        (tester) async {
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.reset);

      await tester.pumpWidget(
        ChangeNotifierProvider(
          create: (_) => AppState(),
          child: const MaterialApp(home: TenantSearchScreen()),
        ),
      );
      await tester.pump();

      expect(find.text('Tenant Assistance Search'), findsOneWidget);
      for (final label in [
        'ID',
        'Select Min Rental',
        'Select Max Rental',
        'Select Property Mode',
        'Select Property Type',
        'Select Bedrooms',
        'Select Floor No',
        'Select state',
        'City',
        'area',
        'SEARCH TENANT LIST',
      ]) {
        expect(find.text(label), findsOneWidget, reason: 'missing $label');
      }
    });
  });
}
