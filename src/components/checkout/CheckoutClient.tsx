"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Loader2, LockKeyhole, Sparkles } from "lucide-react";

import PlatformLogo from "@/components/brand/PlatformLogo";
import { useAuth } from "@/components/auth/AuthProvider";

export type CheckoutItem = {
  type: "game" | "ott";
  slug: string;
  title: string;
  subtitle: string;
  platform: string;
  planLabel: string;
  validity: string;
  price: string;
  mode: "shared" | "personal";
  accent: string;
};

type Method = "bkash" | "nagad";

const METHODS: Record<
  Method,
  { name: string; color: string; color2: string; hint: string; ussd: string }
> = {
  bkash: {
    name: "bKash",
    color: "#e2136e",
    color2: "#ff5ca0",
    hint: "Send Money (personal) → then paste the TrxID",
    ussd: "*247#",
  },
  nagad: {
    name: "Nagad",
    color: "#f6821f",
    color2: "#ffb457",
    hint: "Send Money → then paste the TxnID",
    ussd: "*167#",
  },
};

export function CheckoutClient({
  item,
  merchant,
}: {
  item: CheckoutItem;
  merchant: { bkash: string; nagad: string };
}) {
  const { user, openAuth } = useAuth();
  const [method, setMethod] = useState<Method>("bkash");
  const [sender, setSender] = useState("");
  const [trx, setTrx] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Human-friendly reference the buyer adds as a payment reference.
  const reference = useMemo(
    () => `DB-${item.slug.slice(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 8999)}`,
    [item.slug],
  );

  const active = METHODS[method];
  const number = method === "bkash" ? merchant.bkash : merchant.nagad;

  function copy(value: string, key: string) {
    void navigator.clipboard?.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function submit() {
    if (!user) {
      openAuth();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: item.type,
          productSlug: item.slug,
          productTitle: `${item.title} — ${item.planLabel}`,
          mode: item.mode,
          platform: item.platform,
          planLabel: item.planLabel,
          validity: item.validity,
          priceLabel: item.price,
          paymentMethod: method,
          senderNumber: sender,
          transactionId: trx,
          reference,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Could not place the order.");
        return;
      }
      setPlaced(reference);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight sm:text-4xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Secure <span className="text-gradient">checkout</span>
      </motion.h1>
      <p className="mt-2 text-sm text-white/50">
        Manual bKash / Nagad payment — verified by our team within ~10 minutes.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        {/* ── payment ── */}
        <div className="space-y-5">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              1 · Choose payment method
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(METHODS) as Method[]).map((key) => {
                const option = METHODS[key];
                const isActive = key === method;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setMethod(key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-2xl px-5 py-4 text-left font-semibold transition ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(120deg, ${option.color}, ${option.color2})`
                        : "rgba(255,255,255,0.04)",
                      boxShadow: isActive ? `0 20px 60px -25px ${option.color}` : undefined,
                      border: `1px solid ${isActive ? option.color : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {isActive ? (
                      <span className="animate-shimmer absolute -left-1/3 top-0 h-full w-1/3 bg-white/25 blur-md" />
                    ) : null}
                    <span className="relative block text-lg">{option.name}</span>
                    <span className="relative mt-0.5 block text-[11px] font-normal opacity-80">
                      {option.hint}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              2 · Send the money
            </h2>
            {/* TODO: swap MERCHANT numbers in src/lib/catalog.ts, or automate with
                the bKash Tokenized Checkout / Nagad Merchant API. */}
            <div className="mt-4 space-y-3">
              <div
                className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5"
                style={{ borderColor: `${active.color}55`, background: `${active.color}12` }}
              >
                <span>
                  <span className="block text-[11px] uppercase tracking-widest text-white/45">
                    {active.name} merchant number
                  </span>
                  <span className="text-lg font-semibold tracking-wider">{number}</span>
                </span>
                <button
                  onClick={() => copy(number, "number")}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20"
                >
                  <Copy size={13} /> {copied === "number" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
                <span>
                  <span className="block text-[11px] uppercase tracking-widest text-white/45">
                    Reference ID (add as reference)
                  </span>
                  <span className="text-lg font-semibold tracking-wider text-gradient">
                    {reference}
                  </span>
                </span>
                <button
                  onClick={() => copy(reference, "ref")}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20"
                >
                  <Copy size={13} /> {copied === "ref" ? "Copied" : "Copy"}
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-white/40">
                Dial <span className="text-white/70">{active.ussd}</span> or open the{" "}
                {active.name} app → <b>Send Money</b> → send the exact amount to the
                number above → include the reference ID.
              </p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              3 · Confirm your payment
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/50">
                  Your {active.name} number
                </span>
                <input
                  value={sender}
                  onChange={(event) => setSender(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-white/50">Transaction ID</span>
                <input
                  value={trx}
                  onChange={(event) => setTrx(event.target.value.toUpperCase())}
                  placeholder="e.g. BKX7D2K91A"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-wider outline-none transition focus:border-cyan-400/60 focus:bg-white/10"
                />
              </label>
            </div>

            {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}

            {!user ? (
              <p className="mt-3 flex items-center gap-2 text-xs text-amber-200/80">
                <LockKeyhole size={13} /> Sign in first so we can attach this order to
                your account.
              </p>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => void submit()}
              disabled={busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-black transition disabled:opacity-60"
              style={{ background: `linear-gradient(120deg, ${active.color}, ${active.color2}, #facc15)` }}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {user ? `Submit ${active.name} payment` : "Sign in & submit"}
            </motion.button>
          </div>
        </div>

        {/* ── summary ── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <PlatformLogo slug={item.platform} size={44} />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{item.title}</p>
                <p className="truncate text-xs text-white/45">{item.subtitle}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
              <Row label="Type" value={item.type === "game" ? "Gaming account" : "OTT subscription"} />
              <Row label="Mode" value={item.mode === "shared" ? "Shared" : "Personal"} />
              <Row label="Validity" value={item.validity} />
              <Row label="Plan" value={item.planLabel} />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-widest text-white/45">Total</span>
              <span className="text-xl font-bold text-gradient">{item.price}</span>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-white/40">
              Prices are placeholders — edit them in{" "}
              <code className="text-white/55">src/lib/catalog.ts</code>.
            </p>
          </div>
        </aside>
      </div>

      {/* ── success overlay ── */}
      <AnimatePresence>
        {placed ? (
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="glass-strong w-full max-w-md rounded-3xl p-8 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.55 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-cyan-400 text-black"
              >
                <CheckCircle2 size={34} />
              </motion.span>
              <h3 className="text-xl font-semibold">Order received!</h3>
              <p className="mt-2 text-sm text-white/55">
                Reference <span className="text-white">{placed}</span> is now{" "}
                <span className="text-amber-300">Pending</span>. We&apos;ll verify your{" "}
                {active.name} transaction and unlock the credentials in My Orders.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/orders"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 px-5 py-3 text-sm font-semibold text-black"
                >
                  Go to My Orders
                </Link>
                <Link
                  href="/"
                  className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm"
                >
                  Keep shopping
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-white/45">{label}</span>
      <span className="max-w-[60%] text-right text-[13px]">{value}</span>
    </div>
  );
}

export default CheckoutClient;
