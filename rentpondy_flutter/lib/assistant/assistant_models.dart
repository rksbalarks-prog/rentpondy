// Data models for the assistant chat — the shapes the backend streams over SSE
// (`results`, `action`) and the message list the widget renders. Ports the
// plain-object structures used across `useAssistant.js` + `AssistantWidget.jsx`.

enum ChatRole { user, assistant }

/// A property result card (from the `results` SSE event). Fields mirror
/// `leanCard()` / `detailCard()` on the backend tool registry.
class ResultCard {
  final int? rentId;
  final String? propertyType;
  final String? propertyMode;
  final String? rentType;
  final String? bedrooms;

  /// Either a number (INR) or a string like "On Demand".
  final Object? rent;
  final String? area;
  final String? city;
  final String? furnished;
  final String? totalArea;

  const ResultCard({
    this.rentId,
    this.propertyType,
    this.propertyMode,
    this.rentType,
    this.bedrooms,
    this.rent,
    this.area,
    this.city,
    this.furnished,
    this.totalArea,
  });

  factory ResultCard.fromJson(Map<String, dynamic> j) {
    int? asInt(dynamic v) =>
        v is int ? v : (v is num ? v.toInt() : int.tryParse('${v ?? ''}'));
    String? asStr(dynamic v) => v?.toString();
    return ResultCard(
      rentId: asInt(j['rentId']),
      propertyType: asStr(j['propertyType']),
      propertyMode: asStr(j['propertyMode']),
      rentType: asStr(j['rentType']),
      bedrooms: asStr(j['bedrooms']),
      rent: j['rent'] ?? j['rentalAmount'],
      area: asStr(j['area']),
      city: asStr(j['city']),
      furnished: asStr(j['furnished']),
      totalArea: asStr(j['totalArea']),
    );
  }

  /// A JSON blob shaped for `Property.fromJson`, so tapping a card can open the
  /// existing detail screen with an instant placeholder before it refetches.
  Map<String, dynamic> toPropertyJson() => {
        'rentId': rentId?.toString(),
        'propertyType': propertyType,
        'propertyMode': propertyMode,
        'rentType': rentType,
        'bedrooms': bedrooms,
        'rentalAmount': rent is num ? rent : null,
        'area': area,
        'city': city,
        'furnished': furnished,
        'totalArea': totalArea,
      };
}

enum ActionState { pending, working, done, error }

/// A proposed action from the model. Write actions carry {endpoint, method,
/// body} to POST on Confirm; navigate actions carry {navigate, cta, prefill}
/// to open an app screen.
class AssistantAction {
  final String tool;
  final String? kind; // 'navigate' for nav actions
  final String? method;
  final String? endpoint;
  final Map<String, dynamic>? body;
  final String? navigate;
  final String? cta;
  final Map<String, dynamic>? prefill;
  final String label;
  final String? summary;
  final bool spendsMoney;

  ActionState state;
  String? error;

  AssistantAction({
    required this.tool,
    this.kind,
    this.method,
    this.endpoint,
    this.body,
    this.navigate,
    this.cta,
    this.prefill,
    required this.label,
    this.summary,
    this.spendsMoney = false,
    this.state = ActionState.pending,
    this.error,
  });

  bool get isNavigate => (navigate ?? '').isNotEmpty;

  factory AssistantAction.fromJson(Map<String, dynamic> j) {
    Map<String, dynamic>? asMap(dynamic v) =>
        v is Map ? v.map((k, val) => MapEntry('$k', val)) : null;
    return AssistantAction(
      tool: '${j['tool'] ?? ''}',
      kind: j['kind']?.toString(),
      method: j['method']?.toString(),
      endpoint: j['endpoint']?.toString(),
      body: asMap(j['body']),
      navigate: j['navigate']?.toString(),
      cta: j['cta']?.toString(),
      prefill: asMap(j['prefill']),
      label: '${j['label'] ?? ''}',
      summary: j['summary']?.toString(),
      spendsMoney: j['spendsMoney'] == true,
    );
  }
}

/// One bubble in the chat stream.
class ChatMessage {
  final int id;
  final ChatRole role;
  String content;
  bool streaming;
  final List<ResultCard> cards;
  final List<AssistantAction> actions;

  ChatMessage({
    required this.id,
    required this.role,
    this.content = '',
    this.streaming = false,
    List<ResultCard>? cards,
    List<AssistantAction>? actions,
  })  : cards = cards ?? [],
        actions = actions ?? [];
}
