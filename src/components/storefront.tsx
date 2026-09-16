"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2, Search, SearchX } from "lucide-react";
import {
  bdt,
  PRICE_COMING_SOON,
  type AccountMode,
  type GameDto,
} from "@/lib/shared";

interface StorefrontProps {
  platform: "steam" | "xbox";
  games: GameDto[];
  mode: AccountMode;
}

export function Storefront({ platform, games, mode }: StorefrontProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }, [games, query]);

  if (platform === "steam") {
    return (
      <section className="wrap mt-6">
        <div className="overflow-hidden rounded-lg border border-[#2a475e] bg-[#171d25] font-steam">
          <header className="border-b border-[#2a475e] bg-gradient-to-r from-[#1b2838] to-[#171d25] px-6 py-8 sm:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#66c0f4]">
              Digital Buy Store
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#ecf4fb] sm:text-5xl">
              Steam
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#8d97a3]">
              {mode === "shared" ? "Shared" : "Personal"} PC accounts with each
              title activated. Search the catalog, open a page, and check out
              with bKash or Nagad.
            </p>
            <div className="relative mt-6 max-w-xl">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66c0f4]/70"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Steam titles"
                className="w-full rounded-md border border-[#2a475e] bg-[#16202d] py-3 pl-10 pr-4 text-sm text-[#c7d5e0] outline-none transition-colors placeholder:text-[#5d6d80] focus:border-[#66c0f4]"
              />
            </div>
          </header>

          <div className="px-6 py-8 sm:px-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8d97a3]">
              {games.length === 0
                ? "The catalog is empty"
                : `${filtered.length} of ${games.length} titles`}
            </p>
            {games.length === 0 ? (
              <EmptyCatalog accent="#66c0f4" />
            ) : filtered.length === 0 ? (
              <EmptySearch query={query} accent="#66c0f4" />
            ) : (
              <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((g) => (
                  <Link
                    key={g.id}
                    href={`/games/steam/${g.id}`}
                    className="group"
                  >
                    <article className="overflow-hidden rounded-md border border-[#2a475e]/70 bg-[#1b2838] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#66c0f4]/60 group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
                      <div className="relative aspect-[21/10] overflow-hidden bg-[#16202d]">
                        <img
                          src={g.thumbnail}
                          alt={g.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <span className="absolute left-2 top-2 rounded-sm bg-[#16202d]/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#66c0f4]">
                          {g.accountType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                        <h2 className="truncate text-[15px] font-bold text-[#c7d5e0] group-hover:text-white">
                          {g.title}
                        </h2>
                        <span className="shrink-0 rounded-sm bg-[#16202d] px-2 py-1 text-[11px] font-bold text-[#9fb8ce]">
                          {g.priceBdt != null ? bdt(g.priceBdt) : PRICE_COMING_SOON}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* Xbox theme */
  return (
    <section className="wrap mt-6">
      <div className="relative overflow-hidden rounded-lg border border-[#243524] bg-[#0c0f0c] font-xbox">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 0 88%, rgba(155,240,11,0.08) 88% 100%), radial-gradient(ellipse 60% 40% at 80% -10%, rgba(16,124,16,0.25), transparent)",
          }}
        />
        <header className="relative border-b border-[#243524] px-6 py-8 sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9bf00b]">
            Digital Buy Game Pass
          </p>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-wide text-[#f2fff2] sm:text-6xl">
            Xbox
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#8da08d]">
            {mode === "shared" ? "Shared" : "Personal"} accounts, console and
            PC titles. Pick a tile to watch the trailer and buy.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bf00b]/70"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Xbox titles"
              className="w-full rounded-none border border-[#35503a] bg-[#0f130f] py-3 pl-10 pr-4 text-sm uppercase tracking-wider text-[#e6f2e6] outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[#587058] focus:border-[#9bf00b]"
            />
          </div>
        </header>

        <div className="relative px-6 py-8 sm:px-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8da08d]">
            {games.length === 0
              ? "The catalog is empty"
              : `${filtered.length} / ${games.length} titles`}
          </p>
          {games.length === 0 ? (
            <EmptyCatalog accent="#9bf00b" />
          ) : filtered.length === 0 ? (
            <EmptySearch query={query} accent="#9bf00b" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <Link key={g.id} href={`/games/xbox/${g.id}`} className="group">
                  <article className="relative overflow-hidden border border-[#243524] bg-[#131913] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#9bf00b]/70 group-hover:shadow-[0_0_36px_-8px_rgba(155,240,11,0.35)]">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={g.thumbnail}
                        alt={g.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0f0c] to-transparent" />
                      <span className="absolute left-0 top-3 bg-[#107c10] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                        Xbox
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                      <h2 className="truncate text-sm font-bold uppercase tracking-[0.08em] text-[#e6f2e6] group-hover:text-[#9bf00b]">
                        {g.title}
                      </h2>
                      <span className="flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-[#9bf00b]">
                        {g.priceBdt != null ? bdt(g.priceBdt) : PRICE_COMING_SOON}
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyCatalog({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-line/60 px-6 py-16 text-center">
      <Gamepad2 size={28} style={{ color: accent }} />
      <p className="mt-4 text-lg font-bold text-white">No games added yet</p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-fog">
        Titles are added to the catalog over time. Check back soon, or message
        support if you are looking for a specific game.
      </p>
    </div>
  );
}

function EmptySearch({ query, accent }: { query: string; accent: string }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-line/60 px-6 py-14 text-center">
      <SearchX size={26} style={{ color: accent }} />
      <p className="mt-4 font-bold text-white">
        No titles match &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-fog">
        The catalog grows over time. If a title you want is missing, message
        support and we will try to source it.
      </p>
    </div>
  );
}
