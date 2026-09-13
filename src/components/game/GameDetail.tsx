"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, Infinity as InfinityIcon, PlayCircle, ShieldCheck, Star } from "lucide-react";

import CoverArt from "@/components/game/CoverArt";
import PlatformLogo from "@/components/brand/PlatformLogo";
import { STORE_META, type Game, type Mode, type StorePlatform } from "@/lib/catalog";

export function GameDetail({
  game,
  mode,
  platform,
}: {
  game: Game;
  mode: Mode;
  platform?: StorePlatform;
}) {
  // PERSONAL mode: the buyer picks the platform they prefer.
  const [selected, setSelected] = useState<StorePlatform>(
    platform ?? game.platforms[0],
  );
  const accent = STORE_META[selected].accent;
  const validity = mode === "shared" ? game.sharedValidity : "Permanent";

  const checkoutHref =
    `/checkout?type=game&slug=${game.slug}&mode=${mode}&platform=${selected}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/40"
      >
        <Link href="/gaming" className="transition hover:text-white">Gaming</Link>
        <span>/</span>
        <Link
          href={mode === "shared" ? "/gaming/shared" : "/gaming/personal"}
          className="capitalize transition hover:text-white"
        >
          {mode}
        </Link>
        {mode === "shared" && platform ? (
          <>
            <span>/</span>
            <Link href={`/gaming/shared/${platform}`} className="transition hover:text-white">
              {STORE_META[platform].name}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span className="text-white/70">{game.title}</span>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        {/* ── trailer + description ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_90px_-40px_rgba(168,85,247,0.8)]">
            <div className="aspect-video w-full">
              {/* TRAILER — replace trailerId in src/lib/catalog.ts with the official video id */}
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${game.trailerId}?rel=0&modestbranding=1`}
                title={`${game.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${game.title} official trailer`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
          >
            <PlayCircle size={14} /> More trailers & gameplay on YouTube
          </a>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold">About this game</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {game.description}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-white/35">Studio</dt>
                <dd className="mt-1">{game.studio}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-white/35">Genres</dt>
                <dd className="mt-1">{game.genres.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-white/35">Rating</dt>
                <dd className="mt-1 flex items-center gap-1 text-amber-300">
                  <Star size={13} fill="currentColor" /> {game.rating.toFixed(1)} / 5
                </dd>
              </div>
            </dl>
          </div>

          {mode === "personal" ? (
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                Available on
              </h3>
              <p className="mt-2 text-xs text-white/45">
                Pick the platform you want your permanent account created on.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {game.platforms.map((slug) => {
                  const active = slug === selected;
                  return (
                    <button
                      key={slug}
                      onClick={() => setSelected(slug)}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                        active
                          ? "scale-[1.03] border-white/40 bg-white/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25"
                      }`}
                      style={active ? { boxShadow: `0 12px 40px -18px ${STORE_META[slug].accent}` } : undefined}
                    >
                      <PlatformLogo slug={slug} size={30} />
                      <span className="text-left">
                        <span className="block text-sm font-medium">
                          {STORE_META[slug].name}
                        </span>
                        <span className="block text-[11px] text-white/40">
                          {active ? "Selected" : "Tap to select"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* ── purchase panel ── */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="glass-strong overflow-hidden rounded-3xl">
            <CoverArt game={game} variant="capsule" />
            <div className="space-y-4 p-6">
              <div>
                <h1 className="text-xl font-bold leading-tight">{game.title}</h1>
                <p className="mt-1 text-xs text-white/45">
                  {mode === "shared" ? "Shared account access" : "Permanent personal account"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <PlatformLogo slug={selected} size={26} />
                <span className="text-sm text-white/70">{STORE_META[selected].name}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs text-white/45">Price</span>
                {/* PRICE PLACEHOLDER — edit in src/lib/catalog.ts */}
                <span className="text-lg font-bold text-gradient">{game.price}</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {mode === "shared" ? (
                  <CalendarClock size={18} className="text-cyan-300" />
                ) : (
                  <InfinityIcon size={18} className="text-lime-300" />
                )}
                <span>
                  <span className="block text-xs text-white/45">Validity</span>
                  <span className="text-sm font-medium">{validity}</span>
                </span>
              </div>

              <Link
                href={checkoutHref}
                className="group relative block overflow-hidden rounded-2xl p-[1.5px]"
              >
                <span
                  className="animate-gradient-pan absolute inset-0"
                  style={{ background: `linear-gradient(120deg, ${accent}, #ec4899, #fb923c)` }}
                />
                <span className="relative flex items-center justify-center gap-2 rounded-[14px] bg-[#07061a] px-6 py-3.5 text-sm font-semibold transition group-hover:bg-transparent group-hover:text-black">
                  Buy Now · bKash / Nagad
                </span>
              </Link>

              <p className="flex items-center gap-2 text-[11px] leading-relaxed text-white/40">
                <ShieldCheck size={14} className="shrink-0 text-lime-300" />
                Warranty for the full validity period. Credentials appear in
                “My Orders” after payment verification.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

export default GameDetail;
