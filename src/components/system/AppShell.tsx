"use client";

import { useEffect, useState, type ReactNode } from "react";

import AuthProvider from "@/components/auth/AuthProvider";
import HelloIntro from "@/components/brand/HelloIntro";
import TopNav from "@/components/nav/TopNav";
import RouteLoader from "@/components/system/RouteLoader";
import SiteFooter from "@/components/system/SiteFooter";
import Aurora from "@/components/ui/Aurora";
import SupportButton from "@/components/ui/SupportButton";
import CustomCursor from "@/components/ui/CustomCursor";

const INTRO_KEY = "digitalbuy:intro-seen";

export function AppShell({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // The "hello" boot animation plays once per browser session.
    const seen = window.sessionStorage.getItem(INTRO_KEY);
    if (!seen) setIntroDone(false);
  }, []);

  return (
    <AuthProvider>
      <Aurora />
      <CustomCursor />
      {mounted && !introDone ? (
        <HelloIntro
          onFinish={() => {
            window.sessionStorage.setItem(INTRO_KEY, "1");
            setIntroDone(true);
          }}
        />
      ) : null}
      <RouteLoader />
      <TopNav />
      <main className="relative z-10 min-h-screen pt-20 sm:pt-24">{children}</main>
      <SiteFooter />
      <SupportButton />
    </AuthProvider>
  );
}

export default AppShell;
