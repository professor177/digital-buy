import { notFound } from "next/navigation";

import StoreFront from "@/components/store/StoreFront";
import { STORE_META, gamesForPlatform, type StorePlatform } from "@/lib/catalog";

const VALID: StorePlatform[] = ["steam", "xbox", "ubisoft"];

export function generateStaticParams() {
  return VALID.map((platform) => ({ platform }));
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform } = await params;
  if (!VALID.includes(platform as StorePlatform)) notFound();

  const key = platform as StorePlatform;
  return (
    <div className="-mt-20 sm:-mt-24">
      <div className="pt-20 sm:pt-24">
        <StoreFront platform={key} games={gamesForPlatform(key)} />
      </div>
      <span className="sr-only">{STORE_META[key].ui}</span>
    </div>
  );
}
