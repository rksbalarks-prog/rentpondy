import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../constants/assets.dart';
import '../models/property_lead.dart';
import '../services/api_service.dart';
import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';
import 'property_detail_screen.dart';

/// Which owner-lead feed to show.
enum LeadKind {
  favourites,
  interest,
  offersOwner,
  offersBuyer,
  contactedOwner,
  contactedBuyer,
  photoRequestsOwner,
  photoRequestsBuyer,
  addressRequestsOwner,
}

/// Owner-side lead lists — tenants who favourited or sent interest on *my*
/// properties. Ports Detail/FavoriteBuyer.jsx and Detail/BuyerInterest.jsx,
/// which share the same shape (property + tenant numbers + PayU status).
class LeadsScreen extends StatefulWidget {
  const LeadsScreen({super.key, required this.kind});

  final LeadKind kind;

  @override
  State<LeadsScreen> createState() => _LeadsScreenState();
}

class _LeadsScreenState extends State<LeadsScreen> {
  late final ApiService _api;
  late final String _phone;

  bool _loading = true;
  String? _error;
  List<PropertyLead> _leads = const [];

  String get _title => switch (widget.kind) {
        LeadKind.favourites => 'Shortlisted By Tenants',
        LeadKind.interest => 'Received Interest',
        LeadKind.offersOwner => 'Offers Received',
        LeadKind.offersBuyer => 'My Offers',
        LeadKind.contactedOwner => 'Contacted Tenants',
        LeadKind.contactedBuyer => 'Contacted Owners',
        LeadKind.photoRequestsOwner => 'Photo Requests',
        LeadKind.photoRequestsBuyer => 'My Photo Requests',
        LeadKind.addressRequestsOwner => 'Address Requests',
      };

  /// Favourites carry a single buyer number; the rest carry a list.
  bool get _singleTenant => widget.kind == LeadKind.favourites;

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _api = app.api;
    _phone = app.phoneNumber ?? '';
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final leads = await switch (widget.kind) {
        LeadKind.favourites => _api.fetchFavouriteLeads(_phone),
        LeadKind.interest => _api.fetchInterestLeads(_phone),
        LeadKind.offersOwner => _api.fetchOffersOwner(_phone),
        LeadKind.offersBuyer => _api.fetchOffersBuyer(_phone),
        LeadKind.contactedOwner => _api.fetchContactedOwner(_phone),
        LeadKind.contactedBuyer => _api.fetchContactedBuyer(_phone),
        LeadKind.photoRequestsOwner => _api.fetchPhotoRequestsOwner(_phone),
        LeadKind.photoRequestsBuyer => _api.fetchPhotoRequestsBuyer(_phone),
        LeadKind.addressRequestsOwner => _api.fetchAddressRequestsOwner(_phone),
      };
      if (!mounted) return;
      setState(() {
        _leads = leads;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _dial(String number) async {
    final uri = Uri.parse('tel:$number');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: const BackButton(color: AppColors.primary),
        title: Text(_title,
            style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: _body(),
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.primary));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: _load, child: const Text('Retry')),
          ],
        ),
      );
    }
    if (_leads.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(Assets.noData, width: 100),
            const SizedBox(height: 8),
            Text('No $_title.', textAlign: TextAlign.center),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 12),
        itemCount: _leads.length,
        itemBuilder: (context, i) => _card(_leads[i]),
      ),
    );
  }

  Widget _card(PropertyLead lead) {
    final p = lead.property;
    // Favourites carry one buyer number; the rest carry a list.
    final tenants = _singleTenant
        ? [if ((lead.buyerPhoneNumber ?? '').isNotEmpty) lead.buyerPhoneNumber!]
        : (lead.interestedUsers.isNotEmpty
            ? lead.interestedUsers
            : [if ((lead.buyerPhoneNumber ?? '').isNotEmpty) lead.buyerPhoneNumber!]);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.10),
              blurRadius: 8,
              offset: const Offset(0, 3)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) =>
                  PropertyDetailScreen(rentId: p.rentId, initial: p),
            )),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 110,
                  height: 110,
                  child: p.firstPhotoUrl == null
                      ? Image.asset(Assets.defaultProperty, fit: BoxFit.cover)
                      : CachedNetworkImage(
                          imageUrl: p.firstPhotoUrl!,
                          fit: BoxFit.cover,
                          // 110px thumbnail — cap the decode size.
                          memCacheWidth: 400,
                          placeholder: (_, _) =>
                              Container(color: const Color(0xFFEDEDED)),
                          errorWidget: (_, _, _) => Image.asset(
                              Assets.defaultProperty,
                              fit: BoxFit.cover),
                        ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text('ID: ${p.rentId}',
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textMuted)),
                            ),
                            _statusPill(lead.isPaid),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          p.propertyType == null || p.propertyType!.isEmpty
                              ? 'N/A'
                              : p.propertyType![0].toUpperCase() +
                                  p.propertyType!.substring(1),
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        Text(p.locationLine,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                fontSize: 12, color: AppColors.textGrey)),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Image.asset(Assets.rupeeIcon, width: 8),
                            const SizedBox(width: 6),
                            Text(Formatters.inr(p.price),
                                style: const TextStyle(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          if ((lead.propertyMessage ?? '').isNotEmpty)
            Container(
              width: double.infinity,
              color: const Color(0xFFFFF4D6),
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Text(lead.propertyMessage!,
                  style: const TextStyle(
                      fontSize: 12, color: Color(0xFF7A5B00))),
            ),
          // ---- Tenants who favourited / showed interest ----
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _singleTenant
                      ? 'Shortlisted by'
                      : 'Contacts (${tenants.length})',
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMuted),
                ),
                const SizedBox(height: 6),
                if (tenants.isEmpty)
                  const Text('—',
                      style: TextStyle(
                          fontSize: 12, color: AppColors.textMuted))
                else
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final t in tenants)
                        ActionChip(
                          avatar: const Icon(Icons.call,
                              size: 14, color: AppColors.primary),
                          label: Text(t,
                              style: const TextStyle(fontSize: 12)),
                          onPressed: () => _dial(t),
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: const BorderSide(
                                color: AppColors.primary, width: 0.8),
                          ),
                        ),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusPill(bool paid) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      decoration: BoxDecoration(
        color: paid ? const Color(0xFF28A745) : const Color(0xFFDC3545),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(paid ? 'Paid' : 'Unpaid',
          style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w600)),
    );
  }
}
