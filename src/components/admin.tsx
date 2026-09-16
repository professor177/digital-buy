"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Gamepad2,
  KeyRound,
  Library,
  LogOut,
  Pencil,
  Plus,
  PowerCircle,
  RefreshCcw,
  ShieldX,
  Trash2,
  Tv,
  X,
} from "lucide-react";
import { bdt, PRICE_COMING_SOON } from "@/lib/shared";

/* ---------- types mirroring API rows ---------- */
interface AdminOrder {
  id: string;
  itemType: string;
  itemId: number;
  accountType: string | null;
  itemLabel: string;
  paymentMethod: "bkash" | "nagad";
  transactionId: string;
  amountBdt: number;
  referralCode: string;
  status: "pending" | "verified" | "rejected";
  credentials: string | null;
  adminNote: string | null;
  createdAt: string;
  userPhone: string;
  userNickname: string | null;
}

interface AdminGame {
  id: number;
  platform: "steam" | "xbox";
  accountType: "shared" | "personal";
  title: string;
  thumbnail: string;
  trailerUrl: string | null;
  description: string;
  priceBdt: number | null;
  referralCode: string;
  active: boolean;
  sortOrder: number;
}

interface AdminPlatform {
  id: number;
  name: string;
  slug: string;
  introMedia: string;
  tagline: string;
  active: boolean;
}

interface AdminPackage {
  id: number;
  platformId: number;
  title: string;
  thumbnail: string;
  details: string;
  priceBdt: number | null;
  referralCode: string;
  active: boolean;
}

interface AdminUbisoft {
  id: number;
  title: string;
  tagline: string;
  description: string;
  includes: string[];
  media: string;
  trailerUrl: string | null;
  priceBdt: number;
}

/* ---------- shared form primitives ---------- */
function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow mb-1.5 block">{children}</span>;
}

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}

function StatusChip({ status }: { status: "pending" | "verified" | "rejected" }) {
  const map = {
    pending: "border-amber-500/40 text-amber-300",
    verified: "border-brand/40 text-brand",
    rejected: "border-red-500/40 text-red-300",
  } as const;
  return <span className={`chip ${map[status]}`}>{status}</span>;
}

