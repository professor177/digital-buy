import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Clapperboard, User, Users } from "lucide-react";
import { listPlatforms } from "@/lib/data";
import type { AccountMode } from "@/lib/shared";

export const metadata: Metadata = { title: "OTT" };

export default async function OttPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const mode: AccountMode | null =
    sp.mode === "personal" ? "personal" : sp.mode === "shared" ? "shared" : null;

  if (!mode) {
    return (
      <div className="wrap fade-up max-w-4xl py-12 sm:py-16">
        <p className="eyebrow">OTT</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Shared or personal?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-fog">
          Shared slots sit on accounts we maintain. Personal packages are set
          up on accounts you control.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/ott?mode=shared"
            className="tile-hover group rounded-lg border border-line bg-panel p-7"
          >
            <Users size={26} className="text-brand" />
            <p className="mt-5 text-xl font-extrabold tracking-tight text-white">
              Shared
            </p>
            <p className="mt-2 text-sm leading-6 text-fog">
              Profile access on a maintained subscription. Cheapest way to
              watch and listen.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand">
              Browse shared <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href="/ott?mode=personal"
            className="tile-hover group rounded-lg border border-line bg-panel p-7"
          >
            <User size={26} className="text-brand" />
            <p className="mt-5 text-xl font-extrabold tracking-tight text-white">
              Personal
            </p>
            <p className="mt-2 text-sm leading-6 text-fog">
              A subscription activated on your own account or one created for
              you. Full control stays with you.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand">
              Browse personal <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const platforms = await listPlatforms();

  return (
    <div className="fade-up bg-screen">
      <div className="wrap py-12 sm:py-16">
        <Link
          href="/ott"
          className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
        >
          <ChevronLeft size={15} /> Plan type: {mode === "shared" ? "Shared" : "Personal"}
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-5xl italic tracking-tight text-white sm:text-6xl">
              Streaming, sorted.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-fog">
              {mode === "shared" ? "Shared" : "personal"} packages from the
              platforms below. Pick one to see its plans.
            </p>
          </div>
          <span className="chip border-screen-line">
            <Clapperboard size={12} /> {platforms.length} platforms
          </span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {platforms.map((p) => (
            <Link
              key={p.id}
              href={`/ott/${p.slug}?mode=${mode}`}
              className="group relative overflow-hidden rounded-lg border border-screen-line"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={p.introMedia}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <p className="font-editorial text-4xl italic tracking-tight text-white sm:text-5xl">
                      {p.name}
                    </p>
                    <p className="mt-1.5 text-sm text-mist/80">{p.tagline}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/25 bg-black/50 text-white transition-colors group-hover:border-brand group-hover:text-brand">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
