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
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 },
    );
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
    const phone = decoded.phone_number;
    if (!phone) {
      return NextResponse.json(
        { error: "phone_required" },
        { status: 400 },
      );
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
        .values({ firebaseUid: decoded.uid, phone })
        .returning();
      user = inserted[0];
    } else if (user.phone !== phone) {
      const updated = await db
        .update(users)
        .set({ phone })
        .where(eq(users.id, user.id))
        .returning();
      user = updated[0];
    }

    await createSession(user.id);
    return NextResponse.json({
      user: { id: user.id, phone: user.phone, nickname: user.nickname },
    });
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json(
      { error: "invalid_token" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
