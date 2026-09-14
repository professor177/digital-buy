"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

import GameCard from "@/components/game/GameCard";
import PlatformLogo from "@/components/brand/PlatformLogo";
import { GAMES, STORE_META, type StorePlatform } from "@/lib/catalog";

const FILTERS: Array<{ key: "all" | StorePlatform; label: string }> = [
  { key: "all", label: "All platforms" },
  { key: "steam", label: "Steam" },
  { key: "xbox", label: "Xbox" },
  { key: "ubisoft", label: "Ubisoft" },
];

export default function PersonalLibraryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | StorePlatform>("all");

  const games = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((game) => {
      const matchesQuery =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.studio.toLowerCase().includes(q) ||
        game.genres.some((genre) => genre.toLowerCase().includes(q));
      const matchesPlatform = filter === "all" || game.platforms.includes(filter);
      return matchesQuery && matchesPlatform;
    });
  }, [query, filter]);

  return (
    <div className="relative bg-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/40">
            Gaming · Personal
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            The <span className="text-gradient">permanent</span> library
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
            Every title in one place. Choose your preferred platform on the game
            page — your account never expires.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] text-lime-200">
            <Sparkles size={12} /> No validity limit · lifetime ownership
          </span>
        </motion.div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5">
            <Search size={15} className="text-white/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all titles…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35 sm:w-72"
            />
          </div>

          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs transition ${
                    active
                      ? "border-white/35 bg-white/12 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25"
                  }`}
                >
                  {item.key !== "all" ? <PlatformLogo slug={item.key} size={18} /> : null}
                  {item.label}
                  {item.key !== "all" ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: STORE_META[item.key].accent }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {games.length === 0 ? (
          <div className="glass rounded-3xl p-14 text-center text-sm text-white/45">
            Nothing matched that search.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {games.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
                href={`/gaming/personal/${game.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
