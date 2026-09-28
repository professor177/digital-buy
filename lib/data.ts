import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const productSelect = `
  id,category_id,platform_id,name,slug,account_type,kind,description,genre,image_url,trailer_url,
  price_bdt,duration_value,duration_unit,stock,available,status,customer_instructions,created_at,updated_at,
  platform:platforms!inner(id,category_id,name,slug,description,active,accent),
  category:categories!inner(id,name,slug,description,active,sort_order)
`;

export async function getProducts(categorySlug: "gaming" | "ott", filters?: { q?: string; type?: string; platform?: string }) {
  const supabase = await createClient();
  let query = supabase.from("products").select(productSelect).eq("status", "active").order("name");
  query = query.eq("category.slug", categorySlug);
  if (filters?.type === "shared" || filters?.type === "personal") query = query.eq("account_type", filters.type);
  if (filters?.platform) query = query.eq("platform.slug", filters.platform);
  if (filters?.q?.trim()) query = query.ilike("name", `%${filters.q.trim().slice(0, 80)}%`);
  const { data, error } = await query;
  if (error) throw new Error("Could not load products");
  return (data || []) as unknown as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("slug", slug).eq("status", "active").maybeSingle();
  if (error) throw new Error("Could not load product");
  return data as unknown as Product | null;
}

export async function getPlatforms(categorySlug: "gaming" | "ott") {
  const supabase = await createClient();
  const { data, error } = await supabase.from("platforms").select("id,name,slug,description,accent,category:categories!inner(slug)").eq("category.slug", categorySlug).eq("active", true).order("sort_order");
  if (error) throw new Error("Could not load platforms");
  return data || [];
}
