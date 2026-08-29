import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../constants/assets.dart';
import '../l10n/l10n_ext.dart';
import '../models/property.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';

/// A single property list card — a faithful port of the card markup inside
/// PropertyCard.jsx (image + camera/eye tags on the left, details on the right).
class PropertyCard extends StatelessWidget {
  const PropertyCard({
    super.key,
    required this.property,
    this.imageCount = 0,
    this.onTap,
  });

  final Property property;
  final int imageCount;
  final VoidCallback? onTap;

  String _cap(String? s) {
    if (s == null || s.isEmpty) return 'N/A';
    return s[0].toUpperCase() + s.substring(1);
  }

  /// No figure to show: the owner asked to be called, or none was ever quoted.
  bool get _callOwner =>
      property.callForRent || Formatters.noAmount(property.price);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.15),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ---- Left: image with camera / eye tags ----
              Expanded(
                flex: 4,
                child: SizedBox(
                  height: 160,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      _image(),
                      Positioned(
                        left: 0,
                        right: 0,
                        bottom: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _tag(Assets.cameraTag, Icons.photo_camera,
                                '$imageCount'),
                            _tag(Assets.eyeTag, Icons.remove_red_eye,
                                '${property.views ?? 0}'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // ---- Right: details ----
              Expanded(
                flex: 8,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 7, 8, 6),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_cap(property.propertyMode),
                          style: const TextStyle(
                              color: AppColors.textGrey,
                              fontWeight: FontWeight.w500,
                              fontSize: 13)),
                      Text(_cap(property.propertyType),
                          style: const TextStyle(
                              color: AppColors.textBlack,
                              fontWeight: FontWeight.bold,
                              fontSize: 15)),
                      Text('${_cap(property.city)} , ${_cap(property.district)}',
                          style: const TextStyle(
                              color: AppColors.textGrey,
                              fontWeight: FontWeight.w500,
                              fontSize: 13)),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Expanded(
                              child: _feature(Assets.floorIcon,
                                  _cap(property.floorNo))),
                          Expanded(
                              child: _feature(Assets.bhkIcon,
                                  '${property.bedrooms ?? 'N/A'} BHK')),
                        ],
                      ),
                      Row(
                        children: [
                          Expanded(
                              child: _feature(
                                  Assets.areaIcon,
                                  '${property.totalArea ?? 'N/A'} ${_cap(property.areaUnit)}')),
                          Expanded(
                              child: _feature(Assets.calendarIcon,
                                  Formatters.shortDate(property.createdAt))),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // With no quoted rent there is no figure to decorate:
                          // the rupee sign and "Negotiable" both drop away, so
                          // the card reads "Call Owner" rather than "₹ 0".
                          if (!_callOwner) ...[
                            Image.asset(Assets.rupeeIcon, width: 8),
                            const SizedBox(width: 6),
                          ],
                          Text(
                            _callOwner
                                ? 'Call Owner'
                                : Formatters.inr(property.price),
                            style: const TextStyle(
                              fontSize: 15,
                              color: AppColors.primary,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1,
                            ),
                          ),
                          if (!_callOwner) ...[
                            const SizedBox(width: 5),
                            Text(context.tr('card.negotiable'),
                                style: const TextStyle(
                                    color: AppColors.primary, fontSize: 11)),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _image() {
    final url = property.firstPhotoUrl;
    if (url == null) {
      return Image.asset(Assets.defaultProperty, fit: BoxFit.cover);
    }
    return CachedNetworkImage(
      imageUrl: url,
      fit: BoxFit.cover,
      // Decode to a thumbnail-sized bitmap (invisible at this card size) so a
      // multi-MB owner photo doesn't sit in memory at full resolution.
      memCacheWidth: 600,
      placeholder: (_, _) => Container(color: const Color(0xFFEDEDED)),
      errorWidget: (_, _, _) =>
          Image.asset(Assets.defaultProperty, fit: BoxFit.cover),
    );
  }

  Widget _tag(String bgAsset, IconData icon, String value) {
    return SizedBox(
      width: 45,
      height: 20,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(bgAsset, fit: BoxFit.cover),
          Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 12, color: Colors.white),
                const SizedBox(width: 3),
                Text(value,
                    style: const TextStyle(color: Colors.white, fontSize: 11)),
              ],
            ),
          ),
        ],
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
