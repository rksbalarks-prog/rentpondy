
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    recipientPhoneNumber: { type: String, required: true }, // Property owner
    senderPhoneNumber: { type: String, required: true },
    userPhoneNumber: { type: String},      // Mainly used for filtering (can be same as recipient)
    rentId: { type: String },
    message: { type: String, required: true },
    type: { type: String },                 // Notification type (interest, update, plan, etc.)

    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// ── Push on create (additive) ──────────────────────────────────────────
// Every event that creates one of these in-app notifications (interest,
// offer, contact, photo/address request, buyer assistance, …) also fires an
// FCM push. `.create()` runs the 'save' hook, so this one place covers all
// creation sites without touching any router.
// Fire-and-forget: a push failure must never affect notification creation.
const NOTIF_TITLES = {
  interest: "New Interest",
  offer: "New Offer",
  contact: "Contact Shared",
  photo: "Photo Request",
  address: "Address Request",
  plan: "Plan Update",
  update: "Property Update",
};

// Hide the last five digits of any 10-digit phone number in the pushed text,
// e.g. "User 8870579449 requested photos" -> "User 88705***** requested photos".
// Only the push body is masked — the stored notification and the admin
// "User Activity" screen keep the full number.
// The \b guards stop it from touching rentIds or longer digit runs.
function maskLast5(text) {
  return String(text || "").replace(/\b(\d{5})\d{5}\b/g, "$1*****");
}

NotificationSchema.post("save", function (doc) {
  try {
    if (!doc || !doc.message) return;
    // Required lazily to avoid any load-order surprises.
    const { sendPushToUser, normalizePhoneNumber } = require("../fcm/sendPush");
    const title = NOTIF_TITLES[doc.type] || "Rent Pondy";
    const body = maskLast5(doc.message);
    const data = { route: "/notification", rentId: doc.rentId || "" };

    // Push to the RECIPIENT ONLY.
    //
    // This used to target recipientPhoneNumber AND senderPhoneNumber, which
    // meant the person who performed the action was alerted about their own
    // action: viewing a listing pushed "User 70944***** viewed your property"
    // back to the viewer, and requesting photos pushed "User X requested photos
    // for your property" to the requester. Every message in the system is
    // written in the second person addressed to the recipient ("your
    // property"), so the sender is never a valid audience for it.
    //
    // The stored document is unchanged — senderPhoneNumber still records who
    // acted, and the admin "User Activity" screen still shows both columns.
    //
    // Numbers are stored in several shapes (+91…, 91…, bare) so normalize
    // first. Rows raised by the admin carry "admin" instead of a number and
    // normalize to "", which the length check drops.
    const targets = [
      ...new Set(
        [doc.recipientPhoneNumber]
          .map(normalizePhoneNumber)
          .filter((p) => p && p.length === 10)
      ),
    ];

    targets.forEach((phone) => {
      sendPushToUser(phone, { title, body }, data).catch(() => {});
    });
  } catch (_) {
    /* never break the notification write */
  }
});

module.exports = mongoose.model("NotificationUser", NotificationSchema);
