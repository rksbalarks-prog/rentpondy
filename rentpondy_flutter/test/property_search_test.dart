import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/models/property.dart';
import 'package:rent_pondy_user/screens/property_search_screen.dart';
import 'package:rent_pondy_user/state/app_state.dart';

Property _p(Map<String, dynamic> overrides) => Property.fromJson({
      '_id': 'x1',
      'rentId': 'RP1234',
      'rentalAmount': 8000,
      'propertyMode': 'Residential',
      'propertyType': 'House',
      'rentType': 'Monthly',
      'bedrooms': '2',
      'floorNo': '1st Floor',
      'state': 'Puducherry',
      'area': 'Lawspet',
      'pinCode': '605008',
      ...overrides,
    });

void main() {
  group('PropertySearchFilters.matches', () {
    test('an empty filter keeps everything', () {
      expect(PropertySearchFilters().matches(_p({})), isTrue);
    });

    test('Rent ID is a substring match, as on the web', () {
      final f = PropertySearchFilters()..['id'] = '123';
      expect(f.matches(_p({'rentId': 'RP1234'})), isTrue);
      expect(f.matches(_p({'rentId': 'RP9999'})), isFalse);
    });

    test('the price range compares against rentalAmount', () {
      final f = PropertySearchFilters()
        ..['minPrice'] = '5000'
        ..['maxPrice'] = '10000';
      expect(f.matches(_p({'rentalAmount': 8000})), isTrue);
      expect(f.matches(_p({'rentalAmount': 4000})), isFalse);
      expect(f.matches(_p({'rentalAmount': 12000})), isFalse);
    });

    test('mode / type / bedrooms match exactly, ignoring case', () {
      final f = PropertySearchFilters()
        ..['propertyMode'] = 'residential'
        ..['propertyType'] = 'House'
        ..['bedrooms'] = '2';
      expect(f.matches(_p({})), isTrue);
      expect(f.matches(_p({'bedrooms': '3'})), isFalse);
      expect(f.matches(_p({'propertyType': 'Villa'})), isFalse);
    });

    test('area and pincode both have to match', () {
      final f = PropertySearchFilters()
        ..['area'] = 'Lawspet'
        ..['pinCode'] = '605008';
      expect(f.matches(_p({})), isTrue);
      expect(f.matches(_p({'pinCode': '605010'})), isFalse);
      expect(f.matches(_p({'area': 'Mudaliarpet'})), isFalse);
    });

    test('advanced-only fields are read off the raw document', () {
      final f = PropertySearchFilters()..['lift'] = 'Yes';
      expect(f.matches(_p({'lift': 'Yes'})), isTrue);
      expect(f.matches(_p({'lift': 'No'})), isFalse);
      // Absent on the record -> cannot match.
      expect(f.matches(_p({})), isFalse);
    });

    test('every filled field has to match (AND, not OR)', () {
      final f = PropertySearchFilters()
        ..['propertyType'] = 'House'
        ..['area'] = 'Mudaliarpet';
      expect(f.matches(_p({})), isFalse);
    });

    test('clearing a field removes it from the filter', () {
      final f = PropertySearchFilters()..['bedrooms'] = '2';
      expect(f.isEmpty, isFalse);
      f['bedrooms'] = null;
      expect(f.isEmpty, isTrue);
      expect(f.matches(_p({'bedrooms': '9'})), isTrue);
    });
  });

  group('PropertySearchScreen', () {
    Future<void> pump(WidgetTester tester,
        {PropertySearchMode mode = PropertySearchMode.simple}) async {
      // Both forms are longer than a phone screen; give the test a tall
      // viewport so every field is laid out and findable.
      tester.view.physicalSize = const Size(1000, 3000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        ChangeNotifierProvider(
          create: (_) => AppState(),
          child: MaterialApp(home: PropertySearchScreen(mode: mode)),
        ),
      );
      await tester.pump();
    }

    testWidgets('the simple form shows the web modal\'s fields and buttons',
        (tester) async {
      await pump(tester);

      expect(find.text('Search Property'), findsOneWidget);
      for (final label in [
        'SEARCH BY RENT ID',
        'Select minPrice',
        'Select maxPrice',
        'Select Property Mode',
        'Select Property Type',
        'Select rent Type',
        'Basic Property Info',
        'Select bedrooms',
        'Select floorNo',
        'State',
        'Area',
        'Pincode',
      ]) {
        expect(find.text(label), findsOneWidget, reason: 'missing $label');
      }
      for (final button in [
        'CLEAR',
        'SEARCH',
        'GO TO ADVANCED SEARCH',
        'HOME',
      ]) {
        expect(find.text(button), findsOneWidget, reason: 'missing $button');
      }
      // Advanced-only fields stay out of the simple form.
      expect(find.text('Select attachedBathrooms'), findsNothing);
      expect(find.text('Phone Number'), findsNothing);
    });

    testWidgets('the advanced form adds the extra fields', (tester) async {
      await pump(tester, mode: PropertySearchMode.advanced);

      expect(find.text('Advanced Search'), findsOneWidget);
      for (final label in [
        'Select attachedBathrooms',
        'Select western',
        'Select carParking',
        'Select lift',
        'Select facing',
        'Select wheelChairAvailable',
        'Select postedBy',
        'Mobile Number',
        'Phone Number',
      ]) {
        expect(find.text(label), findsOneWidget, reason: 'missing $label');
      }
      expect(find.text('GO TO SIMPLE SEARCH'), findsOneWidget);
    });

    testWidgets('CLEAR empties the typed fields', (tester) async {
      await pump(tester);

      await tester.enterText(find.byType(TextField).first, '4321');
      await tester.pump();
      expect(find.text('4321'), findsOneWidget);

      await tester.tap(find.text('CLEAR'));
      await tester.pump();
      expect(find.text('4321'), findsNothing);
    });
  });
}
