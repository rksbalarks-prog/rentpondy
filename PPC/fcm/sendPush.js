// Reusable FCM sender. Delivers to device tokens and prunes any FCM reports as
// unregistered/invalid so the collection stays clean.
//
// Reuses the existing Firebase Admin app (config/firebaseAdmin.js). IMPORTANT:
// the service account there (project rentpondy-f0909) MUST be the SAME Firebase
// project as the Flutter app's google-services.json, or sends fail.
const admin = require("../config/firebaseAdmin");
const FcmToken = require("./FcmTokenModel");

function normalizePhoneNumber(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function stringifyData(data) {
  const out = {};
  Object.entries(data || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out[k] = String(v);
  });
  return out;
}

/**
 * Low-level: send to an explicit list of tokens (batched by 500, FCM's limit).
 * Prunes tokens FCM reports as dead. Returns { sent, failed, tokens }.
 */
async function sendPushToTokens(tokens, notification, data = {}) {
  const unique = [...new Set((tokens || []).filter(Boolean))];
  if (unique.length === 0) return { sent: 0, failed: 0, tokens: 0 };

  const stringData = stringifyData(data);
  const message = {
    notification: {
      title: notification.title || "Rent Pondy",
      body: notification.body || "",
    },
    data: stringData,
    android: {
      priority: "high",
      notification: { channelId: "rentpondy_default" },
    },
  };

  let sent = 0;
  let failed = 0;
  const stale = [];

  for (const batch of chunk(unique, 500)) {
    let response;
    try {
      response = await admin
        .messaging()
        .sendEachForMulticast({ tokens: batch, ...message });
    } catch (err) {
      console.error("sendPushToTokens batch failed:", err.message);
      failed += batch.length;
      continue;
    }
    sent += response.successCount;
    failed += response.failureCount;
    response.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error && r.error.code;
        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token" ||
          code === "messaging/invalid-argument"
        ) {
          stale.push(batch[i]);
        }
      }
    });
  }

  if (stale.length) {
    try {
      await FcmToken.deleteMany({ token: { $in: stale } });
    } catch (_) {}
  }

  return { sent, failed, tokens: unique.length };
}

/** Send to every device registered for one phone number. */
async function sendPushToUser(phoneNumber, notification, data = {}) {
  const phone = normalizePhoneNumber(phoneNumber);
  if (!phone) return { sent: 0, failed: 0, tokens: 0 };
  const docs = await FcmToken.find({ phoneNumber: phone }).lean();
  return sendPushToTokens(docs.map((d) => d.token), notification, data);
}

/** Broadcast to every registered device. */
async function sendBroadcast(notification, data = {}) {
  const docs = await FcmToken.find({}, { token: 1 }).lean();
  return sendPushToTokens(docs.map((d) => d.token), notification, data);
}

/** Send to a list of phone numbers (a segment). */
async function sendPushToNumbers(phoneNumbers, notification, data = {}) {
  const phones = [...new Set((phoneNumbers || []).map(normalizePhoneNumber).filter(Boolean))];
  if (phones.length === 0) return { sent: 0, failed: 0, tokens: 0 };
  const docs = await FcmToken.find({ phoneNumber: { $in: phones } }).lean();
  return sendPushToTokens(docs.map((d) => d.token), notification, data);
}

module.exports = {
  sendPushToUser,
  sendPushToTokens,
  sendPushToNumbers,
  sendBroadcast,
  normalizePhoneNumber,
};
