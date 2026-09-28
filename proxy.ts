import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let configuredHost = "";
  try {
    configuredHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "").host;
  } catch {}

  const requestHost = request.headers.get("host") || "";
  const productionLocked =
    process.env.VERCEL_ENV === "production" &&
    (process.env.LAUNCH_READY !== "true" ||
      !configuredHost ||
      requestHost !== configuredHost);

  const allowedWhileLocked =
    request.nextUrl.pathname.startsWith("/launch") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/auth");

  if (productionLocked && !allowedWhileLocked) {
    return NextResponse.rewrite(new URL("/launch", request.url));
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Keep setup/launch pages reachable before Supabase is configured.
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // A temporary auth/backend outage should not turn public pages into 500s.
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image).*)",
  ],
};
