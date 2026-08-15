import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../assistant/assistant_fab_slot.dart';
import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../routes.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/animated_search_logo.dart';
import '../widgets/app_drawer.dart';
import '../widgets/bottom_navigation.dart';
import '../widgets/city_switcher.dart';
import '../widgets/pay_now_fab.dart';
import '../widgets/rp_navbar.dart';
import '../widgets/search_menu_dialog.dart';
import '../widgets/top_bar.dart';
import 'all_property_screen.dart';
import 'more_screen.dart';
import 'my_property_screen.dart';
import 'placeholder_screen.dart';
import 'tenant_list_screen.dart';

/// The home experience — City switcher · Navbar · TopBar · animated content ·
/// BottomNavigation. Assembles Main.jsx + MoblieViews.jsx into one scaffold.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  // Which top-bar / bottom-nav content is showing.
  String _activeContent = 'topAllProperty';

  /// Drives hiding the Pay Now pill while the side menu is open — on the web
  /// it floats over the drawer and covers the Logout row.
  bool _drawerOpen = false;

  // `label` holds a translation key resolved by `context.tr` in the TopBar cell.
  static const List<TopBarItem> _topBarItems = [
    TopBarItem(
        label: 'menu.commercialLease',
        iconAsset: Assets.commercial,
        content: 'topPyProperty'),
    TopBarItem(
        label: 'menu.allProperty',
        iconAsset: Assets.allProperty,
        content: 'topAllProperty'),
    TopBarItem(
        label: 'menu.touristPlace',
        iconData: Icons.beach_access,
        iconColor: AppColors.touristOrange,
        route: '/exclusiveDetail'),
    TopBarItem(
        label: 'menu.tenantList',
        iconAsset: Assets.tenantList,
        content: 'topMBuyerList'),
    TopBarItem(
        label: 'menu.propertyMap',
        iconAsset: Assets.propertyMap,
        content: 'topPropertyMap'),
    TopBarItem(
        label: 'menu.saleProperty',
        iconAsset: Assets.saleProperty,
        content: 'topSaleProperty'),
    TopBarItem(
        label: 'menu.featureProperty',
        iconAsset: Assets.featureProperty,
        content: 'topFeatureProperty'),
    TopBarItem(
        label: 'menu.groom', iconAsset: Assets.groom, content: 'topGroom'),
    TopBarItem(
        label: 'menu.bride', iconAsset: Assets.groom, content: 'topBride'),
    TopBarItem(
        label: 'menu.rentalVideo',
        iconAsset: Assets.groom,
        content: 'topPropertyVideo'),
    TopBarItem(
        label: 'menu.notViewProperty',
        iconAsset: Assets.notViewProperty,
        content: 'topNotViewProperty'),
    TopBarItem(
        label: 'menu.myProperty',
        iconAsset: Assets.myProperty,
        content: 'topMyProperty'),
    TopBarItem(
        label: 'menu.ownerMenu',
        iconAsset: Assets.ownerMenu,
        content: 'topOwnerMenu'),
    TopBarItem(
        label: 'menu.tenantMenu',
        iconAsset: Assets.tenantMenu,
        content: 'topBuyerMenu'),
  ];

  // content id -> translation key (resolved in _buildContent / titles).
  static const Map<String, String> _contentTitleKeys = {
    'topPyProperty': 'menu.commercialLease',
    'topMBuyerList': 'menu.tenantList',
    'topPropertyMap': 'menu.propertyMap',
    'topSaleProperty': 'menu.saleProperty',
    'topFeatureProperty': 'menu.featureProperty',
    'topGroom': 'menu.groom',
    'topBride': 'menu.bride',
    'topPropertyVideo': 'menu.rentalVideo',
    'topNotViewProperty': 'menu.notViewProperty',
    'topMyProperty': 'menu.myProperty',
    'topOwnerMenu': 'menu.ownerMenu',
    'topBuyerMenu': 'menu.tenantMenu',
  };

  @override
  void initState() {
    super.initState();
    _publishFabSlot();
  }

  @override
  void dispose() {
    AssistantFabSlot.set(0);
    super.dispose();
  }

  void _selectContent(String content) {
    setState(() => _activeContent = content);
    _publishFabSlot();
  }

  /// Tell the app-wide assistant FAB to move up while the SEARCH button is on
  /// screen, so the two don't overlap.
  void _publishFabSlot() {
    AssistantFabSlot.set(
      _activeContent == 'topAllProperty' ? AssistantFabSlot.searchButton : 0,
    );
  }

  // Called from tap callbacks (bottom nav, top bar, bell), so it must use
  // `trRead` (listen:false) — `context.tr` (listen:true) throws outside build.
  void _pushRoute(String route) =>
      pushRoute(context, route, context.trRead(_routeTitleKey(route)));

  String _routeTitleKey(String route) {
    switch (route) {
      case '/exclusiveDetail':
        return 'menu.touristPlace';
      case '/my-property':
        return 'menu.myProperty';
      case '/add-property':
        return 'title.addProperty';
      case '/buyer-assistance':
        return 'title.tenantAssistant';
      default:
        return 'title.rentPondy';
    }
  }

  void _onBottomNav(String key) {
    switch (key) {
      case BottomNavKeys.home:
        _selectContent('topAllProperty');
        break;
      case BottomNavKeys.more:
        _selectContent('bottomMore');
        break;
      case BottomNavKeys.property:
        _pushRoute('/my-property');
        break;
      case BottomNavKeys.add:
        _pushRoute('/add-property');
        break;
      case BottomNavKeys.buyer:
        _pushRoute('/buyer-assistance');
        break;
    }
  }

  Widget _buildContent() {
    switch (_activeContent) {
      case 'topAllProperty':
        return const AllPropertyScreen();
      case 'bottomMore':
        return const MoreScreen();
      case 'topMyProperty':
        return const MyPropertyScreen(showAppBar: false);
      case 'topMBuyerList':
        return const TenantListScreen(showAppBar: false);
      default:
        final key = _contentTitleKeys[_activeContent] ?? 'title.rentPondy';
        return PlaceholderScreen(title: context.tr(key), showAppBar: false);
    }
  }

  Future<bool> _confirmExit() async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        content: Text(context.trRead('exit.confirm')),
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
    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        // Not on the default feed → go back to it first.
        if (_activeContent != 'topAllProperty') {
          _selectContent('topAllProperty');
          return;
        }
        final navigator = Navigator.of(context);
        final shouldExit = await _confirmExit();
        if (!mounted || !shouldExit) return;
        // Let the platform handle the pop (exit).
        navigator.maybePop();
      },
      child: Container(
        color: AppColors.scaffoldGrey,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 470),
            child: Scaffold(
              key: _scaffoldKey,
              backgroundColor: Colors.white,
              drawer: const AppDrawer(),
              onDrawerChanged: (open) => setState(() => _drawerOpen = open),
              body: Column(
                children: [
                  const CitySwitcher(),
                  RpNavbar(
                    onMenuTap: () => _scaffoldKey.currentState?.openDrawer(),
                    onBellTap: () {
                      context.read<AppState>().clearUnreadBadge();
                      _pushRoute('/notification');
                    },
                  ),
                  TopBar(
                    items: _topBarItems,
                    activeContent: _activeContent,
                    onSelect: _selectContent,
                    onRoute: _pushRoute,
                  ),
                  Expanded(
                    child: Stack(
                      children: [
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 200),
                          transitionBuilder: (child, animation) {
                            final offset = Tween<Offset>(
                              begin: const Offset(0.15, 0),
                              end: Offset.zero,
                            ).animate(animation);
                            return FadeTransition(
                              opacity: animation,
                              child: SlideTransition(
                                  position: offset, child: child),
                            );
                          },
                          child: KeyedSubtree(
                            key: ValueKey(
                                '${_activeContent}_${context.watch<AppState>().activeBase}'),
                            child: _buildContent(),
                          ),
                        ),
                        // Floating SEARCH button — the web mounts it inside the
                        // All Property feed (AllProperty.jsx), so it shows on
                        // that tab only. Anchored to this 470px column rather
                        // than the window, unlike the assistant FAB.
                        if (_activeContent == 'topAllProperty')
                          Positioned(
                            right: 10,
                            bottom: 16,
                            child: AnimatedSearchLogo(
                              onTap: () => showSearchMenu(context),
                            ),
                          ),
                        // Floating "Pay Now" pill (PayNow.jsx), bottom-left on
                        // every tab and level with the SEARCH button. Dropped
                        // from the tree while the drawer is open so it can't
                        // sit on top of the menu the way the web one does.
                        if (!_drawerOpen)
                          const Positioned(
                            left: 10,
                            bottom: 16,
                            child: PayNowFab(),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
              bottomNavigationBar: Container(
                decoration: const BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage(Assets.bottomNavBg),
                    fit: BoxFit.cover,
                  ),
                ),
                child: SafeArea(
                  top: false,
                  child: RpBottomNavigation(
                    activeItem: _activeContent,
                    onSelect: _onBottomNav,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
