import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import Flash from "@/components/Flash";
import { saveCategory, savePlatform } from "@/app/actions";
export const metadata = { title: "Catalog", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Catalog({ searchParams }: { searchParams: Promise<{ msg?: string; err?: string }> }) {
  if (!(await requireAdmin())) notFound();
  const [cs, ps] = await Promise.all([db().collection("categories").get(), db().collection("platforms").get()]);
  const cats = cs.docs.map((x) => ({ id: x.id, ...x.data() } as any)).sort((a, b) => a.sortOrder - b.sortOrder);
  const plats = ps.docs.map((x) => ({ id: x.id, ...x.data() } as any)).sort((a, b) => a.name.localeCompare(b.name));
  const slug = (c?: any) => c ? <><input type="hidden" name="slug" value={c.id} /><span className="tag">{c.id}</span></> : <input name="slug" placeholder="slug" required pattern="[a-z0-9-]{2,40}" aria-label="Slug" style={{ flex: 1, margin: 0 }} />;
  const CatForm = ({ c }: { c?: any }) => (
    <form action={saveCategory} className="card row">{slug(c)}
      <input name="name" placeholder="Name" defaultValue={c?.name} required aria-label="Name" style={{ flex: 1, margin: 0 }} />
      <input name="sort_order" type="number" defaultValue={c?.sortOrder ?? 0} aria-label="Order" style={{ width: 80, margin: 0 }} /><label><input type="checkbox" name="is_active" defaultChecked={c?.isActive ?? true} style={{ width: "auto" }} /> Active</label><button>{c ? "Save" : "Add"}</button></form>);
  const PlatForm = ({ p }: { p?: any }) => (
    <form action={savePlatform} className="card row">{slug(p)}
      <input name="name" placeholder="Name" defaultValue={p?.name} required aria-label="Name" style={{ flex: 1, margin: 0 }} />
      <select name="category_id" defaultValue={p?.categoryId} aria-label="Category" style={{ width: 140, margin: 0 }}>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input name="brand_color" placeholder="#RRGGBB" defaultValue={p?.brandColor ?? ""} aria-label="Brand colour" style={{ width: 100, margin: 0 }} /><label><input type="checkbox" name="is_active" defaultChecked={p?.isActive ?? true} style={{ width: "auto" }} /> Active</label><button>{p ? "Save" : "Add"}</button></form>);
  return (
    <main><a href="/admin" className="mu">Back to admin</a><h1>Categories and platforms</h1><Flash sp={await searchParams} />
      <p className="mu">Slugs cannot be changed after creation. The shop pages use the categories gaming and ott.</p>
      <h2>Categories</h2><div style={{ display: "grid", gap: 8 }}><CatForm />{cats.map((c) => <CatForm key={c.id} c={c} />)}</div>
      <h2>Platforms</h2><div style={{ display: "grid", gap: 8 }}><PlatForm />{plats.map((p) => <PlatForm key={p.id} p={p} />)}</div></main>
  );
}
