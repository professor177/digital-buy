"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AuthProvider from "@/components/auth/AuthProvider";
import TopNav from "@/components/nav/TopNav";
import RouteLoader from "@/components/system/RouteLoader";
import SiteFooter from "@/components/system/SiteFooter";
import CustomCursor from "@/components/ui/CustomCursor";
import SupportButton from "@/components/ui/SupportButton";
import MinimalLoader from "@/components/system/MinimalLoader";

const INTRO_KEY = "digitalbuy:intro-seen";

/**
 * Boot sequence:
 * Minimal rotating D logo.
 */
type Boot = "loading" | "ready";

const noopSubscribe = () => () => {};

export function AppShell({ children }: { children: ReactNode }) {
  const [boot, setBoot] = useState<Boot>("loading");

  useEffect(() => {
    const timer = setTimeout(() => setBoot("ready"), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <AnimatePresence>
        {boot === "loading" ? (
          <motion.div
            key="boot-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MinimalLoader />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={boot === "loading" ? "invisible" : "visible"}>
        <RouteLoader />
        <TopNav />
        <main className="relative z-10 min-h-screen pt-20 sm:pt-24">{children}</main>
        <SiteFooter />
        <SupportButton />
        <CustomCursor />
      </div>
    </AuthProvider>
  );
}

export default AppShell;
