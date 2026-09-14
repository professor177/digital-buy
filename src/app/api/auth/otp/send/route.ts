import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { generateOtp } from "@/lib/auth";
import { normalizeBdPhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { phone?: string };
  const phone = normalizeBdPhone(body.phone ?? "");

  if (!phone) {
    return Response.json(
      { ok: false, error: "Enter a valid Bangladeshi number, e.g. 01712345678" },
      { status: 400 },
    );
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db
    .update(otpCodes)
    .set({ consumed: true })
    .where(and(eq(otpCodes.phone, phone), eq(otpCodes.consumed, false)));

  await db.insert(otpCodes).values({ phone, code, expiresAt });

  /**
   * ─────────── PLUG IN YOUR OTP / SMS PROVIDER HERE ───────────
   * Example (SSL Wireless):
   *   await fetch("https://smsplus.sslwireless.com/api/v3/send-sms", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     body: JSON.stringify({
   *       api_token: process.env.SSL_SMS_TOKEN,
   *       sid: process.env.SSL_SMS_SID,
   *       msisdn: phone.replace("+", ""),
   *       sms: `Your Digital Buy code is ${code}`,
   *       csms_id: crypto.randomUUID(),
   *     }),
   *   });
   *
   * Example (Twilio Verify):
   *   await twilio.verify.v2.services(process.env.TWILIO_VERIFY_SID)
   *     .verifications.create({ to: phone, channel: "sms" });
   *
   * While no provider is configured we return the code so the UI can
   * auto-fill it (development only).
   */
  const smsConfigured = Boolean(process.env.SMS_PROVIDER_TOKEN);

  return Response.json({
    ok: true,
    phone,
    delivered: smsConfigured,
    devCode: smsConfigured ? undefined : code,
    message: smsConfigured
      ? "OTP sent to your phone"
      : "Demo mode: OTP auto-filled (no SMS provider configured)",
  });
}
