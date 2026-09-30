import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { bdt, dur, embed } from "@/lib/fmt";

const get = async (slug: string) => { const s = await db().doc(`products/${slug}`).get(); const p = s.data(); return p && p.isAvailable ? { id: s.id, ...p } as any : null; };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await get((await params).slug);
  return { title: p?.name ?? "Product", description: p?.description?.slice(0, 150) };
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const p = await get((await params).slug); if (!p) notFound();
  const v = embed(p.trailerUrl); const ok = p.stock > 0; const pic = p.bannerUrl || p.imageUrl;
  return (
    <main data-p={p.platformId}>
      <span className="tag">{p.platformName} / {p.accountType}</span><h1>{p.name}</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div>{v ? <iframe src={v} title={`${p.name} trailer`} loading="lazy" allowFullScreen /> : pic && <Image src={pic} alt={p.name} width={1200} height={675} priority sizes="(max-width:700px) 100vw, 640px" style={{ width: "100%", height: "auto" }} />}
          <p>{p.description}</p>{p.genre && <p className="mu">Genre: {p.genre}</p>}</div>
        <div className="card">
          <p className="mu">Access type: {p.accountType === "shared" ? "Shared account" : "Personal account"}</p>
          <p className="mu">Duration: {dur(p.durationDays)}</p><p className="mu">Availability: {ok ? "In stock" : "Unavailable"}</p>
          <p style={{ fontSize: "1.6rem" }}><b>{bdt(p.priceBdt)}</b></p>
          {ok ? <Link className="btn" href={`/checkout/${p.id}`}>Purchase</Link> : <button disabled>Unavailable</button>}
        </div>
      </div>
    </main>
  );
}
