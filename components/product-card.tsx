import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { durationLabel, money } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const available = product.available && (product.stock === null || product.stock > 0);
  return <article className="card group overflow-hidden border-t-2" style={{ borderTopColor: product.platform?.accent || "#34a8ff" }}>
    <Link href={`/products/${product.slug}`} className="block">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0b111b]">
        {product.image_url ? <Image src={product.image_url} alt={`${product.name} artwork`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]"/> : <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#111a27,#0a0f16)] text-center"><div><div className="text-xs font-extrabold uppercase tracking-[.18em] text-sky-300">{product.platform?.name}</div><div className="mt-2 text-xl font-black">{product.name}</div></div></div>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{product.platform?.name} · {product.account_type}</p><h3 className="mt-1 text-lg font-black leading-tight">{product.name}</h3></div><span className={`badge ${available ? "text-emerald-300" : "text-red-300"}`}>{available ? "Available" : "Unavailable"}</span></div>
        <p className="muted mt-3 line-clamp-2 text-sm leading-6">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-xs text-slate-500">{durationLabel(product.duration_value, product.duration_unit)}</p><p className="text-xl font-black">{money(product.price_bdt)}</p></div><span className="flex items-center gap-1 text-sm font-extrabold text-sky-300">Details <ArrowIcon className="h-4 w-4"/></span></div>
      </div>
    </Link>
  </article>;
}
