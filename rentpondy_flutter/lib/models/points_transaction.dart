import 'dart:ui';

/// Visual label for a transaction row (bg + fg + text), mirroring the LABEL /
/// REFUND_PILL maps in PointsHistory.jsx.
class PointsLabel {
  const PointsLabel(this.text, this.bg, this.fg);
  final String text;
  final Color bg;
  final Color fg;
}

/// A row from `GET /points-transactions/:phone`.
class PointsTransaction {
  final String id;
  final String type; // 'credit' | 'deduct'
  final int points;
  final String? reason;
  final String? note;
  final String? txnId;
  final String? planName;
  final DateTime? createdAt;

  const PointsTransaction({
    required this.id,
    required this.type,
    required this.points,
    this.reason,
    this.note,
    this.txnId,
    this.planName,
    this.createdAt,
  });

  factory PointsTransaction.fromJson(Map<String, dynamic> json) {
    num? n(dynamic v) => v is num ? v : num.tryParse('${v ?? ''}');
    return PointsTransaction(
      id: json['_id']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      points: (n(json['points']) ?? n(json['amount']) ?? 0).toInt(),
      reason: json['reason']?.toString(),
      note: json['note']?.toString(),
      txnId: json['txnId']?.toString(),
      planName: json['planName']?.toString(),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.tryParse(json['createdAt'].toString()),
    );
  }

  bool get isCredit => type == 'credit';

  /// Same precedence as `classify()` in the web app — note-based overrides
  /// first, then purchase / reveal detection, then the raw type.
  String get category {
    final nt = note ?? '';
    if (RegExp(r'^MANUAL-ADJUST', caseSensitive: false).hasMatch(nt)) {
      return 'manual';
    }
    if (RegExp(r'^REFUND', caseSensitive: false).hasMatch(nt)) return 'refund';
    if (type == 'credit' && (txnId ?? '').isNotEmpty) return 'purchase';
    if (type == 'deduct' && reason == 'view-owner-contact') return 'reveal';
    if (type == 'deduct' && reason == 'view-tenant-contact') {
      return 'tenantReveal';
    }
    return type;
  }

  /// Contact reveals are the only rows that can be refunded.
  bool get isReveal => category == 'reveal' || category == 'tenantReveal';

  PointsLabel get label =>
      _labels[category] ??
      PointsLabel(category, const Color(0xFFEEEEEE), const Color(0xFF333333));

  static const _labels = <String, PointsLabel>{
    'purchase':
        PointsLabel('Points purchase', Color(0xFFE6F4EA), Color(0xFF137333)),
    'reveal': PointsLabel('Owner contact', Color(0xFFEAF2FF), Color(0xFF1A5DBA)),
    'tenantReveal':
        PointsLabel('Tenant contact', Color(0xFFE8F8F5), Color(0xFF0E7C6B)),
    'refund': PointsLabel('Refund', Color(0xFFE0F2F1), Color(0xFF00796B)),
    'manual':
        PointsLabel('Manual adjustment', Color(0xFFFFF4D6), Color(0xFF7A5B00)),
    'credit': PointsLabel('Credit', Color(0xFFE6F4EA), Color(0xFF137333)),
    'deduct': PointsLabel('Deduct', Color(0xFFFDECEA), Color(0xFFA53149)),
  };
}

/// A row from `GET /points-refund-requests/:phone`.
class RefundRequest {
  final String transactionId;
  final String status; // pending | approved | rejected

  const RefundRequest({required this.transactionId, required this.status});

  factory RefundRequest.fromJson(Map<String, dynamic> json) => RefundRequest(
        transactionId: json['transactionId']?.toString() ?? '',
        status: json['status']?.toString() ?? 'pending',
      );

  /// pending > approved > rejected — used to pick the most relevant refund
  /// when a transaction has several.
  int get rank => switch (status) {
        'pending' => 3,
        'approved' => 2,
        _ => 1,
      };

  PointsLabel? get pill => _pills[status];

  static const _pills = <String, PointsLabel>{
    'pending':
        PointsLabel('Refund pending', Color(0xFFFFF4D6), Color(0xFF7A5B00)),
    'approved':
        PointsLabel('Refund approved', Color(0xFFE6F4EA), Color(0xFF137333)),
    'rejected':
        PointsLabel('Refund rejected', Color(0xFFFDECEA), Color(0xFFA53149)),
  };
}

/// `GET /points-balance/:phone` also returns lifetime totals.
class PointsSummary {
  final int balance;
  final int totalEarned;
  final int totalSpent;
  final int totalPaid;

  const PointsSummary({
    this.balance = 0,
    this.totalEarned = 0,
    this.totalSpent = 0,
    this.totalPaid = 0,
  });

  factory PointsSummary.fromJson(Map<String, dynamic> json) {
    int n(dynamic v) => (v is num ? v : num.tryParse('${v ?? ''}') ?? 0).toInt();
    return PointsSummary(
      balance: n(json['balance']),
      totalEarned: n(json['totalEarned']),
      totalSpent: n(json['totalSpent']),
      totalPaid: n(json['totalPaid']),
    );
  }
}
