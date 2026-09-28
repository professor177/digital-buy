import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock3, KeyRound, ShieldCheck, Tag } from "lucide-react";
import { getGame } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { BuyBox } from "@/components/purchase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await getGame(Number(id));
  return { title: game ? game.title : "Game" };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ platform: string; id: string }>;
}) {
  const { platform, id } = await params;
  if (platform !== "steam" && platform !== "xbox") notFound();
  const gameId = Number(id);
  if (!Number.isInteger(gameId)) notFound();
  const [game, user] = await Promise.all([getGame(gameId), getSessionUser()]);
  if (!game || game.platform !== platform) notFound();

  const isSteam = platform === "steam";
  const nextPath = `/games/${platform}/${game.id}`;
  const theme = isSteam
    ? {
        frame: "border-[#2a475e] bg-[#171d25]",
        head: "border-[#2a475e]",
        accent: "text-[#66c0f4]",
        chip: "border-[#2a475e] text-[#9fb8ce]",
        font: "font-steam",
        fact: "border-[#22384f] bg-[#1b2838]",
        factLabel: "text-[#8d97a3]",
      }
    : {
        frame: "border-[#243524] bg-[#0c0f0c]",
        head: "border-[#243524]",
        accent: "text-[#9bf00b]",
        chip: "border-[#243524] text-[#a9c4a2]",
        font: "font-xbox",
        fact: "border-[#1e2c1e] bg-[#111711]",
        factLabel: "text-[#8da08d]",
      };

  const facts = [
    {
      icon: Tag,
      label: "Delivery",
      value: "Manual verification, usually under 24 hours",
    },
    {
      icon: KeyRound,
      label: "Account type",
      value:
        game.accountType === "shared"
          ? "Shared slot. Password and email stay with Digital Buy."
          : "Personal account. You receive full email and password access.",
    },
    {
      icon: ShieldCheck,
      label: "Replacement cover",
      value: "If credentials fail on first login, we replace them free.",
    },
    {
      icon: Clock3,
      label: "Reference",
      value: game.referralCode,
    },
  ];

  return (
    <div className="wrap fade-up py-10">
      <Link
        href={`/games/${platform}?mode=${game.accountType}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
      >
        <ChevronLeft size={15} /> All {isSteam ? "Steam" : "Xbox"} titles
      </Link>

      <div
        className={`mt-6 overflow-hidden rounded-lg border ${theme.frame} ${theme.font}`}
      >
        <header
          className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-6 py-6 sm:px-10 ${theme.head}`}
        >
          <h1
            className={`text-3xl font-extrabold tracking-tight text-white sm:text-4xl ${
              isSteam ? "" : "uppercase tracking-wide"
            }`}
          >
            {game.title}
          </h1>
          <div className="flex gap-2">
            <span className={`chip ${theme.chip}`}>
              {isSteam ? "Steam" : "Xbox"}
            </span>
            <span className={`chip ${theme.chip}`}>
              {game.accountType} account
            </span>
          </div>
        </header>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_340px]">
          <div>
            {game.trailerUrl ? (
              <div className="overflow-hidden rounded-md border border-black/60 bg-black">
                <video
                  controls
                  preload="none"
                  poster={game.thumbnail}
                  className="aspect-video w-full"
                  src={game.trailerUrl}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              <img
                src={game.thumbnail}
                alt={game.title}
                className="aspect-video w-full rounded-md border border-black/60 object-cover"
              />
            )}

            <h2
              className={`mt-8 text-[11px] font-bold uppercase tracking-[0.28em] ${theme.accent}`}
            >
              About this title
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-mist">
              {game.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className={`rounded-md border p-4 ${theme.fact}`}
                >
                  <p
                    className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${theme.factLabel}`}
                  >
                    <f.icon size={13} /> {f.label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-mist">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-line bg-panel p-6">
              <p className={`text-[11px] font-bold uppercase tracking-[0.28em] ${theme.accent}`}>
                Buy {game.title}
              </p>
              <div className="mt-4">
                <BuyBox
                  itemType="game"
                  itemId={game.id}
                  title={game.title}
                  priceBdt={game.priceBdt}
                  referralCode={game.referralCode}
                  mode={game.accountType}
                  authed={Boolean(user)}
                  nextPath={nextPath}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
