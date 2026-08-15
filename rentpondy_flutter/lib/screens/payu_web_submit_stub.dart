/// Non-web half of the conditional import in `payu_checkout_screen.dart`.
///
/// On Android/iOS the checkout runs inside `webview_flutter`, so this is never
/// reached — it exists only so the web-only DOM code stays out of mobile builds.
void submitPayuForm(String action, Map<String, dynamic> fields) {
  throw UnsupportedError(
      'submitPayuForm is web-only; mobile posts inside the WebView.');
}
