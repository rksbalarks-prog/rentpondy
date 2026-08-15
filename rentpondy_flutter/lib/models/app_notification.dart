/// A user notification from `/get-user-notifications` (or `/notifications/:phone`).
class AppNotification {
  final String id;
  final String? rentId;
  final String? type;
  final String message;
  final DateTime? createdAt;
  final bool isRead;

  const AppNotification({
    required this.id,
    required this.message,
    this.rentId,
    this.type,
    this.createdAt,
    this.isRead = false,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['_id']?.toString() ?? '',
      rentId: json['rentId']?.toString(),
      type: json['type']?.toString(),
      message: json['message']?.toString() ?? '',
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.tryParse(json['createdAt'].toString()),
      isRead: json['isRead'] == true,
    );
  }

  AppNotification copyWith({bool? isRead}) => AppNotification(
        id: id,
        rentId: rentId,
        type: type,
        message: message,
        createdAt: createdAt,
        isRead: isRead ?? this.isRead,
      );

  /// Dedupe key used by Notification.jsx: `${rentId}_${message}`.
  String get dedupeKey => '${rentId}_$message';

  /// Where tapping this notification should navigate — mirrors the branching
  /// in `handleSingleNotificationClick`.
  String? get targetRoute {
    final m = message.toLowerCase();
    if (m.contains('matches your property')) return '/matched-buyer';
    if (m.contains('buyer') && m.contains('assistance')) {
      return '/Buyer-List-Filter';
    }
    if (rentId != null && rentId!.startsWith('plan-')) return '/my-plan';
    if (rentId != null && rentId!.isNotEmpty) return '/details/$rentId';
    return null;
  }
}
