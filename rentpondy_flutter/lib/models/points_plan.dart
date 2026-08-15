/// A purchasable points bundle from `GET /points-plans`.
class PointsPlan {
  final String id;
  final String name;
  final num price;
  final int points;
  final int? durationDays;
  final String? description;
  final bool popular;
  // Property-subscription plans (active-plans) carry these extras.
  final String? featuredAds;
  final String? numOfCars;
  final String? packageType;

  const PointsPlan({
    required this.id,
    required this.name,
    required this.price,
    required this.points,
    this.durationDays,
    this.description,
    this.popular = false,
    this.featuredAds,
    this.numOfCars,
    this.packageType,
  });

  factory PointsPlan.fromJson(Map<String, dynamic> json) {
    num? num_(dynamic v) => v is num ? v : num.tryParse('${v ?? ''}');
    return PointsPlan(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Plan',
      price: num_(json['price']) ?? 0,
      points: num_(json['points'])?.toInt() ?? 0,
      durationDays: num_(json['durationDays'])?.toInt(),
      description: json['description']?.toString(),
      popular: json['popular'] == true,
      featuredAds: json['featuredAds']?.toString(),
      numOfCars: json['numOfCars']?.toString(),
      packageType: json['packageType']?.toString(),
    );
  }

  /// Each contact reveal costs 10 points (POINTS_PER_CONTACT_VIEW).
  int get revealCount => points ~/ 10;

  /// Shown when `/points-plans` is unreachable — identical to FALLBACK_PLANS
  /// in PointsPlans.jsx so the page never renders empty.
  static const fallback = <PointsPlan>[
    PointsPlan(
      id: 'points-100',
      name: 'Starter',
      price: 100,
      points: 100,
      durationDays: 30,
      description: 'Great for trying things out',
    ),
    PointsPlan(
      id: 'points-200',
      name: 'Standard',
      price: 200,
      points: 200,
      durationDays: 60,
      description: 'Most common choice',
      popular: true,
    ),
    PointsPlan(
      id: 'points-900',
      name: 'Pro',
      price: 900,
      points: 1000,
      durationDays: 180,
      description: 'Best value — 10% extra points',
    ),
  ];
}
