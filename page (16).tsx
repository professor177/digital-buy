import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardList,
  Gamepad2,
  Lock,
  LogIn,
  MessagesSquare,
  Smartphone,
  Tv,
  Wallet,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { SUPPORT_URL } from "@/lib/shared";

const HERO_MEDIA = {
  games:
    "https://images.pexels.com/photos/8107826/pexels-photo-8107826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ott: "https://images.pexels.com/photos/7991436/pexels-photo-7991436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export default async function HomePage() {
  const user = await getSessionUser();
  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="border-b border-line">
        <div className="wrap pb-14 pt-16 sm:pb-20 sm:pt-24">
          <p className="eyebrow flex items-center gap-2 text-fog">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            Dhaka, Bangladesh | Digital delivery
          </p>
          <h1 className="mt-5 text-[13.5vw] font-extrabold leading-[0.92] tracking-[-0.03em] text-white sm:text-7xl lg:text-[92px]">
            GAMES AND
            <br />
            STREAMING,
            <br />
            <span className="text-brand">DELIVERED.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-fog">
            PC game accounts for Steam, Xbox, and the full Ubisoft library, plus
            OTT packages for Netflix and Spotify. You pay with bKash or Nagad,
            we verify the transaction, and your access appears on your order
            page.
          </p>
        </div>
      </section>

      {/* Primary entries */}
      <section className="wrap mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/games"
            className="tile-hover group relative flex h-64 flex-col justify-end overflow-hidden rounded-lg border border-line p-5"
          >
            <img
              src={HERO_MEDIA.games}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            <div className="relative">
              <Gamepad2 size={22} className="mb-3 text-brand" />
              <p className="text-2xl font-extrabold tracking-tight text-white">
                GAMES
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-mist/85">
                Steam, Xbox, and Ubisoft accounts
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </p>
            </div>
          </Link>

          <Link
            href="/ott"
            className="tile-hover group relative flex h-64 flex-col justify-end overflow-hidden rounded-lg border border-line p-5"
          >
            <img
              src={HERO_MEDIA.ott}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            <div className="relative">
              <Tv size={22} className="mb-3 text-brand" />
              <p className="text-2xl font-extrabold tracking-tight text-white">
                OTT
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-mist/85">
                Netflix, Spotify, and more packages
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </p>
            </div>
          </Link>

          <div
            aria-disabled="true"
            className="relative flex h-64 cursor-not-allowed flex-col justify-end overflow-hidden rounded-lg border border-dashed border-line bg-panel/50 p-5"
          >
            <div className="relative">
              <Lock size={22} className="mb-3 text-fog/60" />
              <p className="text-2xl font-extrabold tracking-tight text-fog/60">
                TOPUP
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-fog/60">
                <span className="rounded-sm border border-line px-1.5 py-px text-[10px] font-bold tracking-widest">
                  COMING SOON
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Secondary top-level actions */}
        <div className="mt-4 flex flex-wrap gap-3">
          {user ? (
            <Link href="/account" className="btn btn-dark px-5 py-3 text-sm">
              <LogIn size={16} /> Account
            </Link>
          ) : (
            <Link href="/login" className="btn btn-dark px-5 py-3 text-sm">
              <LogIn size={16} /> Login
            </Link>
          )}
          <Link href="/orders" className="btn btn-dark px-5 py-3 text-sm">
            <ClipboardList size={16} /> My Orders
          </Link>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark px-5 py-3 text-sm"
          >
            <MessagesSquare size={16} /> Support <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* How ordering works */}
      <section className="wrap mt-20">
        <p className="eyebrow">How ordering works</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Gamepad2,
              title: "Pick your product",
              body: "Choose a game, an OTT package, or the Ubisoft library pass.",
            },
            {
              icon: Wallet,
              title: "Pay with bKash or Nagad",
              body: "Send the exact amount to the merchant number shown at checkout.",
            },
            {
              icon: Smartphone,
              title: "Submit the transaction ID",
              body: "Paste the TrxID from your payment app into the order form.",
            },
            {
              icon: BadgeCheck,
              title: "Get access after verification",
              body: "We confirm the payment manually and reveal your credentials in My Orders.",
            },
          ].map((step, i) => (
            <div key={step.title} className="bg-panel p-6">
              <div className="flex items-center justify-between">
                <step.icon size={20} className="text-brand" />
                <span className="text-3xl font-extrabold tracking-tight text-line">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-5 font-bold text-white">{step.title}</p>
              <p className="mt-2 text-sm leading-6 text-fog">{step.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs font-medium tracking-wide text-fog/70">
          Manual verification on every order | No card required | All prices in
          BDT
        </p>
      </section>
    </div>
  );
}
