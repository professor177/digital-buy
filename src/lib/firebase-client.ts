"use client";

import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  getAuth,
} from "firebase/auth";

/**
 * ───────────── FIREBASE (client) ─────────────
 * Add these to `.env` (all must be prefixed NEXT_PUBLIC_ so the browser can
 * read them) and enable **Google** + **Phone** sign-in methods in the
 * Firebase console → Authentication → Sign-in method:
 *
 *   NEXT_PUBLIC_FIREBASE_API_KEY=
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
 *   NEXT_PUBLIC_FIREBASE_APP_ID=
 *
 * Until NEXT_PUBLIC_FIREBASE_API_KEY is set, `firebaseEnabled` is false and
 * AuthModal automatically falls back to the original demo Google OAuth /
 * dev-mode OTP flow, so the site keeps working with zero setup.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseEnabled) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

/** Lazily created singleton Firebase Auth instance (client only). */
export function getFirebaseAuth(): Auth | null {
  if (!firebaseEnabled) return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!authInstance) authInstance = getAuth(firebaseApp);
  return authInstance;
}

export function newGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

/**
 * Invisible reCAPTCHA bound to `containerId`. Firebase (backed by Google)
 * silently verifies the browser/device in the background — most real users
 * never see a challenge, which is the closest web equivalent to Android's
 * automatic SMS-retriever verification. A visible puzzle only appears if
 * Google's risk check can't auto-clear the session.
 */
export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}
