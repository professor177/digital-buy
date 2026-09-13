import { firebaseAdminEnabled, verifyFirebaseIdToken } from "@/lib/firebase-admin";
import { createSession, upsertUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Called by the client right after a successful Firebase sign-in (Google
 * popup or phone auto-verification). We verify the ID token server-side
 * (never trust a client-supplied uid/phone directly), then upsert the user
 * into the existing `users` table and issue the same `db_session` cookie
 * the rest of the app already expects.
 */
export async function POST(request: Request) {
  if (!firebaseAdminEnabled) {
    return Response.json(
      {
        ok: false,
        error:
          "Firebase is not configured on the server yet (missing FIREBASE_* env vars).",
      },
      { status: 501 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    idToken?: string;
    name?: string;
  };

  if (!body.idToken) {
    return Response.json({ ok: false, error: "Missing idToken" }, { status: 400 });
  }

  try {
    const decoded = await verifyFirebaseIdToken(body.idToken);

    const isPhoneSignIn = Boolean(decoded.phone_number) && !decoded.email;
    const user = await upsertUser({
      provider: isPhoneSignIn ? "firebase-phone" : "firebase-google",
      firebaseUid: decoded.uid,
      email: decoded.email ?? null,
      phone: decoded.phone_number ?? null,
      name:
        (decoded.name as string | undefined) ??
        body.name?.trim() ??
        (decoded.phone_number ? `Gamer ${decoded.phone_number.slice(-4)}` : "Digital Buy User"),
      avatarUrl: (decoded.picture as string | undefined) ?? null,
    });

    await createSession(user.id);

    return Response.json({
      ok: true,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email },
    });
  } catch (err) {
    console.error("Firebase session error:", err);
    return Response.json(
      { ok: false, error: "Could not verify Firebase sign-in. Please try again." },
      { status: 401 },
    );
  }
}
