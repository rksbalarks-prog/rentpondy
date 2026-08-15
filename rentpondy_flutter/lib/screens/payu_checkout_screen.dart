import 'dart:convert';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../theme/app_colors.dart';
import 'payu_web_submit_stub.dart'
    if (dart.library.js_interop) 'payu_web_submit_web.dart';

/// Result of a PayU hosted-checkout session.
enum PayUOutcome { success, failure, cancelled }

/// Hosts PayU's checkout inside a WebView.
///
/// The web app builds a hidden `<form method="POST" action="…/_payment">` from
/// the fields the backend returns and auto-submits it. Because those fields
/// include a server-computed hash, they must be POSTed — so we replay the very
/// same trick here by loading a tiny self-submitting HTML document.
///
/// The backend's `surl` / `furl` are still the source of truth for the result;
/// we just watch which one the WebView lands on.
class PayUCheckoutScreen extends StatefulWidget {
  const PayUCheckoutScreen({
    super.key,
    required this.payuFields,
    this.title = 'Payment',
    this.action = 'https://secure.payu.in/_payment',
  });

  /// Exactly what `POST /payu/points-payment` (or the buyer/stay equivalents)
  /// returned — key, txnid, hash, surl, furl, amount, …
  final Map<String, dynamic> payuFields;
  final String title;
  final String action;

  @override
  State<PayUCheckoutScreen> createState() => _PayUCheckoutScreenState();
}

