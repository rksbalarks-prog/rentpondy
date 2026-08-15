/// Payment record attached to one rentId inside a plan.
class PlanPayment {
  final String? payuStatus;
  final num? amount;
  final String? txnId;
  final DateTime? payUDate;
  final String? email;
  final String? expiryMessage;
  final String? status;

  const PlanPayment({
    this.payuStatus,
    this.amount,
    this.txnId,
    this.payUDate,
    this.email,
    this.expiryMessage,
    this.status,
  });

  factory PlanPayment.fromJson(Map<String, dynamic> json) {
    return PlanPayment(
      payuStatus: json['payustatususer']?.toString(),
      amount: json['amount'] is num
          ? json['amount']
          : num.tryParse('${json['amount'] ?? ''}'),
      txnId: json['txnid']?.toString(),
      payUDate: json['payUdate'] == null
          ? null
          : DateTime.tryParse(json['payUdate'].toString()),
      email: json['email']?.toString(),
      expiryMessage: json['expiryMessage']?.toString(),
      status: json['status']?.toString(),
    );
  }

  bool get isPaid => payuStatus?.toLowerCase() == 'paid';

  /// Label on the pay button — "Continue to Pay" when a pending attempt exists.
  String get payButtonLabel =>
      status == 'pending' ? 'Continue to Pay' : 'Pay Now';
}

/// One rentId covered by the plan.
class PlanPhoneEntry {
  final String? number;
  final String? rentId;
  final PlanPayment? payment;

  const PlanPhoneEntry({this.number, this.rentId, this.payment});

  factory PlanPhoneEntry.fromJson(Map<String, dynamic> json) {
    final pd = json['paymentData'];
    return PlanPhoneEntry(
      number: json['number']?.toString(),
      rentId: json['rentId']?.toString(),
      payment: pd is Map<String, dynamic> ? PlanPayment.fromJson(pd) : null,
    );
  }
}

/// A subscription plan from `GET /plans-by-phone/:phone` -> { plans: [...] }.
class UserPlan {
  final String id;
  final String? name;
  final int? durationDays;
  final DateTime? createdAt;
  final String? featuredAds;
  final String? featuredMaxCar;
  final List<PlanPhoneEntry> phoneNumbers;

  const UserPlan({
    required this.id,
    this.name,
    this.durationDays,
    this.createdAt,
    this.featuredAds,
    this.featuredMaxCar,
    this.phoneNumbers = const [],
  });

  factory UserPlan.fromJson(Map<String, dynamic> json) {
    final raw = (json['phoneNumbers'] as List?) ?? const [];
    final entries = raw
        .whereType<Map<String, dynamic>>()
        .map(PlanPhoneEntry.fromJson)
        .toList();
    // Newest payment first, as MyPlan.jsx sorts them.
    entries.sort((a, b) {
      final ad = a.payment?.payUDate ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.payment?.payUDate ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });

    return UserPlan(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString(),
      durationDays: (json['durationDays'] is num
              ? json['durationDays']
              : num.tryParse('${json['durationDays'] ?? ''}'))
          ?.toInt(),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.tryParse(json['createdAt'].toString()),
      featuredAds: json['featuredAds']?.toString(),
      featuredMaxCar: json['featuredMaxCar']?.toString(),
      phoneNumbers: entries,
    );
  }

  /// Only the entries belonging to the signed-in number are shown.
  List<PlanPhoneEntry> entriesFor(String phone) =>
      phoneNumbers.where((e) => e.number == phone).toList();

  /// payUdate + durationDays — the web app's calculateExpireDate().
  DateTime? expiryFor(PlanPayment p) {
    if (p.payUDate == null || durationDays == null) return null;
    return p.payUDate!.add(Duration(days: durationDays!));
  }
}
