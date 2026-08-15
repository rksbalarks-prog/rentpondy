import 'package:clarity_flutter/clarity_flutter.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'assistant/assistant_client.dart';
import 'assistant/assistant_controller.dart';
import 'assistant/assistant_strings.dart';
import 'assistant/assistant_widget.dart';
import 'screens/login_screen.dart';
import 'screens/main_shell.dart';
import 'services/clarity_route_observer.dart';
import 'services/clarity_service.dart';
import 'services/push_service.dart';
import 'state/app_state.dart';
import 'theme/app_colors.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final appState = AppState();

  // Register (or re-register) the device token once auth is restored and
  // whenever the user logs in / out. Safe no-op until FCM init runs.
  appState.addListener(() {
    if (appState.isLoggedIn) {
      PushService.instance.registerFor(appState.phoneDigits);
    }
  });

  await appState.load();

  // One shared assistant client (holds the session token) drives the app-wide
  // controller. The controller reads the live phone number on each call.
  final assistant = AssistantController(
    client: AssistantClient(),
    phoneProvider: () => appState.phoneDigits,
    loginFirstMessage: AssistantT.en.loginFirst,
  );

  final root = MultiProvider(
    providers: [
      ChangeNotifierProvider<AppState>.value(value: appState),
      ChangeNotifierProvider<AssistantController>.value(value: assistant),
    ],
    child: const RentPondyApp(),
  );

  // Microsoft Clarity — session replays / heatmaps. ClarityWidget brings the
  // SDK up around the whole app. With no project ID configured the app is run
  // unwrapped and the SDK is never initialised at all.
  final clarityConfig = ClarityService.instance.config;
  runApp(
    clarityConfig == null
        ? root
        : ClarityWidget(app: root, clarityConfig: clarityConfig),
  );

  // Bring up FCM AFTER the first frame so Firebase init / the permission
  // prompt / channel setup never delay initial paint. Safe no-op if Firebase
  // isn't configured yet.
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    // Attach Clarity first: ClarityWidget has initialised the SDK by now, so
    // the identity tags land on a live session instead of being dropped.
    ClarityService.instance.attach(appState);

    await PushService.instance.init(appState.api);
    if (appState.isLoggedIn) {
      PushService.instance.registerFor(appState.phoneDigits);
    }
  });
}

class RentPondyApp extends StatelessWidget {
  const RentPondyApp({super.key});

  /// One long-lived instance — a NavigatorObserver must not be rebuilt.
  static final ClarityRouteObserver _clarityObserver = ClarityRouteObserver();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rent Pondy',
      debugShowCheckedModeBanner: false,
      // Shared with PushService so a tapped notification can navigate.
      navigatorKey: PushService.navigatorKey,
      // Reports the current screen name to Clarity on every push/pop.
      navigatorObservers: [_clarityObserver],
      theme: AppTheme.light,
      // Float the AI assistant (FAB + chat/voice panel) over every route.
      builder: (context, child) {
        return Stack(
          textDirection: TextDirection.ltr,
          children: [
            child ?? const SizedBox.shrink(),
            const Positioned.fill(child: AssistantWidget()),
          ],
        );
      },
      home: const _AuthGate(),
    );
  }
}

/// Decides between login and the home shell based on the persisted phone number
/// — the Flutter equivalent of RouterPage.jsx's localStorage rehydrate.
class _AuthGate extends StatelessWidget {
  const _AuthGate();

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    if (!app.initialised) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    return app.isLoggedIn ? const MainShell() : const LoginScreen();
  }
}
