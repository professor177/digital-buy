import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * ───────────── FIREBASE (server/admin) ─────────────
 * Add these to `.env` (from Firebase console → Project settings → Service
 * accounts → Generate new private key):
 *
 *   FIREBASE_PROJECT_ID=
 *   FIREBASE_CLIENT_EMAIL=
 *   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *
 * (Keep the surrounding quotes and literal \n's — they're unescaped below.)
 * Without these, `firebaseAdminEnabled` is false and
 * /api/auth/firebase/session rejects requests, so the client-side fallback
 * (old Google OAuth / dev-mode OTP) is used instead.
 */
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const firebaseAdminEnabled = Boolean(
  projectId && clientEmail && privateKey,
);

let adminApp: App | null = null;

function getFirebaseAdminApp(): App | null {
  if (!firebaseAdminEnabled) return null;
  if (!adminApp) {
    adminApp = getApps().length
      ? getApps()[0]!
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
  }
  return adminApp;
}

/** Verifies a Firebase ID token sent from the client. Throws if invalid. */
export async function verifyFirebaseIdToken(idToken: string) {
  const app = getFirebaseAdminApp();
  if (!app) throw new Error("Firebase admin is not configured");
  return getAuth(app).verifyIdToken(idToken);
}
