import { getSessionAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getSessionAdmin();
  if (!admin) return Response.json({ admin: null });
  return Response.json({ admin: { id: admin.id, username: admin.username } });
}
