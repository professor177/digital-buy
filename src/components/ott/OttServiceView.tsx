"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, Check, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";

import PlatformLogo from "@/components/brand/PlatformLogo";
import type { Mode, OttService } from "@/lib/catalog";

export function OttServiceView({
  service,
  mode,
}: {
  service: OttService;
  mode: Mode;
}) {
  const plans = mode === "shared" ? service.sharedPlans : service.personalPlans;
  const [planIndex, setPlanIndex] = useState(0);
  const plan = plans[planIndex] ?? plans[0];

  const checkoutHref = `/checkout?type=ott&slug=${service.slug}&mode=${mode}&plan=${planIndex}`;

  return (
    <div className="relative">
      {/* service hero band, branded per platform */}
      <div
        className="relative overflow-hidden border-b border-white/10"
        style={{
          background: `linear-gradient(140deg, ${service.brand2} 0%, rgba(6,5,18,0.96) 65%)`,
        }}
      >
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-[90px]"
          style={{ background: service.brand }}
        />
        <div className="animate-shimmer absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="animate-float"
          >
            <PlatformLogo slug={service.slug} size={84} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
                {mode}
              </span>
              <span
                className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                style={{ background: `${service.brand}26`, color: service.brand }}
              >
                {service.category}
              </span>
            </div>
            <h1
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {service.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              {service.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        {/* plans */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">
            {mode === "shared" ? "Shared plans" : "Personal (permanent) plans"}
          </h2>

          <div className="space-y-3">
            {plans.map((item, index) => {
              const active = index === planIndex;
              return (
                <motion.button
                  key={`${item.name}-${item.validity}`}
                  onClick={() => setPlanIndex(index)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                    active
                      ? "border-white/35 bg-white/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                  style={active ? { boxShadow: `0 18px 60px -30px ${service.brand}` } : undefined}
                >
                  <span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {active ? (
                        <Check size={15} style={{ color: service.brand }} />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-white/25" />
                      )}
                      {item.name}
                    </span>
                    <span className="mt-1 block pl-6 text-[11px] text-white/45">
                      {item.screens} · {item.quality} · {item.validity}
                    </span>
                  </span>
                  {/* PRICE PLACEHOLDER */}
                  <span className="shrink-0 text-base font-bold text-gradient">
                    {item.price}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              What you get
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {service.perks.map((perk) => (
                <div
                  key={perk}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-xs"
                >
                  <span
                    className="mx-auto mb-2 block h-1.5 w-8 rounded-full"
                    style={{ background: service.brand }}
                  />
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* checkout panel */}
        <motion.aside
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="glass-strong rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Order summary
            </p>
            <h3 className="mt-2 text-lg font-semibold">{service.name}</h3>
            <p className="text-xs text-white/50">{plan?.name}</p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs text-white/45">Price</span>
                <span className="text-lg font-bold text-gradient">{plan?.price}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {mode === "shared" ? (
                  <CalendarClock size={18} className="text-cyan-300" />
                ) : (
                  <InfinityIcon size={18} className="text-lime-300" />
                )}
                <span>
                  <span className="block text-xs text-white/45">Validity</span>
                  <span className="text-sm font-medium">{plan?.validity}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <ShieldCheck size={18} className="text-fuchsia-300" />
                <span>
                  <span className="block text-xs text-white/45">Screens / quality</span>
                  <span className="text-sm font-medium">
                    {plan?.screens} · {plan?.quality}
                  </span>
                </span>
              </div>
            </div>

            <Link
              href={checkoutHref}
              className="group relative mt-5 block overflow-hidden rounded-2xl p-[1.5px]"
            >
              <span
                className="animate-gradient-pan absolute inset-0"
                style={{ background: `linear-gradient(120deg, ${service.brand}, #a855f7, #fb923c)` }}
              />
              <span className="relative flex items-center justify-center gap-2 rounded-[14px] bg-[#07061a] px-6 py-3.5 text-sm font-semibold transition group-hover:bg-transparent group-hover:text-black">
                Checkout · bKash / Nagad
              </span>
            </Link>

            <p className="mt-4 text-[11px] leading-relaxed text-white/40">
              Credentials are delivered inside “My Orders” right after your
              payment is verified.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

export default OttServiceView;
