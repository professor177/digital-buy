import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function rateLimit(scope: string, limit = 8, windowSeconds = 60) {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("consume_rate_limit", {
    p_key: `${scope}:${ip}`,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new Error("Rate limiter unavailable");
  if (data !== true) throw new Error("Too many requests. Please try again shortly.");
}
