import type { MetadataRoute } from "next";
import { db } from "@/lib/firebase-admin";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let items: any[] = []; try { items = (await db().collection("products").where("isAvailable", "==", true).get()).docs; } catch {}
  return [...["", "/shop/gaming", "/shop/ott", "/legal/privacy", "/legal/terms"].map((p) => ({ url: base + p })),
    ...items.map((d) => ({ url: `${base}/product/${d.id}`, lastModified: d.data().updatedAt?.toDate() }))];
}
