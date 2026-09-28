import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminProductForm } from "@/components/admin-product-form";
import type { Product } from "@/lib/types";
export default async function EditProduct({params}:{params:Promise<{id:string}>}){await requireAdmin();const{id}=await params;const admin=createAdminClient();const[{data:product},{data:categories},{data:platforms}]=await Promise.all([admin.from("products").select("*").eq("id",id).maybeSingle(),admin.from("categories").select("id,name").order("sort_order"),admin.from("platforms").select("id,name").order("sort_order")]);if(!product)notFound();return <div><h2 className="text-2xl font-black">Edit product</h2><p className="muted mt-1 text-sm">Changes publish automatically when status is active.</p><div className="mt-6"><AdminProductForm product={product as Product} categories={categories||[]} platforms={platforms||[]}/></div></div>}
