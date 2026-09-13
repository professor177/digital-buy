import { redirect } from "next/navigation";

import { getSessionAdmin } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminDashboard username={admin.username} />;
}
