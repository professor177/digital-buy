import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  CircleUserRound,
  ClipboardList,
  Gamepad2,
  Lock,
  MessagesSquare,
  Tv,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { SUPPORT_URL } from "@/lib/shared";
import { archivo, chakra, instrument, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Digital Buy | Game accounts and OTT subscriptions in Bangladesh",
    template: "%s | Digital Buy",
  },
  description:
    "PC game accounts for Steam, Xbox, and Ubisoft plus OTT packages for Netflix and Spotify. Pay with bKash or Nagad, verified manually, delivered digitally.",
};

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-brand text-[13px] font-extrabold tracking-tight text-[#06140c]">
        db
      </span>
      <span className="text-[15px] font-extrabold tracking-tight text-white">
        DIGITAL<span className="text-brand">BUY</span>
      </span>
    </Link>
  );
}

async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-4">
        <Logo />
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-sm font-semibold [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/games"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-fog transition-colors hover:text-white"
          >
            <Gamepad2 size={15} /> Games
          </Link>
          <Link
            href="/ott"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-fog transition-colors hover:text-white"
          >
            <Tv size={15} /> OTT
          </Link>
          <span
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-3 py-2 text-fog/50"
            title="Coming soon"
          >
            <Lock size={14} /> Topup
            <span className="rounded-sm border border-line px-1 py-px text-[9px] font-bold tracking-wider text-fog/60">
              SOON
            </span>
          </span>
          <Link
            href="/orders"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-fog transition-colors hover:text-white"
          >
            <ClipboardList size={15} />
            <span className="hidden sm:inline">My Orders</span>
          </Link>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-fog transition-colors hover:text-white"
          >
            <MessagesSquare size={15} /> Support
          </a>
          {user ? (
            <Link
              href="/account"
              className="btn btn-dark ml-1 px-3.5 py-2 text-[13px]"
            >
              <CircleUserRound size={15} />
              {user.nickname || "Account"}
            </Link>
          ) : (
            <Link href="/login" className="btn btn-brand ml-1 px-4 py-2 text-[13px]">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-panel/60">
      <div className="wrap grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-fog">
            Game accounts and OTT subscriptions for Bangladesh. Orders are
            verified manually against your bKash or Nagad transaction ID.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Sections</p>
          <ul className="space-y-2.5 text-sm font-medium text-fog">
            <li>
              <Link href="/games" className="hover:text-white">Games</Link>
            </li>
            <li>
              <Link href="/ott" className="hover:text-white">OTT</Link>
            </li>
            <li>
              <span className="text-fog/50">Topup (coming soon)</span>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white">My Orders</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Help and legal</p>
          <ul className="space-y-2.5 text-sm font-medium text-fog">
            <li>
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Support (Instagram DM)
              </a>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-white">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 text-xs text-fog/70">
          <span>© {new Date().getFullYear()} Digital Buy. All prices in BDT.</span>
          <span>bKash and Nagad accepted. Manual verification on every order.</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${inter.variable} ${chakra.variable} ${instrument.variable} flex min-h-screen flex-col bg-ink antialiased`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
