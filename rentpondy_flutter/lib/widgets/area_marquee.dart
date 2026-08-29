import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import '../models/area_summary.dart';

/// The two scrolling area tickers on the home feed — a port of the
/// "Total Rent Property Available" / "Total Tenants Available" rows in
/// AllProperty.jsx, matching them measurement for measurement.
///
/// Web reference (kept here because the numbers are otherwise unexplainable):
///   heading    13px / weight 700, colour #203a43 (property) or #11998e (tenant)
///   panel      linear-gradient(135deg, tint 0%, #ffffff 100%), radius 10, pad 8
///   card       88px wide, 4px side margin, 5px/4px padding, radius 8,
///              1.5px border in the accent colour,
///              shadow 0 2px 8px rgba(accent, .2)
///   area label 10px / 700 / accent, min-height 24px, centred both ways
///   count tile accent tint, radius 5, pad 3px/2px
///   count      1.05rem (~16.8px) / 800 / accent, line-height 1
///   noun       0.75rem (12px) / 700 / black
///
/// The web scrolls with a CSS keyframe animation, which the user cannot touch.
/// Here it is a real horizontal [ListView] nudged along by a [Ticker] instead,
/// so the same drift happens on its own AND a finger can drag, fling or hold
/// it. Auto-scroll pauses while the user is in contact and resumes a couple of
/// seconds after they let go.
class AreaMarquee extends StatefulWidget {
  const AreaMarquee({
    super.key,
    required this.title,
    required this.summary,
    required this.accent,
    required this.tint,
    required this.singularNoun,
    required this.pluralNoun,
    this.onCardTap,
  });

  /// Heading text including its emoji, e.g. "🏠 Total Rent Property Available".
  final String title;
  final AreaSummary summary;

  /// #203a43 for properties, #11998e for tenants.
  final Color accent;

  /// Panel gradient start and count-tile fill: #e6f0f5 / #eafff4.
  final Color tint;

  final String singularNoun;
  final String pluralNoun;
  final ValueChanged<AreaCard>? onCardTap;

  @override
  State<AreaMarquee> createState() => _AreaMarqueeState();
}

class _AreaMarqueeState extends State<AreaMarquee>
    with SingleTickerProviderStateMixin {
  static const double _cardWidth = 88;
  static const double _cardMargin = 4; // per side, so 96 per card
  static const double _slot = _cardWidth + _cardMargin * 2;
  static const double _cardHeight = 84;

  /// How long the user gets after letting go before the drift resumes.
  static const Duration _resumeAfter = Duration(seconds: 2);

  /// The list is laid out three times over. Sitting in the middle copy means a
  /// finger can drag either way and still land on real cards, and the wrap in
  /// [_onTick] keeps it there without the jump ever being visible.
  static const int _copies = 3;

  final ScrollController _scroll = ScrollController();
  late final Ticker _ticker;
  Duration _lastTick = Duration.zero;
  bool _held = false;
  Timer? _resumeTimer;

  /// True while this widget is driving the list itself.
  ///
  /// `ScrollController.jumpTo` dispatches ScrollStart/Update/End notifications
  /// exactly like a real drag does, so without this flag the ticker's own
  /// movement is mistaken for the user grabbing the row — the marquee then
  /// pauses itself on every frame and barely creeps along.
  bool _selfScroll = false;

  /// Move the list without tripping the "user is touching it" handler.
  void _jump(double to) {
    _selfScroll = true;
    _scroll.jumpTo(to); // dispatches its notifications synchronously
    _selfScroll = false;
  }

  double get _runWidth => widget.summary.cards.length * _slot;

  /// Pixels per second, from the web's `max(cards * 6, 24)`-second run.
  double get _speed {
    final seconds = (widget.summary.cards.length * 6).clamp(24, 600);
    return _runWidth / seconds;
  }

  @override
  void initState() {
    super.initState();
    _ticker = createTicker(_onTick)..start();
    // Start in the middle copy once the list has a position to jump within.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) _jump(_runWidth);
    });
  }

  @override
  void dispose() {
    _resumeTimer?.cancel();
    _ticker.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _onTick(Duration elapsed) {
    final dt = (elapsed - _lastTick).inMicroseconds / 1000000;
    _lastTick = elapsed;

    if (_held || !_scroll.hasClients || dt <= 0 || dt > 0.5) return;
    final position = _scroll.position;

    // A fling or an overscroll bounce is still settling. Touching the offset
    // now would cancel that simulation mid-flight and jerk the row, so leave it
    // entirely alone — the next idle tick tidies up the wrap.
    if (position.isScrollingNotifier.value) return;

    _wrap();
    // Few enough cards to fit on screen: nothing to drift.
    if (position.maxScrollExtent <= 0) return;

    _jump((_scroll.offset + _speed * dt).clamp(0.0, position.maxScrollExtent));
  }

  /// Keep the offset inside the middle copy, so the run repeats forever with no
  /// seam. Done by whole runs, which land on an identical pixel.
  void _wrap() {
    if (!_scroll.hasClients || _runWidth <= 0) return;
    final offset = _scroll.offset;
    if (offset >= _runWidth * 2) {
      _jump(offset - _runWidth);
    } else if (offset <= 0) {
      _jump(offset + _runWidth);
    }
  }

  /// A finger is on the list: stop drifting, and do not resume until it has
  /// been gone for [_resumeAfter] — otherwise the ticker fights the drag.
  void _hold() {
    _resumeTimer?.cancel();
    _held = true;
  }

  void _release() {
    _resumeTimer?.cancel();
    _resumeTimer = Timer(_resumeAfter, () {
      if (mounted) _held = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (widget.summary.isEmpty) return const SizedBox.shrink();
    final cards = widget.summary.cards;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
          child: Text(
            '${widget.title} (${widget.summary.total})',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: widget.accent,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [widget.tint, Colors.white],
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.all(8),
          child: SizedBox(
            height: _cardHeight,
            child: NotificationListener<ScrollNotification>(
              onNotification: (n) {
                // Ignore the notifications our own ticker causes.
                if (_selfScroll) return false;
                // dragDetails is non-null only when a finger is driving it;
                // a fling that follows keeps running under its own physics.
                if (n is ScrollStartNotification && n.dragDetails != null) {
                  _hold();
                } else if (n is ScrollEndNotification) {
                  _release();
                }
                return false;
              },
              child: ListView.builder(
                controller: _scroll,
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                padding: EdgeInsets.zero,
                itemCount: cards.length * _copies,
                itemBuilder: (context, i) => _card(cards[i % cards.length]),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _card(AreaCard card) {
    final noun = card.count == 1 ? widget.singularNoun : widget.pluralNoun;
    return GestureDetector(
      onTap: widget.onCardTap == null ? null : () => widget.onCardTap!(card),
      child: Container(
        width: _cardWidth,
        margin: const EdgeInsets.symmetric(horizontal: _cardMargin),
        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: widget.accent, width: 1.5),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: widget.accent.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 24,
              child: Center(
                child: Text(
                  card.area,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: widget.accent,
                    height: 1.1,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 3),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 3, horizontal: 2),
              decoration: BoxDecoration(
                color: widget.tint,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${card.count}',
                    style: TextStyle(
                      fontSize: 16.8, // 1.05rem
                      fontWeight: FontWeight.w800,
                      color: widget.accent,
                      height: 1,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    noun,
                    style: const TextStyle(
                      fontSize: 12, // 0.75rem
                      fontWeight: FontWeight.w700,
                      color: Colors.black,
                      height: 1.1,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
