"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  PackageOpen,
  XCircle,
} from "lucide-react";

import PlatformLogo from "@/components/brand/PlatformLogo";
import { useAuth } from "@/components/auth/AuthProvider";

type OrderRow = {
  id: number;
  reference: string;
  productType: string;
  productSlug: string;
  productTitle: string;
  mode: string;
  platform: string | null;
  planLabel: string | null;
  validity: string;
  priceLabel: string;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  note: string | null;
  hasCredentials?: boolean;
  createdAt: string;
};

type Credentials = { email: string; password: string };

const TABS = [
  { key: "success", label: "Successful", icon: CheckCircle2, color: "#a3e635" },
  { key: "pending", label: "Pending", icon: Clock, color: "#fbbf24" },
  { key: "failed", label: "Failed", icon: XCircle, color: "#fb7185" },
] as const;

export default function OrdersPage() {
  const { user, loading: authLoading, openAuth } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("success");
  const [creds, setCreds] = useState<Record<number, Credentials>>({});
  const [revealing, setRevealing] = useState<number | null>(null);
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) {
        setOrders([]);
        return;
      }
      const data = (await res.json()) as { orders: OrderRow[] };
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) void load();
    else setLoading(false);
  }, [user, load]);

  const grouped = useMemo(
    () => orders.filter((order) => order.status === tab),
    [orders, tab],
  );

  async function reveal(order: OrderRow) {
    if (creds[order.id]) {
      setShown((prev) => ({ ...prev, [order.id]: !prev[order.id] }));
      return;
    }
    setRevealing(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}/credentials`);
      const data = (await res.json()) as {
        ok: boolean;
        email?: string;
        password?: string;
      };
      if (data.ok && data.email) {
        setCreds((prev) => ({
          ...prev,
          [order.id]: { email: data.email!, password: data.password ?? "" },
        }));
        setShown((prev) => ({ ...prev, [order.id]: true }));
      }
    } finally {
      setRevealing(null);
    }
  }

  function copy(value: string, key: string) {
    void navigator.clipboard?.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  }

  if (!authLoading && !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <PackageOpen size={44} className="mb-4 text-white/30" />
        <h1 className="text-2xl font-semibold">Your orders live here</h1>
        <p className="mt-2 text-sm text-white/50">
          Sign in with Google or your phone number to see purchased accounts and
          credentials.
        </p>
        <button
          onClick={openAuth}
          className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 px-6 py-3 text-sm font-semibold text-black"
        >
          Login / Create account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-semibold tracking-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          My <span className="text-gradient">Orders</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Delivered credentials, pending verifications and failed attempts.
        </p>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const count = orders.filter((order) => order.status === item.key).length;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm transition ${
                active
                  ? "border-white/35 bg-white/10"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25"
              }`}
              style={active ? { boxShadow: `0 16px 50px -28px ${item.color}` } : undefined}
            >
              <Icon size={15} style={{ color: item.color }} />
              {item.label}
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="glass flex items-center justify-center gap-3 rounded-3xl p-14 text-sm text-white/50">
            <Loader2 className="animate-spin" size={16} /> Loading your orders…
          </div>
        ) : grouped.length === 0 ? (
          <div className="glass rounded-3xl p-14 text-center">
            <p className="text-sm text-white/50">No {tab} orders yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm transition hover:bg-white/10"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {grouped.map((order, index) => {
              const credential = creds[order.id];
              const visible = shown[order.id];
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  className="glass overflow-hidden rounded-3xl"
                >
                  <div className="flex flex-wrap items-start gap-4 p-5">
                    <PlatformLogo slug={order.platform ?? order.productSlug} size={46} />

                    <div className="min-w-[200px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-semibold">{order.productTitle}</h3>
                        <StatusPill status={order.status} />
                      </div>
                      <p className="mt-1 text-xs text-white/45">
                        Ref {order.reference} · {order.mode} ·{" "}
                        {order.validity} · paid via {order.paymentMethod}
                        {order.transactionId ? ` · TrxID ${order.transactionId}` : ""}
                      </p>
                      {order.note ? (
                        <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/50">
                          {order.note}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-gradient">{order.priceLabel}</p>
                      <p className="text-[11px] text-white/35">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {order.status === "success" ? (
                    <div className="border-t border-white/10 bg-white/[0.02] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                          Account credentials
                        </p>
                        <button
                          onClick={() => void reveal(order)}
                          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs transition hover:bg-white/10"
                        >
                          {revealing === order.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : visible ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                          {visible ? "Hide" : "Click to reveal"}
                        </button>
                      </div>

                      <AnimatePresence>
                        {credential && visible ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0, filter: "blur(8px)" }}
                            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                            exit={{ opacity: 0, height: 0, filter: "blur(8px)" }}
                            className="mt-3 grid gap-2 sm:grid-cols-2"
                          >
                            <CredField
                              label="Email / Username"
                              value={credential.email}
                              copied={copied === `e${order.id}`}
                              onCopy={() => copy(credential.email, `e${order.id}`)}
                            />
                            <CredField
                              label="Password"
                              value={credential.password}
                              copied={copied === `p${order.id}`}
                              onCopy={() => copy(credential.password, `p${order.id}`)}
                            />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    success: { label: "Delivered", className: "bg-lime-400/15 text-lime-300 border-lime-400/30" },
    pending: { label: "Pending", className: "bg-amber-400/15 text-amber-300 border-amber-400/30" },
    failed: { label: "Failed", className: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  };
  const info = map[status] ?? map.pending;
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${info.className}`}>
      {info.label}
    </span>
  );
}

function CredField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-widest text-white/40">
          {label}
        </span>
        <span className="block truncate font-mono text-sm">{value}</span>
      </span>
      <button
        onClick={onCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] transition hover:bg-white/20"
      >
        <Copy size={12} /> {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
