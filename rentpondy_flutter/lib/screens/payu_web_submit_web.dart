import 'package:web/web.dart' as web;

/// Web half of the conditional import in `payu_checkout_screen.dart`.
///
/// `webview_flutter` has no web implementation, so on web we do what the React
/// app's `initiatePayUPayment` does (PayUPointsForm.jsx): build a hidden form and
/// submit it, navigating the tab to PayU. The fields carry a server-computed
/// hash, so they must be POSTed — they cannot be appended to a URL.
///
/// This unloads the Flutter app; PayU then redirects to the backend's
/// `surl`/`furl`, same as the web app's flow.
void submitPayuForm(String action, Map<String, dynamic> fields) {
  final form = web.document.createElement('form') as web.HTMLFormElement
    ..method = 'POST'
    ..action = action;

  for (final entry in fields.entries) {
    final input = web.document.createElement('input') as web.HTMLInputElement
      ..type = 'hidden'
      ..name = entry.key
      ..value = '${entry.value ?? ''}';
    form.appendChild(input);
  }

  web.document.body!.appendChild(form);
  form.submit();
}
