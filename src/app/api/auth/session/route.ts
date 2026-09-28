import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import {
  isFirebaseServerAuthConfigured,
  lookupIdToken,
} from "@/lib/firebase-server";

/**
 * Creates a server session from a Firebase ID token.
 * The token is verified AND the fresh user record fetched in a single
 * accounts:lookup call to Google's public Auth REST API. No firebase-admin
 * SDK is used anywhere in the app, so this route (and every page importing
 * the session helpers) stays safe on any runtime.
 */
export async function POST(req: Request) {
  let idToken: string | null = null;
  try {
    const body = (await req.json()) as { idToken?: string };
    idToken = typeof body.idToken === "string" ? body.idToken : null;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!idToken) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!isFirebaseServerAuthConfigured()) {
    return NextResponse.json({ error: "auth_not_configured" }, { status: 503 });
  }

  try {
    const info = await lookupIdToken(idToken);
    if (!info.email) {
      return NextResponse.json({ error: "email_required" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, info.uid))
      .limit(1);

    let user = existing[0];
    if (!user) {
      const inserted = await db
        .insert(users)
        .values({
          firebaseUid: info.uid,
          email: info.email,
          emailVerified: info.emailVerified,
          nickname: info.displayName ?? null,
        })
        .returning();
      user = inserted[0];
    } else {
      const patch: Partial<typeof users.$inferInsert> = {};
      if (info.email !== user.email) patch.email = info.email;
      if (info.emailVerified !== user.emailVerified)
        patch.emailVerified = info.emailVerified;
      if (!user.nickname && info.displayName)
        patch.nickname = info.displayName;
      if (Object.keys(patch).length > 0) {
        const updated = await db
          .update(users)
          .set(patch)
          .where(eq(users.id, user.id))
          .returning();
        user = updated[0];
      }
    }

    await createSession(user.id, info.refreshToken);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
