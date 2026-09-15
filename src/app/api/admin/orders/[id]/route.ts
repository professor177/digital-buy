import { eq } from "drizzle-orm";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSessionAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["pending", "success", "failed"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getSessionAdmin();
  if (!admin) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) {
    return Response.json({ ok: false, error: "Invalid order id" }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    status?: string;
    note?: string | null;
    credentialEmail?: string | null;
    credentialPassword?: string | null;
  };

  if (body.status && !ALLOWED_STATUSES.has(body.status)) {
    return Response.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const patch: Partial<typeof orders.$inferInsert> = {};
  if (body.status !== undefined) patch.status = body.status;
  if (body.note !== undefined) patch.note = body.note;
  if (body.credentialEmail !== undefined) patch.credentialEmail = body.credentialEmail;
  if (body.credentialPassword !== undefined) patch.credentialPassword = body.credentialPassword;

  if (Object.keys(patch).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const updated = await db
    .update(orders)
    .set(patch)
    .where(eq(orders.id, orderId))
    .returning();

  if (!updated[0]) {
    return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  return Response.json({ ok: true, order: updated[0] });
}
