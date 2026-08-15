// "Someone viewed your property" — owner notification for property detail views.
//
//   POST /PPC/notify-property-viewed   { phoneNumber, rentId }
//        → creates `User <viewer> viewed your property.` for the owner,
//          at most once per viewer, per property, per IST day.
//
// Deliberately SEPARATE from /user-view-property-rent. That route also enforces
// the plan view limit (30/day) and answers 429 when it is exhausted; its call
// site on the detail page is commented out, which is why property views are not
// being recorded today. Hanging the notification off it would have switched the
// daily view gate back on for every visitor as a side effect. This route only
// notifies: no limits, no gating, no change to any existing behaviour.
//
// Additive: new collection, new route, nothing existing touched.
//
// Fire-and-forget from the client — it answers 200 for "notified" and 200 for
// "already notified today" alike, so the page never has to care.

const express = require('express');
const router = express.Router();

const AddModel = require('../AddModel');
const NotificationUser = require('../Notification/NotificationDetailModel');
const PropertyViewNotify = require('./PropertyViewNotifyModel');

const NOTIFICATION_TYPE = 'property-view-owner';

/**
 * Reduce any phone to its LAST 10 DIGITS.
 *
 * Owner numbers are stored in several shapes — most are bare 10 digits, but
 * ~24 properties hold '+918667431940' / '919443095257'. Stripping only '+' and
 * spaces leaves the country code attached, so an owner opening their OWN
 * listing compared as 919443095257 !== 9443095257: the self-view guard below
 * would miss, and the owner would be told they had viewed their own property.
 * `/get-user-notifications` matches on a 91-prefixed variant, so they really
 * would see it.
 *
 * Last-10 is the same rule the notification fetch and the web app's Clarity
 * identity already use, so this keeps one person as one identity everywhere.
 */
const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

/** Today's date in IST as 'YYYY-MM-DD'. India has no DST, so a fixed offset is safe. */
const istDay = (date = new Date()) => {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
};

router.post('/notify-property-viewed', async (req, res) => {
  try {
    const viewer = normalizePhone(req.body?.phoneNumber);
    const rentId = String(req.body?.rentId ?? '').trim();

    if (!viewer || !rentId) {
      return res
        .status(400)
        .json({ success: false, message: 'phoneNumber and rentId are required' });
    }

    const property = await AddModel.findOne({ rentId }).select('rentId phoneNumber').lean();
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const owner = normalizePhone(property.phoneNumber);

    // Owners browse their own listings constantly — never notify them about it.
    if (!owner || owner === viewer) {
      return res.json({ success: true, notified: false, reason: 'own-property' });
    }

    // Claim today's slot. The unique index decides the winner; a duplicate key
    // means this viewer already triggered a notification for this property
    // today, so there is nothing left to do.
    try {
      await PropertyViewNotify.create({
        viewerPhoneNumber: viewer,
        rentId,
        day: istDay(),
        ownerPhoneNumber: owner,
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.json({ success: true, notified: false, reason: 'already-notified-today' });
      }
      throw error;
    }

    await NotificationUser.create({
      recipientPhoneNumber: owner,
      senderPhoneNumber: viewer,
      userPhoneNumber: owner,
      rentId,
      type: NOTIFICATION_TYPE,
      message: `User ${viewer} viewed your property.`,
      createdAt: new Date(),
    });

    res.json({ success: true, notified: true });
  } catch (error) {
    // A failed notification must never break the detail page.
    console.error('[notify-property-viewed]', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
