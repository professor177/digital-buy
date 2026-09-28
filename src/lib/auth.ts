import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import {
  exchangeRefreshToken,
  isFirebaseServerAuthConfigured,
  lookupIdToken,
} from "@/lib/firebase-server";

export const SESSION_COOKIE = "db_session";
export const ADMIN_COOKIE = "db_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function createSession(
  userId: number,
  refreshToken: string | null = null,
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({ token, userId, expiresAt, refreshToken });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await db.delete(sessions).where(eq(sessions.token, token));
    } catch (err) {
      console.error("Session cleanup failed:", err);
    }
  }
  jar.delete(SESSION_COOKIE);
}

/**
 * Runs inside the root layout on every page. It must NEVER throw: a database
 * or schema problem should render the page anonymously, not crash the shell.
 */
export async function getSessionUser(): Promise<User | null> {
  // cookies() stays OUTSIDE the try/catch: Next uses a thrown signal from it
  // to mark the route dynamic, and swallowing that would break rendering.
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const rows = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);
    return rows[0]?.user ?? null;
  } catch (err) {
    console.error("Session lookup failed:", err);
    return null;
  }
}

export interface VerificationState {
  verified: boolean;
  email: string | null;
  /** false when the refresh could not reach Firebase and stored state was used. */
  fresh: boolean;
}

/**
 * Reads emailVerified FRESH from Firebase (never a cached ID-token claim or
 * our own stale copy) and syncs it into the users row. Used to gate orders
 * and account settings.
 *
 * Works by exchanging the session's Firebase refresh token for a fresh ID
 * token over the public Auth REST API (no firebase-admin SDK anywhere), then
 * calling accounts:lookup with it. Falls back to the stored flag when the
 * deployment has no Firebase key or the refresh token is no longer usable
 * (the verify screen mints a new one whenever the user re-confirms).
 */
export async function refreshVerification(
  user: User,
): Promise<VerificationState> {
  const fallback = { verified: user.emailVerified, email: user.email, fresh: false };
  if (!isFirebaseServerAuthConfigured()) return fallback;

  try {
    const [latest] = await db
      .select({ token: sessions.token, refreshToken: sessions.refreshToken })
      .from(sessions)
      .where(and(eq(sessions.userId, user.id), gt(sessions.expiresAt, new Date())))
      .orderBy(desc(sessions.createdAt))
      .limit(1);
    if (!latest?.refreshToken) return fallback;

    const exchanged = await exchangeRefreshToken(latest.refreshToken);
    if (exchanged.refreshToken !== latest.refreshToken) {
      await db
        .update(sessions)
        .set({ refreshToken: exchanged.refreshToken })
        .where(eq(sessions.token, latest.token));
    }

    const info = await lookupIdToken(exchanged.idToken);
    const patch: Partial<typeof users.$inferInsert> = {};
    if (info.emailVerified !== user.emailVerified)
      patch.emailVerified = info.emailVerified;
    const email = info.email ?? user.email;
    if (email && email !== user.email) patch.email = email;
    if (Object.keys(patch).length > 0) {
      await db.update(users).set(patch).where(eq(users.id, user.id));
    }
    return { verified: info.emailVerified, email, fresh: true };
  } catch (err) {
    console.error("Verification refresh failed:", err);
    return fallback;
  }
}

function adminSignature(key: string): string {
  return createHmac("sha256", key).update("digitalbuy:admin:v1").digest("hex");
}

export async function loginAdmin(key: string): Promise<boolean> {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminSignature(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const want = Buffer.from(adminSignature(expected));
  const got = Buffer.from(value);
  return got.length === want.length && timingSafeEqual(got, want);
}
