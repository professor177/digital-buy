import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const next = nextParam?.startsWith("/") ? nextParam : "/";
  const supabase = await createClient();
  let error = null;
  if (tokenHash && type) ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  else if (code) ({ error } = await supabase.auth.exchangeCodeForSession(code));
  else error = new Error("Missing confirmation token");
  const target = new URL(error ? "/auth/login?error=confirmation" : next, url.origin);
  return NextResponse.redirect(target);
}
