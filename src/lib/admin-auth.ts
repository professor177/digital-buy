import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { admins, adminSessions, type Admin } from "@/db/schema";

export const ADMIN_SESSION_COOKIE = "db_admin_session";
const ADMIN_SESSION_DAYS = 7;

export async function createAdminSession(adminId: number): Promise<void> {
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(adminSessions).values({ token, adminId, expiresAt });

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  jar.delete(ADMIN_SESSION_COOKIE);
}

export async function getSessionAdmin(): Promise<Admin | null> {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;

    const rows = await db
      .select({ admin: admins })
      .from(adminSessions)
      .innerJoin(admins, eq(admins.id, adminSessions.adminId))
      .where(
        and(
          eq(adminSessions.token, token),
          gt(adminSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return rows[0]?.admin ?? null;
  } catch {
    return null;
  }
}

/**
 * Verifies username/password against the `admins` table.
 *
 * Bootstrap: if the table is completely empty, and the submitted
 * username/password match ADMIN_USERNAME / ADMIN_PASSWORD in `.env`, the
 * first admin row is created here (password hashed with bcrypt) and the
 * login succeeds. Every login after that only checks the database — change
 * env vars, they no longer matter once an admin row exists.
 */
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<Admin | null> {
  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  if (existing[0]) {
    const ok = await bcrypt.compare(password, existing[0].passwordHash);
    return ok ? existing[0] : null;
  }

  // No row for this username yet — allow bootstrapping the very first admin
  // from env vars, but only while the admins table has no rows at all.
  const anyAdmin = await db.select({ id: admins.id }).from(admins).limit(1);
  if (anyAdmin.length > 0) return null;

  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envUsername || !envPassword) return null;
  if (username !== envUsername || password !== envPassword) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const inserted = await db
    .insert(admins)
    .values({ username, passwordHash })
    .returning();
  return inserted[0];
}
