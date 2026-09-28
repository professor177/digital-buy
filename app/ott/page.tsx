import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { PlatformSection } from "@/components/platform-section";
import { EmptyState } from "@/components/empty-state";
import { BackendPreview } from "@/components/backend-preview";
import { getPlatforms, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "OTT Subscriptions",
  description:
    "Browse configurable shared and personal duration-based digital subscription products.",
};

export default async function OttPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; platform?: string }>;
}) {
  const backendReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!backendReady) {
    return (
      <div className="container py-14">
        <p className="eyebrow">OTT</p>
        <h1 className="title-lg mt-3">Subscriptions with clear access type and duration.</h1>
        <p className="muted mt-4 max-w-3xl leading-7">
          Shared and personal products load from the live Digital Buy database.
        </p>
        <BackendPreview
          title="OTT catalog"
          platforms={[
            "Netflix",
            "Spotify",
            "HBO",
            "YouTube Premium",
            "ChatGPT",
          ]}
        />
      </div>
    );
  }

  const params = await searchParams;
  const [products, platforms] = await Promise.all([
    getProducts("ott", params),
    getPlatforms("ott"),
  ]);

  return (
    <div className="container py-14">
      <p className="eyebrow">OTT</p>
      <h1 className="title-lg mt-3">Subscription access with clear duration.</h1>
      <p className="muted mt-4 max-w-3xl leading-7">
        Shared products provide multi-user or shared access. Personal products
        provide private access for the purchased duration.
      </p>
      <CatalogToolbar
        basePath="/ott"
        q={params.q}
        type={params.type}
        platform={params.platform}
        platforms={platforms as Array<{ name: string; slug: string }>}
      />
      <div className="mt-2">
        {(platforms as Array<any>).map((platform) => (
          <PlatformSection
            key={platform.slug}
            platform={platform}
            products={products.filter((p) => p.platform?.slug === platform.slug)}
          />
        ))}
      </div>
      {products.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No matching subscriptions"
            body="Try another platform or account type."
          />
        </div>
      )}
    </div>
  );
}
