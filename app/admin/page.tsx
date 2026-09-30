import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { bdt } from "@/lib/fmt";
import Flash from "@/components/Flash";
import { setStatus, deliver, saveProduct, deleteProduct } from "@/app/actions";
export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";
const S = ["pending", "payment_submitted", "confirmed", "processing", "completed", "failed", "cancelled"];

function ProductForm({ p, platforms }: { p?: any; platforms: any[] }) {
  return (
    <form action={saveProduct} className="card">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="row"><input name="name" placeholder="Name" defaultValue={p?.name} required style={{ flex: 2 }} aria-label="Name" />
        <select name="platform_id" defaultValue={p?.platformId} aria-label="Platform">{platforms.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <select name="account_type" defaultValue={p?.accountType ?? "shared"} aria-label="Account type"><option>shared</option><option>personal</option></select>
        <select name="kind" defaultValue={p?.kind ?? "game_account"} aria-label="Kind"><option>game_account</option><option>library_rental</option><option>subscription</option></select></div>
      <div className="row"><input name="price_bdt" type="number" step="0.01" placeholder="Price BDT" defaultValue={p?.priceBdt} required aria-label="Price" />
        <input name="duration_days" type="number" placeholder="Days (empty = permanent)" defaultValue={p?.durationDays ?? ""} aria-label="Duration days" />
        <input name="stock" type="number" placeholder="Stock" defaultValue={p?.stock ?? 0} required aria-label="Stock" />
        <label><input type="checkbox" name="is_available" defaultChecked={p?.isAvailable ?? true} style={{ width: "auto" }} /> Available</label></div>
      <details><summary>More fields</summary>
        <input name="genre" placeholder="Genre" defaultValue={p?.genre ?? ""} /><input name="image_url" placeholder="Cover image URL" defaultValue={p?.imageUrl ?? ""} />
        <input name="banner_url" placeholder="Banner image URL" defaultValue={p?.bannerUrl ?? ""} /><input name="trailer_url" placeholder="Trailer embed URL (youtube.com/embed/...)" defaultValue={p?.trailerUrl ?? ""} />
        <textarea name="description" placeholder="Description" defaultValue={p?.description ?? ""} rows={3} /><textarea name="instructions" placeholder="Instructions shown after purchase" defaultValue={p?.instructions ?? ""} rows={2} /></details>
      <div className="row"><button>{p ? "Save" : "Add product"}</button>{p && <button formAction={deleteProduct} className="o" formNoValidate>Delete</button>}</div>
    </form>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; msg?: string; err?: string }> }) {
  if (!(await requireAdmin())) notFound();
  const sp = await searchParams; const d = db();
  const [os, ps, pl] = await Promise.all([d.collection("orders").orderBy("createdAt", "desc").limit(200).get(), d.collection("products").get(), d.collection("platforms").get()]);
  let orders = os.docs.map((x) => ({ id: x.id, ...x.data() } as any));
  if (sp.status && S.includes(sp.status)) orders = orders.filter((o) => o.status === sp.status);
  if (sp.q) orders = orders.filter((o) => o.code.includes(sp.q!.toUpperCase().slice(0, 20)));
  const products = ps.docs.map((x) => ({ id: x.id, ...x.data() } as any)).sort((a, b) => a.name.localeCompare(b.name));
  const platforms = pl.docs.map((x) => ({ id: x.id, ...x.data() } as any)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main><h1>Admin</h1><div className="row" style={{ marginBottom: 12 }}><a className="btn o" href="/admin/catalog">Categories and platforms</a><a className="btn o" href="/admin/customers">Customers</a></div><Flash sp={sp} />
      <h2>Orders</h2>
      <form className="row"><input name="q" placeholder="Order ID" defaultValue={sp.q} style={{ maxWidth: 200 }} aria-label="Order ID" />
        <select name="status" defaultValue={sp.status ?? ""} style={{ maxWidth: 200 }} aria-label="Status"><option value="">All statuses</option>{S.map((s) => <option key={s}>{s}</option>)}</select><button className="o">Filter</button></form>
      {!orders.length ? <div className="empty">No orders match.</div> : orders.map((o) => (
        <div className="card" key={o.id} style={{ marginBottom: 12 }}>
          <b>{o.code}</b> <span className="tag">{o.status}</span> <span className="mu">{o.createdAt.toDate().toLocaleString("en-GB")} / {bdt(o.totalBdt)} / {o.userEmail}</span>
          <p style={{ margin: "6px 0" }}>{o.items.map((i: any) => i.name).join(", ")}</p>
          <p className="mu" style={{ margin: 0 }}>{o.payment.method} from {o.payment.sender}, TrxID <b>{o.payment.txn}</b>, {o.payment.state}</p>
          {o.note && <p className="mu">Note: {o.note}</p>}
          <form action={setStatus} className="row" style={{ marginTop: 10 }}><input type="hidden" name="id" value={o.id} />
            <select name="status" defaultValue={o.status} style={{ maxWidth: 200, margin: 0 }} aria-label="New status">{S.map((s) => <option key={s}>{s}</option>)}</select>
            <input name="reason" placeholder="Reason (shown to customer)" style={{ flex: 1, margin: 0 }} defaultValue={o.statusReason ?? ""} /><button className="o">Update</button></form>
          {o.status !== "completed" && (
            <form action={deliver} className="row" style={{ marginTop: 10 }}><input type="hidden" name="order" value={o.id} />
              <input name="username" placeholder="Account username/email" required style={{ flex: 1, margin: 0 }} /><input name="password" placeholder="Account password" required style={{ flex: 1, margin: 0 }} />
              <input name="instructions" placeholder="Instructions" style={{ flex: 2, margin: 0 }} /><button>Deliver and complete</button></form>)}
        </div>))}
      <h2>Products</h2>
      <details open style={{ marginBottom: 16 }}><summary>Add product</summary><ProductForm platforms={platforms} /></details>
      <div style={{ display: "grid", gap: 12 }}>{products.map((p) => <ProductForm key={p.id} p={p} platforms={platforms} />)}</div>
    </main>
  );
}
