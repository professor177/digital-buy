import { NextResponse, type NextRequest } from "next/server";
// Cheap gate only. Pages and actions fully verify the session cookie and admin role on the server.
export function middleware(req: NextRequest) {
  if (!req.cookies.get("__session")) {
    const url = req.nextUrl.clone(); url.pathname = "/login"; url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/orders/:path*", "/checkout/:path*", "/admin/:path*"] };
