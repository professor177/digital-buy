"use client";

import { motion } from "framer-motion";
import { Gamepad2, Clapperboard, ShieldCheck, Zap, BadgeCheck, Wallet, Lock } from "lucide-react";

import MagneticButton from "@/components/ui/MagneticButton";
import PlatformLogo from "@/components/brand/PlatformLogo";

const PORTALS = [
  {
    href: "/gaming",
    label: "GAMING",
    icon: Gamepad2,
    copy: "Steam · Xbox · Ubisoft accounts",
    from: "#2dd4d4",
    via: "#38bdf8",
    to: "#6366f1",
  },
  {
    href: "/ott",
    label: "OTT",
    icon: Clapperboard,
    copy: "Netflix · Prime · Spotify & more",
    from: "#f2b134",
    via: "#fb923c",
    to: "#ec4899",
  },
];

const LOCKED_PORTAL = {
  label: "TOPUP",
  icon: Wallet,
  copy: "Game & app top-ups, coming soon",
};

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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Gaming accounts and streaming subscriptions,
          <br />
          <span className="text-gradient animate-gradient-pan">verified and delivered within minutes.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base"
        >
          Pay with bKash or Nagad and get Steam, Xbox, Netflix, Spotify and more. Shared plans cost less; personal accounts are yours to keep.
        </motion.p>

        {/* ── Hero portals: Gaming, OTT, and a locked Topup preview ── */}
        <div className="mt-12 grid w-full max-w-5xl gap-5 sm:grid-cols-3">
          {PORTALS.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.href}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.28 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex justify-center"
              >
                <MagneticButton
                  href={portal.href}
                  strength={26}
                  className="group w-full rounded-[28px] p-[1.5px] transition-[transform,filter] duration-300 hover:scale-[1.025]"
                >
                  <span
                    className="absolute inset-0 rounded-[28px] opacity-80 blur-xl transition duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(130deg, ${portal.from}, ${portal.via}, ${portal.to})`,
                    }}
                  />
                  <span
                    className="animate-gradient-pan absolute inset-0 rounded-[28px]"
                    style={{
                      background: `linear-gradient(130deg, ${portal.from}, ${portal.via}, ${portal.to})`,
                    }}
                  />
                  <span className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-[26px] bg-[#131019]/90 px-8 py-10 backdrop-blur-xl transition group-hover:bg-[#131019]/75">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
                      style={{ background: `${portal.from}1f` }}
                    >
                      <Icon size={28} style={{ color: portal.from }} />
                    </span>
                    <span className="mt-1 text-2xl font-bold tracking-[0.22em] sm:text-3xl">
                      {portal.label}
                    </span>
                    <span className="text-xs text-white/50">{portal.copy}</span>
                    <span
                      className="mt-3 h-[3px] w-0 rounded-full transition-all duration-500 group-hover:w-24"
                      style={{ background: portal.to }}
                    />
                  </span>
                </MagneticButton>
              </motion.div>
            );
          })}

          {/* Locked preview — feature not live yet */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.28 + PORTALS.length * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="relative w-full cursor-not-allowed rounded-[28px] border border-white/10 bg-white/[0.02] px-8 py-10">
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/45">
                <Lock size={10} /> Coming soon
              </span>
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-center opacity-50">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
                  <LOCKED_PORTAL.icon size={28} className="text-white/50" />
                </span>
                <span className="mt-1 text-2xl font-bold tracking-[0.22em] text-white/60 sm:text-3xl">
                  {LOCKED_PORTAL.label}
                </span>
                <span className="text-xs text-white/40">{LOCKED_PORTAL.copy}</span>
              </span>
            </div>
          </motion.div>
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
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/30 to-cyan-400/30">
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0c0a12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0c0a12] to-transparent" />
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
          { step: "01", title: "Pick your product", copy: "Gaming account or OTT plan, shared or personal." },
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
