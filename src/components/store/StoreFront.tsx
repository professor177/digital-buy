"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Download, Gift, Home, Library, Search, Users } from "lucide-react";

import CoverArt from "@/components/game/CoverArt";
import GameCard from "@/components/game/GameCard";
import PlatformLogo from "@/components/brand/PlatformLogo";
import { STORE_META, type Game, type StorePlatform } from "@/lib/catalog";

/**
 * Platform-skinned storefronts that mimic the real Steam / Xbox / Ubisoft
 * Connect interfaces, complete with a live-filtering search bar.
 */
export function StoreFront({
  platform,
  games,
}: {
  platform: StorePlatform;
  games: Game[];
}) {
  const meta = STORE_META[platform];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.studio.toLowerCase().includes(q) ||
        game.genres.some((genre) => genre.toLowerCase().includes(q)),
    );
  }, [games, query]);

  const featured = games[0];
  const hrefFor = (slug: string) => `/gaming/shared/${platform}/${slug}`;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          platform === "steam"
            ? "linear-gradient(180deg,#1b2838 0%,#16202d 40%,#0b0f16 100%)"
            : platform === "xbox"
              ? "linear-gradient(180deg,#0d1f0d 0%,#07130a 45%,#050a06 100%)"
              : "linear-gradient(180deg,#071426 0%,#06101f 45%,#04080f 100%)",
      }}
    >
      {/* ── platform chrome ── */}
      <div
        className="sticky top-[68px] z-40 border-b backdrop-blur-xl sm:top-[76px]"
        style={{
          borderColor: `${meta.accent}33`,
          background:
            platform === "steam"
              ? "rgba(23,26,33,0.92)"
              : platform === "xbox"
                ? "rgba(8,20,10,0.92)"
                : "rgba(5,14,26,0.92)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <PlatformLogo slug={platform} size={28} />
            <span className="text-sm font-semibold tracking-wide">{meta.name}</span>
          </div>

          <nav className="hidden items-center gap-1 text-[12px] font-medium uppercase tracking-wider text-white/55 md:flex">
            {(platform === "steam"
              ? ["Store", "Library", "Community", "Profile"]
              : platform === "xbox"
                ? ["Home", "Game Pass", "Store", "Library"]
                : ["Home", "Store", "News", "Rewards"]
            ).map((item, index) => (
              <span
                key={item}
                className="cursor-pointer rounded-md px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
                style={index === 0 ? { color: meta.accent } : undefined}
              >
                {item}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition focus-within:ring-2"
              style={{
                borderColor: `${meta.accent}44`,
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <Search size={14} style={{ color: meta.accent }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="search this store…"
                className="w-32 bg-transparent text-[13px] outline-none placeholder:text-white/35 sm:w-56"
              />
            </div>
            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/45 sm:flex">
              <Bell size={14} />
            </span>
            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/45 sm:flex">
              {platform === "ubisoft" ? <Gift size={14} /> : platform === "xbox" ? <Users size={14} /> : <Download size={14} />}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ── featured hero ── */}
        {featured && !query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 overflow-hidden rounded-2xl border"
            style={{ borderColor: `${meta.accent}33`, background: "rgba(255,255,255,0.03)" }}
          >
            <div className="grid gap-0 md:grid-cols-[1.6fr_1fr]">
              <Link href={hrefFor(featured.slug)} className="group relative block">
                <CoverArt game={featured} variant="wide" />
                <span
                  className="absolute left-4 top-4 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
                  style={{ background: meta.accent }}
                >
                  Featured
                </span>
                <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
              </Link>
              <div className="flex flex-col justify-center gap-3 p-6">
                <h2 className="text-2xl font-bold leading-tight">{featured.title}</h2>
                <p className="text-sm leading-relaxed text-white/55">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded px-2 py-1 text-[11px]"
                      style={{ background: `${meta.accent}1f`, color: meta.accent }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <Link
                  href={hrefFor(featured.slug)}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
                  style={{ background: meta.accent }}
                >
                  View store page →
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-lg font-semibold tracking-wide">
            {query ? `Results for “${query}”` : "All shared titles"}
          </h3>
          <span className="text-xs text-white/40">{filtered.length} games</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/45">
            No titles matched your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
                href={hrefFor(game.slug)}
              />
            ))}
          </div>
        )}

        <div
          className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-xs text-white/45"
          style={{ borderColor: `${meta.accent}22` }}
        >
          <span className="flex items-center gap-2">
            {platform === "steam" ? <Library size={14} /> : <Home size={14} />}
            {meta.ui}
          </span>
          <span>Shared validity: 1 month · Warranty included</span>
        </div>
      </div>
    </div>
  );
}

export default StoreFront;
