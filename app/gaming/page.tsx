import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { PlatformSection } from "@/components/platform-section";
import { EmptyState } from "@/components/empty-state";
import { getPlatforms, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Gaming Accounts", description: "Browse configurable Steam, Xbox and Ubisoft shared or personal gaming account products." };
export default async function GamingPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; platform?: string }> }) {
  const params = await searchParams;
  const [products, platforms] = await Promise.all([getProducts("gaming", params), getPlatforms("gaming")]);
  return <div className="container py-14"><p className="eyebrow">Gaming</p><h1 className="title-lg mt-3">Shared access or personal ownership.</h1><p className="muted mt-4 max-w-3xl leading-7">Shared products are duration-based and lower cost. Personal products can represent permanent ownership where the product allows it. The exact duration, price and availability shown on each product are controlled by the live catalog.</p><CatalogToolbar basePath="/gaming" q={params.q} type={params.type} platform={params.platform} platforms={platforms as Array<{name:string;slug:string}>}/><div className="mt-2">{(platforms as Array<any>).map((platform)=><PlatformSection key={platform.slug} platform={platform} products={products.filter(p=>p.platform?.slug===platform.slug)} distinct={platform.slug==="ubisoft"}/>)}</div>{products.length === 0 && <div className="mt-8"><EmptyState title="No matching games" body="Try a different search, account type or platform. Unavailable and draft products are not shown in the public catalog."/></div>}</div>;
}
