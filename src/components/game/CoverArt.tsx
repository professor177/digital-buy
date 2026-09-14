"use client";

import type { Game } from "@/lib/catalog";

/**
 * Procedural "capsule art" generator — no external image assets required.
 * Drop in real cover images later by replacing this component with <Image />.
 */
export function CoverArt({
  game,
  variant = "portrait",
  className = "",
}: {
  game: Game;
  variant?: "portrait" | "capsule" | "wide";
  className?: string;
}) {
  const [a, b, c] = game.tone;
  const initials = game.title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const ratio =
    variant === "portrait"
      ? "aspect-[3/4]"
      : variant === "capsule"
        ? "aspect-[92/43]"
        : "aspect-[16/7]";

  if (game.image) {
    return (
      <div className={`relative w-full overflow-hidden ${ratio} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.image}
          alt={game.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.05)_45%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">
            {game.studio}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight drop-shadow">
            {game.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${ratio} ${className}`}
      style={{ background: `linear-gradient(140deg, ${a} 0%, ${b} 52%, ${c} 100%)` }}
    >
      <div
        className="absolute -left-10 -top-14 h-48 w-48 rounded-full opacity-45 blur-2xl"
        style={{ background: c }}
      />
      <div
        className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full opacity-40 blur-2xl"
        style={{ background: a }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.22]" viewBox="0 0 200 200" preserveAspectRatio="none">
        <path d="M0 150 L60 60 L110 120 L160 30 L200 90 L200 200 L0 200 Z" fill="#000" />
        <path d="M0 175 L48 110 L96 160 L150 80 L200 140 L200 200 L0 200 Z" fill="#000" opacity="0.6" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.15)_45%,rgba(255,255,255,0.12))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_9px)]" />

      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[26vw] font-black leading-none text-white/10 sm:text-[110px]">
        {initials}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">
          {game.studio}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight drop-shadow">
          {game.title}
        </p>
      </div>
    </div>
  );
}

export default CoverArt;
