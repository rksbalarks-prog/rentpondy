import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// A full-bleed promotional image page — the web app renders these (e.g.
/// Business Opportunity) as a single scrollable image with a header bar.
class ImagePageScreen extends StatelessWidget {
  const ImagePageScreen({
    super.key,
    required this.title,
    required this.asset,
  });

  final String title;
  final String asset;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text(title,
            style: const TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: SingleChildScrollView(
            child: Image.asset(
              asset,
              width: double.infinity,
              fit: BoxFit.fitWidth,
              errorBuilder: (_, _, _) => const Padding(
                padding: EdgeInsets.all(40),
                child: Center(child: Text('Image unavailable')),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
