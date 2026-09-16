import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Firebase service account credentials are read exclusively from environment
 * variables (set in Vercel project settings). They are never committed to the
 * repository. FIREBASE_PRIVATE_KEY keeps its PEM formatting by storing the
 * value with escaped newlines (\n) in the env, which we restore here.
 */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirebaseAdminAuth(): Auth {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin credentials are not configured.");
  }
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }
  return getAuth();
}
