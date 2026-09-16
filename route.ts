import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  games,
  ottPackages,
  ottPlatforms,
  ubisoftRental,
} from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { gameReferral, packageReferral, slugify } from "@/lib/shared";

type Data = Record<string, unknown>;

async function guard(): Promise<NextResponse | null> {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}

function str(v: unknown, max = 400): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function price(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

function intOr(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

export async function GET(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const entity = new URL(req.url).searchParams.get("entity");

  if (entity === "games") {
    const rows = await db
      .select()
      .from(games)
      .orderBy(asc(games.platform), asc(games.accountType), asc(games.sortOrder), asc(games.id));
    return NextResponse.json(rows);
  }
  if (entity === "platforms") {
    const platforms = await db
      .select()
      .from(ottPlatforms)
      .orderBy(asc(ottPlatforms.sortOrder), asc(ottPlatforms.id));
    const packages = await db
      .select()
      .from(ottPackages)
      .orderBy(asc(ottPackages.sortOrder), asc(ottPackages.id));
    return NextResponse.json({ platforms, packages });
  }
  if (entity === "ubisoft") {
    const rows = await db.select().from(ubisoftRental).limit(1);
    return NextResponse.json(rows[0] ?? null);
  }
  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { entity, data } = (await req.json().catch(() => ({}))) as {
    entity?: string;
    data?: Data;
  };
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (entity === "game") {
    const platform = data.platform === "xbox" ? "xbox" : "steam";
    const accountType = data.accountType === "personal" ? "personal" : "shared";
    const title = str(data.title, 120);
    if (!title) return NextResponse.json({ error: "title_required" }, { status: 422 });
    const referralCode = str(data.referralCode, 40) || gameReferral(title);
    const [row] = await db
      .insert(games)
      .values({
        platform,
        accountType,
        title,
        thumbnail: str(data.thumbnail, 600),
        trailerUrl: str(data.trailerUrl, 600) || null,
        description: str(data.description, 1200),
        priceBdt: price(data.priceBdt),
        referralCode,
        sortOrder: intOr(data.sortOrder, 100),
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  }

  if (entity === "platform") {
    const name = str(data.name, 60);
    if (!name) return NextResponse.json({ error: "name_required" }, { status: 422 });
    let slug = slugify(name) || "platform";
    const existing = await db
      .select({ slug: ottPlatforms.slug })
      .from(ottPlatforms);
    const taken = new Set(existing.map((r) => r.slug));
    let i = 2;
    while (taken.has(slug)) slug = `${slugify(name)}-${i++}`;
    const [row] = await db
      .insert(ottPlatforms)
      .values({
        name,
        slug,
        introMedia: str(data.introMedia, 600),
        tagline: str(data.tagline, 160),
        sortOrder: intOr(data.sortOrder, 100),
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  }

  if (entity === "package") {
    const platformId = Number(data.platformId);
    if (!Number.isInteger(platformId)) {
      return NextResponse.json({ error: "platform_required" }, { status: 422 });
    }
    const [platform] = await db
      .select()
      .from(ottPlatforms)
      .where(eq(ottPlatforms.id, platformId))
      .limit(1);
    if (!platform) {
      return NextResponse.json({ error: "platform_not_found" }, { status: 404 });
    }
    const title = str(data.title, 120);
    if (!title) return NextResponse.json({ error: "title_required" }, { status: 422 });
    const referralCode = str(data.referralCode, 40) || packageReferral(platform.name);
    const [row] = await db
      .insert(ottPackages)
      .values({
        platformId,
        title,
        thumbnail: str(data.thumbnail, 600),
        details: str(data.details, 600),
        priceBdt: price(data.priceBdt),
        referralCode,
        sortOrder: intOr(data.sortOrder, 100),
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  }

  if (entity === "ubisoft") {
    const title = str(data.title, 120);
    if (!title) return NextResponse.json({ error: "title_required" }, { status: 422 });
    const includes = Array.isArray(data.includes)
      ? (data.includes as unknown[]).map((x) => str(x, 200)).filter(Boolean)
      : [];
    const [row] = await db
      .insert(ubisoftRental)
      .values({
        title,
        tagline: str(data.tagline, 160),
        description: str(data.description, 1200),
        includes,
        media: str(data.media, 600),
        trailerUrl: str(data.trailerUrl, 600) || null,
        priceBdt: price(data.priceBdt) ?? 150,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  }

  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { entity, id, data } = (await req.json().catch(() => ({}))) as {
    entity?: string;
    id?: number;
    data?: Data;
  };
  const rowId = Number(id);
  if (!data || typeof data !== "object" || !Number.isInteger(rowId)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (entity === "game") {
    const [row] = await db
      .update(games)
      .set({
        ...(data.platform !== undefined && {
          platform: data.platform === "xbox" ? ("xbox" as const) : ("steam" as const),
        }),
        ...(data.accountType !== undefined && {
          accountType:
            data.accountType === "personal" ? ("personal" as const) : ("shared" as const),
        }),
        ...(data.title !== undefined && { title: str(data.title, 120) }),
        ...(data.thumbnail !== undefined && { thumbnail: str(data.thumbnail, 600) }),
        ...(data.trailerUrl !== undefined && {
          trailerUrl: str(data.trailerUrl, 600) || null,
        }),
        ...(data.description !== undefined && {
          description: str(data.description, 1200),
        }),
        ...(data.priceBdt !== undefined && { priceBdt: price(data.priceBdt) }),
        ...(data.referralCode !== undefined && {
          referralCode: str(data.referralCode, 40),
        }),
        ...(data.active !== undefined && { active: Boolean(data.active) }),
        ...(data.sortOrder !== undefined && { sortOrder: intOr(data.sortOrder, 0) }),
      })
      .where(eq(games.id, rowId))
      .returning();
    return row
      ? NextResponse.json(row)
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (entity === "platform") {
    const [row] = await db
      .update(ottPlatforms)
      .set({
        ...(data.name !== undefined && { name: str(data.name, 60) }),
        ...(data.introMedia !== undefined && { introMedia: str(data.introMedia, 600) }),
        ...(data.tagline !== undefined && { tagline: str(data.tagline, 160) }),
        ...(data.active !== undefined && { active: Boolean(data.active) }),
        ...(data.sortOrder !== undefined && { sortOrder: intOr(data.sortOrder, 0) }),
      })
      .where(eq(ottPlatforms.id, rowId))
      .returning();
    return row
      ? NextResponse.json(row)
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (entity === "package") {
    const [row] = await db
      .update(ottPackages)
      .set({
        ...(data.title !== undefined && { title: str(data.title, 120) }),
        ...(data.thumbnail !== undefined && { thumbnail: str(data.thumbnail, 600) }),
        ...(data.details !== undefined && { details: str(data.details, 600) }),
        ...(data.priceBdt !== undefined && { priceBdt: price(data.priceBdt) }),
        ...(data.referralCode !== undefined && {
          referralCode: str(data.referralCode, 40),
        }),
        ...(data.active !== undefined && { active: Boolean(data.active) }),
        ...(data.sortOrder !== undefined && { sortOrder: intOr(data.sortOrder, 0) }),
      })
      .where(eq(ottPackages.id, rowId))
      .returning();
    return row
      ? NextResponse.json(row)
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (entity === "ubisoft") {
    const includes = Array.isArray(data.includes)
      ? (data.includes as unknown[]).map((x) => str(x, 200)).filter(Boolean)
      : undefined;
    const setData: Record<string, unknown> = {
      ...(data.title !== undefined && { title: str(data.title, 120) }),
      ...(data.tagline !== undefined && { tagline: str(data.tagline, 160) }),
      ...(data.description !== undefined && {
        description: str(data.description, 1200),
      }),
      ...(includes !== undefined && { includes }),
      ...(data.media !== undefined && { media: str(data.media, 600) }),
      ...(data.trailerUrl !== undefined && {
        trailerUrl: str(data.trailerUrl, 600) || null,
      }),
      ...(data.priceBdt !== undefined && {
        priceBdt: price(data.priceBdt) ?? 150,
      }),
    };
    const [row] = await db
      .update(ubisoftRental)
      .set(setData)
      .where(eq(ubisoftRental.id, rowId))
      .returning();
    return row
      ? NextResponse.json(row)
      : NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { entity, id } = (await req.json().catch(() => ({}))) as {
    entity?: string;
    id?: number;
  };
  const rowId = Number(id);
  if (!Number.isInteger(rowId)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (entity === "game") {
    await db.delete(games).where(eq(games.id, rowId));
    return NextResponse.json({ ok: true });
  }
  if (entity === "platform") {
    await db.delete(ottPlatforms).where(eq(ottPlatforms.id, rowId));
    return NextResponse.json({ ok: true });
  }
  if (entity === "package") {
    await db.delete(ottPackages).where(eq(ottPackages.id, rowId));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad_request" }, { status: 400 });
}
