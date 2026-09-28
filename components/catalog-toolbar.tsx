import Link from "next/link";
import { SearchIcon } from "@/components/icons";

export function CatalogToolbar({ basePath, q, type, platform, platforms }: { basePath: string; q?: string; type?: string; platform?: string; platforms: Array<{ name: string; slug: string }> }) {
  const qs = (patch: Record<string,string|undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, type, platform, ...patch };
    Object.entries(merged).forEach(([k,v]) => { if (v) p.set(k,v); });
    const s = p.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };
  return <div className="surface mt-8 p-4 sm:p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <form className="flex w-full max-w-md" action={basePath} method="get">
        {type && <input type="hidden" name="type" value={type}/>} {platform && <input type="hidden" name="platform" value={platform}/>} 
        <label className="sr-only" htmlFor="catalog-search">Search products</label>
        <div className="relative w-full"><SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input id="catalog-search" className="input pl-10" name="q" defaultValue={q} placeholder="Search by title" maxLength={80}/></div>
      </form>
      <div className="flex flex-wrap gap-2" aria-label="Account type filter">
        <Link className={`btn !min-h-9 !px-3 !py-1.5 ${!type ? "btn-primary" : "btn-secondary"}`} href={qs({type:undefined})}>All</Link>
        <Link className={`btn !min-h-9 !px-3 !py-1.5 ${type === "shared" ? "btn-primary" : "btn-secondary"}`} href={qs({type:"shared"})}>Shared</Link>
        <Link className={`btn !min-h-9 !px-3 !py-1.5 ${type === "personal" ? "btn-primary" : "btn-secondary"}`} href={qs({type:"personal"})}>Personal</Link>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-4" aria-label="Platform filter">
      <Link className={`badge ${!platform ? "border-sky-500 text-sky-300" : "text-slate-400"}`} href={qs({platform:undefined})}>All platforms</Link>
      {platforms.map((p) => <Link key={p.slug} className={`badge ${platform === p.slug ? "border-sky-500 text-sky-300" : "text-slate-400"}`} href={qs({platform:p.slug})}>{p.name}</Link>)}
    </div>
  </div>;
}