/* ---------- login ---------- */
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(
          body?.error === "admin_not_configured"
            ? "ADMIN_KEY is not set in the environment yet."
            : "That key is not correct.",
        );
        return;
      }
      onSuccess();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-line bg-panel p-8">
      <KeyRound size={24} className="text-brand" />
      <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
        Admin access
      </h1>
      <p className="mt-2 text-sm leading-6 text-fog">
        Enter the admin key configured for this deployment.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          className="field"
          placeholder="Admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <ErrorNote message={error} />
        <button disabled={busy} className="btn btn-brand w-full px-5 py-3 text-sm">
          {busy ? "Checking..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export function AdminApp({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [tab, setTab] = useState<TabId>("orders");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {(
            [
              { id: "orders", label: "Orders", icon: CircleDollarSign },
              { id: "games", label: "Games", icon: Gamepad2 },
              { id: "ott", label: "OTT", icon: Tv },
              { id: "ubisoft", label: "Ubisoft rental", icon: Library },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`btn px-4 py-2 text-[13px] ${
                tab === t.id ? "btn-brand" : "btn-dark"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
          <button
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" });
              setAuthed(false);
            }}
            className="btn btn-outline px-3 py-2 text-[13px]"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
      <div className="mt-8">
        {tab === "orders" && <OrdersPanel />}
        {tab === "games" && <GamesPanel />}
        {tab === "ott" && <OttPanel />}
        {tab === "ubisoft" && <UbisoftPanel />}
      </div>
    </div>
  );
}

type TabId = "orders" | "games" | "ott" | "ubisoft";

/* ---------- orders ---------- */
function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [credentials, setCredentials] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function act(id: string, action: "verify" | "reject") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, credentials, note }),
      });
      const body = (await res.json().catch(() => null)) as {
        order?: AdminOrder;
        error?: string;
      } | null;
      if (!res.ok || !body?.order) {
        setError(
          body?.error === "credentials_required"
            ? "Enter the account credentials before verifying."
            : "Action failed. Try again.",
        );
        return;
      }
      setOrders((prev) => prev.map((o) => (o.id === id ? body.order! : o)));
      setCredentials("");
      setNote("");
      setExpanded(null);
    } catch {
      setError("Action failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const visible = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "pending", "verified", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn px-3.5 py-1.5 text-xs capitalize ${
              filter === f ? "btn-brand" : "btn-dark"
            }`}
          >
            {f}
          </button>
        ))}
        <button onClick={refresh} className="btn btn-outline ml-auto px-3 py-1.5 text-xs">
          <RefreshCcw size={13} /> Refresh
        </button>
      </div>

      <ErrorNote message={error} />

      {loading ? (
        <p className="py-10 text-center text-sm text-fog">Loading orders...</p>
      ) : visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line py-10 text-center text-sm text-fog">
          No {filter === "all" ? "" : filter} orders.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <div key={o.id} className="rounded-lg border border-line bg-panel p-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="min-w-40">
                  <p className="font-bold text-white">{o.itemLabel}</p>
                  <p className="mt-0.5 text-xs text-fog">
                    {o.userNickname ? `${o.userNickname} | ` : ""}
                    {o.userPhone}
                    {o.accountType ? ` | ${o.accountType}` : ""}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-fog">
                  {o.paymentMethod === "bkash" ? "bKash" : "Nagad"}
                </span>
                <span className="font-mono text-xs text-mist">{o.transactionId}</span>
                <span className="text-sm font-extrabold text-brand">{bdt(o.amountBdt)}</span>
                <StatusChip status={o.status} />
                <button
                  onClick={() => {
                    setExpanded(expanded === o.id ? null : o.id);
                    setCredentials(o.credentials ?? "");
                    setNote(o.adminNote ?? "");
                  }}
                  className="btn btn-dark ml-auto px-3 py-1.5 text-xs"
                >
                  {expanded === o.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {expanded === o.id ? "Close" : "Review"}
                </button>
              </div>
              {expanded === o.id && (
                <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
                  <div>
                    <Label>Credentials revealed to the buyer on verify</Label>
                    <textarea
                      className="field min-h-24 font-mono text-xs"
                      placeholder={"e.g.\nEmail: user@example.com\nPassword: xxxxxxxx"}
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                    />
                    <div className="mt-3">
                      <Label>Internal note (optional)</Label>
                      <input
                        className="field text-sm"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Only visible to admins"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-fog">
                    <p>
                      Placed{" "}
                      {new Date(o.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      | Ref {o.referralCode}
                    </p>
                    <p className="text-xs leading-5 text-fog/70">
                      Verify only after the TrxID appears in your bKash or Nagad
                      merchant statement with the exact amount. The buyer sees
                      the credentials instantly on this order once verified.
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button
                        disabled={busy}
                        onClick={() => act(o.id, "verify")}
                        className="btn btn-brand flex-1 px-4 py-2.5 text-sm"
                      >
                        <BadgeCheck size={15} /> Verify and reveal
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => act(o.id, "reject")}
                        className="btn btn-outline flex-1 px-4 py-2.5 text-sm hover:border-red-500/60 hover:text-red-300"
                      >
                        <ShieldX size={15} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- games ---------- */
const emptyGame: Omit<AdminGame, "id" | "referralCode" | "active" | "sortOrder"> = {
  platform: "steam",
  accountType: "shared",
  title: "",
  thumbnail: "",
  trailerUrl: "",
  description: "",
  priceBdt: null,
};

function GameForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: AdminGame | null;
  onClose: () => void;
  onSaved: (g: AdminGame) => void;
}) {
  const [form, setForm] = useState({ ...emptyGame, ...(initial ?? {}) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "game",
          ...(initial ? { id: initial.id } : {}),
          data: { ...form, priceBdt: form.priceBdt ?? null },
        }),
      });
      const body = (await res.json().catch(() => null)) as AdminGame | { error?: string } | null;
      if (!res.ok || !body || "error" in body) {
        setError("Save failed. Title is required; check the fields and retry.");
        return;
      }
      onSaved(body as AdminGame);
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={save} className="mb-6 rounded-lg border border-brand/30 bg-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-extrabold text-white">{initial ? "Edit game" : "Add game"}</p>
        <button type="button" onClick={onClose} className="btn btn-dark px-2.5 py-1.5 text-xs">
          <X size={13} /> Cancel
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Platform</Label>
          <select
            className="field"
            value={form.platform}
            onChange={(e) => set("platform", e.target.value)}
          >
            <option value="steam">Steam</option>
            <option value="xbox">Xbox</option>
          </select>
        </div>
        <div>
          <Label>Account type</Label>
          <select
            className="field"
            value={form.accountType}
            onChange={(e) => set("accountType", e.target.value)}
          >
            <option value="shared">Shared</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Thumbnail URL</Label>
          <input className="field text-xs" value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Trailer video URL (optional)</Label>
          <input className="field text-xs" value={form.trailerUrl ?? ""} onChange={(e) => set("trailerUrl", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <textarea className="field min-h-20" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <Label>Price in ৳ (blank = shows coming soon)</Label>
          <input
            className="field"
            inputMode="numeric"
            value={form.priceBdt ?? ""}
            onChange={(e) =>
              set("priceBdt", e.target.value === "" ? null : Number(e.target.value.replace(/\D/g, "")))
            }
          />
        </div>
      </div>
      <ErrorNote message={error} />
      <button disabled={busy} className="btn btn-brand mt-5 px-6 py-2.5 text-sm">
        {busy ? "Saving..." : "Save game"}
      </button>
    </form>
  );
}

function GamesPanel() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminGame | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog?entity=games", { cache: "no-store" });
      if (res.ok) setGames(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function remove(id: number) {
    if (!window.confirm("Delete this game? Buyers with existing orders keep their order records.")) return;
    const res = await fetch("/api/admin/catalog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "game", id }),
    });
    if (!res.ok) setError("Delete failed.");
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-fog">
          {games.length} games. Referral codes generate automatically from the title.
        </p>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="btn btn-brand ml-auto px-4 py-2 text-xs">
          <Plus size={13} /> Add game
        </button>
      </div>
      <ErrorNote message={error} />
      {creating && (
        <GameForm
          initial={null}
          onClose={() => setCreating(false)}
          onSaved={(g) => {
            setGames((prev) => [...prev, g]);
            setCreating(false);
          }}
        />
      )}
      {editing && (
        <GameForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(g) => {
            setGames((prev) => prev.map((x) => (x.id === g.id ? g : x)));
            setEditing(null);
          }}
        />
      )}
      {loading ? (
        <p className="py-10 text-center text-sm text-fog">Loading games...</p>
      ) : (
        <div className="space-y-2">
          {games.map((g) => (
            <div key={g.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3">
              <span className={`chip ${g.platform === "steam" ? "border-[#2a475e] text-[#66c0f4]" : "border-[#243524] text-[#9bf00b]"}`}>
                {g.platform}
              </span>
              <span className="chip">{g.accountType}</span>
              <span className="min-w-0 truncate font-bold text-white">{g.title}</span>
              <span className="text-xs text-fog">{g.priceBdt != null ? bdt(g.priceBdt) : PRICE_COMING_SOON}</span>
              <span className="font-mono text-[11px] text-fog/70">{g.referralCode}</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => { setEditing(g); setCreating(false); }} className="btn btn-dark px-2.5 py-1.5 text-xs" title="Edit">
                  <Pencil size={12} />
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/admin/catalog", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ entity: "game", id: g.id, data: { active: !g.active } }),
                    });
                    if (res.ok) setGames((prev) => prev.map((x) => (x.id === g.id ? { ...x, active: !g.active } : x)));
                  }}
                  className="btn btn-dark px-2.5 py-1.5 text-xs"
                  title={g.active ? "Hide from store" : "Show in store"}
                >
                  <PowerCircle size={12} className={g.active ? "text-brand" : "text-fog/50"} />
                </button>
                <button onClick={() => remove(g.id)} className="btn btn-dark px-2.5 py-1.5 text-xs hover:border-red-500/60" title="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- OTT ---------- */
function OttPanel() {
  const [platforms, setPlatforms] = useState<AdminPlatform[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformForm, setPlatformForm] = useState<{ id: number | null; name: string; introMedia: string; tagline: string } | null>(null);
  const [packageForm, setPackageForm] = useState<{ id: number | null; platformId: number; title: string; thumbnail: string; details: string; priceBdt: number | null } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog?entity=platforms", { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as { platforms: AdminPlatform[]; packages: AdminPackage[] };
        setPlatforms(body.platforms);
        setPackages(body.packages);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function savePlatform(e: React.FormEvent) {
    e.preventDefault();
    if (!platformForm) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: platformForm.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "platform",
          ...(platformForm.id ? { id: platformForm.id } : {}),
          data: { name: platformForm.name, introMedia: platformForm.introMedia, tagline: platformForm.tagline },
        }),
      });
      if (!res.ok) throw new Error();
      setPlatformForm(null);
      await refresh();
    } catch {
      setError("Platform save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function savePackage(e: React.FormEvent) {
    e.preventDefault();
    if (!packageForm) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: packageForm.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "package",
          ...(packageForm.id ? { id: packageForm.id } : {}),
          data: {
            platformId: packageForm.platformId,
            title: packageForm.title,
            thumbnail: packageForm.thumbnail,
            details: packageForm.details,
            priceBdt: packageForm.priceBdt,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setPackageForm(null);
      await refresh();
    } catch {
      setError("Package save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(entity: "platform" | "package", id: number) {
    const warn =
      entity === "platform"
        ? "Delete this platform and ALL its packages?"
        : "Delete this package?";
    if (!window.confirm(warn)) return;
    await fetch("/api/admin/catalog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, id }),
    });
    await refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-fog">
          {platforms.length} platforms, {packages.length} packages.
        </p>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setPlatformForm({ id: null, name: "", introMedia: "", tagline: "" })}
            className="btn btn-dark px-4 py-2 text-xs"
          >
            <Plus size={13} /> Platform
          </button>
          <button
            onClick={() => {
              if (platforms.length === 0) {
                setError("Add a platform first, then its packages.");
                return;
              }
              setError(null);
              setPackageForm({ id: null, platformId: platforms[0].id, title: "", thumbnail: "", details: "", priceBdt: null });
            }}
            className="btn btn-brand px-4 py-2 text-xs"
          >
            <Plus size={13} /> Package
          </button>
        </div>
      </div>
      <ErrorNote message={error} />

      {platformForm && (
        <form onSubmit={savePlatform} className="mb-6 rounded-lg border border-brand/30 bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-extrabold text-white">{platformForm.id ? "Edit platform" : "Add platform"}</p>
            <button type="button" onClick={() => setPlatformForm(null)} className="btn btn-dark px-2.5 py-1.5 text-xs">
              <X size={13} /> Cancel
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <input className="field" value={platformForm.name} onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Tagline</Label>
              <input className="field" value={platformForm.tagline} onChange={(e) => setPlatformForm({ ...platformForm, tagline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Intro image or video URL</Label>
              <input className="field text-xs" value={platformForm.introMedia} onChange={(e) => setPlatformForm({ ...platformForm, introMedia: e.target.value })} />
            </div>
          </div>
          <button disabled={busy} className="btn btn-brand mt-5 px-6 py-2.5 text-sm">
            {busy ? "Saving..." : "Save platform"}
          </button>
        </form>
      )}

      {packageForm && (
        <form onSubmit={savePackage} className="mb-6 rounded-lg border border-brand/30 bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-extrabold text-white">{packageForm.id ? "Edit package" : "Add package"}</p>
            <button type="button" onClick={() => setPackageForm(null)} className="btn btn-dark px-2.5 py-1.5 text-xs">
              <X size={13} /> Cancel
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Platform</Label>
              <select
                className="field"
                value={packageForm.platformId}
                onChange={(e) => setPackageForm({ ...packageForm, platformId: Number(e.target.value) })}
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Price in ৳ (blank = shows coming soon)</Label>
              <input
                className="field"
                inputMode="numeric"
                value={packageForm.priceBdt ?? ""}
                onChange={(e) =>
                  setPackageForm({
                    ...packageForm,
                    priceBdt: e.target.value === "" ? null : Number(e.target.value.replace(/\D/g, "")),
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Package title</Label>
              <input className="field" value={packageForm.title} onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Thumbnail URL</Label>
              <input className="field text-xs" value={packageForm.thumbnail} onChange={(e) => setPackageForm({ ...packageForm, thumbnail: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Details</Label>
              <textarea className="field min-h-16" value={packageForm.details} onChange={(e) => setPackageForm({ ...packageForm, details: e.target.value })} />
            </div>
          </div>
          <button disabled={busy} className="btn btn-brand mt-5 px-6 py-2.5 text-sm">
            {busy ? "Saving..." : "Save package"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-fog">Loading OTT catalog...</p>
      ) : (
        <div className="space-y-6">
          {platforms.map((p) => {
            const pkgs = packages.filter((x) => x.platformId === p.id);
            return (
              <div key={p.id} className="rounded-lg border border-line bg-panel p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-editorial text-2xl italic text-white">{p.name}</span>
                  <span className="font-mono text-xs text-fog">/{p.slug}</span>
                  <span className="text-xs text-fog">{pkgs.length} packages</span>
                  <div className="ml-auto flex gap-1.5">
                    <button
                      onClick={() => setPlatformForm({ id: p.id, name: p.name, introMedia: p.introMedia, tagline: p.tagline })}
                      className="btn btn-dark px-2.5 py-1.5 text-xs"
                      title="Edit platform"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => remove("platform", p.id)}
                      className="btn btn-dark px-2.5 py-1.5 text-xs hover:border-red-500/60"
                      title="Delete platform"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {pkgs.length === 0 && (
                    <p className="rounded-md border border-dashed border-line px-3 py-2 text-xs text-fog">
                      No packages yet for {p.name}.
                    </p>
                  )}
                  {pkgs.map((pkg) => (
                    <div key={pkg.id} className="flex flex-wrap items-center gap-3 rounded-md border border-line/70 bg-panel2 px-3 py-2">
                      <span className="font-semibold text-white">{pkg.title}</span>
                      <span className="text-xs text-fog">{pkg.priceBdt != null ? bdt(pkg.priceBdt) : PRICE_COMING_SOON}</span>
                      <span className="font-mono text-[11px] text-fog/70">{pkg.referralCode}</span>
                      <div className="ml-auto flex gap-1.5">
                        <button
                          onClick={() =>
                            setPackageForm({
                              id: pkg.id,
                              platformId: pkg.platformId,
                              title: pkg.title,
                              thumbnail: pkg.thumbnail,
                              details: pkg.details,
                              priceBdt: pkg.priceBdt,
                            })
                          }
                          className="btn btn-dark px-2.5 py-1.5 text-xs"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => remove("package", pkg.id)}
                          className="btn btn-dark px-2.5 py-1.5 text-xs hover:border-red-500/60"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- ubisoft ---------- */
function UbisoftPanel() {
  const [rental, setRental] = useState<AdminUbisoft | null>(null);
  const [creating, setCreating] = useState(false);
  const [includesText, setIncludesText] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/catalog?entity=ubisoft", { cache: "no-store" });
        if (res.ok) {
          const body = (await res.json()) as AdminUbisoft | null;
          if (body) {
            setRental(body);
            setIncludesText(body.includes.join("\n"));
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!rental) return;
    setBusy(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: creating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "ubisoft",
          ...(creating ? {} : { id: rental.id }),
          data: {
            title: rental.title,
            tagline: rental.tagline,
            description: rental.description,
            media: rental.media,
            trailerUrl: rental.trailerUrl,
            priceBdt: rental.priceBdt,
            includes: includesText.split("\n").map((s) => s.trim()).filter(Boolean),
          },
        }),
      });
      const body = (await res.json().catch(() => null)) as AdminUbisoft | null;
      if (!res.ok || !body) throw new Error();
      setRental(body);
      setCreating(false);
      setIncludesText(body.includes.join("\n"));
      setSaved(true);
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-fog">Loading rental...</p>;
  if (!rental) {
    return (
      <div className="max-w-2xl rounded-lg border border-dashed border-line bg-panel/50 px-6 py-14 text-center">
        <p className="font-extrabold text-white">No Ubisoft rental listed yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-fog">
          Create the single rental record here. It will go live on the Ubisoft
          page immediately.
        </p>
        <button
          onClick={() => {
            setRental({
              id: 0,
              title: "Ubisoft Library Pass",
              tagline: "Full library. One account. 30 days.",
              description: "",
              includes: [],
              media: "",
              trailerUrl: null,
              priceBdt: 150,
            });
            setIncludesText("");
            setCreating(true);
          }}
          className="btn btn-brand mt-6 px-5 py-2.5 text-sm"
        >
          <Plus size={15} /> Create the rental
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="max-w-2xl rounded-lg border border-line bg-panel p-6">
      <p className="font-extrabold text-white">Ubisoft library rental</p>
      <p className="mt-1 text-xs text-fog">This is a single record. Editing it updates the live rental page.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <input className="field" value={rental.title} onChange={(e) => setRental({ ...rental, title: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Tagline</Label>
          <input className="field" value={rental.tagline} onChange={(e) => setRental({ ...rental, tagline: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <textarea className="field min-h-24" value={rental.description} onChange={(e) => setRental({ ...rental, description: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Included (one per line)</Label>
          <textarea className="field min-h-28 font-mono text-xs" value={includesText} onChange={(e) => setIncludesText(e.target.value)} />
        </div>
        <div>
          <Label>Media URL (image or path)</Label>
          <input className="field text-xs" value={rental.media} onChange={(e) => setRental({ ...rental, media: e.target.value })} />
        </div>
        <div>
          <Label>Trailer video URL</Label>
          <input className="field text-xs" value={rental.trailerUrl ?? ""} onChange={(e) => setRental({ ...rental, trailerUrl: e.target.value })} />
        </div>
        <div>
          <Label>Monthly price in ৳</Label>
          <input
            className="field"
            inputMode="numeric"
            value={rental.priceBdt}
            onChange={(e) => setRental({ ...rental, priceBdt: Number(e.target.value.replace(/\D/g, "")) || 0 })}
          />
        </div>
      </div>
      <ErrorNote message={error} />
      <button disabled={busy} className="btn btn-brand mt-6 px-6 py-2.5 text-sm">
        {busy ? "Saving..." : saved ? "Saved" : "Save rental"}
      </button>
    </form>
  );
}
