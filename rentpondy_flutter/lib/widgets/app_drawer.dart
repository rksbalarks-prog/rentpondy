import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../routes.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';

/// Left sidebar menu opened by the navbar hamburger. Ports the sidebar in
/// Navbar.jsx (teal header + phone, purple-tinted item icons).
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final city = app.activeBase == 'CH' ? 'CHENNAI' : 'PONDY';

    return Drawer(
      width: 300,
      backgroundColor: Colors.white,
      child: Column(
        children: [
          // ---- Header ----
          Container(
            color: AppColors.teal,
            padding: EdgeInsets.fromLTRB(
                10, MediaQuery.of(context).padding.top + 10, 10, 10),
            width: double.infinity,
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.asset(Assets.logo, height: 80, width: 80),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('RENT $city',
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18)),
                      Text(context.tr('drawer.tagline'),
                          style: const TextStyle(
                              color: Colors.white, fontSize: 13)),
                      if (app.phoneNumber != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.phone,
                                color: Colors.white, size: 14),
                            const SizedBox(width: 6),
                            Text(app.phoneNumber!,
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 14)),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          // ---- Menu items ----
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 4),
              children: [
                _item(context, Icons.account_circle, 'title.myProfile',
                    '/my-profile'),
                _item(context, Icons.apartment, 'menu.myProperty',
                    '/my-property'),
                _item(context, Icons.lightbulb_outline, 'drawer.myPlan',
                    '/my-plan'),
                _item(context, Icons.hotel, 'drawer.stayOwnersPlan',
                    '/stay-owners-plan'),
                _item(context, Icons.rocket_launch, 'drawer.pricingPlans',
                    '/add-plan'),
                _item(context, Icons.star_border, 'drawer.pointsPlans',
                    '/points-plans'),
                _item(context, Icons.monetization_on_outlined,
                    'drawer.pointsHistory', '/points-history'),
                _item(context, Icons.rocket_launch,
                    'drawer.myTenantAssistantPlan', '/my-buyer-plan'),
                _item(context, Icons.settings, 'menu.ownerMenu',
                    '/owner-menu'),
                _item(context, Icons.settings, 'menu.tenantMenu',
                    '/buyer-menu'),
                _item(context, Icons.grid_view, 'nav.more', '/more'),
                _item(context, Icons.phone, 'drawer.contactUs',
                    '/contactus'),
                _item(context, Icons.info_outline, 'drawer.aboutUs',
                    '/about-mobile'),
                _item(context, Icons.policy, 'drawer.refundPolicy',
                    '/refund-mobile'),
                _item(context, Icons.description_outlined,
                    'drawer.terms', '/terms-conditions'),
                _item(context, Icons.local_shipping_outlined,
                    'drawer.shipping', '/shiping-delivery-app'),
                _item(context, Icons.verified_user_outlined,
                    'drawer.business', '/business'),
                _item(context, Icons.groups_outlined, 'drawer.ourSupport',
                    '/our-support'),
                const Divider(),
                _logout(context),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _item(
    BuildContext context,
    IconData icon,
    String labelKey,
    String route,
  ) {
    final label = context.tr(labelKey);
    return ListTile(
      dense: true,
      leading: Icon(icon, color: AppColors.primary, size: 20),
      title: Text(label, style: const TextStyle(color: Colors.black)),
      onTap: () {
        Navigator.pop(context); // close drawer
        pushRoute(context, route, label);
      },
    );
  }

  Widget _logout(BuildContext context) {
    return ListTile(
      dense: true,
      leading: const Icon(Icons.logout, color: AppColors.primary, size: 20),
      title: Text(context.tr('common.logout'),
          style: const TextStyle(color: Colors.black)),
      onTap: () async {
        final confirm = await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            content: Text(context.trRead('drawer.logoutConfirm'),
                textAlign: TextAlign.center),
            actionsAlignment: MainAxisAlignment.spaceBetween,
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                onPressed: () => Navigator.pop(context, true),
                child: Text(context.trRead('common.yes')),
              ),
              OutlinedButton(
                onPressed: () => Navigator.pop(context, false),
                child: Text(context.trRead('common.no')),
              ),
            ],
          ),
        );
        if (confirm == true && context.mounted) {
          Navigator.pop(context); // close drawer
          await context.read<AppState>().logout();
        }
      },
    );
  }
}
