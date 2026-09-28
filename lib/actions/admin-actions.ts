"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { encryptSecret } from "@/lib/crypto";
import type { ActionState } from "@/components/action-feedback";

const emptyToNullNumber = z.preprocess((v) => v === "" || v == null ? null : Number(v), z.number().int().nonnegative().nullable());
const emptyToNullPositive = z.preprocess((v) => v === "" || v == null ? null : Number(v), z.number().int().positive().nullable());
const slugSchema = z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/);

export async function reviewPaymentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ orderId: z.string().uuid(), decision: z.enum(["approve","reject"]), reason: z.string().trim().max(500).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Invalid payment review." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_review_payment", { p_order_id: parsed.data.orderId, p_approve: parsed.data.decision === "approve", p_reason: parsed.data.reason || null });
  if (error) return { message: error.message };
  revalidatePath(`/admin/orders/${parsed.data.orderId}`); revalidatePath("/admin/orders");
  return { ok: true, message: parsed.data.decision === "approve" ? "Payment verified and order confirmed." : "Payment rejected and order failed." };
}

export async function updateOrderStatusAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ orderId: z.string().uuid(), status: z.enum(["processing","completed","failed","cancelled"]), reason: z.string().trim().max(500).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Invalid status update." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_order_status", { p_order_id: parsed.data.orderId, p_status: parsed.data.status, p_reason: parsed.data.reason || null });
  if (error) return { message: error.message };
  revalidatePath(`/admin/orders/${parsed.data.orderId}`); revalidatePath("/admin/orders"); revalidatePath("/orders");
  return { ok: true, message: `Order changed to ${parsed.data.status}.` };
}

export async function deliverCredentialsAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { user } = await requireAdmin();
  const parsed = z.object({ orderItemId: z.string().uuid(), username: z.string().trim().max(500).optional(), password: z.string().max(1000).optional(), instructions: z.string().trim().max(5000).optional(), orderId: z.string().uuid() }).refine(v => Boolean(v.username || v.password || v.instructions), { message: "Add at least one credential or instruction." }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Invalid credentials." };
  const admin = createAdminClient();
  const { data: item } = await admin.from("order_items").select("id,order_id").eq("id", parsed.data.orderItemId).eq("order_id", parsed.data.orderId).maybeSingle();
  if (!item) return { message: "Order item not found." };
  const { error } = await admin.from("delivered_credentials").upsert({ order_item_id: parsed.data.orderItemId, username_encrypted: encryptSecret(parsed.data.username), password_encrypted: encryptSecret(parsed.data.password), instructions_encrypted: encryptSecret(parsed.data.instructions), delivered_by: user.id, delivered_at: new Date().toISOString() }, { onConflict: "order_item_id" });
  if (error) return { message: error.message };
  revalidatePath(`/admin/orders/${parsed.data.orderId}`); revalidatePath("/orders");
  return { ok: true, message: "Encrypted delivery details saved." };
}

