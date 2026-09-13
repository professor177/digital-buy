"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import PlatformLogo from "@/components/brand/PlatformLogo";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { GAMING_BG_VIDEOS, STORE_META, gamesForPlatform } from "@/lib/catalog";

const ORDER = ["steam", "xbox", "ubisoft"] as const;

export default function SharedPlatformsPage() {
  return (
    <div className="relative">
      <VideoBackdrop sources={GAMING_BG_VIDEOS} tint="rgba(5,4,12,0.8)" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/40">
            Gaming · Shared
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Choose your <span className="text-gradient">store</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
            Each store is a faithful, in-house recreation of the real platform UI.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ORDER.map((slug, index) => {
            const meta = STORE_META[slug];
            const count = gamesForPlatform(slug).length;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 40, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
              >
                <Link
                  href={`/gaming/shared/${slug}`}
                  className="group relative block overflow-hidden rounded-3xl border border-white/10 p-6 transition duration-300 hover:border-white/30"
                  style={{
                    background: `linear-gradient(160deg, ${meta.surface}, rgba(6,5,18,0.92))`,
                  }}
                >
                  <span
                    className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-25 blur-3xl transition duration-500 group-hover:opacity-60"
                    style={{ background: meta.accent }}
                  />
                  <span className="animate-shimmer absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <motion.div whileHover={{ rotate: 8, scale: 1.08 }} className="relative">
                    <PlatformLogo slug={slug} size={56} />
                  </motion.div>

                  <h2 className="relative mt-5 text-xl font-semibold">{meta.name}</h2>
                  <p className="relative mt-1.5 text-xs leading-relaxed text-white/50">
                    {meta.tagline}
                  </p>

                  <div className="relative mt-5 flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{ background: `${meta.accent}22`, color: meta.accent }}
                    >
                      {count} titles
                    </span>
                    <span className="text-xs text-white/45 transition group-hover:text-white">
                      Open store →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-white/35">
          Shared accounts come with a fixed validity window (default: 1 month).
        </p>
      </div>
    </div>
  );
}
