import 'package:flutter/material.dart';

import '../l10n/l10n_ext.dart';
import '../routes.dart';
import '../theme/app_colors.dart';

/// The "More" hub (bottom-nav → More). A grid of shortcuts to the many
/// secondary pages of the app. Ports MoreComponent.jsx at a structural level.
class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  // Second tuple element is a translation key (resolved via context.tr).
  static const _items = <(IconData, String, String)>[
    (Icons.account_circle, 'title.myProfile', '/my-profile'),
    (Icons.apartment, 'menu.myProperty', '/my-property'),
    (Icons.favorite_border, 'more.shortlisted', '/my-short-property'),
    (Icons.history, 'more.lastViewed', '/my-last-property'),
    (Icons.send, 'more.sentInterest', '/my-sent-interest'),
    (Icons.notifications_none, 'title.notifications', '/notification'),
    (Icons.lightbulb_outline, 'drawer.myPlan', '/my-plan'),
    (Icons.star_border, 'drawer.pointsPlans', '/points-plans'),
    (Icons.monetization_on_outlined, 'drawer.pointsHistory', '/points-history'),
    (Icons.rocket_launch, 'drawer.pricingPlans', '/add-plan'),
    (Icons.handshake_outlined, 'title.tenantAssistant', '/buyer-assistance'),
    (Icons.beach_access, 'menu.touristPlace', '/exclusiveDetail'),
    (Icons.settings, 'menu.ownerMenu', '/owner-menu'),
    (Icons.settings, 'menu.tenantMenu', '/buyer-menu'),
    (Icons.phone, 'drawer.contactUs', '/contactus'),
    (Icons.info_outline, 'drawer.aboutUs', '/about-mobile'),
    (Icons.help_outline, 'more.faq', '/Frequently-Asked-Questions'),
    (Icons.sort, 'more.quickSort', '/Sort-Property'),
    (Icons.description_outlined, 'more.termsShort', '/terms-conditions'),
    (Icons.policy, 'drawer.refundPolicy', '/refund-mobile'),
    (Icons.verified_user_outlined, 'more.businessShort', '/business'),
    (Icons.headset_mic_outlined, 'drawer.ourSupport', '/our-support'),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.95,
      ),
      itemCount: _items.length,
      itemBuilder: (context, i) {
        final (icon, labelKey, route) = _items[i];
        final label = context.tr(labelKey);
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
                  child: Icon(icon, color: AppColors.primary, size: 22),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Text(
                    label,
                    textAlign: TextAlign.center,
                    maxLines: 2,
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
    );
  }
}
