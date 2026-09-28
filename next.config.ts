import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
  async headers() {
    return [
      { source: "/orders", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      { source: "/checkout/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
