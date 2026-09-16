import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Gamepad2, Library, User, Users } from "lucide-react";
import type { AccountMode } from "@/lib/shared";

export const metadata: Metadata = { title: "Games" };

function ModeCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/games?mode=shared"
        className="tile-hover group rounded-lg border border-line bg-panel p-7"
      >
        <Users size={26} className="text-brand" />
        <p className="mt-5 text-xl font-extrabold tracking-tight text-white">
          Shared Account
        </p>
        <p className="mt-2 text-sm leading-6 text-fog">
          One slot on a maintained account with the game activated. Lower
          price, and you do not change the password or email.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand">
          Browse shared <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
      <Link
        href="/games?mode=personal"
        className="tile-hover group rounded-lg border border-line bg-panel p-7"
      >
        <User size={26} className="text-brand" />
        <p className="mt-5 text-xl font-extrabold tracking-tight text-white">
          Personal Account
        </p>
        <p className="mt-2 text-sm leading-6 text-fog">
          A fresh account created for you, with the game activated. You get
          full email and password access after verification.
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand">
          Browse personal <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

function PlatformCards({ mode }: { mode: AccountMode }) {
  return (
    <div className="space-y-3">
      <Link
        href={`/games/steam?mode=${mode}`}
        className="tile-hover group flex items-center gap-5 rounded-lg border border-[#2a475e] bg-[#1b2838] p-5 sm:p-6"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-[#2a475e] bg-[#16202d] text-[#66c0f4]">
          <Gamepad2 size={22} />
        </span>
        <span className="min-w-0">
          <span className="block font-steam text-lg font-bold tracking-tight text-[#c7d5e0]">
            Steam
          </span>
          <span className="block truncate text-sm text-[#8d97a3]">
            PC game accounts, shared or personal
          </span>
        </span>
        <ArrowRight size={18} className="ml-auto shrink-0 text-[#66c0f4] transition-transform group-hover:translate-x-1" />
      </Link>
      <Link
        href={`/games/xbox?mode=${mode}`}
        className="tile-hover group flex items-center gap-5 rounded-lg border border-[#243524] bg-[#131913] p-5 sm:p-6"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-[#243524] bg-[#0d120d] text-[#9bf00b]">
          <Gamepad2 size={22} />
        </span>
        <span className="min-w-0">
          <span className="block font-xbox text-lg font-bold uppercase tracking-wide text-[#e6f2e6]">
            Xbox
          </span>
          <span className="block truncate text-sm text-[#8da08d]">
            PC game accounts, shared or personal
          </span>
        </span>
        <ArrowRight size={18} className="ml-auto shrink-0 text-[#9bf00b] transition-transform group-hover:translate-x-1" />
      </Link>
      <Link
        href={`/games/ubisoft?mode=${mode}`}
        className="tile-hover group flex items-center gap-5 rounded-lg border border-line bg-panel p-5 sm:p-6"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-line bg-panel2 text-white">
          <Library size={22} />
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-bold tracking-tight text-white">
            Ubisoft
          </span>
          <span className="block truncate text-sm text-fog">
            One rental, the full Ubisoft library, BDT 150 per month
          </span>
        </span>
        <ArrowRight size={18} className="ml-auto shrink-0 text-brand transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const mode = sp.mode === "personal" ? "personal" : sp.mode === "shared" ? "shared" : null;

  return (
    <div className="wrap fade-up max-w-4xl py-12 sm:py-16">
      {mode ? (
        <>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
          >
            <ChevronLeft size={15} /> Account type: {mode === "shared" ? "Shared" : "Personal"}
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Choose a platform
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-fog">
            Every option below delivers {mode} account access after your
            payment is verified manually.
          </p>
          <div className="mt-8">
            <PlatformCards mode={mode} />
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">Games</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Shared or personal account?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-fog">
            Both give you the same game library per platform. The difference is
            who owns and controls the account.
          </p>
          <div className="mt-8">
            <ModeCards />
          </div>
        </>
      )}
    </div>
  );
}
