import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// The CMS-backed info pages — About Us, Refund Policy, Terms & Conditions,
/// Privacy Policy, Shipping & Delivery.
///
/// The web app fetches admin-authored HTML from `/get-text/:type` and renders
/// it with `dangerouslySetInnerHTML`, so there is no copy to hardcode. We
/// render the same HTML in a WebView (already a dependency for PayU) wrapped in
/// a stylesheet that matches the app's typography.
class CmsPageScreen extends StatefulWidget {
  const CmsPageScreen({
    super.key,
    required this.title,
    required this.type,
  });

  final String title;

  /// CMS key: `aboutUs` | `refundPolicy` | `privacyPolicy` |
  /// `terms&conditions` | `shiping&Delivery`
  final String type;

  @override
  State<CmsPageScreen> createState() => _CmsPageScreenState();
}

class _CmsPageScreenState extends State<CmsPageScreen> {
  late final ApiService _api;
  late final WebViewController _controller;

  bool _loading = true;
  bool _empty = false;

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.disabled)
      ..setBackgroundColor(Colors.white);
    _load();
  }

  Future<void> _load() async {
    final html = await _api.fetchCmsText(widget.type);
    if (!mounted) return;
    if (html.trim().isEmpty) {
      setState(() {
        _empty = true;
        _loading = false;
      });
      return;
    }
    await _controller.loadHtmlString(_wrap(html));
    if (mounted) setState(() => _loading = false);
  }

  /// Wrap the admin HTML so it reads like the rest of the app (Inter-ish
  /// system stack, comfortable measure, brand-coloured links).
  String _wrap(String content) => '''
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body {
    margin: 0;
    padding: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #2b2b2b;
    background: #ffffff;
    word-wrap: break-word;
  }
  h1, h2, h3, h4 { color: #4F4B7E; }
  a { color: #4F4B7E; }
  img, table { max-width: 100%; height: auto; }
  table { border-collapse: collapse; display: block; overflow-x: auto; }
  td, th { border: 1px solid #e0e0e0; padding: 6px; }
</style>
</head>
<body>$content</body>
</html>
''';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text(widget.title,
            style: const TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Stack(
        children: [
          if (!_empty) WebViewWidget(controller: _controller),
          if (_empty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.article_outlined,
                        size: 44, color: AppColors.textMuted),
                    const SizedBox(height: 12),
                    Text('${widget.title} is not available right now.',
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: AppColors.textGrey)),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _empty = false;
                          _loading = true;
                        });
                        _load();
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          if (_loading)
            const Center(
                child: CircularProgressIndicator(color: AppColors.primary)),
        ],
      ),
    );
  }
}
