import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { bdt, dur } from "@/lib/fmt";

const Img = ({ src, w, h }: { src?: string | null; w: number; h: number }) => src ? <Image src={src} alt="" width={w} height={h} sizes="(max-width:600px) 100vw, 230px" style={{ width: "100%", height: "auto" }} /> : null;

export default async function Shop({ params, searchParams }: { params: Promise<{ cat: string }>; searchParams: Promise<{ type?: string; q?: string }> }) {
  const { cat } = await params; const { type = "shared", q = "" } = await searchParams;
  if (!["gaming", "ott"].includes(cat)) notFound();
  const t = type === "personal" ? "personal" : "shared"; let list: any[] = []; let failed = false;
  try {
    const s = await db().collection("products").where("categoryId", "==", cat).get();
    list = s.docs.map((d) => ({ id: d.id, ...d.data() } as any)).filter((p) => p.isAvailable && p.accountType === t && (!q || p.name.toLowerCase().includes(q.toLowerCase().slice(0, 60)))).sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) { console.error("shop load failed", e); failed = true; }
  const tab = (v: string) => `/shop/${cat}?type=${v}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  const by = new Map<string, any[]>(); list.forEach((p) => by.set(p.platformName, [...(by.get(p.platformName) ?? []), p]));
  return (
    <main>
      <h1>{cat === "gaming" ? "Gaming" : "OTT"}</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <Link className={`btn ${t === "shared" ? "" : "o"}`} href={tab("shared")}>Shared</Link>
        <Link className={`btn ${t === "personal" ? "" : "o"}`} href={tab("personal")}>Personal</Link>
      </div>
      <form className="row"><input type="hidden" name="type" value={t} /><input name="q" defaultValue={q} placeholder="Search products" aria-label="Search products" style={{ maxWidth: 360 }} /><button className="o">Search</button></form>
      {failed ? <p className="toast err">Could not load products. Refresh to try again.</p>
        : !by.size ? <div className="empty">No {t} products found.</div>
        : [...by.entries()].map(([name, items]) => { const s = items[0].platformId; return (
          <section key={name}><h2>{name}</h2>
            <div className={s === "steam" ? "lst" : s === "xbox" ? "grid xb" : "grid"}>{items.map((p) => s === "steam" ? (
              <Link key={p.id} href={`/product/${p.id}`} className="card" data-p={s}><Img src={p.imageUrl} w={184} h={69} />
                <div><b>{p.name}</b><p className="mu" style={{ margin: 0 }}>{p.genre} / {dur(p.durationDays)}</p></div>
                <div className="price"><b>{bdt(p.priceBdt)}</b><br /><span className="mu">{p.stock < 1 ? "Out of stock" : "In stock"}</span></div></Link>
            ) : s === "xbox" ? (
              <Link key={p.id} href={`/product/${p.id}`} className="card" data-p={s}><Img src={p.imageUrl} w={360} h={480} />
                <div><b>{p.name}</b><p className="mu" style={{ margin: 0 }}>{dur(p.durationDays)}</p><b>{bdt(p.priceBdt)}</b> {p.stock < 1 && <span className="tag">Out</span>}</div></Link>
            ) : (
              <Link key={p.id} href={`/product/${p.id}`} className="card" data-p={s}><Img src={p.imageUrl} w={460} h={259} />
                <h3 style={{ margin: "8px 0 2px" }}>{p.name}</h3><p className="mu" style={{ margin: 0 }}>{p.genre} {dur(p.durationDays)}</p>
                <p><b>{bdt(p.priceBdt)}</b> {p.stock < 1 && <span className="tag">Out of stock</span>}</p></Link>))}</div></section>); })}
    </main>
  );
}
