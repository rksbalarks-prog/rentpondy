import 'package:flutter/material.dart';

import 'screens/add_property_screen.dart';
import 'screens/cms_page_screen.dart';
import 'screens/contact_us_screen.dart';
import 'constants/assets.dart';
import 'screens/faq_screen.dart';
import 'screens/filtered_property_screen.dart';
import 'screens/image_page_screen.dart';
import 'screens/side_menu_screen.dart';
import 'screens/leads_screen.dart';
import 'screens/my_buyer_plan_screen.dart';
import 'screens/my_plan_screen.dart';
import 'screens/my_profile_screen.dart';
import 'screens/my_property_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/placeholder_screen.dart';
import 'screens/points_history_screen.dart';
import 'screens/points_plans_screen.dart';
import 'screens/pricing_plans_screen.dart';
import 'screens/sort_property_screen.dart';
import 'screens/tenant_assistance_screen.dart';
import 'screens/tenant_list_screen.dart';

/// Single place that maps a web-app route path to its Flutter screen.
///
/// Routes that have been ported return the real screen; everything else falls
/// back to [PlaceholderScreen] with the original path preserved, so the whole
/// navigation graph stays intact while screens are ported one at a time.
///
/// **To port a screen:** add one `case` here — the drawer, the More grid and
/// the shell all route through this function.
Widget screenForRoute(String route, String title) {
  switch (route) {
    case '/my-property':
      return const MyPropertyScreen();
    case '/removed-property':
      return const MyPropertyScreen(initialTab: MyPropertyTab.removed);
    case '/expire-property':
    case '/expired-plans':
      return const MyPropertyScreen(initialTab: MyPropertyTab.expired);
    case '/add-property':
    case '/add-form':
      return const AddPropertyScreen();
    case '/my-plan':
      return const MyPlanScreen();
    case '/my-buyer-plan':
      return const MyBuyerPlanScreen();
    case '/my-profile':
      return const MyProfileScreen();
    case '/notification':
      return const NotificationsScreen();
    case '/points-plans':
      return const PointsPlansScreen();
    case '/add-plan':
    case '/plans':
    case '/pricing-plans':
    case '/Pricing-Plan':
      return const PricingPlansScreen();
    case '/points-history':
      return const PointsHistoryScreen();
    // ---- Quick Sort hub + its destinations ----
    case '/Sort-Property':
      return const SortPropertyScreen();
    case '/sort/low-to-high':
      return const FilteredPropertyScreen(filter: PropertyFilter.lowToHigh);
    case '/sort/high-to-low':
      return const FilteredPropertyScreen(filter: PropertyFilter.highToLow);
    case '/sort/new-to-old':
      return const FilteredPropertyScreen(filter: PropertyFilter.newToOld);
    case '/sort/old-to-new':
      return const FilteredPropertyScreen(filter: PropertyFilter.oldToNew);
    case '/sort/with-image':
      return const FilteredPropertyScreen(filter: PropertyFilter.withImage);
    case '/sort/property-with-location':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.withLocation);
    case '/sort/zero-view':
    case '/zero-view':
      return const FilteredPropertyScreen(filter: PropertyFilter.zeroView);
    case '/my-last-property':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.recentlyViewed);
    case '/most-viewed':
      return const FilteredPropertyScreen(filter: PropertyFilter.mostViewed);
    case '/matched-owner':
      return const FilteredPropertyScreen(filter: PropertyFilter.matchedOwner);
    case '/sort/bank-loan':
    case '/loan-property':
      return const FilteredPropertyScreen(filter: PropertyFilter.bankLoan);
    case '/sort/house-below-30L':
    case '/house-below':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.houseBelow30L);
    case '/sort/house-30L-50L':
    case '/house-average':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.house30to50L);
    case '/sort/plot-below-15L':
    case '/plot-below':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.plotBelow15L);
    case '/sort/agricultural-land':
    case '/land-property':
      return const FilteredPropertyScreen(
          filter: PropertyFilter.agriculturalLand);
    case '/contactus':
    case '/contact-web':
      return const ContactUsScreen();
    case '/Frequently-Asked-Questions':
      return const FaqScreen();
    // CMS-backed info pages (`GET /get-text/:type`).
    case '/about-mobile':
    case '/about':
      return const CmsPageScreen(title: 'About Us', type: 'aboutUs');
    case '/refund-mobile':
    case '/refund-policy':
    case '/RefundPolicy':
      return const CmsPageScreen(
          title: 'Refund Policy', type: 'refundPolicy');
    case '/privacy-policy':
    case '/privacy-web':
      return const CmsPageScreen(
          title: 'Privacy Policy', type: 'privacyPolicy');
    case '/terms-conditions':
    case '/terms-conditions-web':
      return const CmsPageScreen(
          title: 'Terms And Conditions', type: 'terms&conditions');
    case '/shiping-delivery-app':
    case '/shiping-delivery':
      return const CmsPageScreen(
          title: 'Shipping & Delivery', type: 'shiping&Delivery');
    case '/buyer-lists':
    case '/buyer-list':
      return const TenantListScreen();
    case '/buyer-assistance':
    case '/tenant-search':
      return const TenantAssistanceScreen();
    case '/owner-menu':
      return const SideMenuScreen(kind: SideMenuKind.owner);
    case '/buyer-menu':
      return const SideMenuScreen(kind: SideMenuKind.tenant);
    case '/business':
      return const ImagePageScreen(
          title: 'Business Opportunity', asset: Assets.business);
    // Support pages reuse the Contact Us form (OurSupport.jsx also posts to
    // /contactUs).
    case '/our-support':
    case '/support':
      return const ContactUsScreen();
    // Owner-side leads. `/my-short-property` and `/my-sent-interest` are dead
    // stubs in the web app (no API calls at all); they point here so the menu
    // entries show the real favourite/interest data instead of nothing.
    case '/favorite-buyer':
    case '/my-short-property':
      return const LeadsScreen(kind: LeadKind.favourites);
    case '/interest-buyer':
    case '/my-interest-buyer':
    case '/my-sent-interest':
      return const LeadsScreen(kind: LeadKind.interest);
    // Route paths mirror the web routes exactly: `/offer-owner` -> OfferOwner
    // -> /offers/owner, `/offer-buyer` -> OfferBuyer -> /offers/buyer, etc.
    case '/offer-owner':
      return const LeadsScreen(kind: LeadKind.offersOwner);
    case '/offer-buyer':
    case '/my-offers':
      return const LeadsScreen(kind: LeadKind.offersBuyer);
    case '/contact-owner':
      return const LeadsScreen(kind: LeadKind.contactedOwner);
    case '/contact-buyer':
      return const LeadsScreen(kind: LeadKind.contactedBuyer);
    case '/photo-request-owner':
      return const LeadsScreen(kind: LeadKind.photoRequestsOwner);
    case '/photo-request-buyer':
    case '/my-photo':
      return const LeadsScreen(kind: LeadKind.photoRequestsBuyer);
    case '/address-request-owner':
      return const LeadsScreen(kind: LeadKind.addressRequestsOwner);
    default:
      return PlaceholderScreen(title: title, routePath: route);
  }
}

/// Convenience: push a route's screen onto the navigator.
///
/// The `settings: RouteSettings(name: route)` matters beyond navigation: it is
/// what ClarityRouteObserver reports to Microsoft Clarity as the screen name,
/// so mobile recordings are labelled with the same paths the web app uses.
void pushRoute(BuildContext context, String route, String title) {
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (_) => screenForRoute(route, title),
      settings: RouteSettings(name: route),
    ),
  );
}
