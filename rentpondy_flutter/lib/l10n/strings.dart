// Bilingual (English / Tamil) UI string table.
//
// This is the ONLY place UI copy lives once a screen is localized. Each entry
// maps a stable key -> { 'en': ..., 'ta': ... }. Tamil is baked in statically
// (no runtime translation API): instant, offline, free, consistent. Add new
// keys here as more screens are converted.
//
// Lookup goes through `AppStrings.tr(key, lang)`, but screens should prefer the
// `context.tr('key')` extension (l10n_ext.dart) so they rebuild on toggle.
library;

/// Supported language codes.
const String kLangEn = 'en';
const String kLangTa = 'ta';

/// Human labels for the toggle button ("EN" / "த").
const Map<String, String> kLangShort = {
  kLangEn: 'EN',
  kLangTa: 'த',
};

/// The full string table. Keep keys grouped by area with a dotted prefix.
const Map<String, Map<String, String>> kStrings = {
  // ── City switcher ──────────────────────────────────────────────────────
  'city.pondicherry': {'en': 'Pondicherry', 'ta': 'புதுச்சேரி'},
  'city.chennai': {'en': 'Chennai', 'ta': 'சென்னை'},

  // ── Bottom navigation ──────────────────────────────────────────────────
  'nav.home': {'en': 'Home', 'ta': 'முகப்பு'},
  'nav.properties': {'en': 'Properties', 'ta': 'சொத்துகள்'},
  'nav.assistant': {'en': 'Assistant', 'ta': 'உதவியாளர்'},
  'nav.more': {'en': 'More', 'ta': 'மேலும்'},

  // ── Points chip ────────────────────────────────────────────────────────
  'points.unit': {'en': 'PTS', 'ta': 'புள்'},

  // ── Top bar menu ───────────────────────────────────────────────────────
  'menu.commercialLease': {'en': 'Commercial / Lease', 'ta': 'வணிகம் / குத்தகை'},
  'menu.allProperty': {'en': 'All Property', 'ta': 'அனைத்து சொத்துகள்'},
  'menu.touristPlace': {'en': 'Tourist Place', 'ta': 'சுற்றுலா இடம்'},
  'menu.tenantList': {'en': 'Tenant List', 'ta': 'வாடகைதாரர் பட்டியல்'},
  'menu.propertyMap': {'en': 'Property Map', 'ta': 'சொத்து வரைபடம்'},
  'menu.saleProperty': {'en': 'Sale Property', 'ta': 'விற்பனை சொத்து'},
  'menu.featureProperty': {'en': 'Feature Property', 'ta': 'சிறப்பு சொத்து'},
  'menu.groom': {'en': 'Groom', 'ta': 'மணமகன்'},
  'menu.bride': {'en': 'Bride', 'ta': 'மணமகள்'},
  'menu.rentalVideo': {'en': 'Rental Property Video', 'ta': 'வாடகை சொத்து காணொளி'},
  'menu.notViewProperty': {'en': 'Not View Property', 'ta': 'பார்க்காத சொத்து'},
  'menu.myProperty': {'en': 'My Property', 'ta': 'என் சொத்து'},
  'menu.ownerMenu': {'en': 'Owner Menu', 'ta': 'உரிமையாளர் மெனு'},
  'menu.tenantMenu': {'en': 'Tenant Menu', 'ta': 'வாடகைதாரர் மெனு'},

  // ── Route / screen titles ──────────────────────────────────────────────
  'title.rentPondy': {'en': 'Rent Pondy', 'ta': 'ரென்ட் பாண்டி'},
  'title.addProperty': {'en': 'Add Property', 'ta': 'சொத்து சேர்'},
  'title.tenantAssistant': {'en': 'Tenant Assistant', 'ta': 'வாடகைதாரர் உதவியாளர்'},
  'title.notifications': {'en': 'Notifications', 'ta': 'அறிவிப்புகள்'},
  'title.myProfile': {'en': 'My Profile', 'ta': 'என் சுயவிவரம்'},

  // ── Common actions / words ─────────────────────────────────────────────
  'common.yes': {'en': 'Yes', 'ta': 'ஆம்'},
  'common.no': {'en': 'No', 'ta': 'இல்லை'},
  'common.ok': {'en': 'OK', 'ta': 'சரி'},
  'common.cancel': {'en': 'Cancel', 'ta': 'ரத்து'},
  'common.close': {'en': 'Close', 'ta': 'மூடு'},
  'common.save': {'en': 'Save', 'ta': 'சேமி'},
  'common.submit': {'en': 'Submit', 'ta': 'சமர்ப்பி'},
  'common.next': {'en': 'Next', 'ta': 'அடுத்து'},
  'common.back': {'en': 'Back', 'ta': 'பின்'},
  'common.retry': {'en': 'Retry', 'ta': 'மீண்டும் முயற்சி'},
  'common.loading': {'en': 'Loading...', 'ta': 'ஏற்றுகிறது...'},
  'common.search': {'en': 'Search', 'ta': 'தேடு'},
  'common.viewMore': {'en': 'View More', 'ta': 'மேலும் பார்'},
  'common.login': {'en': 'Login', 'ta': 'உள்நுழை'},
  'common.logout': {'en': 'Logout', 'ta': 'வெளியேறு'},
  'common.delete': {'en': 'Delete', 'ta': 'நீக்கு'},

  // ── Exit confirmation ──────────────────────────────────────────────────
  'exit.confirm': {
    'en': 'Are you sure you want to exit the app?',
    'ta': 'செயலியை வெளியேற விரும்புகிறீர்களா?'
  },

  // ── Drawer / sidebar ───────────────────────────────────────────────────
  'drawer.tagline': {
    'en': 'Find Your dream House Here!',
    'ta': 'உங்கள் கனவு வீட்டை இங்கே கண்டறியுங்கள்!'
  },
  'drawer.myPlan': {'en': 'My Plan', 'ta': 'என் திட்டம்'},
  'drawer.stayOwnersPlan': {
    'en': 'Stay Owners Plan',
    'ta': 'தங்கும் உரிமையாளர் திட்டம்'
  },
  'drawer.pricingPlans': {'en': 'Pricing Plans', 'ta': 'விலை திட்டங்கள்'},
  'drawer.pointsPlans': {'en': 'Points Plans', 'ta': 'புள்ளி திட்டங்கள்'},
  'drawer.pointsHistory': {'en': 'Points History', 'ta': 'புள்ளி வரலாறு'},
  'drawer.myTenantAssistantPlan': {
    'en': 'My Tenant Assistant Plan',
    'ta': 'என் வாடகைதாரர் உதவியாளர் திட்டம்'
  },
  'drawer.contactUs': {'en': 'Contact Us', 'ta': 'எங்களை தொடர்பு கொள்ள'},
  'drawer.aboutUs': {'en': 'About Us', 'ta': 'எங்களை பற்றி'},
  'drawer.refundPolicy': {'en': 'Refund Policy', 'ta': 'பணத்திரும்ப கொள்கை'},
  'drawer.terms': {
    'en': 'Terms And Conditions',
    'ta': 'விதிமுறைகள் மற்றும் நிபந்தனைகள்'
  },
  'drawer.shipping': {'en': 'Shipping & Delivery', 'ta': 'அனுப்புதல் & விநியோகம்'},
  'drawer.business': {'en': 'Business Opportunity', 'ta': 'வணிக வாய்ப்பு'},
  'drawer.ourSupport': {'en': 'Our Support', 'ta': 'எங்கள் ஆதரவு'},
  'drawer.logoutConfirm': {
    'en': 'Are you sure you want to logout?',
    'ta': 'கணக்கிலிருந்து வெளியேற விரும்புகிறீர்களா?'
  },

  // ── Login screen ───────────────────────────────────────────────────────
  'login.welcomeBack': {'en': 'Welcome Back', 'ta': 'மீண்டும் வரவேற்கிறோம்'},
  'login.loginToContinue': {'en': 'Login to continue', 'ta': 'தொடர உள்நுழையவும்'},
  'login.tagline': {
    'en': 'Connecting Tenants and Owners Seamlessly',
    'ta': 'வாடகைதாரர்களையும் உரிமையாளர்களையும் தடையின்றி இணைக்கிறோம்'
  },
  'login.loginBtn': {'en': 'LOGIN', 'ta': 'உள்நுழை'},
  'login.loggingIn': {'en': 'LOGGING IN...', 'ta': 'உள்நுழைகிறது...'},
  'login.editOrAdd': {
    'en': 'Edit or Add Your Property  ',
    'ta': 'உங்கள் சொத்தை திருத்த அல்லது சேர்க்க  '
  },
  'login.mobileHint': {
    'en': 'Enter Mobile No (10 digits)',
    'ta': 'கைபேசி எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)'
  },
  'login.invalidPhone': {
    'en': 'Please enter a valid 10-digit phone number.',
    'ta': 'சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.'
  },
  'login.otpSentToast': {
    'en': 'OTP sent successfully!',
    'ta': 'OTP வெற்றிகரமாக அனுப்பப்பட்டது!'
  },
  'login.enterOtpErr': {'en': 'Please enter the OTP.', 'ta': 'OTP ஐ உள்ளிடவும்.'},
  'login.otpResent': {'en': 'OTP resent!', 'ta': 'OTP மீண்டும் அனுப்பப்பட்டது!'},
  'login.failed': {'en': 'Login Failed', 'ta': 'உள்நுழைவு தோல்வி'},
  'login.tryAgain': {'en': 'Try Again', 'ta': 'மீண்டும் முயற்சிக்கவும்'},
  'login.loginNumber': {'en': 'Login Number:', 'ta': 'உள்நுழைவு எண்:'},
  'login.otpSentMobile': {
    'en': 'OTP Sent to Your Mobile No',
    'ta': 'உங்கள் கைபேசி எண்ணுக்கு OTP அனுப்பப்பட்டது'
  },
  'login.enterOtp': {'en': 'Enter OTP', 'ta': 'OTP ஐ உள்ளிடவும்'},
  'login.verifying': {'en': 'VERIFYING...', 'ta': 'சரிபார்க்கிறது...'},
  'login.verifyOtp': {'en': 'VERIFY OTP', 'ta': 'OTP சரிபார்க்க'},
  'login.resendIn': {
    'en': 'Resend OTP in {s} seconds',
    'ta': 'OTP ஐ {s} வினாடிகளில் மீண்டும் அனுப்பவும்'
  },
  'login.resendOtp': {'en': 'RESEND OTP', 'ta': 'OTP மீண்டும் அனுப்பு'},

  // ── Property feed / cards ──────────────────────────────────────────────
  'card.negotiable': {'en': 'Negotiable', 'ta': 'பேரம் பேசலாம்'},
  'feed.loading': {'en': 'Loading properties...', 'ta': 'சொத்துகள் ஏற்றப்படுகிறது...'},
  'feed.empty': {'en': 'No properties found.', 'ta': 'சொத்துகள் எதுவும் இல்லை.'},
  'feed.marquee': {
    'en': '✨ Exclusive Place to Stay — Resorts · Hotels · Guest Houses    ·    Tap to explore →',
    'ta': '✨ தங்குவதற்கு பிரத்யேக இடம் — ரிசார்ட்ஸ் · ஹோட்டல்கள் · விருந்தினர் இல்லங்கள்    ·    ஆராய தட்டவும் →'
  },

  // ── Property detail ────────────────────────────────────────────────────
  'detail.title': {'en': 'Property Details', 'ta': 'சொத்து விவரங்கள்'},
  'detail.favourite': {'en': 'Favourite', 'ta': 'பிடித்தவை'},
  'detail.report': {'en': 'Report', 'ta': 'புகார்'},
  'detail.overview': {'en': 'Overview', 'ta': 'கண்ணோட்டம்'},
  'detail.descriptionHeading': {'en': 'Description', 'ta': 'விளக்கம்'},
  'detail.actions': {'en': 'Actions', 'ta': 'செயல்கள்'},
  'detail.ownerContact': {'en': 'Owner Contact', 'ta': 'உரிமையாளர் தொடர்பு'},
  'detail.primary': {'en': 'Primary', 'ta': 'முதன்மை'},
  'detail.alternate': {'en': 'Alternate', 'ta': 'மாற்று'},
  'detail.call': {'en': 'Call', 'ta': 'அழை'},
  'detail.sendInterest': {'en': 'Send Interest', 'ta': 'ஆர்வம் அனுப்பு'},
  'detail.interestSent': {'en': 'Interest Sent', 'ta': 'ஆர்வம் அனுப்பப்பட்டது'},
  'detail.requestPhotos': {'en': 'Request Photos', 'ta': 'புகைப்படங்களைக் கோரு'},
  'detail.requestAddress': {'en': 'Request Address', 'ta': 'முகவரியைக் கோரு'},
  'detail.makeOffer': {'en': 'Make an Offer', 'ta': 'சலுகை வழங்கு'},
  'detail.contactOwner': {'en': 'Contact Owner', 'ta': 'உரிமையாளரை தொடர்பு கொள்ள'},
  'detail.viewOwnerContact': {
    'en': 'View Owner Contact · {n} pts',
    'ta': 'உரிமையாளர் தொடர்பை பார் · {n} புள்'
  },
  // Toasts
  'detail.balanceVerifyFail': {
    'en': 'Could not verify your points balance. Please try again.',
    'ta': 'உங்கள் புள்ளி இருப்பை சரிபார்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
  },
  'detail.revealed': {
    'en': 'Contact details revealed. {n} points used.',
    'ta': 'தொடர்பு விவரங்கள் காட்டப்பட்டன. {n} புள்ளிகள் பயன்படுத்தப்பட்டன.'
  },
  'detail.deductFail': {
    'en': 'Could not deduct points. Please try again.',
    'ta': 'புள்ளிகளை கழிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
  },
  'detail.addedFav': {'en': 'Added to favourites.', 'ta': 'பிடித்தவைகளில் சேர்க்கப்பட்டது.'},
  'detail.removedFav': {
    'en': 'Removed from favourites.',
    'ta': 'பிடித்தவைகளிலிருந்து அகற்றப்பட்டது.'
  },
  'detail.interestSentToast': {
    'en': 'Interest sent to the owner.',
    'ta': 'உரிமையாளருக்கு ஆர்வம் அனுப்பப்பட்டது.'
  },
  'detail.interestRemovedToast': {
    'en': 'Interest removed successfully.',
    'ta': 'ஆர்வம் வெற்றிகரமாக அகற்றப்பட்டது.'
  },
  'detail.photoReqOk': {
    'en': 'Photo request submitted successfully!',
    'ta': 'புகைப்பட கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!'
  },
  'detail.addressReqOk': {'en': 'Address request sent.', 'ta': 'முகவரி கோரிக்கை அனுப்பப்பட்டது.'},
  'detail.reportedThanks': {
    'en': 'Property reported. Thank you.',
    'ta': 'சொத்து புகார் செய்யப்பட்டது. நன்றி.'
  },
  // Re-deduct dialog
  'detail.viewAgainTitle': {'en': 'View again?', 'ta': 'மீண்டும் பார்க்கவா?'},
  'detail.viewAgainBody': {
    'en': 'You have already unlocked this contact.\n\nSpend another {n} points to view it again?\n\nBalance: {b} pts',
    'ta': 'இந்த தொடர்பை நீங்கள் ஏற்கனவே திறந்துவிட்டீர்கள்.\n\nமீண்டும் பார்க்க மற்றொரு {n} புள்ளிகளை செலவழிக்கவா?\n\nஇருப்பு: {b} புள்'
  },
  'detail.yesSpend': {'en': 'Yes, spend {n}', 'ta': 'ஆம், {n} செலவழி'},
  // Insufficient-points dialog
  'detail.notEnough': {'en': 'Not enough points', 'ta': 'போதிய புள்ளிகள் இல்லை'},
  'detail.notEnoughBody': {
    'en': 'Viewing an owner\'s contact costs {n} points.\n\nYour balance: {b} pts',
    'ta': 'ஒரு உரிமையாளரின் தொடர்பை பார்க்க {n} புள்ளிகள் தேவை.\n\nஉங்கள் இருப்பு: {b} புள்'
  },
  'detail.maybeLater': {'en': 'Maybe later', 'ta': 'பின்னர் பார்க்கலாம்'},
  'detail.buyMore': {'en': 'Buy More Points', 'ta': 'மேலும் புள்ளிகள் வாங்கு'},

  // ── Floating "Pay Now" button + amount modal (PayNow.jsx) ─────────────
  'payNow.button': {'en': 'Pay Now', 'ta': 'இப்போது செலுத்து'},
  'payNow.subtitle': {
    'en': 'Enter the amount you want to pay (above ₹{n}).',
    'ta': 'நீங்கள் செலுத்த விரும்பும் தொகையை உள்ளிடவும் (₹{n}-க்கு மேல்).'
  },
  'payNow.hint': {'en': 'Enter amount', 'ta': 'தொகையை உள்ளிடவும்'},
  'payNow.invalid': {
    'en': 'Please enter a valid amount.',
    'ta': 'சரியான தொகையை உள்ளிடவும்.'
  },
  'payNow.tooLow': {
    'en': 'Amount must be greater than ₹{n}.',
    'ta': 'தொகை ₹{n}-ஐ விட அதிகமாக இருக்க வேண்டும்.'
  },
  'payNow.pay': {'en': 'Pay', 'ta': 'செலுத்து'},
  'payNow.processing': {'en': 'Processing…', 'ta': 'செயலாக்கம்…'},
  'payNow.failed': {
    'en': 'Failed to start the payment. Please try again.',
    'ta': 'கட்டணத்தை தொடங்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
  },
  'payNow.success': {
    'en': 'Payment successful.',
    'ta': 'கட்டணம் வெற்றிகரமாக முடிந்தது.'
  },
  'payNow.declined': {
    'en': 'Payment failed. Please try again.',
    'ta': 'கட்டணம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'
  },

  // ── "Unlock Owner Contact" paywall (InsufficientPointsModal.jsx) ───────
  'ip.title': {
    'en': 'Unlock Owner Contact',
    'ta': 'உரிமையாளர் தொடர்பை திறக்க'
  },
  'ip.subtitle': {
    'en': "You need points to view this owner's details",
    'ta': 'இந்த உரிமையாளரின் விவரங்களை பார்க்க புள்ளிகள் தேவை'
  },
  'ip.yourBalance': {'en': 'Your Balance', 'ta': 'உங்கள் இருப்பு'},
  'ip.requiredLabel': {'en': 'Required', 'ta': 'தேவை'},
  'ip.pts': {'en': 'pts', 'ta': 'புள்'},
  'ip.pitch': {
    'en': 'Pick a points pack and keep exploring properties. '
        'Packs start at just {p}.',
    'ta': 'ஒரு புள்ளி தொகுப்பை தேர்ந்தெடுத்து சொத்துகளை தொடர்ந்து பாருங்கள். '
        'தொகுப்புகள் {p} முதல்.'
  },
  'ip.buyPlan': {'en': 'Buy Points Plan', 'ta': 'புள்ளி திட்டம் வாங்கு'},
  'ip.redirecting': {'en': 'Redirecting to PayU…', 'ta': 'PayU-க்கு செல்கிறது…'},
  'ip.morePlans': {'en': 'More Plans', 'ta': 'மேலும் திட்டங்கள்'},
  'ip.loginFirst': {'en': 'Please login first', 'ta': 'முதலில் உள்நுழையவும்'},
  'ip.paymentFailed': {
    'en': 'Payment failed. Please try again.',
    'ta': 'கட்டணம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'
  },
  'ip.pointsAdded': {
    'en': 'Payment successful! Points added.',
    'ta': 'கட்டணம் வெற்றி! புள்ளிகள் சேர்க்கப்பட்டன.'
  },
  'detail.contactInfo': {'en': 'Contact Info', 'ta': 'தொடர்பு தகவல்'},
  'detail.viewOwnerContactDetails': {
    'en': 'View owner contact details',
    'ta': 'உரிமையாளர் தொடர்பு விவரங்களை பார்'
  },
  'detail.offerConfirm': {
    'en': 'Submit an offer of',
    'ta': 'இந்த சலுகையை சமர்ப்பிக்கவா —'
  },
  'detail.offerSent': {
    'en': 'Offer submitted successfully',
    'ta': 'சலுகை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது'
  },
  'detail.linkCopied': {'en': 'Link copied', 'ta': 'இணைப்பு நகலெடுக்கப்பட்டது'},
  'detail.photoReq': {'en': 'Photo Request', 'ta': 'புகைப்பட கோரிக்கை'},
  'detail.photoReqSent': {
    'en': 'Photo Request Sent',
    'ta': 'புகைப்பட கோரிக்கை அனுப்பப்பட்டது'
  },
  // Report dialog
  'detail.reportTitle': {'en': 'Report property', 'ta': 'சொத்தை புகார் செய்'},
  'detail.reportReasonLabel': {'en': 'Reason', 'ta': 'காரணம்'},
  'detail.reportCommentsLabel': {'en': 'Comments', 'ta': 'கருத்துகள்'},
  'detail.reasonWrongInfo': {'en': 'Wrong information', 'ta': 'தவறான தகவல்'},
  'detail.reasonAlreadyGone': {
    'en': 'Already rented / sold',
    'ta': 'ஏற்கனவே வாடகைக்கு / விற்பனை ஆகிவிட்டது'
  },
  'detail.reasonFake': {'en': 'Fake listing', 'ta': 'போலி பட்டியல்'},
  'detail.reasonUnreachable': {
    'en': 'Owner not reachable',
    'ta': 'உரிமையாளரை தொடர்பு கொள்ள முடியவில்லை'
  },
  'detail.reasonOther': {'en': 'Other', 'ta': 'மற்றவை'},

  // ── My Profile ─────────────────────────────────────────────────────────
  'profile.fillAll': {'en': 'Please fill all fields', 'ta': 'அனைத்து புலங்களையும் நிரப்பவும்'},
  'profile.updated': {
    'en': 'Profile updated successfully!',
    'ta': 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
  },
  'profile.created': {
    'en': 'Profile created successfully!',
    'ta': 'சுயவிவரம் வெற்றிகரமாக உருவாக்கப்பட்டது!'
  },
  'profile.updateDetails': {
    'en': 'Update your details',
    'ta': 'உங்கள் விவரங்களை புதுப்பிக்கவும்'
  },
  'profile.createProfile': {
    'en': 'Create your profile',
    'ta': 'உங்கள் சுயவிவரத்தை உருவாக்கவும்'
  },
  'profile.name': {'en': 'Name', 'ta': 'பெயர்'},
  'profile.email': {'en': 'Email', 'ta': 'மின்னஞ்சல்'},
  'profile.address': {'en': 'Address', 'ta': 'முகவரி'},
  'profile.saving': {'en': 'Saving…', 'ta': 'சேமிக்கிறது…'},
  'profile.updateBtn': {'en': 'UPDATE PROFILE', 'ta': 'சுயவிவரத்தை புதுப்பி'},
  'profile.createBtn': {'en': 'CREATE PROFILE', 'ta': 'சுயவிவரத்தை உருவாக்கு'},

  // ── Notifications ──────────────────────────────────────────────────────
  'notif.error': {
    'en': 'Error fetching notifications. Please try again.',
    'ta': 'அறிவிப்புகளை பெறுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.'
  },
  'notif.deleteConfirm': {
    'en': 'Are you sure you want to delete this notification?',
    'ta': 'இந்த அறிவிப்பை நீக்க விரும்புகிறீர்களா?'
  },
  'notif.deleted': {
    'en': 'Notification deleted successfully',
    'ta': 'அறிவிப்பு வெற்றிகரமாக நீக்கப்பட்டது'
  },
  'notif.deleteFail': {
    'en': 'Failed to delete notification',
    'ta': 'அறிவிப்பை நீக்க முடியவில்லை'
  },
  'notif.forLabel': {'en': 'Notifications for: ', 'ta': 'அறிவிப்புகள்: '},
  'notif.showAll': {
    'en': 'Show All Notifications',
    'ta': 'அனைத்து அறிவிப்புகளையும் காட்டு'
  },
  'notif.admin': {'en': 'Admin', 'ta': 'நிர்வாகம்'},
  'notif.empty': {'en': 'No notifications found.', 'ta': 'அறிவிப்புகள் எதுவும் இல்லை.'},
  'notif.typeLabel': {'en': 'Type:', 'ta': 'வகை:'},
  'notif.read': {'en': '🔵 Read', 'ta': '🔵 படித்தது'},
  'notif.unread': {'en': '🔴 Unread', 'ta': '🔴 படிக்கவில்லை'},
  'notif.matchedBuyer': {'en': 'Matched Buyer', 'ta': 'பொருந்திய வாங்குபவர்'},

  // ── More grid (extra labels) ───────────────────────────────────────────
  'more.shortlisted': {'en': 'Shortlisted', 'ta': 'தேர்வு செய்யப்பட்டவை'},
  'more.lastViewed': {'en': 'Last Viewed', 'ta': 'கடைசியாக பார்த்தவை'},
  'more.sentInterest': {'en': 'Sent Interest', 'ta': 'அனுப்பிய ஆர்வம்'},
  'more.faq': {'en': 'FAQ', 'ta': 'அடிக்கடி கேட்கப்படும் கேள்விகள்'},
  'more.quickSort': {'en': 'Quick Sort', 'ta': 'விரைவு வரிசை'},
  'more.termsShort': {'en': 'Terms', 'ta': 'விதிமுறைகள்'},
  'more.businessShort': {'en': 'Business', 'ta': 'வணிகம்'},

  // ── Floating SEARCH button menu ────────────────────────────────────────
  'search.property': {'en': 'Search Property', 'ta': 'சொத்து தேடு'},
  'search.tenant': {'en': 'Tenant Search', 'ta': 'வாடகைதாரர் தேடு'},
  'search.quickSort': {'en': 'Quick Sort', 'ta': 'விரைவு வரிசை'},
  'search.assistance': {'en': 'Property Assistance', 'ta': 'சொத்து உதவி'},
  'search.byRentId': {'en': 'Search by Rent ID', 'ta': 'Rent ID மூலம் தேடு'},
  'search.rentIdHint': {'en': 'Enter Rent ID', 'ta': 'Rent ID உள்ளிடுக'},
  'search.notFound': {
    'en': 'No property found for that Rent ID.',
    'ta': 'அந்த Rent ID-க்கு சொத்து இல்லை.'
  },
};

/// Static lookup. Falls back to English, then to the raw key (so a missing
/// translation shows up in dev instead of crashing).
class AppStrings {
  AppStrings._();

  static String tr(String key, String lang) {
    final entry = kStrings[key];
    if (entry == null) return key;
    return entry[lang] ?? entry[kLangEn] ?? key;
  }

  static bool isTamil(String lang) => lang == kLangTa;
}
