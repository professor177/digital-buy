import { notFound } from "next/navigation";

import CheckoutClient, { type CheckoutItem } from "@/components/checkout/CheckoutClient";
import {
  MERCHANT,
  STORE_META,
  getGame,
  getOttService,
  type StorePlatform,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const readParam = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const type = readParam("type") === "ott" ? "ott" : "game";
  const slug = readParam("slug") ?? "";
  const mode = readParam("mode") === "personal" ? "personal" : "shared";

  let item: CheckoutItem | null = null;

  if (type === "game") {
    const game = getGame(slug);
    if (!game) notFound();
    const platform = (readParam("platform") ?? game.platforms[0]) as StorePlatform;
    item = {
      type: "game",
      slug: game.slug,
      title: game.title,
      subtitle: `${STORE_META[platform].name} · ${mode === "shared" ? "Shared access" : "Permanent personal account"}`,
      platform,
      planLabel:
        mode === "shared" ? "Shared library access" : "Permanent personal account",
      validity: mode === "shared" ? game.sharedValidity : "Permanent",
      price: game.price,
      mode,
      accent: "var(--color-accent)",
    };
  } else {
    const service = getOttService(slug);
    if (!service) notFound();
    const plans = mode === "shared" ? service.sharedPlans : service.personalPlans;
    const planIndex = Number(readParam("plan") ?? "0");
    const plan = plans[Number.isFinite(planIndex) ? planIndex : 0] ?? plans[0];
    item = {
      type: "ott",
      slug: service.slug,
      title: service.name,
      subtitle: `${plan.name} · ${plan.screens} · ${plan.quality}`,
      platform: service.slug,
      planLabel: plan.name,
      validity: plan.validity,
      price: plan.price,
      mode,
      accent: "var(--color-accent)",
    };
  }

  return <CheckoutClient item={item} merchant={MERCHANT} />;
}
