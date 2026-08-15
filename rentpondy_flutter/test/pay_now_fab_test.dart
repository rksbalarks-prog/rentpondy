import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/state/app_state.dart';
import 'package:rent_pondy_user/widgets/pay_now_fab.dart';

void main() {
  testWidgets('pay now fab opens the amount prompt and guards the amount',
      (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [Positioned(left: 10, bottom: 16, child: PayNowFab())],
            ),
          ),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 600));
    expect(find.text('Pay Now'), findsOneWidget);

    await tester.tap(find.text('Pay Now'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Enter amount'), findsOneWidget);

    // At or below the ₹100 floor is rejected locally — no request is made.
    await tester.enterText(find.byType(TextField), '100');
    await tester.tap(find.text('Pay'));
    await tester.pump();
    expect(find.text('Amount must be greater than ₹100.'), findsOneWidget);

    // Letters are dropped and only the first decimal point survives, matching
    // the web's onChange sanitiser.
    await tester.enterText(find.byType(TextField), '1a2.3.4');
    await tester.pump();
    expect(find.text('12.34'), findsOneWidget);
    // Typing again clears the previous error.
    expect(find.text('Amount must be greater than ₹100.'), findsNothing);

    await tester.tap(find.text('Cancel'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Enter amount'), findsNothing);
  });
}
