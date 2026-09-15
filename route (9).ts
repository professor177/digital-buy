import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return Response.json(
      { ok: false, error: "Username and password are required" },
      { status: 400 },
    );
  }

  const admin = await verifyAdminCredentials(username, password);
  if (!admin) {
    return Response.json(
      { ok: false, error: "Invalid username or password" },
      { status: 401 },
    );
  }

  await createAdminSession(admin.id);
  return Response.json({ ok: true, admin: { id: admin.id, username: admin.username } });
}
