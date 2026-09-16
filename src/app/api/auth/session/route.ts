import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import {
  getFirebaseAdminAuth,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";

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

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "auth_not_configured" }, { status: 503 });
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
    // Reload the user record server-side so email + emailVerified are fresh
    // from Firebase, never the client-cached claims inside the token.
    const record = await getFirebaseAdminAuth().getUser(decoded.uid);
    const email = record.email ?? null;
    if (!email) {
      return NextResponse.json({ error: "email_required" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, decoded.uid))
      .limit(1);

    let user = existing[0];
    if (!user) {
      const inserted = await db
        .insert(users)
        .values({
          firebaseUid: decoded.uid,
          email,
          emailVerified: record.emailVerified,
          nickname: record.displayName ?? null,
        })
        .returning();
      user = inserted[0];
    } else {
      const patch: Partial<typeof users.$inferInsert> = {};
      if (email !== user.email) patch.email = email;
      if (record.emailVerified !== user.emailVerified)
        patch.emailVerified = record.emailVerified;
      if (!user.nickname && record.displayName)
        patch.nickname = record.displayName;
      if (Object.keys(patch).length > 0) {
        const updated = await db
          .update(users)
          .set(patch)
          .where(eq(users.id, user.id))
          .returning();
        user = updated[0];
      }
    }

    await createSession(user.id);
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
