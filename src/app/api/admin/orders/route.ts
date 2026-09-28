import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { listAllOrders } from "@/lib/data";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json(await listAllOrders());
}

interface PatchBody {
  id?: string;
  action?: string;
  credentials?: string;
  note?: string;
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { id, action } = body;
  if (typeof id !== "string" || (action !== "verify" && action !== "reject")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const credentials = typeof body.credentials === "string" ? body.credentials.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";

  if (action === "verify" && credentials.length < 3) {
    return NextResponse.json(
      { error: "credentials_required" },
      { status: 422 },
    );
  }

  const [updated] = await db
    .update(orders)
    .set({
      status: action === "verify" ? "verified" : "rejected",
      credentials: action === "verify" ? credentials : null,
      adminNote: note || null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const all = await listAllOrders();
  return NextResponse.json({ order: all.find((o) => o.id === updated.id) });
}
