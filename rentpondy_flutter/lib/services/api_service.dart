import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/app_notification.dart';
import '../models/points_deduct_result.dart';
import '../models/points_plan.dart';
import '../models/points_transaction.dart';
import '../models/property.dart';
import '../models/property_lead.dart';
import '../models/tenant_request.dart';
import '../models/user_plan.dart';

/// Thin REST client for the PPC backend. Every request automatically carries
/// `?base=PY|CH`, replicating the axios request interceptor in `cityBase.js`.
class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  /// Active city base ('PY' or 'CH'), injected before each screen fetches so
  /// the query param matches whichever city the user is browsing.
  String activeBase = 'PY';

  Uri _uri(String path, [Map<String, String>? params]) {
    return Uri.parse('${ApiConfig.baseUrl}$path').replace(
      queryParameters: {
        ...?params,
        'base': activeBase,
      },
    );
  }

  /// GET /fetch-active-users -> { users: [...] }, sorted newest-first
  /// (exactly the sort the AllProperty page applies client-side).
  Future<List<Property>> fetchActiveProperties() async {
    final res = await _client.get(_uri('/fetch-active-users'));
    if (res.statusCode != 200) {
      throw ApiException('Failed to load properties (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final users = (body['users'] as List?) ?? const [];
    final list = users
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
    list.sort((a, b) {
      final ad = a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });
    return list;
  }

  /// GET /fetch-active-users-datas-all-rent -> the approved-property rows the
  /// home tickers count by pincode. Deliberately NOT /fetch-active-users: the
  /// web ticker uses this endpoint, and it is the one that includes pincodes
  /// the public feed can omit (605104 Kottakuppam among them).
  ///
  /// Returns the raw maps so the tap-through list can filter them by pincode
  /// without a second round trip — same as the web keeping `marqueePropertyList`.
  Future<List<Map<String, dynamic>>> fetchAreaPropertyRows() async {
    final res = await _client.get(
      _uri('/fetch-active-users-datas-all-rent',
          {'_t': DateTime.now().millisecondsSinceEpoch.toString()}),
      headers: const {'Cache-Control': 'no-cache'},
    );
    if (res.statusCode != 200) {
      throw ApiException('Failed to load area counts (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['users'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .where((r) => r['isDeleted'] != true)
        .toList();
  }

  /// GET /raActive-buyerAssistance-all-plans-rent -> { data: [...] }
  /// Active tenant requirements, counted by pincode for the second ticker.
  Future<List<Map<String, dynamic>>> fetchTenantAssistanceRows() async {
    final res = await _client.get(
      _uri('/raActive-buyerAssistance-all-plans-rent',
          {'_t': DateTime.now().millisecondsSinceEpoch.toString()}),
      headers: const {'Cache-Control': 'no-cache'},
    );
    if (res.statusCode != 200) {
      throw ApiException('Failed to load tenant counts (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['data'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .where((r) => r['isDeleted'] != true)
        .toList();
  }

  /// GET /fetch-status-with-payment-rent?phoneNumber= -> { data: [...] }
  /// The logged-in user's own listings, newest-updated first (My Property tab).
  Future<List<Property>> fetchMyProperties(String phoneNumber) async {
    final res = await _client.get(
        _uri('/fetch-status-with-payment-rent', {'phoneNumber': phoneNumber}));
    if (res.statusCode != 200) {
      throw ApiException('Failed to load your properties (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final list = ((body['data'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
    list.sort((a, b) {
      final ad = a.updatedAt ?? a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.updatedAt ?? b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });
    return list;
  }

  /// GET /fetch-delete-status-rent?phoneNumber= -> { users: [...] }
  /// Soft-deleted ("Removed" tab) listings.
  Future<List<Property>> fetchRemovedProperties(String phoneNumber) async {
    final res = await _client.get(
        _uri('/fetch-delete-status-rent', {'phoneNumber': phoneNumber}));
    if (res.statusCode != 200) {
      throw ApiException('Failed to load removed properties (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['users'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
  }

  /// GET /expired-plans-by-phone-rent?phoneNumber= -> { data|users: [...] }
  Future<List<Property>> fetchExpiredProperties(String phoneNumber) async {
    final res = await _client.get(
        _uri('/expired-plans-by-phone-rent', {'phoneNumber': phoneNumber}));
    if (res.statusCode != 200) return const [];
    final body = jsonDecode(res.body);
    if (body is! Map<String, dynamic>) return const [];
    final raw = (body['data'] ?? body['users']) as List?;
    return (raw ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
  }

  /// GET /uploads-count?rentId= -> { uploadedImagesCount }
  Future<int> fetchImageCount(String rentId) async {
    try {
      final res =
          await _client.get(_uri('/uploads-count', {'rentId': rentId}));
      if (res.statusCode != 200) return 0;
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return (body['uploadedImagesCount'] as num?)?.toInt() ?? 0;
    } catch (_) {
      return 0;
    }
  }

  /// GET /get-user-notifications?phoneNumber= -> { notifications: [...] }
  /// Deduped by `rentId_message` and sorted newest-first, exactly as
  /// Notification.jsx does client-side.
  Future<List<AppNotification>> fetchNotifications(String phoneNumber) async {
    final res = await _client
        .get(_uri('/get-user-notifications', {'phoneNumber': phoneNumber}));
    if (res.statusCode != 200) {
      throw ApiException('Error fetching notifications (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final raw = ((body['notifications'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(AppNotification.fromJson);

    final seen = <String, AppNotification>{};
    for (final n in raw) {
      seen.putIfAbsent(n.dedupeKey, () => n);
    }
    final list = seen.values.toList();
    list.sort((a, b) {
      final ad = a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });
    return list;
  }

  /// GET /notifications/:phone -> { notifications: [...] }  ("Admin" tab)
  Future<List<AppNotification>> fetchAdminNotifications(String phone) async {
    final res = await _client.get(_uri('/notifications/$phone'));
    if (res.statusCode != 200) {
      throw ApiException('Error fetching notifications (${res.statusCode})');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['notifications'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(AppNotification.fromJson)
        .toList();
  }

  /// PUT /mark-single-notification-read/:id
  Future<void> markNotificationRead(String notificationId) async {
    await _client.put(_uri('/mark-single-notification-read/$notificationId'));
  }

  /// DELETE /delete-notification-by-time  (body: { createdAt })
  /// The web app deletes by timestamp, not id — kept identical here.
  Future<void> deleteNotificationByTime(String createdAtIso) async {
    final request = http.Request('DELETE', _uri('/delete-notification-by-time'))
      ..headers['Content-Type'] = 'application/json'
      ..body = jsonEncode({'createdAt': createdAtIso});
    final streamed = await _client.send(request);
    if (streamed.statusCode != 200) {
      throw ApiException('Failed to delete notification');
    }
  }

  /// GET /get-unread-notifications?phoneNumber= -> { notifications: [...] }
  /// Used by the navbar bell to decide whether to show the red dot.
  Future<int> fetchUnreadCount(String phoneNumber) async {
    try {
      final res = await _client
          .get(_uri('/get-unread-notifications', {'phoneNumber': phoneNumber}));
      if (res.statusCode != 200) return 0;
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return ((body['notifications'] as List?) ?? const []).length;
    } catch (_) {
      return 0;
    }
  }

  /// GET /points-balance/:phone -> { balance }
  Future<int?> fetchPointsBalance(String phone) async {
    try {
      final res = await _client.get(_uri('/points-balance/$phone'));
      if (res.statusCode != 200) return null;
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      final bal = body['balance'];
      return bal is num ? bal.toInt() : null;
    } catch (_) {
      return null;
    }
  }

  /// POST /send-otp-rent -> { result: { otp } }  (India flow)
  Future<String?> sendOtp(String phoneNumber, {String countryCode = '+91'}) async {
    final res = await _client.post(
      _uri('/send-otp-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'loginMode': 'web',
        'countryCode': countryCode,
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Could not send OTP'));
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final result = body['result'];
    if (result is Map && result['otp'] != null) {
      return result['otp'].toString();
    }
    return null;
  }

  /// POST /verify-otp-rent
  Future<bool> verifyOtp(String phoneNumber, String otp) async {
    final res = await _client.post(
      _uri('/verify-otp-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phoneNumber, 'otp': otp}),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'OTP verification failed'));
    }
    return true;
  }

  /// GET /user/direct-verified-users-rent -> { users: [{ phone, directVerified }] }
  /// Used to skip OTP for admin-whitelisted numbers ("Login Direct Verify").
  ///
  /// Called WITHOUT the `?base=` param on purpose: the endpoint filters by city
  /// base, but the whitelist must be city-independent — a directly-verified
  /// number should skip OTP whichever city the app is defaulted to. Phone
  /// numbers are compared on their last 10 digits to ignore country-code /
  /// formatting differences.
  Future<bool> isDirectVerified(String plainPhone) async {
    String last10(String s) {
      final d = s.replaceAll(RegExp(r'\D'), '');
      return d.length > 10 ? d.substring(d.length - 10) : d;
    }

    try {
      // No base param → returns the full whitelist across all cities.
      final uri =
          Uri.parse('${ApiConfig.baseUrl}/user/direct-verified-users-rent');
      final res = await _client.get(uri);
      if (res.statusCode != 200) return false;
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      final users = (body['users'] as List?) ?? const [];
      final target = last10(plainPhone);
      return users.whereType<Map<String, dynamic>>().any((u) =>
          last10(u['phone']?.toString() ?? '') == target &&
          u['directVerified'] == true);
    } catch (_) {
      return false;
    }
  }

  // ---------------------------------------------------------------------
  // Property detail (Details.jsx)
  // ---------------------------------------------------------------------

  /// GET /fetch-data-on-demand-rent?rentId= -> { user: {...} }
  Future<Property> fetchPropertyDetail(String rentId) async {
    final res =
        await _client.get(_uri('/fetch-data-on-demand-rent', {'rentId': rentId}));
    if (res.statusCode != 200) {
      throw ApiException('Failed to fetch property details.');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final user = body['user'];
    if (user is! Map<String, dynamic>) {
      throw ApiException('Failed to fetch property details.');
    }
    return Property.fromJson(user);
  }

  /// GET /points-balance/:phone — **strict**: throws when unreachable.
  ///
  /// The contact paywall must refuse to reveal if we cannot prove the balance
  /// (revealing "just in case" is what let the paywall leak), so this variant
  /// propagates the error instead of returning null.
  Future<int> fetchPointsBalanceStrict(String phone) async {
    final res = await _client.get(_uri('/points-balance/$phone'));
    if (res.statusCode != 200) {
      throw ApiException('Could not verify your points balance.');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return (body['balance'] as num?)?.toInt() ?? 0;
  }

  /// POST /points-deduct { phoneNumber, points, rentId, reason, force? }
  Future<PointsDeductResult> deductPoints({
    required String phoneNumber,
    required int points,
    required String rentId,
    required String reason,
    bool force = false,
  }) async {
    final res = await _client.post(
      _uri('/points-deduct'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'points': points,
        'rentId': rentId,
        'reason': reason,
        if (force) 'force': true,
      }),
    );

    if (res.statusCode == 402) {
      // Balance dropped between the check and the deduct.
      int? bal;
      try {
        bal = ((jsonDecode(res.body) as Map)['balance'] as num?)?.toInt();
      } catch (_) {}
      return PointsDeductResult(
          success: false, insufficient: true, balance: bal);
    }
    if (res.statusCode != 200) {
      return PointsDeductResult(
          success: false, message: _errorMessage(res.body, 'Could not deduct points. Please try again.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is! Map<String, dynamic>) {
      return const PointsDeductResult(
          success: false, message: 'Could not deduct points. Please try again.');
    }
    return PointsDeductResult.fromJson(decoded);
  }

  /// POST /notify-owner-contact-view — SMSes the owner via the SIM gateway.
  /// Fire-and-forget; never blocks the reveal.
  Future<void> notifyOwnerContactView({
    required String rentId,
    required String viewerPhone,
    required String ownerPhone,
  }) async {
    try {
      await _client.post(
        _uri('/notify-owner-contact-view'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'rentId': rentId,
          'viewerPhone': viewerPhone,
          'ownerPhone': ownerPhone,
        }),
      );
    } catch (_) {/* non-blocking */}
  }

  /// POST /add-favorite-rent | /remove-favorite-rent { phoneNumber, rentId }
  /// -> { status: "favorite" | ..., message }
  Future<String?> toggleFavorite({
    required String phoneNumber,
    required String rentId,
    required bool add,
  }) async {
    final res = await _client.post(
      _uri(add ? '/add-favorite-rent' : '/remove-favorite-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phoneNumber, 'rentId': rentId}),
    );
    if (res.statusCode != 200) throw ApiException('Could not update favourite.');
    final body = jsonDecode(res.body);
    return body is Map ? body['status']?.toString() : null;
  }

  /// POST /send-interests-rent | /remove-interest-rent { phoneNumber, rentId }
  Future<String?> toggleInterest({
    required String phoneNumber,
    required String rentId,
    required bool send,
  }) async {
    final res = await _client.post(
      _uri(send ? '/send-interests-rent' : '/remove-interest-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phoneNumber, 'rentId': rentId}),
    );
    if (res.statusCode != 200) throw ApiException('Could not update interest.');
    final body = jsonDecode(res.body);
    return body is Map ? body['status']?.toString() : null;
  }

  /// POST /report-property-rent { phoneNumber, rentId, reason, selectReasons }
  Future<void> reportProperty({
    required String phoneNumber,
    required String rentId,
    required String comment,
    required String selectedReason,
  }) async {
    final res = await _client.post(
      _uri('/report-property-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'rentId': rentId,
        'reason': comment,
        'selectReasons': selectedReason,
      }),
    );
    if (res.statusCode != 200) throw ApiException('Could not report property.');
  }

  /// POST /photo-request-rent { rentId, requesterPhoneNumber }
  Future<void> requestPhotos({
    required String rentId,
    required String requesterPhoneNumber,
  }) async {
    final res = await _client.post(
      _uri('/photo-request-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'rentId': rentId, 'requesterPhoneNumber': requesterPhoneNumber}),
    );
    if (res.statusCode != 200) throw ApiException('Photo request failed.');
  }

  /// POST /request-address-rent { rentId, requesterPhoneNumber } -> { message }
  Future<String?> requestAddress({
    required String rentId,
    required String requesterPhoneNumber,
  }) async {
    final res = await _client.post(
      _uri('/request-address-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'rentId': rentId, 'requesterPhoneNumber': requesterPhoneNumber}),
    );
    if (res.statusCode != 200) throw ApiException('Address request failed.');
    final body = jsonDecode(res.body);
    return body is Map ? body['message']?.toString() : null;
  }

  // ---------------------------------------------------------------------
  // Points plans + PayU (PointsPlans.jsx / initiatePointsPayment.js)
  // ---------------------------------------------------------------------

  /// GET /points-plans -> [ { _id, name, price, points, durationDays, ... } ]
  /// Returns an empty list on failure so the caller can keep its fallback set,
  /// exactly like the web page does.
  Future<List<PointsPlan>> fetchPointsPlans() async {
    try {
      final res = await _client.get(_uri('/points-plans'));
      if (res.statusCode != 200) return const [];
      final decoded = jsonDecode(res.body);
      if (decoded is! List) return const [];
      return decoded
          .whereType<Map<String, dynamic>>()
          .map(PointsPlan.fromJson)
          .toList();
    } catch (_) {
      return const [];
    }
  }

  /// GET /points-config-public -> { popupPlans: [ ... ], popupPlansSource }
  ///
  /// The plans an admin picked for the "no points" paywall on the admin panel's
  /// Points Pricing > No Points Popup screen. The server already drops hidden
  /// plans and falls back to the cheapest active one, so whatever comes back
  /// here is safe to show as-is. Empty list on failure, so the modal keeps its
  /// own hardcoded fallback and the buy button is never dead.
  Future<List<PointsPlan>> fetchPopupPlans() async {
    try {
      final res = await _client.get(_uri('/points-config-public'));
      if (res.statusCode != 200) return const [];
      final decoded = jsonDecode(res.body);
      if (decoded is! Map<String, dynamic>) return const [];
      final list = decoded['popupPlans'];
      if (list is! List) return const [];
      return list
          .whereType<Map<String, dynamic>>()
          .map(PointsPlan.fromJson)
          .toList();
    } catch (_) {
      return const [];
    }
  }

  /// Reserve the plan, then fetch the PayU form fields.
  ///
  ///   POST /select-points-plan  { phoneNumber, planId, points, amount }
  ///   POST /payu/points-payment { txnid, amount, ... }  -> PayU form fields
  ///
  /// Mirrors `initiatePointsPayment.js` field-for-field.
  Future<Map<String, dynamic>> initiatePointsPayment({
    required String phoneNumber,
    required PointsPlan plan,
    String firstname = 'User',
    String? email,
    required int nowMillis,
  }) async {
    await _client.post(
      _uri('/select-points-plan'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'planId': plan.id,
        'points': plan.points,
        'amount': plan.price,
      }),
    );

    final res = await _client.post(
      _uri('/payu/points-payment'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'txnid': 'points_$nowMillis',
        'amount': plan.price,
        'productinfo': 'Points Plan',
        'firstname': firstname,
        'email': email ?? 'user$nowMillis@rentpondy.com',
        'phone': phoneNumber,
        'planName': plan.name,
        'planId': plan.id,
        'points': plan.points,
        'payustatususer': 'pay now',
        'planType': 'points',
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Failed to start payment.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is! Map<String, dynamic>) {
      throw ApiException('Failed to start payment.');
    }
    return decoded;
  }

  // ---------------------------------------------------------------------
  // Points history (PointsHistory.jsx)
  // ---------------------------------------------------------------------

  /// GET /points-balance/:phone -> { balance, totalEarned, totalSpent, totalPaid }
  Future<PointsSummary> fetchPointsSummary(String phone) async {
    final res = await _client.get(_uri('/points-balance/$phone'));
    if (res.statusCode != 200) {
      throw ApiException('Could not load points history.');
    }
    final body = jsonDecode(res.body);
    if (body is! Map<String, dynamic>) return const PointsSummary();
    return PointsSummary.fromJson(body);
  }

  /// GET /points-transactions/:phone?limit= -> { transactions: [...] }
  Future<List<PointsTransaction>> fetchPointsTransactions(String phone,
      {int limit = 200}) async {
    final res = await _client
        .get(_uri('/points-transactions/$phone', {'limit': '$limit'}));
    if (res.statusCode != 200) {
      throw ApiException('Could not load points history.');
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['transactions'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(PointsTransaction.fromJson)
        .toList();
  }

  /// GET /points-refund-requests/:phone?limit= -> { requests: [...] }
  /// Tolerates failure (returns empty) exactly like the web page.
  Future<List<RefundRequest>> fetchRefundRequests(String phone,
      {int limit = 200}) async {
    try {
      final res = await _client
          .get(_uri('/points-refund-requests/$phone', {'limit': '$limit'}));
      if (res.statusCode != 200) return const [];
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return ((body['requests'] as List?) ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(RefundRequest.fromJson)
          .toList();
    } catch (_) {
      return const [];
    }
  }

  /// POST /points-refund-request { phoneNumber, transactionId, reason }
  Future<void> submitRefundRequest({
    required String phoneNumber,
    required String transactionId,
    required String reason,
  }) async {
    final res = await _client.post(
      _uri('/points-refund-request'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'transactionId': transactionId,
        'reason': reason,
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Failed to submit'));
    }
  }

  // ---------------------------------------------------------------------
  // Tenant list / buyer assistance (BuyerLists.jsx)
  // ---------------------------------------------------------------------

  /// GET /get-buyerAssistances-rent -> { data: [...] }, newest-first.
  Future<List<TenantRequest>> fetchTenantRequests() async {
    final res = await _client.get(_uri('/get-buyerAssistances-rent'));
    if (res.statusCode != 200) throw ApiException('Failed to load data');
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    final list = ((body['data'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(TenantRequest.fromJson)
        .toList();
    list.sort((a, b) {
      final ad = a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });
    return list;
  }

  /// POST /buyer-assistance-interests-rent { phoneNumber, buyerAssistanceId }
  /// — an owner expressing interest in a tenant's requirement.
  Future<void> sendTenantInterest({
    required String phoneNumber,
    required String buyerAssistanceId,
  }) async {
    final res = await _client.post(
      _uri('/buyer-assistance-interests-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'buyerAssistanceId': buyerAssistanceId,
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Could not send interest.'));
    }
  }

  /// POST /record-buyer-assist-view { Ra_Id, phoneNumber } — view tracking.
  Future<void> recordTenantView({
    required String raId,
    required String phoneNumber,
  }) async {
    try {
      await _client.post(
        _uri('/record-buyer-assist-view'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'Ra_Id': raId, 'phoneNumber': phoneNumber}),
      );
    } catch (_) {/* non-blocking */}
  }

  /// GET /plans-by-phone/:phone -> { plans: [...] }  (MyPlan.jsx)
  Future<List<UserPlan>> fetchMyPlans(String phone) async {
    final res = await _client.get(_uri('/plans-by-phone/$phone'));
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Failed to fetch plans'));
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return ((body['plans'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(UserPlan.fromJson)
        .toList();
  }

  // ---------------------------------------------------------------------
  // Profile (MyProfile.jsx)
  // ---------------------------------------------------------------------

  /// GET /profile/mobile/:phone -> profile object.
  /// Returns null on 404, which the web app treats as "no profile yet" and
  /// switches the form into create mode.
  Future<Map<String, dynamic>?> fetchProfile(String phone) async {
    final res = await _client.get(_uri('/profile/mobile/$phone'));
    if (res.statusCode == 404) return null;
    if (res.statusCode != 200) {
      throw ApiException('Could not load your profile.');
    }
    final decoded = jsonDecode(res.body);
    return decoded is Map<String, dynamic> ? decoded : null;
  }

  /// POST /profile-create { name, email, address, mobile }
  Future<void> createProfile(Map<String, dynamic> profile) async {
    final res = await _client.post(
      _uri('/profile-create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(profile),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw ApiException(_errorMessage(res.body, 'Could not create profile.'));
    }
  }

  /// PUT /profile/:mobile { name, email, address }
  Future<void> updateProfile({
    required String mobile,
    required String name,
    required String email,
    required String address,
  }) async {
    final res = await _client.put(
      _uri('/profile/$mobile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'address': address}),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Could not update profile.'));
    }
  }

  // ---------------------------------------------------------------------
  // Owner leads: favourites + received interest
  // (Detail/FavoriteBuyer.jsx, Detail/BuyerInterest.jsx)
  // ---------------------------------------------------------------------

  /// GET /payustatus-users -> [{ rentId, status }] as a rentId->status map.
  Future<Map<String, String>> _payuStatusMap() async {
    try {
      final res = await _client.get(_uri('/payustatus-users'));
      if (res.statusCode != 200) return {};
      final decoded = jsonDecode(res.body);
      if (decoded is! List) return {};
      final map = <String, String>{};
      for (final e in decoded.whereType<Map<String, dynamic>>()) {
        final id = e['rentId']?.toString();
        if (id != null && id.isNotEmpty) {
          map[id] = e['status']?.toString() ?? 'unpaid';
        }
      }
      return map;
    } catch (_) {
      return {};
    }
  }

  /// GET /user/property-message/:rentId -> { data: { message } }
  Future<String?> _propertyMessage(String rentId) async {
    try {
      final res = await _client.get(_uri('/user/property-message/$rentId'));
      if (res.statusCode != 200) return null;
      final body = jsonDecode(res.body);
      if (body is Map && body['data'] is Map) {
        return (body['data'] as Map)['message']?.toString();
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Enrich a raw property-shaped list with the PayU status + property message,
  /// newest-first — the common tail of every owner/tenant lead endpoint.
  Future<List<PropertyLead>> _enrichLeads(List raw) async {
    final statusMap = await _payuStatusMap();
    final leads =
        await Future.wait(raw.whereType<Map<String, dynamic>>().map((json) async {
      final rentId = json['rentId']?.toString() ?? '';
      return PropertyLead.fromJson(
        json,
        payuStatus: statusMap[rentId] ?? 'unpaid',
        propertyMessage:
            rentId.isEmpty ? null : await _propertyMessage(rentId),
      );
    }));
    leads.sort((a, b) => b.sortDate.compareTo(a.sortDate));
    return leads;
  }

  /// GET a lead endpoint and pull the array out from under [dataKey]
  /// (empty key = the response *is* the array).
  Future<List<PropertyLead>> _fetchLeads({
    required String path,
    String dataKey = '',
    Map<String, String>? params,
  }) async {
    final res = await _client.get(_uri(path, params));
    if (res.statusCode != 200) throw ApiException('Failed to load leads.');
    final body = jsonDecode(res.body);
    final List raw = body is List
        ? body
        : (body is Map ? (body[dataKey] as List?) ?? const [] : const []);
    return _enrichLeads(raw);
  }

  /// GET /get-favorite-buyer-rent?postedPhoneNumber= -> { favoriteRequestsData }
  Future<List<PropertyLead>> fetchFavouriteLeads(String phone) => _fetchLeads(
        path: '/get-favorite-buyer-rent',
        dataKey: 'favoriteRequestsData',
        params: {'postedPhoneNumber': phone},
      );

  /// GET /get-interest-buyers-rent?postedPhoneNumber= -> { propertiesData }
  Future<List<PropertyLead>> fetchInterestLeads(String phone) => _fetchLeads(
        path: '/get-interest-buyers-rent',
        dataKey: 'propertiesData',
        params: {'postedPhoneNumber': phone},
      );

  /// GET /offers/owner/:phone   -> { offers } (offers received on my listings)
  /// GET /offers/buyer/:phone   -> { offers } (offers I sent)
  Future<List<PropertyLead>> fetchOffersOwner(String phone) =>
      _fetchLeads(path: '/offers/owner/$phone', dataKey: 'offers');
  Future<List<PropertyLead>> fetchOffersBuyer(String phone) =>
      _fetchLeads(path: '/offers/buyer/$phone', dataKey: 'offers');

  /// GET /get-contact-owner-rent?phoneNumber= -> { contactRequestsData }
  /// GET /get-contact-buyer-rent?phoneNumber= -> { contactRequestsData }
  Future<List<PropertyLead>> fetchContactedOwner(String phone) => _fetchLeads(
        path: '/get-contact-owner-rent',
        dataKey: 'contactRequestsData',
        params: {'phoneNumber': phone},
      );
  Future<List<PropertyLead>> fetchContactedBuyer(String phone) => _fetchLeads(
        path: '/get-contact-buyer-rent',
        dataKey: 'contactRequestsData',
        params: {'phoneNumber': phone},
      );

  /// GET /photo-requests-rent/owner/:phone -> bare array
  /// GET /photo-requests-rent/buyer/:phone -> bare array
  Future<List<PropertyLead>> fetchPhotoRequestsOwner(String phone) =>
      _fetchLeads(path: '/photo-requests-rent/owner/$phone');
  Future<List<PropertyLead>> fetchPhotoRequestsBuyer(String phone) =>
      _fetchLeads(path: '/photo-requests-rent/buyer/$phone');

  /// GET /address-requests-rent/owner/:phone -> bare array
  Future<List<PropertyLead>> fetchAddressRequestsOwner(String phone) =>
      _fetchLeads(path: '/address-requests-rent/owner/$phone');

  /// GET /get-text/:type -> `{ content: "<html>" }`
  ///
  /// The policy/info pages (About, Refund, Terms, Privacy, Shipping) are
  /// CMS-driven — admins author HTML that the app renders verbatim, so there is
  /// no copy to hardcode. Known types: `aboutUs`, `refundPolicy`,
  /// `privacyPolicy`, `terms&conditions`, `shiping&Delivery`.
  Future<String> fetchCmsText(String type) async {
    try {
      final res = await _client.get(_uri('/get-text/$type'));
      if (res.statusCode != 200) return '';
      final body = jsonDecode(res.body);
      if (body is Map) return body['content']?.toString() ?? '';
      return '';
    } catch (_) {
      return '';
    }
  }

  // ---------------------------------------------------------------------
  // Add / edit property (AddProperty.jsx)
  // ---------------------------------------------------------------------

  /// GET /fetch -> { data: [{ field, value }] } grouped into field -> options.
  /// This is the dropdown configuration behind nearly every select on the
  /// property form, so it is admin-editable without an app release.
  Future<Map<String, List<String>>> fetchFieldConfig() async {
    final res = await _client.get(_uri('/fetch'));
    if (res.statusCode != 200) return {};
    final body = jsonDecode(res.body);
    if (body is! Map || body['data'] is! List) return {};
    final grouped = <String, List<String>>{};
    for (final item in (body['data'] as List).whereType<Map>()) {
      final field = item['field']?.toString();
      final value = item['value']?.toString();
      if (field == null || value == null) continue;
      grouped.putIfAbsent(field, () => []).add(value);
    }
    return grouped;
  }

  /// POST /store-data-rent { phoneNumber } -> { rentId }
  ///
  /// Reserves the property record up-front; the form then fills it in. This
  /// mirrors AddProperty.jsx, which calls this on mount so photos and fields
  /// always attach to a known rentId.
  Future<String?> reserveRentId(String phoneNumber) async {
    final res = await _client.post(
      _uri('/store-data-rent'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phoneNumber': phoneNumber}),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw ApiException(_errorMessage(res.body, 'Error adding user.'));
    }
    final body = jsonDecode(res.body);
    return body is Map ? body['rentId']?.toString() : null;
  }

  /// POST /update-rent-property as multipart/form-data — all form fields plus
  /// repeated `photos` parts (and `video` when present).
  Future<void> submitProperty({
    required Map<String, dynamic> fields,
    List<String> photoPaths = const [],
    List<String> videoPaths = const [],
  }) async {
    final request =
        http.MultipartRequest('POST', _uri('/update-rent-property'));

    fields.forEach((k, v) {
      if (v != null) request.fields[k] = '$v';
    });
    for (final path in photoPaths) {
      request.files.add(await http.MultipartFile.fromPath('photos', path));
    }
    for (final path in videoPaths) {
      request.files.add(await http.MultipartFile.fromPath('video', path));
    }

    final streamed = await _client.send(request);
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw ApiException(
          _errorMessage(res.body, 'Error saving property data.'));
    }
  }

  /// GET /get-location-applied-properties -> properties that have map
  /// coordinates set (the "Property with location" sort).
  Future<List<Property>> fetchLocatedProperties() =>
      _propertyList('/get-location-applied-properties');

  /// GET /zero-view-properties -> listings nobody has viewed yet.
  Future<List<Property>> fetchZeroViewProperties() =>
      _propertyList('/zero-view-properties');

  /// GET /user-most-viewed-properties-rent/:phone -> the user's most-viewed.
  Future<List<Property>> fetchMostViewed(String phone) =>
      _propertyList('/user-most-viewed-properties-rent/$phone');

  /// GET /fetch-matched-data-owner-rent?phoneNumber= -> tenant requirements
  /// matched to the owner's listings.
  Future<List<Property>> fetchMatchedForOwner(String phone) => _propertyList(
      '/fetch-matched-data-owner-rent', {'phoneNumber': phone});

  /// Shared reader for endpoints that return a property array under one of the
  /// usual keys (`users`, `data`, `properties`) or as a bare list.
  Future<List<Property>> _propertyList(String path,
      [Map<String, String>? params]) async {
    final res = await _client.get(_uri(path, params));
    if (res.statusCode != 200) {
      throw ApiException('Failed to load properties (${res.statusCode})');
    }
    final decoded = jsonDecode(res.body);
    final List raw;
    if (decoded is List) {
      raw = decoded;
    } else if (decoded is Map) {
      raw = (decoded['users'] ?? decoded['data'] ?? decoded['properties'])
              as List? ??
          const [];
    } else {
      raw = const [];
    }
    return raw
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
  }

  /// POST /contactUs { name, email, phoneNumber, message } — 201 on success.
  Future<void> submitContactUs({
    required String name,
    required String email,
    required String phoneNumber,
    required String message,
  }) async {
    final res = await _client.post(
      _uri('/contactUs'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'phoneNumber': phoneNumber,
        'message': message,
      }),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw ApiException(_errorMessage(res.body, 'Submission failed'));
    }
  }

  /// GET /get-property-videos -> rental property video listings.
  Future<List<Map<String, dynamic>>> fetchPropertyVideos() async {
    final res = await _client.get(_uri('/get-property-videos'));
    if (res.statusCode != 200) {
      throw ApiException('Failed to load videos.');
    }
    final decoded = jsonDecode(res.body);
    final List raw;
    if (decoded is List) {
      raw = decoded;
    } else if (decoded is Map) {
      raw = (decoded['videos'] ?? decoded['data']) as List? ?? const [];
    } else {
      raw = const [];
    }
    return raw.whereType<Map<String, dynamic>>().toList();
  }

  // ---------------------------------------------------------------------
  // Tenant (buyer) assistance request — BuyerAssistance.jsx
  // ---------------------------------------------------------------------

  /// POST /add-buyerAssistance-rent (create) or
  /// PUT  /update-buyerAssistance-rent/:id (when the request already exists).
  /// Both take the whole form object as JSON. Returns the saved record (the
  /// backend's `data`) so the caller can read its `Ra_Id`/`_id` for the plan
  /// payment step.
  Future<Map<String, dynamic>?> submitTenantAssistance(
    Map<String, dynamic> form, {
    String? existingId,
  }) async {
    final isUpdate = existingId != null && existingId.isNotEmpty;
    final uri = isUpdate
        ? _uri('/update-buyerAssistance-rent/$existingId')
        : _uri('/add-buyerAssistance-rent');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode(form);

    final res = isUpdate
        ? await _client.put(uri, headers: headers, body: body)
        : await _client.post(uri, headers: headers, body: body);

    if (res.statusCode != 200 && res.statusCode != 201) {
      throw ApiException(
          _errorMessage(res.body, 'Could not submit your requirement.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is Map && decoded['data'] is Map) {
      return Map<String, dynamic>.from(decoded['data'] as Map);
    }
    return decoded is Map<String, dynamic> ? decoded : null;
  }

  /// GET /buyer-plans-active -> { status:'success', plans:[...] }. The
  /// tenant-assistance subscription plans shown on the BuyerPlan screen. Each
  /// plan: _id, planName, planAmount, planValidity, numberOfAssistants,
  /// serviceType, status.
  Future<List<Map<String, dynamic>>> fetchActiveBuyerPlans() async {
    try {
      final res = await _client.get(_uri('/buyer-plans-active'));
      if (res.statusCode != 200) return const [];
      final body = jsonDecode(res.body);
      if (body is Map && body['status'] == 'success') {
        final raw = body['plans'] as List? ?? const [];
        return raw.whereType<Map<String, dynamic>>().toList();
      }
      return const [];
    } catch (_) {
      return const [];
    }
  }

  /// Tenant-assistance plan payment: associate the plan to this request
  /// (POST /select-buyer-plan) then start PayU (POST /payu/payment-buyer),
  /// returning the PayU form fields to replay in the checkout WebView.
  Future<Map<String, dynamic>> initiateBuyerPlanPayment({
    required String phoneNumber,
    required String planId,
    required String planName,
    required String amount,
    required int raId,
    required int nowMillis,
    String firstname = 'Buyer',
    String? email,
  }) async {
    // 1. Associate the plan + create the pending payment row. Best-effort:
    //    a duplicate/pending response is fine; only a hard "already paid"
    //    should stop us (surfaced as an error to the caller).
    final sel = await _client.post(
      _uri('/select-buyer-plan'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'planId': planId,
        'Ra_Id': raId,
      }),
    );
    if (sel.statusCode == 400 &&
        sel.body.toLowerCase().contains('payment is completed')) {
      throw ApiException('You already have an active plan for this request.');
    }

    // 2. Start PayU.
    final res = await _client.post(
      _uri('/payu/payment-buyer'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'txnid': 'txn_$nowMillis',
        'amount': amount,
        'productinfo': 'Subscription Plan',
        'firstname': firstname,
        'email': email ?? 'buyer$nowMillis@gmail.com',
        'phone': phoneNumber,
        'payustatususer': 'pay now',
        'planName': planName,
        'Ra_Id': raId,
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Failed to start payment.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is! Map<String, dynamic>) {
      throw ApiException('Failed to start payment.');
    }
    return decoded;
  }

  /// "Pay Now" — an arbitrary amount the user types (PayNow.jsx). Reuses the
  /// already-wired buyer PayU endpoint, which computes the hash and saves the
  /// row; `Ra_Id: 0` marks a payment not tied to a Tenant Assistance record,
  /// exactly as the web does.
  Future<Map<String, dynamic>> initiateCustomPayment({
    required String phoneNumber,
    required num amount,
    required int nowMillis,
    String firstname = 'User',
    String? email,
  }) async {
    final res = await _client.post(
      _uri('/payu/payment-buyer'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'txnid': 'txn_$nowMillis',
        'amount': amount,
        'productinfo': 'RentPondy Payment',
        'firstname': firstname,
        'email': email ?? 'user$nowMillis@rentpondy.com',
        'phone': phoneNumber,
        'payustatususer': 'pay now',
        'planName': 'Custom Payment',
        'Ra_Id': 0,
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(
          _errorMessage(res.body, 'Failed to start the payment.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is! Map<String, dynamic>) {
      throw ApiException('Failed to start the payment.');
    }
    return decoded;
  }

  /// GET /cities and /areas — location pickers on the assistance form.
  Future<List<String>> fetchCities() => _stringList('/cities');
  Future<List<String>> fetchAreas() => _stringList('/areas');

  Future<List<String>> _stringList(String path) async {
    try {
      final res = await _client.get(_uri(path));
      if (res.statusCode != 200) return const [];
      final decoded = jsonDecode(res.body);
      final List raw = decoded is List
          ? decoded
          : (decoded is Map
              ? (decoded['data'] ?? decoded['cities'] ?? decoded['areas'])
                      as List? ??
                  const []
              : const []);
      return raw
          .map((e) => e is Map ? (e['name'] ?? e['value'] ?? '') : e)
          .map((e) => '$e')
          .where((e) => e.isNotEmpty)
          .toList();
    } catch (_) {
      return const [];
    }
  }

  /// GET /user-last-30-days-views-rent/:phone -> { properties: [...] }
  /// Properties this user viewed in the last 30 days, newest-first.
  Future<List<Property>> fetchRecentlyViewed(String phone) async {
    final res =
        await _client.get(_uri('/user-last-30-days-views-rent/$phone'));
    if (res.statusCode != 200) {
      throw ApiException('Could not load recently viewed properties.');
    }
    final body = jsonDecode(res.body);
    final raw = body is Map ? (body['properties'] as List?) ?? const [] : const [];
    final list = raw
        .whereType<Map<String, dynamic>>()
        .map(Property.fromJson)
        .toList();
    list.sort((a, b) {
      final ad = a.updatedAt ?? a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.updatedAt ?? b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });
    return list;
  }

  // ---------------------------------------------------------------------
  // Property subscription plans (AddPlan.jsx + PayUPayment/PayUForm.jsx)
  // ---------------------------------------------------------------------

  /// GET /active-plans -> [{ _id, name, price, durationDays, featuredAds,
  /// numOfCars, packageType, description }]
  Future<List<PointsPlan>> fetchActivePlans() async {
    try {
      final res = await _client.get(_uri('/active-plans'));
      if (res.statusCode != 200) return const [];
      final decoded = jsonDecode(res.body);
      if (decoded is! List) return const [];
      // Reuse PointsPlan as a generic plan-card model (name/price/etc.).
      return decoded
          .whereType<Map<String, dynamic>>()
          .map(PointsPlan.fromJson)
          .toList();
    } catch (_) {
      return const [];
    }
  }

  /// POST /payu/payment { ...form, payustatususer: 'pay now' } -> PayU fields.
  /// The property-plan sibling of `initiatePointsPayment`.
  Future<Map<String, dynamic>> initiatePlanPayment({
    required String phoneNumber,
    required PointsPlan plan,
    required String rentId,
    String firstname = 'Owner',
    String? email,
    required int nowMillis,
  }) async {
    final res = await _client.post(
      _uri('/payu/payment'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'txnid': 'txn_$nowMillis',
        'amount': plan.price,
        'productinfo': 'Subscription Plan',
        'firstname': firstname,
        'email': email ?? 'owner$nowMillis@gmail.com',
        'phone': phoneNumber,
        'planName': plan.name,
        'planId': plan.id,
        'rentId': rentId,
        'payustatususer': 'pay now',
      }),
    );
    if (res.statusCode != 200) {
      throw ApiException(_errorMessage(res.body, 'Failed to start payment.'));
    }
    final decoded = jsonDecode(res.body);
    if (decoded is! Map<String, dynamic>) {
      throw ApiException('Failed to start payment.');
    }
    return decoded;
  }

  /// GET /get-buyer-plan-by-phone-buyer/:phone -> { data: [...] }
  /// The tenant-assistant plans held by this number (My Tenant Assistant Plan).
  Future<List<Map<String, dynamic>>> fetchBuyerPlans(String phone) async {
    final res =
        await _client.get(_uri('/get-buyer-plan-by-phone-buyer/$phone'));
    if (res.statusCode != 200) {
      throw ApiException('Could not load your assistant plan.');
    }
    final body = jsonDecode(res.body);
    final raw = body is Map ? (body['data'] as List?) ?? const [] : const [];
    return raw.whereType<Map<String, dynamic>>().toList();
  }

  /// POST /register-fcm-token { phoneNumber, token, platform }
  /// Upserts this device's FCM token so the backend can target pushes. This is
  /// a NEW additive endpoint on the PPC backend (see backend/fcm/).
  Future<void> registerFcmToken({
    required String phoneNumber,
    required String token,
    required String platform,
  }) async {
    await _client.post(
      _uri('/register-fcm-token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'token': token,
        'platform': platform,
      }),
    );
  }

  /// POST /log-app-open (fire-and-forget).
  Future<void> logAppOpen(String phoneNumber) async {
    try {
      await _client.post(
        _uri('/log-app-open'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phoneNumber': phoneNumber}),
      );
    } catch (_) {/* non-blocking */}
  }

  String _errorMessage(String body, String fallback) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map) {
        return (decoded['error'] ?? decoded['message'] ?? fallback).toString();
      }
    } catch (_) {}
    return fallback;
  }
}

class ApiException implements Exception {
  ApiException(this.message);
  final String message;
  @override
  String toString() => message;
}
