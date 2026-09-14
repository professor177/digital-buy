"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, LogIn, LogOut, Package, UserRound } from "lucide-react";

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
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                <UserRound size={16} className="text-accent" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-xl z-[120]"
                  >
                    <div className="px-4 py-3 text-xs text-text-secondary border-b border-border">
                      {user.email ?? user.phone}
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-surface-hover transition-colors"
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="btn-primary py-2 px-6"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default TopNav;