export async function upsertProductAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({
    id: z.string().uuid().optional().or(z.literal("")), categoryId: z.string().uuid(), platformId: z.string().uuid(), name: z.string().trim().min(2).max(150), slug: slugSchema,
    accountType: z.enum(["shared","personal"]), kind: z.enum(["rental","permanent","subscription"]), description: z.string().trim().min(10).max(5000), genre: z.string().max(500).optional(),
    imageUrl: z.string().url().optional().or(z.literal("")), trailerUrl: z.string().url().optional().or(z.literal("")), priceBdt: z.coerce.number().int().positive().max(10000000),
    durationValue: emptyToNullPositive, durationUnit: z.enum(["day","week","month","year","permanent"]), stock: emptyToNullNumber, status: z.enum(["draft","active","archived"]),
    customerInstructions: z.string().trim().max(5000).optional(), available: z.string().optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Invalid product data.", fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.durationUnit === "permanent" && parsed.data.durationValue !== null) return { message: "Permanent products cannot have a duration value." };
  if (parsed.data.durationUnit !== "permanent" && parsed.data.durationValue === null) return { message: "Duration value is required for non-permanent products." };
  const admin = createAdminClient();
  let imageUrl = parsed.data.imageUrl || null;
  if (imageUrl) {
    const storageBase = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!storageBase || !imageUrl.startsWith(`${storageBase}/storage/v1/object/public/product-media/`)) {
      return { message: "Image URL must be from this project’s public product-media Supabase Storage bucket, or upload a file instead." };
    }
  }
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    const allowed = ["image/jpeg","image/png","image/webp","image/avif"];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) return { message: "Product image must be JPG, PNG, WEBP or AVIF and 5 MB or smaller." };
    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "img";
    const path = `products/${randomUUID()}.${ext}`;
    const { error: uploadError } = await admin.storage.from("product-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return { message: `Image upload failed: ${uploadError.message}` };
    imageUrl = admin.storage.from("product-media").getPublicUrl(path).data.publicUrl;
  }
  const payload = {
    category_id: parsed.data.categoryId, platform_id: parsed.data.platformId, name: parsed.data.name, slug: parsed.data.slug, account_type: parsed.data.accountType, kind: parsed.data.kind,
    description: parsed.data.description, genre: parsed.data.genre ? parsed.data.genre.split(",").map(x=>x.trim()).filter(Boolean).slice(0,12) : null, image_url: imageUrl,
    trailer_url: parsed.data.trailerUrl || null, price_bdt: parsed.data.priceBdt, duration_value: parsed.data.durationUnit === "permanent" ? null : parsed.data.durationValue,
    duration_unit: parsed.data.durationUnit, stock: parsed.data.stock, available: parsed.data.available === "on", status: parsed.data.status, customer_instructions: parsed.data.customerInstructions || null,
  };
  const query = parsed.data.id ? admin.from("products").update(payload).eq("id", parsed.data.id) : admin.from("products").insert(payload);
  const { error } = await query; if (error) return { message: error.message };
  revalidatePath("/gaming"); revalidatePath("/ott"); revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin(); const id = z.string().uuid().parse(formData.get("id")); const admin = createAdminClient();
  const { count } = await admin.from("order_items").select("id", { count: "exact", head: true }).eq("product_id", id);
  if ((count || 0) > 0) await admin.from("products").update({ status: "archived", available: false }).eq("id", id);
  else await admin.from("products").delete().eq("id", id);
  revalidatePath("/admin/products"); revalidatePath("/gaming"); revalidatePath("/ott");
}

export async function saveCategoryAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed=z.object({id:z.string().uuid().optional().or(z.literal("")),name:z.string().trim().min(2).max(80),slug:slugSchema,description:z.string().trim().max(500).optional(),active:z.string().optional()}).safeParse(Object.fromEntries(formData));
  if(!parsed.success)return{message:parsed.error.issues[0]?.message||"Invalid category."}; const admin=createAdminClient(); const payload={name:parsed.data.name,slug:parsed.data.slug,description:parsed.data.description||null,active:parsed.data.active==="on"}; const q=parsed.data.id?admin.from("categories").update(payload).eq("id",parsed.data.id):admin.from("categories").insert(payload); const {error}=await q; if(error)return{message:error.message}; revalidatePath("/admin/categories"); return{ok:true,message:"Category saved."};
}

export async function savePlatformAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed=z.object({id:z.string().uuid().optional().or(z.literal("")),categoryId:z.string().uuid(),name:z.string().trim().min(2).max(80),slug:slugSchema,description:z.string().trim().max(500).optional(),accent:z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")),active:z.string().optional()}).safeParse(Object.fromEntries(formData));
  if(!parsed.success)return{message:parsed.error.issues[0]?.message||"Invalid platform."}; const admin=createAdminClient(); const payload={category_id:parsed.data.categoryId,name:parsed.data.name,slug:parsed.data.slug,description:parsed.data.description||null,accent:parsed.data.accent||null,active:parsed.data.active==="on"}; const q=parsed.data.id?admin.from("platforms").update(payload).eq("id",parsed.data.id):admin.from("platforms").insert(payload); const {error}=await q; if(error)return{message:error.message}; revalidatePath("/admin/platforms"); revalidatePath("/gaming"); revalidatePath("/ott"); return{ok:true,message:"Platform saved."};
}

export async function setCustomerBanAction(formData: FormData) {
  await requireAdmin(); const parsed=z.object({userId:z.string().uuid(),mode:z.enum(["ban","unban"])}).parse(Object.fromEntries(formData)); const admin=createAdminClient();
  const { data: protectedAdmin } = await admin.from("admin_users").select("auth_user_id").eq("auth_user_id", parsed.userId).eq("active", true).maybeSingle();
  if (protectedAdmin) throw new Error("Active administrator accounts cannot be banned from the customer screen.");
  const {error}=await admin.auth.admin.updateUserById(parsed.userId,{ban_duration:parsed.mode==="ban"?"876000h":"none"}); if(error)throw new Error(error.message); revalidatePath("/admin/customers");
}
