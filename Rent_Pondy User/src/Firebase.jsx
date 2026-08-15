import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase config (project rentpondy-f0909)
const firebaseConfig = {
  apiKey: "AIzaSyCN8XiTM3xwsdYGRIdQYxVSBY96jZIJ1TA",
  authDomain: "rentpondy-f0909.firebaseapp.com",
  databaseURL: "https://rentpondy-f0909.firebaseio.com",
  projectId: "rentpondy-f0909",
  storageBucket: "rentpondy-f0909.firebasestorage.app",
  messagingSenderId: "635342691323",
  appId: "1:635342691323:web:29d0bfc10cd4045d3b095e",
  measurementId: "G-NTJDDJ9S77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

/**
 * Start Firebase Phone Auth for the given E.164 phone number (e.g. "+919876543210").
 * Renders/reuses a single invisible reCAPTCHA bound to the #recaptcha-container
 * element that the login screen must render. Returns the confirmationResult whose
 * .confirm(code) verifies the OTP the user types.
 *
 * Firebase v9+ modular signature:
 *   new RecaptchaVerifier(authInstance, containerIdOrElement, parameters)
 *   signInWithPhoneNumber(authInstance, phoneNumber, appVerifier)
 */
export const setupRecaptcha = async (phoneNumber) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  }
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  return confirmationResult;
};
