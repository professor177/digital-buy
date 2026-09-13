import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[62vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.5em] text-white/35">Error 404</p>
      <h1
        className="text-gradient animate-gradient-pan mt-4 text-5xl font-bold sm:text-7xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Lost in the grid
      </h1>
      <p className="mt-4 text-sm text-white/50">
        That product doesn&apos;t exist (yet). Head back and pick a universe.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/gaming"
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          🎮 Gaming
        </Link>
        <Link
          href="/ott"
          className="rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          🎬 OTT
        </Link>
        <Link
          href="/"
          className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm transition hover:bg-white/10"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
