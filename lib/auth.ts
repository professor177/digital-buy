import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function hasPublicSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function requireUser() {
  if (!hasPublicSupabaseConfig()) {
    redirect("/launch");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/orders");
  if (!user.email_confirmed_at) {
    redirect("/auth/login?error=verify-email");
  }

  return user;
}

export async function getUserOrNull() {
  if (!hasPublicSupabaseConfig()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
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
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    return false;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("auth_user_id")
    .eq("auth_user_id", userId)
    .eq("active", true)
    .maybeSingle();

  return Boolean(data);
}
