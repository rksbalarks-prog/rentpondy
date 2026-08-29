import '../config/api_config.dart';

/// A rental / sale property returned by `/fetch-active-users`.
///
/// The backend documents are loosely typed, so every field is parsed
/// defensively (the web app sprinkles `|| 'N/A'` fallbacks everywhere).
class Property {
  final String id;
  final String rentId;
  final num? price;
  final String? propertyMode;
  final String? propertyType;
  final String? city;
  final String? district;
  final String? state;
  final String? area;
  final String? bedrooms;
  final String? totalArea;
  final String? areaUnit;
  final String? floorNo;
  final String? negotiation;
  final String? bankLoan;
  final String? phoneNumber;
  final String? assignedPhoneNumber;
  final int? views;
  final DateTime? createdAt;
  final List<String> photos;
  // --- My Property (fetch-status-with-payment-rent) extras ---
  final String? nagar;
  final String? postedBy;
  final String? displayStatus;
  final String? paymentStatus;
  final DateTime? updatedAt;
  // --- Detail page extras ---
  final String? alternatePhone;
  final String? postedUserPhoneNumber;
  final String? ownerName;
  final String? description;
  // Full backend document, so the detail page can read the ~40 extra fields
  // (rentType, securityDeposit, kitchen, facing, familyMembers, doorNumber, …)
  // the web overview grid shows without adding a typed field for each.
  final Map<String, dynamic> raw;

  const Property({
    required this.id,
    required this.rentId,
    this.price,
    this.propertyMode,
    this.propertyType,
    this.city,
    this.district,
    this.state,
    this.area,
    this.bedrooms,
    this.totalArea,
    this.areaUnit,
    this.floorNo,
    this.negotiation,
    this.bankLoan,
    this.phoneNumber,
    this.assignedPhoneNumber,
    this.views,
    this.createdAt,
    this.photos = const [],
    this.nagar,
    this.postedBy,
    this.displayStatus,
    this.paymentStatus,
    this.updatedAt,
    this.alternatePhone,
    this.postedUserPhoneNumber,
    this.ownerName,
    this.description,
    this.raw = const {},
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    String? str(dynamic v) => v?.toString();

    List<String> parsePhotos(dynamic v) {
      if (v is List) {
        return v.map((e) => e.toString()).toList();
      }
      return const [];
    }

    DateTime? parseDate(dynamic v) {
      if (v == null) return null;
      return DateTime.tryParse(v.toString());
    }

    num? parseNum(dynamic v) {
      if (v == null) return null;
      if (v is num) return v;
      return num.tryParse(v.toString());
    }

    return Property(
      id: str(json['_id']) ?? str(json['rentId']) ?? '',
      rentId: str(json['rentId']) ?? '',
      // The backend schema stores the amount as `rentalAmount` (there is no
      // `price` field); some endpoints alias it to `price`, so try both.
      price: parseNum(json['rentalAmount']) ?? parseNum(json['price']),
      propertyMode: str(json['propertyMode']),
      propertyType: str(json['propertyType']),
      city: str(json['city']),
      district: str(json['district']),
      state: str(json['state']),
      area: str(json['area']),
      bedrooms: str(json['bedrooms']),
      totalArea: str(json['totalArea']),
      areaUnit: str(json['areaUnit']),
      floorNo: str(json['floorNo']),
      negotiation: str(json['negotiation']),
      bankLoan: str(json['bankLoan']),
      phoneNumber: str(json['phoneNumber']),
      assignedPhoneNumber: str(json['assignedPhoneNumber']),
      views: parseNum(json['views'])?.toInt(),
      createdAt: parseDate(json['createdAt']),
      photos: parsePhotos(json['photos']),
      nagar: str(json['nagar']),
      postedBy: str(json['postedBy']),
      displayStatus: str(json['displayStatus']),
      // The backend spells the payment flag several ways depending on the
      // endpoint; MyProperty.jsx checks all of them in this order.
      paymentStatus: str(json['payustatususer']) ??
          str(json['payUstatususer']) ??
          str(json['paymentStatus']) ??
          str((json['paymentData'] as Map?)?['payustatususer']) ??
          str((json['paymentData'] as Map?)?['status']),
      updatedAt: parseDate(json['updatedAt']),
      // Details.jsx checks several spellings for the alternate number.
      alternatePhone: str(json['alternatePhone']) ??
          str(json['alternatePhoneNumber']) ??
          str(json['secondaryPhone']),
      postedUserPhoneNumber: str(json['postedUserPhoneNumber']),
      ownerName: str(json['ownerName']),
      description: str(json['description']),
      raw: json,
    );
  }

  /// Read any backend field by key as a display string (used by the detail
  /// overview grid). Returns null for missing/empty values.
  String? rawStr(String key) {
    final v = raw[key];
    if (v == null) return null;
    final s = v.toString().trim();
    return s.isEmpty ? null : s;
  }

  /// First photo as an absolute URL, or null when the property has no image.
  String? get firstPhotoUrl =>
      photos.isNotEmpty ? ApiConfig.photoUrl(photos.first) : null;

  /// Owner number to display once revealed. Prefers the masked/assigned number
  /// the admin set for this rentId, falling back to the real one — the exact
  /// precedence `revealOwnerContact()` uses in Details.jsx.
  String? get displayPhone {
    for (final v in [assignedPhoneNumber, phoneNumber, postedUserPhoneNumber]) {
      if (v != null && v.isNotEmpty) return v;
    }
    return null;
  }

  /// The owner's *real* number, sent to /notify-owner-contact-view so the
  /// backend can SMS them (it also resolves by rentId as a fallback).
  String get ownerRealPhone {
    for (final v in [phoneNumber, postedUserPhoneNumber]) {
      if (v != null && v.isNotEmpty) return v;
    }
    return '';
  }

  /// True when the listing's payment has cleared (drives the green "paid-card"
  /// styling and the Paid/Pending pill on My Property).
  /// The owner quoted no rent and wants a phone call. Set explicitly on the
  /// add-property form, and by the newspaper importer for the many classified
  /// ads that print no figure. A 0 price means the same thing.
  bool get callForRent {
    final v = raw['callForRent'];
    if (v is bool) return v;
    if (v is String) return const ['true', '1', 'yes', 'y'].contains(v.toLowerCase());
    return false;
  }

  bool get isPaid => paymentStatus?.toLowerCase() == 'paid';

  bool get isPreApproved {
    final s = displayStatus?.toLowerCase() ?? '';
    return s == 'preapproved' || s == 'pre_approved';
  }

  /// Status shown over the photo: "Approved" once paid + pre-approved.
  String get statusLabel =>
      (isPaid && isPreApproved) ? 'Approved' : (displayStatus ?? 'N/A');

  /// First three non-empty location parts, capitalised — mirrors the IIFE in
  /// MyProperty.jsx (nagar, area, city, district, state).
  String get locationLine {
    final parts = [nagar, area, city, district, state]
        .where((v) => v != null && v.isNotEmpty)
        .map((v) => v![0].toUpperCase() + v.substring(1).toLowerCase())
        .take(3)
        .toList();
    return parts.isEmpty ? 'N/A, N/A' : parts.join(', ');
  }
}
