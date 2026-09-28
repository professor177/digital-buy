import { NextResponse } from "next/server";
import { db } from "@/db";
import { games } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { gameReferral, type AccountMode } from "@/lib/shared";
import { SEED_GAMES, steamHeader } from "@/lib/seed-catalog";

/**
 * Adds the starter game catalog. Safe to run repeatedly: a game is only
 * inserted when the same platform + account type + title is not there yet,
 * so it never duplicates rows or overwrites prices you edited.
 */
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const existing = await db
      .select({
        platform: games.platform,
        accountType: games.accountType,
        title: games.title,
      })
      .from(games);
    const have = new Set(
      existing.map((g) => `${g.platform}|${g.accountType}|${g.title.toLowerCase()}`),
    );

    const rows: Array<typeof games.$inferInsert> = [];
    SEED_GAMES.forEach((g, index) => {
      for (const platform of g.platforms) {
        for (const accountType of ["shared", "personal"] as AccountMode[]) {
          const key = `${platform}|${accountType}|${g.title.toLowerCase()}`;
          if (have.has(key)) continue;
          rows.push({
            platform,
            accountType,
            title: g.title,
            thumbnail: steamHeader(g.steamAppId),
            trailerUrl: null,
            description: g.description,
            priceBdt: g.price[accountType],
            referralCode: gameReferral(g.title),
            sortOrder: index + 1,
          });
        }
      }
    });

    if (rows.length > 0) await db.insert(games).values(rows);
    return NextResponse.json({ added: rows.length });
  } catch (err) {
    console.error("Catalog seed failed:", err);
    return NextResponse.json({ error: "seed_failed" }, { status: 500 });
  }
}
