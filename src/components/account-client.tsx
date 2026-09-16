"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleUserRound, LogOut, Phone } from "lucide-react";

interface AccountUser {
  id: number;
  phone: string;
  nickname: string | null;
  createdAt: string;
}

export function AccountCard({ user }: { user: AccountUser }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) throw new Error(body?.error ?? "save_failed");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "invalid_nickname"
          ? "Nicknames must be 2 to 24 characters: letters, numbers, spaces, dot, dash, or underscore."
          : "Could not save right now. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/session", { method: "DELETE" }).catch(
      () => undefined,
    );
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-lg border border-line bg-panel p-7 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-md border border-line bg-panel2">
            <CircleUserRound size={24} className="text-brand" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Account settings
            </h1>
            <p className="text-sm text-fog">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <form onSubmit={save} className="mt-8 space-y-5">
          <div>
            <label className="eyebrow mb-2 block" htmlFor="nickname">
              Nickname
            </label>
            <input
              id="nickname"
              className="field"
              value={nickname}
              maxLength={24}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="What should we call you?"
            />
            <p className="mt-2 text-xs text-fog/70">
              Only your nickname can be edited right now. More profile options
              are coming later.
            </p>
          </div>
          <div>
            <label className="eyebrow mb-2 block">Phone</label>
            <div className="flex items-center gap-2.5 rounded-md border border-line bg-ink px-3.5 py-3 text-sm font-semibold text-fog">
              <Phone size={14} /> {user.phone}
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-fog/60">
                Verified
              </span>
            </div>
          </div>
          {error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="btn btn-brand px-6 py-2.5 text-sm"
            >
              {saved ? <Check size={15} /> : null}
              {busy ? "Saving..." : saved ? "Saved" : "Save nickname"}
            </button>
            <button
              type="button"
              onClick={logout}
              disabled={busy}
              className="btn btn-outline px-5 py-2.5 text-sm"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
