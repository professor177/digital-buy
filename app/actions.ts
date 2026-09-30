"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { adminAuth, db } from "@/lib/firebase-admin";
import { COOKIE, getUser, requireAdmin } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

const back = (path: string, k: "msg" | "err", t: string): never => redirect(`${path}?${k}=${encodeURIComponent(t)}`);
const obj = (fd: FormData) => Object.fromEntries(fd);
const opt = (s: z.ZodString) => s.optional().or(z.literal(""));

export async function logout() {
  const u = await getUser(); (await cookies()).delete(COOKIE);
  if (u) await adminAuth().revokeRefreshTokens(u.uid).catch(() => {});
  redirect("/");
}

export async function createOrder(fd: FormData) {
  const slug = String(fd.get("slug") ?? ""); const path = `/checkout/${encodeURIComponent(slug)}`;
  const user = await getUser(); if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  const p = z.object({ method: z.enum(["bkash", "nagad"]), sender: z.string().regex(/^01\d{9}$/), txn: z.string().regex(/^[A-Za-z0-9]{6,20}$/), note: z.string().max(300).optional() }).safeParse(obj(fd));
  if (!p.success) back(path, "err", "Check your number (01XXXXXXXXX) and transaction ID.");
  const d = db(); const f = p.data!; const txn = f.txn.toUpperCase();
  const since = Date.now() - 3600e3;
  const mine = await d.collection("orders").where("userId", "==", user!.uid).get();
  if (mine.docs.filter((x) => x.data().createdAt.toMillis() > since).length >= 5) back(path, "err", "Too many orders in the last hour. Try again later.");
  try {
    await d.runTransaction(async (t) => {
      const ps = await t.get(d.doc(`products/${slug}`)); const pr = ps.data();
      if (!pr || !pr.isAvailable || pr.stock < 1) throw new Error("unavailable");
      const tref = d.doc(`txns/${f.method}_${txn}`); if ((await t.get(tref)).exists) throw new Error("dup");
      const oref = d.collection("orders").doc(); t.set(tref, { orderId: oref.id });
      t.set(oref, { code: randomBytes(4).toString("hex").toUpperCase(), userId: user!.uid, userEmail: user!.email, status: "payment_submitted", statusReason: null,
        totalBdt: pr.priceBdt, note: f.note || null, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), credentials: [],
        items: [{ productId: ps.id, name: pr.name, priceBdt: pr.priceBdt, durationDays: pr.durationDays ?? null }],
        payment: { method: f.method, sender: f.sender, txn, state: "submitted" } });
    });
  } catch (e: any) {
    back(path, "err", e.message === "dup" ? "That transaction ID was already used." : e.message === "unavailable" ? "This product is no longer available." : "Could not create the order. Try again.");
  }
  back("/orders", "msg", "Order submitted. We will verify your payment and update the status here.");
}

const adminOnly = async () => { const a = await requireAdmin(); if (!a) throw new Error("Forbidden"); return a; };

export async function setStatus(fd: FormData) {
  await adminOnly();
  const p = z.object({ id: z.string().min(1), status: z.enum(["pending", "payment_submitted", "confirmed", "processing", "completed", "failed", "cancelled"]), reason: z.string().max(300).optional() }).safeParse(obj(fd));
  if (!p.success) back("/admin", "err", "Invalid status change.");
  const s = p.data!.status;
  const upd: any = { status: s, statusReason: p.data!.reason || null, updatedAt: Timestamp.now() };
  if (["confirmed", "processing", "completed"].includes(s)) upd["payment.state"] = "verified";
  if (["failed", "cancelled"].includes(s)) upd["payment.state"] = "rejected";
  await db().doc(`orders/${p.data!.id}`).update(upd);
  back("/admin", "msg", "Order updated.");
}

export async function deliver(fd: FormData) {
  await adminOnly();
  const p = z.object({ order: z.string().min(1), username: z.string().min(1).max(200), password: z.string().min(1).max(200), instructions: z.string().max(1000).optional() }).safeParse(obj(fd));
  if (!p.success) back("/admin", "err", "Username and password are required.");
  const d = db(); const x = p.data!;
  try {
    await d.runTransaction(async (t) => {
      const oref = d.doc(`orders/${x.order}`); const o = (await t.get(oref)).data(); if (!o) throw new Error("missing");
      const pref = d.doc(`products/${o.items[0].productId}`); const pr = (await t.get(pref)).data();
      t.update(oref, { status: "completed", "payment.state": "verified", updatedAt: Timestamp.now(),
        credentials: FieldValue.arrayUnion({ username: x.username, passwordEnc: encrypt(x.password), instructions: x.instructions || null }) });
      if (pr) t.update(pref, { stock: Math.max(pr.stock - 1, 0) });
    });
  } catch { back("/admin", "err", "Could not deliver credentials."); }
  back("/admin", "msg", "Credentials delivered and order completed.");
}

