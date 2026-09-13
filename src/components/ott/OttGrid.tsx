"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import PlatformLogo from "@/components/brand/PlatformLogo";
import { OTT_SERVICES, type Mode } from "@/lib/catalog";

export function OttGrid({ mode }: { mode: Mode }) {
  const [query, setQuery] = useState("");

  const services = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OTT_SERVICES;
    return OTT_SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.45em] text-white/40">
          OTT · {mode}
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Choose your <span className="text-gradient">service</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
          {mode === "shared"
            ? "Shared plans are duration based — pick 1, 3 or 6 months on the next screen."
            : "Personal plans are permanent, private accounts registered for you."}
        </p>
      </motion.div>

      <div className="mb-7 flex justify-center">
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5">
          <Search size={15} className="text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Netflix, Spotify, HBO…"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-white/35 sm:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
            whileHover={{ y: -8 }}
          >
            <Link
              href={`/ott/${mode}/${service.slug}`}
              className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 p-5 transition duration-300 hover:border-white/30"
              style={{
                background: `linear-gradient(165deg, ${service.brand2}, rgba(7,6,22,0.94))`,
              }}
            >
              <span
                className="absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition duration-500 group-hover:opacity-70"
                style={{ background: service.brand }}
              />
              <span className="animate-shimmer absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="relative">
                <PlatformLogo slug={service.slug} size={48} />
              </motion.div>

              <h2 className="relative mt-4 text-base font-semibold">{service.name}</h2>
              <p className="relative mt-1 text-[11px] uppercase tracking-widest text-white/40">
                {service.category}
              </p>
              <p className="relative mt-2 line-clamp-2 text-xs leading-relaxed text-white/50">
                {service.blurb}
              </p>

              <div className="relative mt-4 flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: `${service.brand}22`, color: service.brand }}
                >
                  {mode === "shared" ? "Duration based" : "Permanent"}
                </span>
                <span className="text-[11px] text-white/45 transition group-hover:text-white">
                  View →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-white/35">
        Need something else? Add it in <code className="text-white/50">src/lib/catalog.ts</code>{" "}
        → OTT_SERVICES.
      </p>
    </div>
  );
}

export default OttGrid;
