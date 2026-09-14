"use client";

import { Clapperboard, Gamepad2, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[62vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.5em] text-text-secondary uppercase">Error 404</p>
      <h1
        className="mt-4 text-4xl font-bold sm:text-6xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Page Not Found
      </h1>
      <p className="mt-4 text-sm text-text-secondary">
        The page you are looking for doesn&apos;t exist. Return to the shop to browse our gaming and OTT accounts.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/gaming" className="btn-primary gap-2">
          <Gamepad2 size={18} />
          Gaming
        </Link>
        <Link href="/ott" className="btn-secondary gap-2">
          <Clapperboard size={18} />
          OTT
        </Link>
        <Link href="/" className="btn-secondary gap-2">
          <Home size={18} />
          Home
        </Link>
      </div>
    </div>
  );
}
