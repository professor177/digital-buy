"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  Copy,
  Check,
  LogIn,
  Send,
  ShieldAlert,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  bdt,
  isValidTxnId,
  paymentNumbers,
  PRICE_COMING_SOON,
  type AccountMode,
  type ItemType,
  type OrderDto,
  type PaymentMethod,
} from "@/lib/shared";
import { VerifyEmailCard } from "@/components/verify-email";

interface BuyBoxProps {
  itemType: ItemType;
  itemId: number;
  title: string;
  priceBdt: number | null;
  referralCode: string;
  mode: AccountMode | null;
  authed: boolean;
  nextPath: string;
}

const METHODS: Array<{ id: PaymentMethod; label: string; color: string }> = [
  { id: "bkash", label: "bKash", color: "#e2136e" },
  { id: "nagad", label: "Nagad", color: "#f6921e" },
];

function OrderStatePanel({ order }: { order: OrderDto }) {
  const [copied, setCopied] = useState(false);
  if (order.status === "pending") {
    return (
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-amber-200">
          <Clock3 size={16} /> Verification in progress
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-200/70">
          We received your TrxID{" "}
          <span className="font-mono font-bold">{order.transactionId}</span>{" "}
          and are matching it manually. Track it any time in My Orders.
        </p>
        <Link
          href="/orders"
          className="btn btn-dark mt-4 w-full px-4 py-2.5 text-sm"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }
  if (order.status === "verified") {
    return (
      <div className="rounded-md border border-brand/30 bg-brand/10 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-brand">
          <BadgeCheck size={16} /> Verified. Access delivered.
        </p>
        {order.credentials && (
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-brand/20 bg-ink px-3 py-2.5 font-mono text-[13px] leading-6 text-mist">
              {order.credentials}
            </code>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(order.credentials ?? "");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  /* noop */
                }
              }}
              className="btn btn-dark shrink-0 px-2.5 py-1.5 text-xs"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
        <Link
          href="/orders"
          className="btn btn-dark mt-4 w-full px-4 py-2.5 text-sm"
        >
          View in My Orders
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-red-300">
        <XCircle size={16} /> Previous attempt could not be verified
      </p>
      <p className="mt-2 text-sm leading-6 text-red-300/70">
        The TrxID did not match our records. You can place a fresh order below
        with the correct details.
      </p>
    </div>
  );
}

export function BuyBox({
  itemType,
  itemId,
  title,
  priceBdt,
  referralCode,
  mode,
  authed,
  nextPath,
}: BuyBoxProps) {
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [txn, setTxn] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(authed);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [me, setMe] = useState<{
    email: string | null;
    emailVerified: boolean;
  } | null>(null);

  const loadExisting = useCallback(async () => {
    if (!authed) return;
    setLoadingOrder(true);
    try {
      // /api/me re-reads emailVerified fresh from Firebase on every call.
      const [meRes, ordersRes] = await Promise.all([
        fetch("/api/me", { cache: "no-store" }),
        fetch("/api/orders", { cache: "no-store" }),
      ]);
      if (meRes.ok) {
        const body = (await meRes.json()) as {
          user: { email: string | null; emailVerified: boolean };
        };
        setMe({ email: body.user.email, emailVerified: body.user.emailVerified });
      }
      if (ordersRes.ok) {
        const list = (await ordersRes.json()) as OrderDto[];
        const match = list.find(
          (o) =>
            o.itemType === itemType &&
            o.itemId === itemId &&
            (!mode || !o.accountType || o.accountType === mode),
        );
        setOrder(match ?? null);
      }
    } catch {
      /* keep form usable */
    } finally {
      setLoadingOrder(false);
    }
  }, [authed, itemType, itemId, mode]);

  useEffect(() => {
    void loadExisting();
  }, [loadExisting]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidTxnId(txn)) {
      setError(
        "Enter the Transaction ID exactly as it appears in your payment confirmation (6 to 32 letters or digits).",
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          itemId,
          paymentMethod: method,
          transactionId: txn.trim(),
          accountType: mode,
        }),
      });
      const body = (await res.json().catch(() => null)) as
        | { order?: OrderDto; error?: string }
        | null;
      if (res.status === 403 && body?.error === "email_unverified") {
        setMe((prev) => ({
          email: prev?.email ?? null,
          emailVerified: false,
        }));
        return;
      }
      if (res.status === 409) {
        await loadExisting();
        setRetrying(false);
        return;
      }
      if (!res.ok || !body?.order) {
        throw new Error(body?.error ?? "failed");
      }
      setOrder(body.order);
      setTxn("");
      setRetrying(false);
    } catch {
      setError("Could not submit the order right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /* Price not announced yet */
  if (priceBdt == null) {
    return (
      <div className="rounded-md border border-line bg-ink p-6 text-center">
        <p className="text-2xl font-extrabold tracking-tight text-white">
          {PRICE_COMING_SOON}
        </p>
        <p className="mt-2 text-sm leading-6 text-fog">
          Pricing for this item is being finalized. Message support and we
          will tell you as soon as it goes on sale.
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div>
        <div className="flex items-center justify-between rounded-md border border-line bg-ink px-4 py-3">
          <span className="text-sm font-semibold text-fog">Price</span>
          <span className="text-xl font-extrabold text-brand">
            {bdt(priceBdt)}
          </span>
        </div>
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="btn btn-brand mt-4 w-full px-5 py-3 text-sm"
        >
          <LogIn size={16} /> Sign in to buy
        </Link>
        <p className="mt-3 text-center text-xs leading-5 text-fog/70">
          Use your Digital Buy email and password. New here? Account creation
          takes a minute.
        </p>
      </div>
    );
  }

  if (loadingOrder) {
    return (
      <div className="space-y-3">
        <div className="h-14 animate-pulse rounded-md bg-panel2" />
        <div className="h-24 animate-pulse rounded-md bg-panel2" />
      </div>
    );
  }

  // Verified email is required before any purchase can be submitted.
  if (me && !me.emailVerified) {
    return (
      <VerifyEmailCard
        email={me.email ?? ""}
        onVerified={() => loadExisting()}
      />
    );
  }

  const showForm = order == null || (order.status === "rejected" && retrying);

  return (
    <div>
      {order && !showForm && <OrderStatePanel order={order} />}
      {order?.status === "rejected" && !retrying && (
        <button
          type="button"
          onClick={() => {
            setRetrying(true);
            setError(null);
          }}
          className="btn btn-dark mt-3 w-full px-4 py-2.5 text-sm"
        >
          Try again with a corrected TrxID
        </button>
      )}
      {showForm && (
        <form onSubmit={submit}>
          <p className="eyebrow mb-2">1. Choose payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`btn px-4 py-3 text-sm ${
                  method === m.id ? "text-white" : "btn-dark"
                }`}
                style={
                  method === m.id
                    ? { background: m.color, borderColor: m.color }
                    : undefined
                }
              >
                <Wallet size={15} /> {m.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-line bg-ink p-4">
            <p className="eyebrow mb-2">2. Send the payment</p>
            <p className="text-sm leading-6 text-mist">
              Send{" "}
              <span className="font-extrabold text-white">
                {bdt(priceBdt)}
              </span>{" "}
              to{" "}
              <span className="font-mono font-extrabold text-white">
                {paymentNumbers[method] || "our merchant number"}
              </span>{" "}
              using {method === "bkash" ? "bKash" : "Nagad"} Send Money. Quote
              ref{" "}
              <span className="font-mono font-bold text-brand">
                {referralCode}
              </span>{" "}
              in the payment note if your app allows it.
            </p>
            {!paymentNumbers[method] && (
              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-amber-300/90">
                <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                The merchant number for this method is not configured on this
                deployment yet. Ask support for the current number before
                sending money.
              </p>
            )}
          </div>

          <div className="mt-4">
            <p className="eyebrow mb-2">3. Submit your TrxID</p>
            <input
              value={txn}
              onChange={(e) => setTxn(e.target.value)}
              placeholder="e.g. 9HXK2LM4P1"
              className="field font-mono"
              maxLength={32}
              autoComplete="off"
            />
            <p className="mt-2 text-xs leading-5 text-fog/70">
              Buying: {title}
              {mode ? ` (${mode} account)` : ""}. Credentials are revealed
              here and in My Orders after verification.
            </p>
          </div>

          {error && (
            <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-brand mt-4 w-full px-5 py-3 text-sm"
          >
            <Send size={15} />
            {busy ? "Submitting..." : `Submit for verification | ${bdt(priceBdt)}`}
          </button>
        </form>
      )}
    </div>
  );
}
