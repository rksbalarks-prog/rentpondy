/// Typed references to bundled images (copied from the web app's `src/Assets`).
/// Casing matters at runtime on some platforms, so these match the files exactly.
class Assets {
  Assets._();

  static const String _base = 'assets/images/';

  /// Public base for the property-detail overview field icons (prop_mode.PNG,
  /// bed.PNG, floor.PNG, …) which are referenced by filename at runtime.
  static const String detailIconBase = _base;

  // Branding
  static const String logo = '${_base}rentpondylogo.png';
  static const String loginBg = '${_base}loo.PNG';
  static const String otpBanner = '${_base}otp_img.jpeg';
  static const String bottomNavBg = '${_base}bottomimg.png';

  // Top-bar icons
  static const String commercial = '${_base}ppc_sentyourinterest.png';
  static const String allProperty = '${_base}allprop50.png';
  static const String tenantList = '${_base}bl50.png';
  static const String propertyMap = '${_base}locations.png';
  static const String saleProperty = '${_base}Sale Property-01.png';
  static const String featureProperty = '${_base}fprop50.png';
  static const String groom = '${_base}groom.PNG';
  static const String notViewProperty = '${_base}nvprop50.PNG';
  static const String myProperty = '${_base}my50.png';
  static const String ownerMenu = '${_base}seller50.png';
  static const String tenantMenu = '${_base}buyer50.PNG';

  // Property card
  static const String defaultProperty = '${_base}Mask Group 3@2x.png';
  static const String cameraTag = '${_base}Rectangle 146.png';
  static const String eyeTag = '${_base}Rectangle 145.png';
  static const String bhkIcon = '${_base}BHK-01.png';
  static const String calendarIcon = '${_base}Calender-01.png';
  static const String areaIcon = '${_base}Total Area-01.png';
  static const String floorIcon = '${_base}Floor-01.png';
  static const String rupeeIcon = '${_base}Indian Rupee-01.png';
  static const String postedByIcon = '${_base}Posted By-01.png';
  static const String noData = '${_base}OOOPS-No-Data-Found.png';

  // Promo / info
  static const String business = '${_base}business.png';

  // Tenant list (buyer assistance)
  static const String tenantAssistHero = '${_base}tenant_assist.png';
  static const String profile = '${_base}xd_profile.png';
  static const String priceMin = '${_base}Price Mini-01.png';
  static const String priceMax = '${_base}Price maxi-01.png';
}
