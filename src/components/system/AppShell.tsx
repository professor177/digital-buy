"use client";

import type { ReactNode } from "react";

import AuthProvider from "@/components/auth/AuthProvider";
import TopNav from "@/components/nav/TopNav";
import RouteLoader from "@/components/system/RouteLoader";
import SiteFooter from "@/components/system/SiteFooter";
import Aurora from "@/components/ui/Aurora";
import SupportButton from "@/components/ui/SupportButton";
import CustomCursor from "@/components/system/CustomCursor";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Aurora />
      <CustomCursor />
      <RouteLoader />
      <TopNav />
      <main className="relative z-10 min-h-screen pt-20 sm:pt-24">{children}</main>
      <SiteFooter />
      <SupportButton />
    </AuthProvider>
  );
}

export default AppShell;
