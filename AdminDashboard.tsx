"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  LogOut,
  Save,
  XCircle,
} from "lucide-react";

type OrderRow = {
  id: number;
  reference: string;
  productTitle: string;
  mode: string;
  platform: string | null;
  planLabel: string | null;
  priceLabel: string;
  paymentMethod: string;
  senderNumber: string | null;
  transactionId: string | null;
  status: "pending" | "success" | "failed" | string;
  note: string | null;
  credentialEmail: string | null;
  credentialPassword: string | null;
  createdAt: string;
  buyerName: string;
  buyerEmail: string | null;
  buyerPhone: string | null;
};

type Tab = "pending" | "success" | "failed" | "all";

const TABS: { key: Tab; label: string; icon: typeof Clock; color: string }[] = [
  { key: "pending", label: "Pending", icon: Clock, color: "#fbbf24" },
  { key: "success", label: "Successful", icon: CheckCircle2, color: "#a3e635" },
  { key: "failed", label: "Failed", icon: XCircle, color: "#fb7185" },
  { key: "all", label: "All", icon: ChevronDown, color: "#94a3b8" },
];

export default function AdminDashboard({ username }: { username: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [openId, setOpenId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Partial<OrderRow>>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; orders?: OrderRow[]; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Could not load orders");
        return;
      }
      setOrders(data.orders ?? []);
    } catch {
      setError("Network error while loading orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab],
  );

  function updateDraft(id: number, patch: Partial<OrderRow>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function draftValue<K extends keyof OrderRow>(order: OrderRow, key: K): OrderRow[K] {
    return (drafts[order.id]?.[key] ?? order[key]) as OrderRow[K];
  }

  async function save(order: OrderRow) {
    setSavingId(order.id);
    setError(null);
    try {
      const patch = drafts[order.id] ?? {};
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { ok: boolean; order?: OrderRow; error?: string };
      if (!data.ok || !data.order) {
        setError(data.error ?? "Could not save changes");
        return;
      }
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order! : o)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[order.id];
        return next;
      });
      setSavedId(order.id);
      window.setTimeout(() => setSavedId((id) => (id === order.id ? null : id)), 1500);
    } catch {
      setError("Network error while saving.");
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Digital Buy</p>
            <h1 className="text-2xl font-semibold">Admin panel</h1>
            <p className="text-sm text-white/45">Logged in as {username}</p>
          </div>
          <button
            onClick={() => void logout()}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                tab === key
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 text-white/50 hover:text-white/80"
              }`}
            >
              <Icon size={14} color={color} />
              {label}
              {key !== "all" ? (
                <span className="text-white/30">
                  {orders.filter((o) => o.status === key).length}
                </span>
              ) : (
                <span className="text-white/30">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-white/40">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/40">No orders in this tab.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const isOpen = openId === order.id;
              const isDirty = Boolean(drafts[order.id]);
              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : order.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <p className="font-medium">{order.productTitle}</p>
                      <p className="text-xs text-white/45">
                        {order.reference} • {order.buyerName}
                        {order.buyerPhone ? ` • ${order.buyerPhone}` : ""}
                        {order.buyerEmail ? ` • ${order.buyerEmail}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill status={order.status} />
                      <ChevronDown
                        size={16}
                        className={`text-white/40 transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="space-y-4 border-t border-white/10 px-5 py-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Payment">
                          <p className="text-sm text-white/70">
                            {order.paymentMethod.toUpperCase()} • {order.senderNumber ?? "—"}
                          </p>
                        </Field>
                        <Field label="Transaction ID">
                          <p className="text-sm text-white/70">
                            {order.transactionId ?? "—"}
                          </p>
                        </Field>
                        <Field label="Price / plan">
                          <p className="text-sm text-white/70">
                            {order.priceLabel} • {order.planLabel ?? order.mode}
                          </p>
                        </Field>
                        <Field label="Status">
                          <select
                            value={draftValue(order, "status")}
                            onChange={(e) => updateDraft(order.id, { status: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                          >
                            <option value="pending">Pending</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                          </select>
                        </Field>
                      </div>

                      <Field label="Note shown to buyer">
                        <textarea
                          value={draftValue(order, "note") ?? ""}
                          onChange={(e) => updateDraft(order.id, { note: e.target.value })}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                          placeholder="e.g. Delivered. Do not change the password."
                        />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Credential email / username">
                          <input
                            value={draftValue(order, "credentialEmail") ?? ""}
                            onChange={(e) =>
                              updateDraft(order.id, { credentialEmail: e.target.value })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                            placeholder="account@mail.com"
                          />
                        </Field>
                        <Field label="Credential password">
                          <input
                            value={draftValue(order, "credentialPassword") ?? ""}
                            onChange={(e) =>
                              updateDraft(order.id, { credentialPassword: e.target.value })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/60"
                            placeholder="SuperSecret123"
                          />
                        </Field>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => void save(order)}
                          disabled={!isDirty || savingId === order.id}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-40"
                        >
                          <Save size={14} />
                          {savingId === order.id ? "Saving…" : "Save changes"}
                        </button>
                        {savedId === order.id ? (
                          <span className="text-xs text-lime-300">Saved</span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-white/50">{label}</p>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#fbbf24" },
    success: { label: "Success", color: "#a3e635" },
    failed: { label: "Failed", color: "#fb7185" },
  };
  const entry = map[status] ?? { label: status, color: "#94a3b8" };
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: `${entry.color}22`, color: entry.color }}
    >
      {entry.label}
    </span>
  );
}
