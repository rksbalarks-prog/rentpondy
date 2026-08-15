// Firebase Admin SDK init — used to verify Firebase Phone Auth ID tokens
// server-side for the Firebase OTP login path (user + admin).
// Reuses the existing service account (config/serviceAccountKey.json), whose
// project_id (ppc-2-a4437) matches the frontend Firebase config.
const admin = require('firebase-admin');

// Initialise once. Wrapped in try/catch so a missing/invalid serviceAccountKey.json
// does NOT crash the whole server — only the Firebase OTP path becomes unavailable
// (SMS Idea keeps working). verifyIdToken() will then throw and be handled per-request.
try {
  if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialised (project:', serviceAccount.project_id + ')');
  }
} catch (err) {
  console.error('⚠️  Firebase Admin NOT initialised — Firebase OTP disabled:', err.message);
}

module.exports = admin;