export async function saveProduct(fd: FormData) {
  await adminOnly();
  const url = z.string().url().optional().or(z.literal(""));
  const p = z.object({ id: z.string().optional(), platform_id: z.string().min(1), name: z.string().min(2).max(120),
    kind: z.enum(["game_account", "library_rental", "subscription"]), account_type: z.enum(["shared", "personal"]),
    price_bdt: z.coerce.number().min(0), duration_days: z.coerce.number().int().min(1).optional().or(z.literal("").transform(() => undefined)),
    stock: z.coerce.number().int().min(0), description: z.string().max(4000).optional(), genre: z.string().max(80).optional(),
    image_url: url, banner_url: url, trailer_url: url, instructions: z.string().max(2000).optional() }).safeParse(obj(fd));
  if (!p.success) back("/admin", "err", "Check the product fields: " + p.error.issues[0].path.join("."));
  const x = p.data!; const d = db();
  const pl = (await d.doc(`platforms/${x.platform_id}`).get()).data(); if (!pl) back("/admin", "err", "Unknown platform.");
  const row = { platformId: x.platform_id, platformName: pl!.name, categoryId: pl!.categoryId, name: x.name, kind: x.kind, accountType: x.account_type,
    priceBdt: x.price_bdt, durationDays: x.duration_days ?? null, stock: x.stock, description: x.description ?? "", genre: x.genre ?? "",
    imageUrl: x.image_url || null, bannerUrl: x.banner_url || null, trailerUrl: x.trailer_url || null, instructions: x.instructions ?? "",
    isAvailable: fd.get("is_available") === "on", updatedAt: Timestamp.now() };
  const id = x.id || `${x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${x.account_type}-${randomBytes(2).toString("hex")}`;
  await d.doc(`products/${id}`).set(row, { merge: true });
  back("/admin", "msg", "Product saved.");
}

export async function deleteProduct(fd: FormData) {
  await adminOnly(); await db().doc(`products/${String(fd.get("id"))}`).delete();
  back("/admin", "msg", "Product deleted. Existing orders keep their own copy of the product details.");
}

const slugRe = z.string().regex(/^[a-z0-9-]{2,40}$/);

export async function saveCategory(fd: FormData) {
  await adminOnly();
  const p = z.object({ slug: slugRe, name: z.string().min(2).max(60), sort_order: z.coerce.number().int() }).safeParse(obj(fd));
  if (!p.success) back("/admin/catalog", "err", "Check the category fields.");
  await db().doc(`categories/${p.data!.slug}`).set({ name: p.data!.name, sortOrder: p.data!.sort_order, isActive: fd.get("is_active") === "on" }, { merge: true });
  back("/admin/catalog", "msg", "Category saved.");
}

export async function savePlatform(fd: FormData) {
  await adminOnly();
  const p = z.object({ slug: slugRe, name: z.string().min(2).max(60), category_id: z.string().min(1), brand_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal("")) }).safeParse(obj(fd));
  if (!p.success) back("/admin/catalog", "err", "Check the platform fields (colour like #1b2838).");
  const d = db(); const x = p.data!;
  await d.doc(`platforms/${x.slug}`).set({ name: x.name, categoryId: x.category_id, brandColor: x.brand_color || null, isActive: fd.get("is_active") === "on" }, { merge: true });
  const prods = await d.collection("products").where("platformId", "==", x.slug).get(); const b = d.batch();
  prods.docs.forEach((s) => b.update(s.ref, { platformName: x.name, categoryId: x.category_id })); await b.commit();
  back("/admin/catalog", "msg", "Platform saved.");
}

export async function setBan(fd: FormData) {
  const a = await adminOnly(); const uid = String(fd.get("user_id") ?? "");
  if (!uid || uid === a.uid) back("/admin/customers", "err", "Invalid user.");
  const ban = fd.get("ban") === "1";
  await adminAuth().updateUser(uid, { disabled: ban }); if (ban) await adminAuth().revokeRefreshTokens(uid);
  back("/admin/customers", "msg", "Account updated.");
}
