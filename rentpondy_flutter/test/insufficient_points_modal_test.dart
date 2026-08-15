import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:rent_pondy_user/state/app_state.dart';
import 'package:rent_pondy_user/widgets/insufficient_points_modal.dart';

void main() {
  testWidgets('paywall modal renders and keeps animating', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: MaterialApp(
          home: Builder(
            builder: (context) => Scaffold(
              body: Center(
                child: ElevatedButton(
                  onPressed: () => showInsufficientPointsModal(
                    context,
                    balance: 0,
                    cost: 10,
                  ),
                  child: const Text('open'),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('open'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    expect(find.text('Unlock Owner Contact'), findsOneWidget);
    expect(find.text('0 pts'), findsOneWidget);
    expect(find.text('10 pts'), findsOneWidget);
    expect(find.text('Buy Points Plan'), findsOneWidget);
    expect(find.text('More Plans'), findsOneWidget);
    expect(find.text('Maybe later'), findsOneWidget);

    // Past every sparkle delay, then a few frames of every loop.
    for (var i = 0; i < 12; i++) {
      await tester.pump(const Duration(milliseconds: 250));
    }

    await tester.tap(find.text('Maybe later'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Unlock Owner Contact'), findsNothing);
  });
}
