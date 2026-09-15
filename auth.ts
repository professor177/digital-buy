import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { and, desc, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { orders, sessions, users, type User } from "@/db/schema";

export const SESSION_COOKIE = "db_session";
const SESSION_DAYS = 30;

export function newReference(): string {
  return `DB-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ token, userId, expiresAt });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const rows = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);

    return rows[0]?.user ?? null;
  } catch {
    return null;
  }
}

type UpsertInput = {
  email?: string | null;
  phone?: string | null;
  name?: string;
  avatarUrl?: string | null;
  provider: "google" | "otp" | "firebase-google" | "firebase-phone";
  firebaseUid?: string | null;
};

export async function upsertUser(input: UpsertInput): Promise<User> {
  // Firebase uid is the most reliable match once a user has one.
  if (input.firebaseUid) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, input.firebaseUid))
      .limit(1);
    if (existing[0]) return existing[0];
  }
  if (input.email) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);
    if (existing[0]) {
      // A legacy (non-Firebase) account signed in with Firebase for the
      // first time — link it so future logins match on firebaseUid.
      if (input.firebaseUid && !existing[0].firebaseUid) {
        const updated = await db
          .update(users)
          .set({ firebaseUid: input.firebaseUid })
          .where(eq(users.id, existing[0].id))
          .returning();
        return updated[0];
      }
      return existing[0];
    }
  }
  if (input.phone) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, input.phone))
      .limit(1);
    if (existing[0]) {
      if (input.firebaseUid && !existing[0].firebaseUid) {
        const updated = await db
          .update(users)
          .set({ firebaseUid: input.firebaseUid })
          .where(eq(users.id, existing[0].id))
          .returning();
        return updated[0];
      }
      return existing[0];
    }
  }

  const inserted = await db
    .insert(users)
    .values({
      name: input.name ?? "Digital Buy User",
      email: input.email ?? null,
      phone: input.phone ?? null,
      avatarUrl: input.avatarUrl ?? null,
      provider: input.provider,
      firebaseUid: input.firebaseUid ?? null,
    })
    .returning();

  const user = inserted[0];
  return user;
}

export async function listOrders(userId: number) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt), desc(orders.id));
}
