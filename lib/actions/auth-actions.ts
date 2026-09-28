"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/components/action-feedback";

const email = z.string().trim().email().max(254);
const password = z.string().min(8).max(128);

export async function signUpAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try { await rateLimit("signup", 5, 300); } catch (e) { return { message: e instanceof Error ? e.message : "Try again later." }; }
  const parsed = z.object({ name: z.string().trim().min(2).max(100), email, password }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { name: parsed.data.name }, emailRedirectTo: `${siteUrl}/auth/confirm?next=/` } });
  if (error) return { message: error.message };
  return { ok: true, message: "Account created. Check your email to verify your address before signing in." };
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try { await rateLimit("login", 8, 300); } catch (e) { return { message: e instanceof Error ? e.message : "Try again later." }; }
  const parsed = z.object({ email, password, next: z.string().optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Enter a valid email and password." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { message: "Invalid email or password, or the account is not verified." };
  if (!data.user.email_confirmed_at) { await supabase.auth.signOut(); return { message: "Verify your email before signing in." }; }
  const next = parsed.data.next?.startsWith("/") ? parsed.data.next : "/";
  redirect(next);
}

export async function adminLoginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try { await rateLimit("admin-login", 6, 300); } catch (e) { return { message: e instanceof Error ? e.message : "Try again later." }; }
  const parsed = z.object({ email, password }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Enter a valid email and password." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { message: "Invalid administrator credentials." };
  const admin = createAdminClient();
  const { data: adminRow } = await admin.from("admin_users").select("auth_user_id").eq("auth_user_id", data.user.id).eq("active", true).maybeSingle();
  if (!adminRow) { await supabase.auth.signOut(); return { message: "This account is not authorized for administration." }; }
  redirect("/admin/orders");
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try { await rateLimit("forgot-password", 4, 600); } catch (e) { return { message: e instanceof Error ? e.message : "Try again later." }; }
  const parsed = z.object({ email }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Enter a valid email." };
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${siteUrl}/auth/confirm?next=/auth/update-password` });
  return { ok: true, message: "If that email exists, a password reset message has been sent." };
}

export async function updatePasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ password, confirmPassword: password }).refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Invalid password." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { message: error.message };
  return { ok: true, message: "Password updated. You can continue using your account." };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
