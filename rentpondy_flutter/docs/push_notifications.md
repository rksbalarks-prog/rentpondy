# Firebase Push Notifications (FCM)

The app is fully wired for Firebase Cloud Messaging, but ships **inert**: with no
`google-services.json` present, `Firebase.initializeApp()` is caught and push
stays off, so the app still builds and runs normally. Push turns on the moment
the config below is added — no Dart changes needed.

## What's already built

**Flutter client** (`lib/services/push_service.dart`)
- Initialises Firebase (guarded), requests the notification permission
  (Android 13+ `POST_NOTIFICATIONS`, iOS), fetches the FCM token, and listens
  for token refresh.
- Registers the token with the backend on login via
  `POST /register-fcm-token { phoneNumber, token, platform }` (deduped so it
  fires once per number).
- Foreground messages show a banner via `flutter_local_notifications`
  (FCM alone doesn't show one in the foreground on Android).
- Tapping a notification (foreground / background / terminated) routes through
  `screenForRoute()` using the message's `data`.

**Backend** (`PPC/fcm/`, additive — no existing file changed except two mount
lines in `server.js`)
- `FcmTokenModel.js` — one token per device, keyed by token.
- `FcmTokenRouter.js` — `POST /register-fcm-token` (upsert) and
  `POST /send-test-push` (verify delivery).
- `sendPush.js` — `sendPushToUser(phone, {title, body}, data)`; delivers to all
  of a number's devices and prunes dead tokens. Reuses the existing
  `config/firebaseAdmin.js`.

## Firebase project

Everything uses ONE project — **`rentpondy-f0909`** (sender id `635342691323`):
- backend `config/serviceAccountKey.json` → `project_id: rentpondy-f0909`
  (client email `firebase-adminsdk-6s89n@rentpondy-f0909.iam.gserviceaccount.com`)
- web OTP frontend `Firebase.jsx` → `projectId: rentpondy-f0909`

(The `ppc-2-a4437` mentioned in a comment in `config/firebaseAdmin.js` is
**stale/wrong** — the actual service-account key is `rentpondy-f0909`.)

So the app's `google-services.json` and the backend's `serviceAccountKey.json`
are already the same project — register the Android app in **`rentpondy-f0909`**
and the backend can send with the service account it already has, no change.

## Activation steps (manual — needs the Firebase console)

1. **Firebase console → project `rentpondy-f0909` → Add app → Android**
   - Package name: **`com.apps.rent_pondy_user`** (this app's applicationId).
   - Download **`google-services.json`** → put it in
     `rentpondy_flutter/android/app/google-services.json`.

2. **Enable the Gradle plugin** (two one-line uncomments):
   - `android/app/build.gradle.kts` → uncomment
     `id("com.google.gms.google-services")`
   - `android/settings.gradle.kts` → uncomment the
     `com.google.gms.google-services` version line.

3. **Backend**: deploy the new `PPC/fcm/` folder and the two `server.js` mount
   lines to the VPS (manual upload, then `pm2 restart`). No credential change —
   `config/serviceAccountKey.json` is already `rentpondy-f0909`, the project you
   registered the Android app in.

4. **iOS (later)**: add an iOS app to the same project, drop
   `GoogleService-Info.plist` into `ios/Runner/`, add the Push Notifications
   capability, and upload an APNs auth key in Firebase → Project settings →
   Cloud Messaging.

5. **Build & test**:
   ```
   flutter build apk        # now bundles google-services.json
   ```
   Install, log in, then:
   ```
   POST https://rentpondy.com/PPC/PPC/send-test-push
   { "phoneNumber": "<the logged-in number>", "title": "Hi", "body": "It works" }
   ```
   A banner should arrive.

## Sending real pushes

Call `sendPushToUser` from anywhere a notification is created. To mirror the
in-app notifications, add one line where `Notification` docs are created (e.g.
in the routers that already write to the Notification collection):

```js
const { sendPushToUser } = require('../fcm/sendPush');
// after saving the in-app notification:
sendPushToUser(userPhoneNumber, { title: 'New interest', body: 'A tenant is interested in RENT-123' },
               { route: '/notification' }).catch(() => {});
```

## Message → route contract

The client reads these keys from `message.data`:
- `route` — an app route path (e.g. `/notification`); wins if present.
- `rentId` — opens that property (`/details/<id>`).
- else defaults to `/notification`.
`title` / `body` come from the FCM `notification` block (or `data`).
