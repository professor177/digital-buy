import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  games,
  orders,
  ottPackages,
  ottPlatforms,
  ubisoftRental,
  users,
  type Game,
  type Order,
  type OttPackage,
  type OttPlatform,
  type UbisoftRental,
} from "@/db/schema";
import type {
  AccountMode,
  GameDto,
  OrderDto,
  PackageDto,
  PlatformDto,
  UbisoftDto,
} from "@/lib/shared";

export function gameToDto(g: Game): GameDto {
  return {
    id: g.id,
    platform: g.platform,
    accountType: g.accountType,
    title: g.title,
    thumbnail: g.thumbnail,
    trailerUrl: g.trailerUrl,
    description: g.description,
    priceBdt: g.priceBdt,
    referralCode: g.referralCode,
  };
}

export function platformToDto(p: OttPlatform): PlatformDto {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    introMedia: p.introMedia,
    tagline: p.tagline,
  };
}

export function packageToDto(p: OttPackage): PackageDto {
  return {
    id: p.id,
    platformId: p.platformId,
    title: p.title,
    thumbnail: p.thumbnail,
    details: p.details,
    priceBdt: p.priceBdt,
    referralCode: p.referralCode,
  };
}

export function ubisoftToDto(u: UbisoftRental): UbisoftDto {
  return {
    id: u.id,
    title: u.title,
    tagline: u.tagline,
    description: u.description,
    includes: u.includes,
    media: u.media,
    trailerUrl: u.trailerUrl,
    priceBdt: u.priceBdt,
    referralCode: u.referralCode,
  };
}

export function orderToDto(o: Order): OrderDto {
  return {
    id: o.id,
    itemType: o.itemType,
    itemId: o.itemId,
    accountType: o.accountType,
    itemLabel: o.itemLabel,
    paymentMethod: o.paymentMethod,
    transactionId: o.transactionId,
    amountBdt: o.amountBdt,
    referralCode: o.referralCode,
    status: o.status,
    credentials: o.status === "verified" ? o.credentials : null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

export async function listGames(
  platform: "steam" | "xbox",
  accountType: AccountMode,
): Promise<GameDto[]> {
  const rows = await db
    .select()
    .from(games)
    .where(
      and(
        eq(games.platform, platform),
        eq(games.accountType, accountType),
        eq(games.active, true),
      ),
    )
    .orderBy(asc(games.sortOrder), asc(games.id));
  return rows.map(gameToDto);
}

export async function getGame(id: number): Promise<GameDto | null> {
  const rows = await db.select().from(games).where(eq(games.id, id)).limit(1);
  return rows[0] ? gameToDto(rows[0]) : null;
}

export async function listPlatforms(): Promise<PlatformDto[]> {
  const rows = await db
    .select()
    .from(ottPlatforms)
    .where(eq(ottPlatforms.active, true))
    .orderBy(asc(ottPlatforms.sortOrder), asc(ottPlatforms.id));
  return rows.map(platformToDto);
}

export async function getPlatformBySlug(
  slug: string,
): Promise<PlatformDto | null> {
  const rows = await db
    .select()
    .from(ottPlatforms)
    .where(eq(ottPlatforms.slug, slug))
    .limit(1);
  return rows[0] ? platformToDto(rows[0]) : null;
}

export async function listPackages(platformId: number): Promise<PackageDto[]> {
  const rows = await db
    .select()
    .from(ottPackages)
    .where(
      and(eq(ottPackages.platformId, platformId), eq(ottPackages.active, true)),
    )
    .orderBy(asc(ottPackages.sortOrder), asc(ottPackages.id));
  return rows.map(packageToDto);
}

export async function getUbisoft(): Promise<UbisoftDto | null> {
  const rows = await db.select().from(ubisoftRental).limit(1);
  return rows[0] ? ubisoftToDto(rows[0]) : null;
}

export async function listOrdersForUser(userId: number): Promise<OrderDto[]> {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  return rows.map(orderToDto);
}

export interface AdminOrderDto extends OrderDto {
  userPhone: string;
  userNickname: string | null;
  adminNote: string | null;
}

export async function listAllOrders(): Promise<AdminOrderDto[]> {
  const rows = await db
    .select({ order: orders, user: users })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));
  return rows.map(({ order, user }) => ({
    ...orderToDto(order),
    credentials: order.credentials,
    userPhone: user.phone,
    userNickname: user.nickname,
    adminNote: order.adminNote,
  }));
}
