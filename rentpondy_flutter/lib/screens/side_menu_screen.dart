import 'package:flutter/material.dart';

import '../routes.dart';
import '../theme/app_colors.dart';

/// Which hub to render.
enum SideMenuKind { owner, tenant }

/// Owner Menu / Tenant Menu — the two dashboard hubs from OwnerSideMenu.jsx /
/// BuyerSideMenu.jsx. Those web components fetch ~40 per-item count badges;
/// this port renders the same navigation grid (the counts are shown on each
/// destination screen instead of duplicated here).
class SideMenuScreen extends StatelessWidget {
  const SideMenuScreen({super.key, required this.kind});

  final SideMenuKind kind;

  bool get _isOwner => kind == SideMenuKind.owner;

  /// (icon, label, route) — the union of items shown on the two menus, with
  /// each side's leads pointed at the relevant feed.
  List<(IconData, String, String)> get _items => _isOwner
      ? const [
          (Icons.person_outline, 'My Profile', '/my-profile'),
          (Icons.apartment, 'My Property', '/my-property'),
          (Icons.add_home_work_outlined, 'Add Property', '/add-property'),
          (Icons.favorite_border, 'Shortlisted By Tenants', '/favorite-buyer'),
          (Icons.star_border, 'Interest Received', '/interest-buyer'),
          (Icons.local_offer_outlined, 'Offers Received', '/offer-owner'),
          (Icons.call_outlined, 'Contacted Tenants', '/contact-owner'),
          (Icons.photo_library_outlined, 'Photo Requests', '/photo-request-owner'),
          (Icons.location_on_outlined, 'Address Requests', '/address-request-owner'),
          (Icons.compare_arrows, 'Matched Tenants', '/matched-owner'),
          (Icons.visibility_outlined, 'Most Viewed', '/most-viewed'),
          (Icons.delete_outline, 'Removed Property', '/removed-property'),
          (Icons.timer_off_outlined, 'Expired Property', '/expire-property'),
          (Icons.lightbulb_outline, 'My Plan', '/my-plan'),
          (Icons.rocket_launch, 'Pricing Plans', '/add-plan'),
        ]
      : const [
          (Icons.person_outline, 'My Profile', '/my-profile'),
          (Icons.handshake_outlined, 'Post Requirement', '/buyer-assistance'),
          (Icons.list_alt, 'Tenant List', '/buyer-lists'),
          (Icons.favorite_border, 'My Shortlist', '/my-short-property'),
          (Icons.history, 'Recently Viewed', '/my-last-property'),
          (Icons.send_outlined, 'Sent Interest', '/my-sent-interest'),
          (Icons.local_offer_outlined, 'My Offers', '/offer-buyer'),
          (Icons.call_outlined, 'Contacted Owners', '/contact-buyer'),
          (Icons.photo_library_outlined, 'Photo Requests', '/photo-request-buyer'),
          (Icons.lightbulb_outline, 'My Assistant Plan', '/my-buyer-plan'),
        ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFEFEF),
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text(_isOwner ? 'Owner Menu' : 'Tenant Menu',
            style: const TextStyle(fontSize: 18, color: Colors.black)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.95,
            ),
            itemCount: _items.length,
            itemBuilder: (context, i) {
              final (icon, label, route) = _items[i];
              return InkWell(
                borderRadius: BorderRadius.circular(14),
                onTap: () => pushRoute(context, route, label),
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.cardBg,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 46,
                        height: 46,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.08),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(icon, color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Text(
                          label,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textGrey,
                              fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
