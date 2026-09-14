import { NextResponse, type NextRequest } from "next/server";

import { createSession, upsertUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * ───────────── GOOGLE OAUTH ─────────────
 * PLUG IN YOUR KEYS: add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to .env
 * and set the authorised redirect URI to:  {origin}/api/auth/google/callback
 *
 * When the keys are missing we fall back to an instant "demo" sign-in so the
 * whole storefront stays clickable during development.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (clientId) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${origin}/api/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
      access_type: "offline",
    });
    return NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  }

  // ── DEMO FALLBACK ──
  const user = await upsertUser({
    provider: "google",
    email: "demo.player@digitalbuy.gg",
    name: "Demo Player",
    avatarUrl: null,
  });
  await createSession(user.id);
  return NextResponse.redirect(`${origin}/?welcome=1`);
}
