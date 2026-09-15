import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { getSessionAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getSessionAdmin();
  if (!admin) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      order: orders,
      buyerName: users.name,
      buyerEmail: users.email,
      buyerPhone: users.phone,
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .orderBy(desc(orders.createdAt), desc(orders.id));

  return Response.json({
    ok: true,
    orders: rows.map((r) => ({ ...r.order, buyerName: r.buyerName, buyerEmail: r.buyerEmail, buyerPhone: r.buyerPhone })),
  });
}
