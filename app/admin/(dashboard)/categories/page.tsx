import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { CategoryForm } from "@/components/taxonomy-form";
export default async function AdminCategories(){await requireAdmin();const admin=createAdminClient();const{data:items,error}=await admin.from("categories").select("id,name,slug,description,active").order("sort_order");if(error)throw new Error(error.message);return <div><h2 className="text-2xl font-black">Categories</h2><p className="muted mt-1 text-sm">Create or edit storefront category records.</p><div className="mt-6 grid gap-4"><CategoryForm/>{(items||[]).map(item=><CategoryForm key={item.id} item={item}/>)}</div></div>}
