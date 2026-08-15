import 'property.dart';

/// A lead on one of *my* properties — either a tenant who favourited it
/// (`/get-favorite-buyer-rent`) or one who sent interest
/// (`/get-interest-buyers-rent`).
///
/// Both endpoints return property-shaped documents, enriched client-side with
/// the PayU status and the admin property message.
class PropertyLead {
  final Property property;

  /// Tenant numbers attached to this property (interest list).
  final List<String> interestedUsers;

  /// Tenant who favourited it (favourites list).
  final String? buyerPhoneNumber;

  /// From `/payustatus-users`; defaults to "unpaid" like the web app.
  final String payuStatus;

  /// From `/user/property-message/:rentId`.
  final String? propertyMessage;

  final DateTime? updatedAt;

  const PropertyLead({
    required this.property,
    this.interestedUsers = const [],
    this.buyerPhoneNumber,
    this.payuStatus = 'unpaid',
    this.propertyMessage,
    this.updatedAt,
  });

  factory PropertyLead.fromJson(
    Map<String, dynamic> json, {
    String payuStatus = 'unpaid',
    String? propertyMessage,
  }) {
    // The web app filters out null / literal "undefined" entries.
    final raw = (json['interestedUsers'] as List?) ?? const [];
    final users = raw
        .map((e) => e?.toString() ?? '')
        .where((e) => e.isNotEmpty && e != 'undefined')
        .toList();

    return PropertyLead(
      property: Property.fromJson(json),
      interestedUsers: users,
      buyerPhoneNumber: json['buyerPhoneNumber']?.toString() ??
          json['phoneNumber']?.toString(),
      payuStatus: payuStatus,
      propertyMessage: propertyMessage,
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.tryParse(json['updatedAt'].toString()),
    );
  }

  bool get isPaid => payuStatus.toLowerCase() == 'paid';

  /// Sort key — updatedAt falling back to createdAt.
  DateTime get sortDate =>
      updatedAt ??
      property.createdAt ??
      DateTime.fromMillisecondsSinceEpoch(0);
}
