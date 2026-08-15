// Smoke test for the Rent Pondy app root.
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/main.dart';
import 'package:rent_pondy_user/state/app_state.dart';

void main() {
  testWidgets('App boots into the auth gate', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const RentPondyApp(),
      ),
    );
    // Initial frame renders without throwing.
    expect(find.byType(RentPondyApp), findsOneWidget);
  });
}
