import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Intro from "@/components/Intro";
import { getUser } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Digital Buy | Gaming accounts and OTT subscriptions in Bangladesh", template: "%s | Digital Buy" },
  description: "Buy Steam, Xbox and Ubisoft accounts and OTT subscriptions with bKash or Nagad. Prices in BDT.",
};

export default async function Root({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="en"><body>
      <Intro />
      <nav className="nav" aria-label="Main">
        <Link href="/"><b>Digital<span style={{ color: "var(--ac)" }}>Buy</span></b></Link>
        <Link href="/orders">My Orders</Link>
        <a href={process.env.NEXT_PUBLIC_SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a>
        {user ? <form action={logout}><button className="o">Logout</button></form> : <Link href="/login">Login</Link>}
      </nav>
      {children}
      <footer className="foot"><span>Digital Buy</span><Link href="/legal/privacy">Privacy Policy</Link><Link href="/legal/terms">Terms &amp; Conditions</Link></footer>
    </body></html>
  );
}
