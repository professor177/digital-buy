import { and, desc, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { createSession, upsertUser } from "@/lib/auth";
import { normalizeBdPhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    phone?: string;
    code?: string;
    name?: string;
  };
  const phone = normalizeBdPhone(body.phone ?? "");
  const code = (body.code ?? "").trim();

  if (!phone || code.length !== 6) {
    return Response.json(
      { ok: false, error: "Invalid phone number or code" },
      { status: 400 },
    );
  }

  const rows = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.consumed, false),
        gt(otpCodes.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(otpCodes.id))
    .limit(1);

  const record = rows[0];
  if (!record || record.code !== code) {
    return Response.json(
      { ok: false, error: "Wrong or expired OTP. Request a new code." },
      { status: 400 },
    );
  }

  await db
    .update(otpCodes)
    .set({ consumed: true })
    .where(eq(otpCodes.id, record.id));

  const user = await upsertUser({
    provider: "otp",
    phone,
    name: body.name?.trim() || `Gamer ${phone.slice(-4)}`,
  });
  await createSession(user.id);

  return Response.json({
    ok: true,
    user: { id: user.id, name: user.name, phone: user.phone },
  });
}
