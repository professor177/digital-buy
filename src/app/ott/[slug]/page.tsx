import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPlatformBySlug, listPackages } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { bdt, type AccountMode } from "@/lib/shared";
import { BuyBox } from "@/components/purchase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const platform = await getPlatformBySlug(slug);
  return { title: platform ? `${platform.name} packages` : "OTT" };
}

export default async function OttPlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const mode: AccountMode = sp.mode === "personal" ? "personal" : "shared";
  const [platform, user] = await Promise.all([
    getPlatformBySlug(slug),
    getSessionUser(),
  ]);
  if (!platform) notFound();
  const packages = await listPackages(platform.id);

  return (
    <div className="fade-up bg-screen">
      <div className="relative overflow-hidden border-b border-screen-line">
        <img
          src={platform.introMedia}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-screen via-screen/70 to-transparent" />
        <div className="wrap relative pb-12 pt-12">
          <Link
            href={`/ott?mode=${mode}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-fog hover:text-white"
          >
            <ChevronLeft size={15} /> All platforms
          </Link>
          <h1 className="mt-6 font-editorial text-5xl italic tracking-tight text-white sm:text-6xl">
            {platform.name}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-mist/80">
            {platform.tagline}{" "}
            {mode === "shared"
              ? "Shown as shared plans on accounts we maintain."
              : "Shown as personal plans on an account you control."}
          </p>
        </div>
      </div>

      <div className="wrap py-12">
        <p className="eyebrow">{packages.length} packages available</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="flex flex-col overflow-hidden rounded-lg border border-screen-line bg-screen-panel"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                {pkg.thumbnail ? (
                  <img
                    src={pkg.thumbnail}
                    alt={pkg.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-panel2" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-screen-panel to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-sm border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  {platform.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-editorial text-2xl italic tracking-tight text-white">
                  {pkg.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-fog">{pkg.details}</p>
                <div className="mt-4 flex items-center justify-between border-t border-screen-line pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-fog/70">
                    Ref {pkg.referralCode}
                  </span>
                  <span className="text-lg font-extrabold tracking-tight text-white">
                    {pkg.priceBdt != null ? bdt(pkg.priceBdt) : "TBD"}
                  </span>
                </div>
                <div className="mt-4">
                  <BuyBox
                    itemType="ott_package"
                    itemId={pkg.id}
                    title={`${platform.name} | ${pkg.title}`}
                    priceBdt={pkg.priceBdt}
                    referralCode={pkg.referralCode}
                    mode={mode}
                    authed={Boolean(user)}
                    nextPath={`/ott/${platform.slug}?mode=${mode}`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
