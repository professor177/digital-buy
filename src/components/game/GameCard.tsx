"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import CoverArt from "@/components/game/CoverArt";
import type { Game } from "@/lib/catalog";

export function GameCard({
  game,
  href,
  index = 0,
  accent = "#a855f7",
  square = false,
}: {
  game: Game;
  href: string;
  index?: number;
  accent?: string;
  square?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link
        href={href}
        className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 group-hover:border-white/25"
        style={{ boxShadow: `0 20px 60px -30px ${accent}` }}
      >
        <div className="relative overflow-hidden">
          <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.55 }}>
            <CoverArt game={game} variant={square ? "capsule" : "portrait"} />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-6 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold text-black"
              style={{ background: accent }}
            >
              View details →
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium">{game.title}</p>
            <p className="truncate text-[11px] text-white/40">
              {game.genres.join(" • ")}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] text-amber-300">
            <Star size={11} fill="currentColor" /> {game.rating.toFixed(1)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default GameCard;
