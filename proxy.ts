import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let configuredHost = "";
  try { configuredHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "").host; } catch {}
  const requestHost = request.headers.get("host") || "";
  const productionLocked = process.env.VERCEL_ENV === "production" && (process.env.LAUNCH_READY !== "true" || !configuredHost || requestHost !== configuredHost);
  const allowedWhileLocked = request.nextUrl.pathname.startsWith("/launch") || request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/auth");
  if (productionLocked && !allowedWhileLocked) return NextResponse.rewrite(new URL("/launch", request.url));
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image).*)"],
};
