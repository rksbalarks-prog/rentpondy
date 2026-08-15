/// Outcome of `POST /points-deduct`.
///
/// The web app treats this endpoint as the authority for the contact paywall:
/// the contact is revealed **only** when `success == true` and
/// `alreadyDeducted == false`. Anything else keeps it hidden.
class PointsDeductResult {
  final bool success;
  final bool alreadyDeducted;
  final int? balance;
  final String? message;

  /// True when the backend answered HTTP 402 — the balance dropped below the
  /// required points between the check and the deduct. Surfaces the
  /// "Buy Points" modal rather than a generic error.
  final bool insufficient;

  const PointsDeductResult({
    required this.success,
    this.alreadyDeducted = false,
    this.balance,
    this.message,
    this.insufficient = false,
  });

  factory PointsDeductResult.fromJson(Map<String, dynamic> json) {
    return PointsDeductResult(
      success: json['success'] == true,
      alreadyDeducted: json['alreadyDeducted'] == true,
      balance: (json['balance'] as num?)?.toInt(),
      message: json['message']?.toString(),
    );
  }

  static const insufficientResult =
      PointsDeductResult(success: false, insufficient: true);
}
