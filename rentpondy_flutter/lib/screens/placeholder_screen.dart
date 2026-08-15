import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// A styled stand-in for pages from the web app that haven't been ported to
/// Flutter yet. Keeps the whole app navigable while screens are built out
/// one by one, and carries the route path so it's clear what maps where.
class PlaceholderScreen extends StatelessWidget {
  const PlaceholderScreen({
    super.key,
    required this.title,
    this.routePath,
    this.showAppBar = true,
  });

  final String title;
  final String? routePath;
  final bool showAppBar;

  @override
  Widget build(BuildContext context) {
    final body = Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 84,
              height: 84,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.08),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.construction,
                  color: AppColors.primary, size: 40),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textBlack),
            ),
            const SizedBox(height: 8),
            const Text(
              'This screen is being ported to Flutter.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textGrey),
            ),
            if (routePath != null) ...[
              const SizedBox(height: 6),
              Text(
                routePath!,
                style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                    fontStyle: FontStyle.italic),
              ),
            ],
          ],
        ),
      ),
    );

    if (!showAppBar) return body;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: const BackButton(color: AppColors.primary),
        title: Text(title,
            style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: body,
    );
  }
}
