import { NextResponse, type NextRequest } from "next/server";

import { createSession, upsertUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Google OAuth code → token → profile exchange. Requires the env keys. */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/?auth=google_not_configured`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) throw new Error("no access token");

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenJson.access_token}` } },
    );
    const profile = (await profileRes.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    const user = await upsertUser({
      provider: "google",
      email: profile.email ?? null,
      name: profile.name ?? "Digital Buy User",
      avatarUrl: profile.picture ?? null,
    });
    await createSession(user.id);
    return NextResponse.redirect(`${origin}/?welcome=1`);
  } catch {
    return NextResponse.redirect(`${origin}/?auth=google_failed`);
  }
}
