import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/orders");
  if (!user.email_confirmed_at) redirect("/auth/login?error=verify-email");
  return user;
}

export async function getUserOrNull() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("auth_user_id,role,active")
    .eq("auth_user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (!data) redirect("/admin/login?error=unauthorized");
  return { user, admin: data };
}

export async function isAdmin(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("auth_user_id")
    .eq("auth_user_id", userId)
    .eq("active", true)
    .maybeSingle();
  return Boolean(data);
}
