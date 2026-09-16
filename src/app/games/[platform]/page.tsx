import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { getUbisoft, listGames } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { bdt, type AccountMode } from "@/lib/shared";
import { Storefront } from "@/components/storefront";
import { BuyBox } from "@/components/purchase";

export const metadata: Metadata = { title: "Games" };

function parseMode(raw: string | string[] | undefined): AccountMode | null {
  return raw === "personal" ? "personal" : raw === "shared" ? "shared" : null;
}

export default async function GamePlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ platform: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { platform } = await params;
  const sp = await searchParams;
  const mode = parseMode(sp.mode);
  if (!mode) redirect(`/games`);

  if (platform === "ubisoft") {
    const [rental, user] = await Promise.all([getUbisoft(), getSessionUser()]);
    if (!rental) notFound();
    return (
      <div className="fade-up">
        <div className="relative border-b border-line">
          <img
            src={rental.media}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
          <div className="wrap relative pb-14 pt-12">
            <Link
              href={`/games?mode=${mode}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
            >
              <ChevronLeft size={15} /> All platforms
            </Link>
            <p className="eyebrow mt-6 text-brand">Ubisoft | Rental</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {rental.title}
            </h1>
            <p className="mt-3 max-w-xl font-editorial text-xl italic text-mist/90">
              {rental.tagline}
            </p>
          </div>
        </div>

        <div className="wrap mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {rental.trailerUrl && (
              <div className="overflow-hidden rounded-lg border border-line bg-black">
                <video
                  controls
                  preload="none"
                  poster={rental.media}
                  className="aspect-video w-full"
                  src={rental.trailerUrl}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-mist">
              {rental.description}
            </p>
            <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-fog">
              What is included
            </h2>
            <ul className="mt-4 max-w-2xl space-y-3">
              {rental.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-md border border-line bg-panel px-4 py-3 text-sm font-medium text-mist"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-2xl rounded-lg border border-line bg-panel p-5 text-sm leading-6 text-fog">
              <p className="font-bold text-white">How the rental works</p>
              <p className="mt-2">
                You receive login access to a maintained Ubisoft account with
                the full library unlocked for 30 days. {mode === "shared"
                  ? "This is a shared rental: one slot on a maintained account, so the password and email stay with us."
                  : "This is billed as a personal rental slot reserved for you during the month."}{" "}
                Renewing keeps your saves and playtime.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line bg-panel p-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">Monthly rent</p>
                <p className="text-3xl font-extrabold tracking-tight text-brand">
                  {bdt(rental.priceBdt)}
                  <span className="text-sm font-semibold text-fog">/mo</span>
                </p>
              </div>
              <div className="mt-6">
                <BuyBox
                  itemType="ubisoft"
                  itemId={rental.id}
                  title={rental.title}
                  priceBdt={rental.priceBdt}
                  referralCode={rental.referralCode}
                  mode={mode}
                  authed={Boolean(user)}
                  nextPath={`/games/ubisoft?mode=${mode}`}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (platform !== "steam" && platform !== "xbox") notFound();
  const games = await listGames(platform, mode);
  return (
    <div className="fade-up pb-4">
      <div className="wrap pt-10">
        <Link
          href={`/games?mode=${mode}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
        >
          <ChevronLeft size={15} /> Change platform
        </Link>
      </div>
      <Storefront platform={platform} games={games} mode={mode} />
    </div>
  );
}
