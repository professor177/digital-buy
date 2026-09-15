import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSessionUser, listOrders, newReference } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: false, orders: [] }, { status: 401 });

  const rows = await listOrders(user.id);
  return Response.json({
    ok: true,
    orders: rows.map((order) => ({
      ...order,
      // credentials are only exposed through /api/orders/[id]/credentials
      credentialEmail: undefined,
      credentialPassword: undefined,
      hasCredentials: Boolean(order.credentialEmail),
    })),
  });
}

type OrderBody = {
  productType?: string;
  productSlug?: string;
  productTitle?: string;
  mode?: string;
  platform?: string | null;
  planLabel?: string | null;
  validity?: string;
  priceLabel?: string;
  paymentMethod?: string;
  senderNumber?: string;
  transactionId?: string;
  reference?: string;
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { ok: false, error: "Please sign in before placing an order." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as OrderBody;

  if (!body.productSlug || !body.productTitle || !body.paymentMethod) {
    return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  if (!body.transactionId || body.transactionId.trim().length < 6) {
    return Response.json(
      { ok: false, error: "Enter the full transaction ID from your payment SMS." },
      { status: 400 },
    );
  }

  /**
   * ─────────── PLUG IN YOUR PAYMENT VERIFICATION HERE ───────────
   * bKash Tokenized Checkout → POST /tokenized/checkout/payment/status
   * Nagad Merchant API       → GET  /api/dfs/verify/payment/{paymentRefId}
   * On success flip `status` to "success" and attach the credentials.
   */
  const inserted = await db
    .insert(orders)
    .values({
      userId: user.id,
      reference: body.reference?.trim() || newReference(),
      productType: body.productType === "ott" ? "ott" : "game",
      productSlug: body.productSlug,
      productTitle: body.productTitle,
      mode: body.mode === "personal" ? "personal" : "shared",
      platform: body.platform ?? null,
      planLabel: body.planLabel ?? null,
      validity: body.validity || "Permanent",
      priceLabel: body.priceLabel || "BDT",
      paymentMethod: body.paymentMethod === "nagad" ? "nagad" : "bkash",
      senderNumber: body.senderNumber ?? user.phone ?? null,
      transactionId: body.transactionId.trim(),
      status: "pending",
      note: "Awaiting manual payment verification (usually within 10 minutes).",
    })
    .returning();

  return Response.json({ ok: true, order: inserted[0] });
}
