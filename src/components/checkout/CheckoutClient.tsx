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
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">
        Secure Checkout
      </h1>
      <p className="mt-2 text-sm text-text-secondary uppercase tracking-widest">
        Official Manual Payment
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">
              1 · Payment Method
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(Object.keys(METHODS) as Method[]).map((key) => {
                const option = METHODS[key];
                const isActive = key === method;
                return (
                  <button
                    key={key}
                    onClick={() => setMethod(key)}
                    className={`relative flex flex-col rounded-lg p-5 text-left border transition-all ${
                      isActive ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-bg hover:border-border-hover"
                    }`}
                  >
                    <span className={`text-lg font-bold ${isActive ? "text-accent" : "text-text-primary"}`}>
                      {option.name}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-text-secondary opacity-70">
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">
              2 · Transaction Details
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-bg border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                   Send Money to
                </span>
                <div className="flex items-center justify-between">
                   <span className="text-lg font-mono font-bold text-text-primary">{number}</span>
                   <button onClick={() => copy(number, "num")} className="text-xs font-bold text-accent uppercase tracking-widest">
                      {copied === "num" ? "Copied" : "Copy"}
                   </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-4 rounded-lg bg-bg border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                   Reference Code
                </span>
                <div className="flex items-center justify-between">
                   <span className="text-lg font-mono font-bold text-accent">{reference}</span>
                   <button onClick={() => copy(reference, "ref")} className="text-xs font-bold text-accent uppercase tracking-widest">
                      {copied === "ref" ? "Copied" : "Copy"}
                   </button>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed text-text-secondary uppercase tracking-wider text-center pt-2">
                Use your {active.name} app or dial {active.ussd} to send the payment.
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary">
              3 · Verification
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-1">Your Number</label>
                <input
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-1">Transaction ID</label>
                <input
                  value={trx}
                  onChange={(e) => setTrx(e.target.value.toUpperCase())}
                  placeholder="TRX123456"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-accent outline-none transition-colors uppercase font-mono"
                />
              </div>
            </div>

            {error && <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>}

            <button
              onClick={() => void submit()}
              disabled={busy}
              className="btn-primary w-full mt-8 py-4 gap-3 text-lg"
            >
              {busy ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Confirm Payment
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6 border-accent/20">
            <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
               <PlatformLogo slug={item.platform} size={48} />
               <div>
                  <p className="text-sm font-bold text-text-primary uppercase tracking-widest">{item.title}</p>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">{item.subtitle}</p>
               </div>
            </div>

            <div className="space-y-4">
               <SummaryRow label="Plan" value={item.planLabel} />
               <SummaryRow label="Validity" value={item.validity} />
               <SummaryRow label="Method" value={active.name} />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
               <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.3em]">Total</span>
               <span className="text-2xl font-bold text-accent">{item.price}</span>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-bg/95 backdrop-blur-md p-6"
          >
            <div className="card max-w-md w-full p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-6 border border-accent/20">
                 <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Order Placed</h3>
              <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                Reference <span className="text-accent font-mono font-bold">{placed}</span> has been received. 
                We are verifying your transaction. Credentials will appear in your orders dashboard soon.
              </p>
              <div className="mt-10 space-y-3">
                <Link href="/orders" className="btn-primary w-full py-4 uppercase tracking-widest text-xs">
                  My Orders
                </Link>
                <Link href="/" className="btn-secondary w-full py-4 uppercase tracking-widest text-xs">
                  Keep Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
      <span className="text-text-secondary opacity-50">{label}</span>
      <span className="text-text-primary">{value}</span>
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
