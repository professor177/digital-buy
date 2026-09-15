"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck, User } from "lucide-react";

import DMark from "@/components/brand/DMark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Invalid username or password");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-8">
        <div className="mb-6 flex items-center gap-3">
          <DMark size={34} />
          <div>
            <p className="text-lg font-semibold tracking-tight">Digital Buy</p>
            <p className="text-xs text-white/45">Admin panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Username</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-cyan-400/60 focus-within:bg-white/10">
              <User size={16} className="text-white/40" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-transparent py-3 text-sm outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-white/50">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-cyan-400/60 focus-within:bg-white/10">
              <Lock size={16} className="text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-transparent py-3 text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error ? <p className="text-xs text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={busy || !username || !password}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 px-5 py-3.5 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/35">
          Separate from buyer accounts. No Google or phone sign-in here.
        </p>
      </div>
    </main>
  );
}
