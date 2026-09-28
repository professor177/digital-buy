import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IntroGate } from "@/components/intro-gate";
import { ToastProvider } from "@/components/toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Digital Buy | Gaming Accounts & Digital Subscriptions", template: "%s | Digital Buy" },
  description: "Buy configured gaming account access and digital subscription products with protected order delivery and manual bKash or Nagad payment verification.",
  applicationName: "Digital Buy",
  robots: { index: true, follow: true },
  openGraph: { title: "Digital Buy", description: "Gaming accounts and digital subscriptions with protected order delivery.", type: "website", url: siteUrl, siteName: "Digital Buy" },
  twitter: { card: "summary_large_image", title: "Digital Buy", description: "Gaming accounts and digital subscriptions with protected order delivery." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ToastProvider><IntroGate/><Header/><main>{children}</main><Footer/></ToastProvider></body></html>;
}
