import { destroyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroyAdminSession();
  return Response.json({ ok: true });
}
