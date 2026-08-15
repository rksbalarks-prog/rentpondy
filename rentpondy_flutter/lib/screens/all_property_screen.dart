import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/property.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../routes.dart';
import '../theme/app_colors.dart';
import '../widgets/marquee_banner.dart';
import '../widgets/property_card.dart';
import 'property_detail_screen.dart';

/// "All Property" feed — GET /fetch-active-users, sorted newest-first, each row
/// rendered as a [PropertyCard]. Ports the list portion of PropertyCard.jsx.
class AllPropertyScreen extends StatefulWidget {
  const AllPropertyScreen({super.key});

  @override
  State<AllPropertyScreen> createState() => _AllPropertyScreenState();
}

class _AllPropertyScreenState extends State<AllPropertyScreen> {
  late final ApiService _api;
  bool _loading = true;
  String? _error;
  List<Property> _properties = const [];
  final Map<String, int> _imageCounts = {};

  /// Coalesces the many image-count responses into at most one rebuild per
  /// window, instead of a setState per response (which rebuilt the whole feed
  /// dozens of times during load). Badges still fill in progressively.
  Timer? _countFlush;

  @override
  void initState() {
    super.initState();
    _api = context.read<AppState>().api;
    _load();
  }

  @override
  void dispose() {
    _countFlush?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final props = await _api.fetchActiveProperties();
      if (!mounted) return;
      setState(() {
        _properties = props;
        _loading = false;
      });
      _loadImageCounts(props);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _loadImageCounts(List<Property> props) async {
    await Future.wait(props.map((p) async {
      final count = await _api.fetchImageCount(p.rentId);
      if (!mounted) return;
      _imageCounts[p.rentId] = count;
      // Batch bursts of responses into a single rebuild per ~100ms.
      _countFlush ??= Timer(const Duration(milliseconds: 100), () {
        _countFlush = null;
        if (mounted) setState(() {});
      });
    }));
  }

  void _openDetail(Property p) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PropertyDetailScreen(rentId: p.rentId, initial: p),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: AppColors.primary),
            const SizedBox(height: 12),
            Text(context.tr('feed.loading')),
          ],
        ),
      );
    }

    if (_error != null) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 40, color: AppColors.textMuted),
            const SizedBox(height: 8),
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(
                onPressed: _load, child: Text(context.tr('common.retry'))),
          ],
        ),
      );
    }

    if (_properties.isEmpty) {
      return _CenteredMessage(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 8),
            Text(context.tr('feed.empty')),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
        // +1 for the exclusive-stays marquee pinned at the top of the feed.
        itemCount: _properties.length + 1,
        itemBuilder: (context, i) {
          if (i == 0) {
            return MarqueeBanner(
              text: context.tr('feed.marquee'),
              onTap: () => pushRoute(
                  context, '/exclusiveDetail', context.trRead('menu.touristPlace')),
            );
          }
          final p = _properties[i - 1];
          return PropertyCard(
            property: p,
            imageCount: _imageCounts[p.rentId] ?? 0,
            onTap: () => _openDetail(p),
          );
        },
      ),
    );
  }
}

class _CenteredMessage extends StatelessWidget {
  const _CenteredMessage({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(child: Padding(padding: const EdgeInsets.all(24), child: child));
  }
}
