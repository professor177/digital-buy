import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";

import AppShell from "@/components/system/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Buy — Gaming Accounts & OTT Subscriptions",
  description:
    "Premium digital gaming accounts (Steam, Xbox, Ubisoft) and OTT streaming subscriptions delivered instantly in Bangladesh. Pay with bKash or Nagad.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#05040c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#05040c] text-white antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
