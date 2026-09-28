import "server-only";

/**
 * Server-side Firebase Auth via the public Identity Toolkit REST API.
 *
 * This project deliberately does NOT use the firebase-admin SDK: it is a
 * Node-only package with heavy transitive deps, and importing it from code
 * that can land in Edge/serverless bundles (middleware, or any shared
 * module pulled in by the root layout) crashes every request on hosts like
 * Vercel with "Failed to load external module firebase-admin-.../auth".
 *
 * The REST endpoints used here are plain HTTPS, work in EVERY runtime
 * (Node, Edge, workers), are included in the free Spark plan, and need only
 * the public web API key, no service-account JSON:
 *  - accounts:lookup        -> validate an ID token AND read the fresh user
 *    record (email, emailVerified, displayName) in one call. Google verifies
 *    the token signature/expiry server-side.
 *  - securetoken token      -> exchange a refresh token for a fresh ID token,
 *    so verification state can be re-read server-side for any session.
 */

const LOOKUP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
const TOKEN_URL = "https://securetoken.googleapis.com/v1/token";

export function isFirebaseServerAuthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
}

class FirebaseRestError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${url}?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | (T & { error?: { message?: string } })
    | null;
  if (!res.ok || !data) {
    throw new FirebaseRestError(data?.error?.message ?? `HTTP_${res.status}`);
  }
  return data;
}

export interface FirebaseAccountInfo {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  refreshToken: string | null;
}

/** Verifies an ID token and returns the FRESH user record for it. */
export async function lookupIdToken(idToken: string): Promise<FirebaseAccountInfo> {
  const data = await postJson<{
    users?: Array<Record<string, unknown>>;
  }>(LOOKUP_URL, { idToken });
  const u = data.users?.[0];
  if (!u || typeof u.localId !== "string") {
    throw new FirebaseRestError("INVALID_ID_TOKEN");
  }
  return {
    uid: u.localId,
    email: typeof u.email === "string" ? u.email : null,
    emailVerified: Boolean(u.emailVerified),
    displayName: typeof u.displayName === "string" ? u.displayName : null,
    refreshToken: typeof u.refreshToken === "string" ? u.refreshToken : null,
  };
}

export interface ExchangedTokens {
  idToken: string;
  /** Google rotates refresh tokens on exchange; persist the new one. */
  refreshToken: string;
}

export async function exchangeRefreshToken(
  refreshToken: string,
): Promise<ExchangedTokens> {
  const data = await postJson<{
    id_token?: string;
    refresh_token?: string;
  }>(TOKEN_URL, { grant_type: "refresh_token", refresh_token: refreshToken });
  if (!data.id_token || !data.refresh_token) {
    throw new FirebaseRestError("TOKEN_EXCHANGE_FAILED");
  }
  return { idToken: data.id_token, refreshToken: data.refresh_token };
}