class _PayUCheckoutScreenState extends State<PayUCheckoutScreen> {
  /// Null on web, where there is no `webview_flutter` implementation.
  WebViewController? _controller;
  bool _loading = true;
  bool _finished = false;
  String? _webError;

  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      // Hand the POST to the browser itself; see payu_web_submit_web.dart.
      WidgetsBinding.instance.addPostFrameCallback((_) => _submitOnWeb());
      return;
    }
    _boot();
  }

  Future<void> _boot() async {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(_externalChannel,
          onMessageReceived: (m) => _openExternally(m.message))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (url) {
            _installBridge();
            _checkOutcome(url);
          },
          onPageFinished: (url) {
            if (mounted) setState(() => _loading = false);
            _installBridge();
            _checkOutcome(url);
          },
          onNavigationRequest: (request) {
            // A UPI app hand-off (`upi://`, `tez://`, `phonepe://`, an
            // `intent://` …) is not something a WebView can load — it dies with
            // ERR_UNKNOWN_URL_SCHEME. Stop the navigation and give the link to
            // the OS instead; the checkout page stays put, keeps polling, and
            // lands on surl/furl once the payment finishes.
            if (_isDeepLink(request.url)) {
              _openExternally(request.url);
              return NavigationDecision.prevent;
            }
            _checkOutcome(request.url);
            return NavigationDecision.navigate;
          },
        ),
      );

    // Required for the per-app UPI tiles (Google Pay, PhonePe, …) to work.
    // With the stock WebView user agent, PayU registers the tap ("L1 CTA
    // clicked") and then silently drops it — it never emits a deep link at all,
    // while the generic "Pay using any UPI App" still navigates to `upi://`.
    // The giveaway is the "; wv" token every Android WebView carries; strip it
    // and PayU treats the page as a real browser and hands off normally.
    final browserUa = _asBrowserUserAgent(await controller.getUserAgent());
    if (browserUa != null) await controller.setUserAgent(browserUa);

    await controller.loadHtmlString(_autoSubmitHtml());
    if (!mounted) return;
    setState(() => _controller = controller);
  }

  /// Drops the tokens that identify an Android WebView (`; wv` and the
  /// `Version/4.0` it pairs with), leaving the device's own Chrome UA. Returns
  /// null when there is nothing to strip, so the caller leaves the UA alone.
  static String? _asBrowserUserAgent(String? ua) {
    if (ua == null || ua.isEmpty) return null;
    final out = ua
        .replaceAll('; wv)', ')')
        .replaceAll(' wv)', ')')
        .replaceAll(RegExp(r'Version/\d+(\.\d+)*\s+'), '');
    return out == ua ? null : out;
  }

  /// Name of the JS channel the [_installBridge] shim posts deep links to.
  static const _externalChannel = 'RentPondyExternal';


  /// Schemes a WebView can render itself. Anything else belongs to another app.
  static const _webSchemes = {
    'http',
    'https',
    'about',
    'data',
    'blob',
    'file',
    'javascript',
  };

  bool _isDeepLink(String url) {
    final scheme = Uri.tryParse(url)?.scheme.toLowerCase() ?? '';
    return scheme.isNotEmpty && !_webSchemes.contains(scheme);
  }

  /// Catches the UPI hand-offs that never reach [NavigationDelegate].
  ///
  /// `webview_flutter` only reports **main-frame** navigations, so a `upi://`
  /// link followed inside an iframe is dropped on the floor — and because the
  /// plugin has already told the WebView "handled", such a tap does nothing at
  /// all. Intercepting in JavaScript covers that, plus `window.open('upi://…')`
  /// and clicks on `<a href="upi://…">`. Re-swept on a timer in case the page
  /// adds frames after load.
  void _installBridge() {
    _controller?.runJavaScript('''
(function () {
  var WEB = /^(https?|about|data|blob|javascript|file|mailto|tel):/i;
  function isDeep(u) {
    u = String(u || '');
    return u.indexOf(':') > 0 && !WEB.test(u);
  }
  function send(u) { try { $_externalChannel.postMessage(String(u)); } catch (e) {} }

  function install(w) {
    try {
      if (!w || w.__rpHooked) return;
      w.__rpHooked = true;
      var nativeOpen = w.open;
      w.open = function (url) {
        if (isDeep(url)) { send(url); return null; }
        return nativeOpen.apply(w, arguments);
      };
      w.document.addEventListener('click', function (e) {
        var el = e.target;
        while (el && el.tagName !== 'A') el = el.parentElement;
        var href = el ? el.getAttribute('href') : null;
        if (isDeep(href)) { e.preventDefault(); send(href); }
      }, true);
    } catch (e) {}
  }

  function sweep() {
    install(window);
    for (var i = 0; i < window.frames.length; i++) {
      try { install(window.frames[i]); } catch (e) {}
    }
  }

  sweep();
  if (!window.__rpSweeper) window.__rpSweeper = setInterval(sweep, 1200);
})();
''').catchError((_) {
      // Page not ready yet (or already gone) — the other hook point covers it.
    });
  }

  /// Hands [url] to the OS so the UPI/bank app takes over.
  Future<void> _openExternally(String url) async {
    for (final candidate in _deepLinkCandidates(url)) {
      final uri = Uri.tryParse(candidate);
      if (uri == null) continue;
      try {
        if (await launchUrl(uri, mode: LaunchMode.externalApplication)) return;
      } catch (_) {
        // Nothing on the device handles this URI — try the next candidate.
      }
    }
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
            'No UPI app found to complete this payment. Install one, or pay by card / net banking.'),
      ),
    );
  }

  /// `intent://…#Intent;scheme=upi;package=…;S.browser_fallback_url=…;end` is
  /// Chrome's way of writing a deep link; `url_launcher` just does an
  /// ACTION_VIEW on whatever URI it is given, so rebuild the real `scheme://…`
  /// URI first and keep the fallback URL as a second try. Plain deep links pass
  /// through untouched.
  List<String> _deepLinkCandidates(String url) {
    const marker = '#Intent;';
    if (!url.startsWith('intent://') || !url.contains(marker)) return [url];

    final split = url.indexOf(marker);
    final body = url.substring('intent://'.length, split);
    String? scheme;
    String? fallback;
    for (final part in url.substring(split + marker.length).split(';')) {
      if (part.startsWith('scheme=')) {
        scheme = part.substring('scheme='.length);
      } else if (part.startsWith('S.browser_fallback_url=')) {
        fallback =
            Uri.decodeComponent(part.substring('S.browser_fallback_url='.length));
      }
    }
    return [
      if (scheme != null && scheme.isNotEmpty) '$scheme://$body',
      if (fallback != null && fallback.isNotEmpty) fallback,
      if (scheme == null && fallback == null) url,
    ];
  }

  /// Web: POST straight from the page, which navigates the tab to PayU. The
  /// awaited [PayUOutcome] never arrives because this document is unloaded —
  /// the backend's `surl`/`furl` take over from here, as in the web app.
  void _submitOnWeb() {
    try {
      submitPayuForm(widget.action, widget.payuFields);
    } catch (e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _webError = '$e';
        });
      }
    }
  }

  /// Builds the self-submitting form, HTML-escaping every value so a stray
  /// quote in a field can't break out of the attribute.
  String _autoSubmitHtml() {
    final inputs = widget.payuFields.entries.map((e) {
      final name = const HtmlEscape().convert(e.key);
      final value = const HtmlEscape().convert('${e.value ?? ''}');
      return '<input type="hidden" name="$name" value="$value" />';
    }).join('\n');

    return '''
<!DOCTYPE html>
<html>
  <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="font-family:sans-serif;text-align:center;padding-top:40px;color:#4F4B7E">
    <p>Redirecting to secure payment…</p>
    <form id="payuForm" method="POST" action="${widget.action}">
      $inputs
    </form>
    <script>document.getElementById('payuForm').submit();</script>
  </body>
</html>
''';
  }

  /// The backend's success/failure return URLs both come back to our own host,
  /// so match on those path segments.
  void _checkOutcome(String url) {
    if (_finished) return;
    final u = url.toLowerCase();
    PayUOutcome? outcome;
    if (u.contains('payment-success') ||
        u.contains('points-payment-success') ||
        u.contains('payu/success')) {
      outcome = PayUOutcome.success;
    } else if (u.contains('payment-failure') ||
        u.contains('points-payment-failure') ||
        u.contains('payu/failure')) {
      outcome = PayUOutcome.failure;
    }
    if (outcome != null) {
      _finished = true;
      if (mounted) Navigator.of(context).pop(outcome);
    }
  }

  /// Shown on web for the moment before the tab leaves for PayU, and to
  /// surface the failure if the submit itself threw.
  Widget _webBody() {
    if (_webError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.red, size: 40),
              const SizedBox(height: 12),
              const Text('Could not open the payment page.',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 6),
              Text(_webError!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12, color: Colors.black54)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _webError = null;
                    _loading = true;
                  });
                  _submitOnWeb();
                },
                child: const Text('Try again'),
              ),
            ],
          ),
        ),
      );
    }
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppColors.primary),
          SizedBox(height: 16),
          Text('Redirecting to secure payment…',
              style: TextStyle(color: AppColors.primary)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final navigator = Navigator.of(context);
        final leave = await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            title: const Text('Cancel payment?'),
            content: const Text(
                'Your payment is not complete. Leave this page?'),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: const Text('Stay')),
              ElevatedButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: const Text('Leave')),
            ],
          ),
        );
        if (leave == true && mounted) {
          navigator.pop(PayUOutcome.cancelled);
        }
      },
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          leading: const BackButton(color: AppColors.primary),
          title: Text(widget.title,
              style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                  fontSize: 18)),
        ),
        body: _controller == null
            ? _webBody()
            : Stack(
                children: [
                  WebViewWidget(controller: _controller!),
                  if (_loading)
                    const Center(
                        child:
                            CircularProgressIndicator(color: AppColors.primary)),
                ],
              ),
      ),
    );
  }
}
