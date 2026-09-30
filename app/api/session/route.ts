import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const d = await adminAuth().verifyIdToken(idToken);
    if (!d.email_verified) return NextResponse.json({ error: "unverified" }, { status: 403 });
    if (Date.now() / 1000 - d.auth_time > 300) return NextResponse.json({ error: "stale" }, { status: 401 });
    const ms = 5 * 24 * 3600 * 1000;
    const cookie = await adminAuth().createSessionCookie(idToken, { expiresIn: ms });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, cookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: ms / 1000 });
    return res;
  } catch { return NextResponse.json({ error: "invalid" }, { status: 401 }); }
}
