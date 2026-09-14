"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Phone, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

import DMark from "@/components/brand/DMark";

type Step = "choose" | "phone" | "otp" | "done";

export function AuthModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setStep("choose");
        setCode("");
        setError(null);
        setHint(null);
      }, 250);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus();
  }, [step]);

  async function sendOtp() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        devCode?: string;
        message?: string;
      };
      if (!data.ok) {
        setError(data.error ?? "Could not send OTP");
        return;
      }
      // DEV ONLY: the API returns the code while no SMS provider is configured.
      if (data.devCode) setCode(data.devCode);
      setHint(data.message ?? null);
      setStep("otp");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }
      setStep("done");
      window.setTimeout(() => void onSuccess(), 900);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-7 shadow-[0_30px_120px_-20px_rgba(168,85,247,0.55)]"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative mb-8 flex items-center gap-3">
              <DMark size={40} />
              <div>
                <p className="text-xl font-bold tracking-tight text-text-primary">Digital Buy</p>
                <p className="text-xs text-text-secondary uppercase tracking-widest">Client Portal</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "choose" ? (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative space-y-4"
                >
                  <a
                    href="/api/auth/google"
                    className="group flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3.5 font-bold text-black transition-colors hover:bg-gray-100"
                  >
                    <GoogleGlyph />
                    Continue with Google
                  </a>

                  <div className="flex items-center gap-3 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary opacity-30">
                    <span className="h-px flex-1 bg-border" />
                    or
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <button
                    onClick={() => setStep("phone")}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-5 py-3.5 font-bold text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <Phone size={18} className="text-accent" />
                    Login with Phone
                  </button>

                  <p className="pt-4 text-center text-[10px] font-medium leading-relaxed text-text-secondary uppercase tracking-wider">
                    Bangladesh numbers only (+880). By signing in you agree to our 
                    <Link href="/terms" className="text-accent ml-1 hover:underline">Terms</Link>.
                  </p>
                </motion.div>
              ) : null}

              {step === "phone" ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  className="relative space-y-4"
                >
                  <div>
                    <label className="mb-1.5 block text-xs text-white/50">
                      Your name
                    </label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Rafi Ahmed"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-white/50">
                      Phone number
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-cyan-400/60 focus-within:bg-white/10">
                      <span className="flex items-center gap-1.5 border-r border-white/10 py-3 pr-3 text-sm text-white/70">
                        🇧🇩 +880
                      </span>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        inputMode="numeric"
                        placeholder="1712 345678"
                        className="w-full bg-transparent py-3 text-sm outline-none"
                      />
                    </div>
                  </div>
                  {error ? (
                    <p className="text-xs text-rose-300">{error}</p>
                  ) : null}
                  <button
                    onClick={() => void sendOtp()}
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 px-5 py-3.5 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="animate-spin" size={18} /> : null}
                    Send OTP
                  </button>
                  <button
                    onClick={() => setStep("choose")}
                    className="w-full text-center text-xs text-white/40 hover:text-white/70"
                  >
                    ← Back
                  </button>
                </motion.div>
              ) : null}

              {step === "otp" ? (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  className="relative space-y-4"
                >
                  <p className="text-sm text-white/60">
                    Enter the 6-digit code sent to{" "}
                    <span className="text-white">+880{phone.replace(/^0/, "")}</span>
                  </p>
                  <input
                    ref={otpRef}
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    inputMode="numeric"
                    placeholder="••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl tracking-[0.7em] outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                  />
                  {hint ? (
                    <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[11px] text-cyan-200">
                      {hint}
                    </p>
                  ) : null}
                  {error ? <p className="text-xs text-rose-300">{error}</p> : null}
                  <button
                    onClick={() => void verifyOtp()}
                    disabled={busy || code.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 via-cyan-400 to-fuchsia-500 px-5 py-3.5 font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                    Verify &amp; continue
                  </button>
                  <button
                    onClick={() => void sendOtp()}
                    className="w-full text-center text-xs text-white/40 hover:text-white/70"
                  >
                    Resend code
                  </button>
                </motion.div>
              ) : null}

              {step === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex flex-col items-center gap-3 py-6"
                >
                  <DMark size={62} animated duration={1} />
                  <p className="text-lg font-semibold">You&apos;re in! 🎉</p>
                  <p className="text-sm text-white/50">Loading your dashboard…</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.5 14.5 0 0 1 9.77 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default AuthModal;
