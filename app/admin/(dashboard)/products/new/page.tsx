import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminProductForm } from "@/components/admin-product-form";
export default async function NewProduct(){await requireAdmin();const admin=createAdminClient();const[{data:categories},{data:platforms}]=await Promise.all([admin.from("categories").select("id,name").eq("active",true).order("sort_order"),admin.from("platforms").select("id,name").eq("active",true).order("sort_order")]);return <div><h2 className="text-2xl font-black">Add product</h2><p className="muted mt-1 text-sm">Create a catalog product with real price, duration, stock and delivery information.</p><div className="mt-6"><AdminProductForm categories={categories||[]} platforms={platforms||[]}/></div></div>}
