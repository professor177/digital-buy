import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { PlatformSection } from "@/components/platform-section";
import { EmptyState } from "@/components/empty-state";
import { getPlatforms, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "OTT Subscriptions", description: "Browse configurable shared and personal duration-based digital subscription products." };
export default async function OttPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; platform?: string }> }) {
  const params = await searchParams;
  const [products, platforms] = await Promise.all([getProducts("ott", params), getPlatforms("ott")]);
  return <div className="container py-14"><p className="eyebrow">OTT</p><h1 className="title-lg mt-3">Subscription access with clear duration.</h1><p className="muted mt-4 max-w-3xl leading-7">Shared products provide multi-user or shared access. Personal products provide private access for the purchased duration. Product availability and pricing are maintained by Digital Buy administrators.</p><CatalogToolbar basePath="/ott" q={params.q} type={params.type} platform={params.platform} platforms={platforms as Array<{name:string;slug:string}>}/><div className="mt-2">{(platforms as Array<any>).map((platform)=><PlatformSection key={platform.slug} platform={platform} products={products.filter(p=>p.platform?.slug===platform.slug)}/>)}</div>{products.length === 0 && <div className="mt-8"><EmptyState title="No matching subscriptions" body="Try another platform or account type. New platform products can be added from the admin dashboard without changing frontend code."/></div>}</div>;
}
