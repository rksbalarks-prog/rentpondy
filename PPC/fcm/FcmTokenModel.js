// Stores one FCM registration token per device so the backend can target
// push notifications at a phone number. Additive — no existing collection is
// touched. One phone number can have several tokens (multiple devices).
const mongoose = require("mongoose");

const FcmTokenSchema = new mongoose.Schema(
  {
    // Normalised to the last 10 digits, matching how the rest of the app keys
    // users (see normalizePhoneNumber in the routers).
    phoneNumber: { type: String, required: true, index: true },
    // The FCM registration token — unique across devices.
    token: { type: String, required: true, unique: true },
    // 'android' | 'iOS' | 'web' (defaultTargetPlatform.name from the client).
    platform: { type: String, default: "unknown" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FcmToken || mongoose.model("FcmToken", FcmTokenSchema);
