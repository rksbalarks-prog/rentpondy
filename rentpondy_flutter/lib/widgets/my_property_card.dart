import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../constants/assets.dart';
import '../models/property.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';

/// Card used on the "My Property" screen. Ports the `.property-card` +
/// `.paid-card` / `.pending-card` styling from MyProperty.css: a green or red
/// bordered card with a 3px gradient top bar, a purple "Rent_Id-" header over
/// the photo, a status strip, and a Paid/Pending pill.
class MyPropertyCard extends StatelessWidget {
  const MyPropertyCard({
    super.key,
    required this.property,
    this.onTap,
    this.onEdit,
  });

  final Property property;
  final VoidCallback? onTap;

  /// Opens the property form in edit mode. Hidden when null.
  final VoidCallback? onEdit;

  static const _paid = Color(0xFF0F9F2C);
  static const _pending = Color(0xFFFF3B3B);
  static const _statusStrip = Color(0xFF5A52B3);

  String _cap(String? s) =>
      (s == null || s.isEmpty) ? 'N/A' : s[0].toUpperCase() + s.substring(1);

  @override
  Widget build(BuildContext context) {
    final isPaid = property.isPaid;
    final accent = isPaid ? _paid : _pending;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border(
            top: BorderSide(color: accent, width: 2),
            right: BorderSide(color: accent, width: 2),
            bottom: BorderSide(color: accent, width: 2),
            left: BorderSide(color: accent, width: 6),
          ),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isPaid
                ? const [Color(0xFFE8F9ED), Color(0xFFF5FFF8), Colors.white]
                : const [Color(0xFFFFEBEB), Color(0xFFFFF5F5), Colors.white],
          ),
          boxShadow: [
            BoxShadow(
              color: accent.withValues(alpha: 0.3),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            // 3px gradient bar along the top (.paid-card::before)
            Container(
              height: 3,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isPaid
                      ? const [_paid, Color(0xFF34D058), _paid]
                      : const [_pending, Color(0xFFFF6B6B), _pending],
                ),
              ),
            ),
            IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ---- Left: id header + photo + status strip ----
                  Expanded(flex: 4, child: _imageColumn()),
                  // ---- Right: details ----
                  Expanded(flex: 8, child: _detailsColumn(isPaid)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _imageColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          color: AppColors.primary,
          padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          child: Text(
            'Rent_Id- ${property.rentId}',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white, fontSize: 12),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        SizedBox(
          height: 150,
          child: Stack(
            fit: StackFit.expand,
            children: [
              _photo(),
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  color: _statusStrip,
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text(
                    property.statusLabel,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _photo() {
    final url = property.firstPhotoUrl;
    if (url == null) {
      return Image.asset(Assets.defaultProperty, fit: BoxFit.cover);
    }
    return CachedNetworkImage(
      imageUrl: url,
      fit: BoxFit.cover,
      // Downscale on decode — the card thumbnail never needs full resolution.
      memCacheWidth: 600,
      placeholder: (_, _) => Container(color: const Color(0xFFEDEDED)),
      errorWidget: (_, _, _) =>
          Image.asset(Assets.defaultProperty, fit: BoxFit.cover),
    );
  }

  Widget _detailsColumn(bool isPaid) {
    return Container(
      color: AppColors.cardBodyBg,
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(_cap(property.propertyMode),
                    style: const TextStyle(fontSize: 11, color: Color(0xFF666666))),
              ),
              if (onEdit != null)
                InkResponse(
                  onTap: onEdit,
                  radius: 18,
                  child: const Padding(
                    padding: EdgeInsets.only(right: 6),
                    child: Icon(Icons.edit_outlined,
                        size: 17, color: AppColors.primary),
                  ),
                ),
              _paymentBadge(isPaid),
            ],
          ),
          Text(_cap(property.propertyType),
              style: const TextStyle(
                  color: AppColors.textBlack,
                  fontWeight: FontWeight.bold,
                  fontSize: 15)),
          Text(property.locationLine,
              style: const TextStyle(
                  color: AppColors.textGrey,
                  fontWeight: FontWeight.w500,
                  fontSize: 13)),
          const SizedBox(height: 2),
          Row(
            children: [
              Expanded(child: _feature(Assets.floorIcon, _cap(property.floorNo))),
              Expanded(
                  child: _feature(
                      Assets.bhkIcon, '${property.bedrooms ?? 'N/A'} BHK')),
            ],
          ),
          Row(
            children: [
              Expanded(
                  child: _feature(Assets.areaIcon,
                      '${property.totalArea ?? 'N/A'} ${_cap(property.areaUnit)}')),
              Expanded(
                  child: _feature(Assets.calendarIcon,
                      Formatters.shortDate(property.createdAt))),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Image.asset(Assets.rupeeIcon, width: 8),
              const SizedBox(width: 6),
              Text(
                Formatters.inr(property.price),
                style: const TextStyle(
                  fontSize: 15,
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(width: 5),
              const Text('Negotiable',
                  style: TextStyle(color: AppColors.primary, fontSize: 11)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _paymentBadge(bool isPaid) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      decoration: BoxDecoration(
        color: isPaid ? const Color(0xFF28A745) : const Color(0xFFDC3545),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        isPaid ? 'Paid' : 'Pending',
        style: const TextStyle(
            color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
      ),
    );
  }

  Widget _feature(String iconAsset, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 1),
      child: Row(
        children: [
          Image.asset(iconAsset, width: 12),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              text,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textGrey,
                  fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}
