import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { games, orders, ottPackages, ottPlatforms, ubisoftRental } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import {
  ensureCatalogSeed,
  listOrdersForUser,
  orderToDto,
} from "@/lib/data";
import { isValidTxnId, type AccountMode } from "@/lib/shared";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "signin_required" }, { status: 401 });
  return NextResponse.json(await listOrdersForUser(user.id));
}

interface CreateOrderBody {
  itemType?: string;
  itemId?: number;
  paymentMethod?: string;
  transactionId?: string;
  accountType?: string;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "signin_required" }, { status: 401 });

  let body: CreateOrderBody;
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const itemType = body.itemType;
  const itemId = Number(body.itemId);
  const paymentMethod = body.paymentMethod;
  const transactionId = (body.transactionId ?? "").trim();

  if (
    (itemType !== "game" && itemType !== "ott_package" && itemType !== "ubisoft") ||
    !Number.isInteger(itemId) ||
    (paymentMethod !== "bkash" && paymentMethod !== "nagad")
  ) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!isValidTxnId(transactionId)) {
    return NextResponse.json({ error: "invalid_txn" }, { status: 422 });
  }

  await ensureCatalogSeed();

  let itemLabel: string;
  let priceBdt: number | null;
  let referralCode: string;
  let accountType: AccountMode | null = null;

  if (itemType === "game") {
    const rows = await db
      .select()
      .from(games)
      .where(and(eq(games.id, itemId), eq(games.active, true)))
      .limit(1);
    const game = rows[0];
    if (!game) return NextResponse.json({ error: "item_not_found" }, { status: 404 });
    itemLabel = `${game.platform === "steam" ? "Steam" : "Xbox"} | ${game.title}`;
    priceBdt = game.priceBdt;
    referralCode = game.referralCode;
    accountType = game.accountType;
  } else if (itemType === "ott_package") {
    const rows = await db
      .select({ pkg: ottPackages, platform: ottPlatforms })
      .from(ottPackages)
      .innerJoin(ottPlatforms, eq(ottPackages.platformId, ottPlatforms.id))
      .where(and(eq(ottPackages.id, itemId), eq(ottPackages.active, true)))
      .limit(1);
    const row = rows[0];
    if (!row) return NextResponse.json({ error: "item_not_found" }, { status: 404 });
    itemLabel = `${row.platform.name} | ${row.pkg.title}`;
    priceBdt = row.pkg.priceBdt;
    referralCode = row.pkg.referralCode;
    accountType = body.accountType === "personal" ? "personal" : "shared";
  } else {
    const rows = await db.select().from(ubisoftRental).limit(1);
    const rental = rows[0];
    if (!rental || rental.id !== itemId) {
      return NextResponse.json({ error: "item_not_found" }, { status: 404 });
    }
    itemLabel = rental.title;
    priceBdt = rental.priceBdt;
    referralCode = rental.referralCode;
    accountType = body.accountType === "personal" ? "personal" : "shared";
  }

  if (priceBdt == null) {
    return NextResponse.json({ error: "price_unavailable" }, { status: 422 });
  }

  try {
    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        itemType,
        itemId,
        accountType,
        itemLabel,
        paymentMethod,
        transactionId,
        amountBdt: priceBdt,
        referralCode,
      })
      .returning();
    return NextResponse.json({ order: orderToDto(order) }, { status: 201 });
  } catch (err) {
    const code =
      typeof err === "object" && err !== null
        ? ((err as { code?: string; cause?: { code?: string } }).code ??
          (err as { cause?: { code?: string } }).cause?.code)
        : undefined;
    if (code === "23505") {
      return NextResponse.json({ error: "existing_order" }, { status: 409 });
    }
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }
}
