import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Credentials are revealed only for delivered orders owned by the user. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: false }, { status: 401 });

  const { id } = await context.params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
    .limit(1);

  const order = rows[0];
  if (!order || order.status !== "success" || !order.credentialEmail) {
    return Response.json(
      { ok: false, error: "Credentials are not available for this order yet." },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    email: order.credentialEmail,
    password: order.credentialPassword,
  });
}
