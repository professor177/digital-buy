import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

type Platform = { name:string; slug:string; description?:string|null; accent?:string|null };
export function PlatformSection({ platform, products, distinct = false }: { platform:Platform; products:Product[]; distinct?:boolean }) {
  if (!products.length) return null;
  return <section className="mt-10 border-l-2 pl-4 sm:pl-6" style={{ borderLeftColor: platform.accent || "#34a8ff" }}>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.16em]" style={{ color: platform.accent || "#84cfff" }}>{platform.name}</p><h2 className="mt-2 text-2xl font-black">{platform.slug === "steam" ? "PC library access" : platform.slug === "xbox" ? "Console account access" : platform.slug === "ubisoft" ? "Ubisoft library rentals" : `${platform.name} subscriptions`}</h2>{platform.description&&<p className="muted mt-2 max-w-2xl text-sm leading-6">{platform.description}</p>}</div></div>
    <div className={`mt-5 grid gap-5 ${distinct ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>
  </section>;
}
