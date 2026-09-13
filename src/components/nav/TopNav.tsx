"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, LogOut, Package, UserRound } from "lucide-react";

import DMark from "@/components/brand/DMark";
import { useAuth } from "@/components/auth/AuthProvider";

export function TopNav() {
  const { user, openAuth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-[110] px-3 pt-3 sm:px-6 sm:pt-5">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-3 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          {!isHome ? (
            <button
              onClick={() => router.back()}
              className="mr-1 hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white sm:flex"
              aria-label="Go back"
            >
              <ChevronLeft size={18} />
            </button>
          ) : null}

          <Link href="/" className="group flex items-center gap-2.5">
            <motion.span whileHover={{ rotate: -6, scale: 1.08 }} className="block">
              <DMark size={28} />
            </motion.span>
            <span className="text-[15px] font-semibold tracking-tight sm:text-base">
              Digital<span className="text-gradient"> Buy</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/orders"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white sm:text-sm"
          >
            <Package size={15} />
            <span className="hidden sm:inline">My Orders</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-fuchsia-500/25 to-cyan-500/25 px-3 py-2 text-xs font-medium transition hover:brightness-125 sm:text-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <UserRound size={12} />
                </span>
                <span className="max-w-[90px] truncate">{user.name}</span>
              </button>
              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    className="glass-strong absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl p-2 text-sm"
                  >
                    <div className="px-3 py-2 text-xs text-white/45">
                      {user.email ?? user.phone}
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-white/10"
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-rose-300 transition hover:bg-rose-500/10"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 px-4 py-2 text-xs font-semibold text-black transition hover:brightness-110 sm:text-sm"
            >
              <span className="animate-shimmer absolute inset-y-0 -left-1/2 w-1/2 bg-white/40 blur-md" />
              <span className="relative">Login</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default TopNav;
