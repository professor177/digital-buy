import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

const NICKNAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,23}$/u;

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    user: { id: user.id, phone: user.phone, nickname: user.nickname },
  });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let nickname: unknown;
  try {
    const body = (await req.json()) as { nickname?: unknown };
    nickname = body.nickname;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const trimmed = typeof nickname === "string" ? nickname.trim() : "";
  if (trimmed !== "" && !NICKNAME_RE.test(trimmed)) {
    return NextResponse.json({ error: "invalid_nickname" }, { status: 422 });
  }

  const [updated] = await db
    .update(users)
    .set({ nickname: trimmed === "" ? null : trimmed })
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({
    user: {
      id: updated.id,
      phone: updated.phone,
      nickname: updated.nickname,
    },
  });
}
