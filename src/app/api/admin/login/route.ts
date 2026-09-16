import { NextResponse } from "next/server";
import { loginAdmin, logoutAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  let key: unknown;
  try {
    const body = (await req.json()) as { key?: unknown };
    key = body.key;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof key !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!process.env.ADMIN_KEY) {
    return NextResponse.json(
      { error: "admin_not_configured" },
      { status: 503 },
    );
  }
  const ok = await loginAdmin(key);
  if (!ok) return NextResponse.json({ error: "invalid_key" }, { status: 401 });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await logoutAdmin();
  return NextResponse.json({ ok: true });
}
