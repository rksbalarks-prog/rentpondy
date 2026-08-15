/// A tenant's rental requirement ("buyer assistance") from
/// `GET /get-buyerAssistances-rent` -> { data: [...] }.
class TenantRequest {
  final String id;
  final String? raId;
  final String? raName;
  final num? minPrice;
  final num? maxPrice;
  final String? propertyMode;
  final String? propertyType;
  final String? paymentType;
  final String? bedrooms;
  final String? area;
  final String? city;
  final String? phoneNumber;
  final DateTime? createdAt;

  const TenantRequest({
    required this.id,
    this.raId,
    this.raName,
    this.minPrice,
    this.maxPrice,
    this.propertyMode,
    this.propertyType,
    this.paymentType,
    this.bedrooms,
    this.area,
    this.city,
    this.phoneNumber,
    this.createdAt,
  });

  factory TenantRequest.fromJson(Map<String, dynamic> json) {
    String? s(dynamic v) => v?.toString();
    num? n(dynamic v) => v is num ? v : num.tryParse('${v ?? ''}');
    return TenantRequest(
      id: s(json['_id']) ?? '',
      raId: s(json['Ra_Id']),
      raName: s(json['raName']),
      minPrice: n(json['minPrice']),
      maxPrice: n(json['maxPrice']),
      propertyMode: s(json['propertyMode']),
      propertyType: s(json['propertyType']),
      paymentType: s(json['paymentType']),
      bedrooms: s(json['bedrooms']),
      area: s(json['area']),
      city: s(json['city']),
      phoneNumber: s(json['phoneNumber']),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.tryParse(json['createdAt'].toString()),
    );
  }

  /// The list masks the last five digits: `98765*****`.
  String get maskedPhone {
    final p = phoneNumber ?? '';
    if (p.isEmpty) return 'Phone: N/A';
    if (p.length <= 5) return 'Buyer Phone: *****';
    return 'Buyer Phone: ${p.substring(0, p.length - 5)}*****';
  }

  /// `createdAt.slice(0, 10)` in the web card.
  String get shortDate =>
      createdAt == null ? 'N/A' : createdAt!.toIso8601String().substring(0, 10);
}
