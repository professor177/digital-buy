"use client";

import { motion } from "framer-motion";
import { Gamepad2, Clapperboard, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import Link from "next/link";

import PlatformLogo from "@/components/brand/PlatformLogo";

const PORTALS = [
  {
    href: "/gaming",
    label: "GAMING",
    icon: Gamepad2,
    copy: "Shared and personal gaming accounts.",
    accent: "var(--color-accent)",
  },
  {
    href: "/ott",
    label: "OTT",
    icon: Clapperboard,
    copy: "Streaming subscriptions and profiles.",
    accent: "var(--color-accent)",
  },
  {
    href: "#",
    label: "TOPUP",
    icon: Zap,
    copy: "Coming soon",
    accent: "var(--color-border)",
    disabled: true,
  },
];

const TRUST = [
  { icon: Zap, title: "Instant delivery", copy: "Most orders within 10 minutes" },
  { icon: ShieldCheck, title: "Warranty included", copy: "Replacement on any issue" },
  { icon: BadgeCheck, title: "bKash & Nagad", copy: "Pay the local way, no cards" },
];

const MARQUEE = [
  "steam",
  "xbox",
  "ubisoft",
  "netflix",
  "spotify",
  "prime-video",
  "hbo-max",
  "disney-plus-hotstar",
  "youtube-premium",
  "crunchyroll",
];

export default function HomePage() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
      <section className="flex min-h-[78vh] flex-col items-center justify-center py-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.32em] text-white/65"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
          Bangladesh&apos;s digital store
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl md:text-7xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Gaming Accounts and
          <br />
          <span className="text-accent">OTT Subscriptions.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 max-w-xl text-lg text-text-secondary"
        >
          The most reliable digital store in Bangladesh. Get premium shared or 
          personal accounts delivered to your dashboard.
        </motion.p>

        {/* ── The hero portals ── */}
        <div className="mt-16 grid w-full max-w-6xl gap-6 sm:grid-cols-3">
          {PORTALS.map((portal, index) => {
            const Icon = portal.icon;
            const isDisabled = portal.disabled;
            
            return (
              <motion.div
                key={portal.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={portal.href}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-10 text-center transition-all duration-200 ${
                    isDisabled ? "cursor-not-allowed opacity-50" : "hover:border-accent hover:bg-surface-hover"
                  }`}
                >
                  <span className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-bg border border-border group-hover:border-accent transition-colors ${isDisabled ? "" : "text-accent"}`}>
                    <Icon size={32} />
                  </span>
                  <span className="text-2xl font-bold tracking-wider">
                    {portal.label}
                  </span>
                  <span className="mt-2 text-sm text-text-secondary">
                    {portal.copy}
                  </span>
                  
                  {isDisabled && (
                    <span className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
                      Coming soon
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-14 grid w-full max-w-3xl gap-3 sm:grid-cols-3"
        >
          {TRUST.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:border-white/25"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/30">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-[13px] font-medium">{item.title}</span>
                  <span className="block text-[11px] text-white/45">{item.copy}</span>
                </span>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Brand marquee ── */}
      <section className="relative mb-16 overflow-hidden py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#05040c] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#05040c] to-transparent" />
        <motion.div
          className="flex w-max gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        >
          {[...MARQUEE, ...MARQUEE].map((slug, index) => (
            <div
              key={`${slug}-${index}`}
              className="flex items-center gap-3 opacity-45 transition hover:opacity-100"
            >
              <PlatformLogo slug={slug} size={34} />
              <span className="text-xs uppercase tracking-[0.25em] text-white/60">
                {slug.replace(/-/g, " ")}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section className="mb-24 grid gap-4 md:grid-cols-4">
        {[
          { step: "01", title: "Pick your product", copy: "Gaming account or OTT plan — shared or personal." },
          { step: "02", title: "Pay with bKash / Nagad", copy: "Send money, drop the transaction ID." },
          { step: "03", title: "We verify", copy: "Manual check, usually under 10 minutes." },
          { step: "04", title: "Credentials unlocked", copy: "Login details appear inside My Orders." },
        ].map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <span className="text-gradient text-2xl font-bold">{item.step}</span>
            <p className="mt-2 text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">{item.copy}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
