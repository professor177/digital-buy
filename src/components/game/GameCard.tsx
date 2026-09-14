"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import CoverArt from "@/components/game/CoverArt";
import type { Game } from "@/lib/catalog";

export function GameCard({
  game,
  href,
}: {
  game: Game;
  href: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="card group"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          {game.videoUrl ? (
            <video
              src={game.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
             <CoverArt game={game} variant="portrait" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
          <div className="absolute bottom-3 left-3">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                {game.referralCode}
             </span>
          </div>
        </div>

        <div className="p-4">
          <p className="truncate text-sm font-bold text-text-primary">{game.title}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-accent">{game.price}</span>
            <span className="flex items-center gap-1 text-[10px] text-text-secondary">
              <Star size={10} className="text-accent" fill="currentColor" />
              {game.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default GameCard;
