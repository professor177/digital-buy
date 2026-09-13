"use client";

import Link from "next/link";

import DMark from "@/components/brand/DMark";
import { SUPPORT_MESSENGER_URL } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/10 bg-black/30 px-4 pb-28 pt-10 backdrop-blur-xl sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <DMark size={30} />
            <span className="text-base font-semibold">
              Digital<span className="text-gradient"> Buy</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/45">
            Premium gaming accounts and OTT subscriptions for Bangladesh.
            Instant delivery, warranty included, bKash &amp; Nagad accepted.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-white/55">
            <li><Link href="/gaming/shared" className="transition hover:text-white">Shared gaming</Link></li>
            <li><Link href="/gaming/personal" className="transition hover:text-white">Personal gaming</Link></li>
            <li><Link href="/ott/shared" className="transition hover:text-white">Shared OTT</Link></li>
            <li><Link href="/ott/personal" className="transition hover:text-white">Personal OTT</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-white/55">
            <li><Link href="/orders" className="transition hover:text-white">My Orders</Link></li>
            <li>
              <a href={SUPPORT_MESSENGER_URL} target="_blank" rel="noreferrer" className="transition hover:text-white">
                Messenger support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-7xl text-[11px] text-white/25">
        © {new Date().getFullYear()} Digital Buy. Prices are placeholders — all
        brand names belong to their respective owners.
      </p>
    </footer>
  );
}

export default SiteFooter;
