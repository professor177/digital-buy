import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

const CORE_TABLES = [
  "users",
  "sessions",
  "games",
  "ott_platforms",
  "ott_packages",
  "ubisoft_rental",
  "orders",
] as const;

/**
 * Deep diagnostics for deployments: one request answers "is it an env var,
 * the database connection, or the schema being missing" without needing
 * function logs. Booleans only; never leaks secret values.
 */
export async function GET() {
  const env = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    adminKey: Boolean(process.env.ADMIN_KEY),
    firebaseClient: [
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ].every(Boolean),
    firebaseAdmin: [
      process.env.FIREBASE_PROJECT_ID,
      process.env.FIREBASE_CLIENT_EMAIL,
      process.env.FIREBASE_PRIVATE_KEY,
    ].every(Boolean),
    paymentNumbers: {
      bkash: Boolean(process.env.NEXT_PUBLIC_BKASH_NUMBER),
      nagad: Boolean(process.env.NEXT_PUBLIC_NAGAD_NUMBER),
    },
  };

  let connected: "ok" | "unreachable" | "not_configured" = "not_configured";
  let errorCode: string | null = null;
  const tables: Record<string, boolean> = {};

  if (env.databaseUrl) {
    try {
      await db.execute(sql`SELECT 1`);
      connected = "ok";
      const res = await db.execute(
        sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
      );
      const names = new Set(
        res.rows.map((r) =>
          String((r as { tablename: string }).tablename),
        ),
      );
      for (const t of CORE_TABLES) tables[t] = names.has(t);
    } catch (err) {
      connected = "unreachable";
      errorCode =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "unknown";
    }
  }

  const schemaReady =
    connected === "ok" && CORE_TABLES.every((t) => tables[t]);
  const ok = env.databaseUrl && schemaReady;

  // Always HTTP 200: this endpoint doubles as a liveness probe for deploy
  // platforms. The detailed degradation info lives in the JSON body, so a
  // broken database never blocks a deployment health gate.
  return NextResponse.json({
    status: ok ? "ok" : "degraded",
    env,
    database: {
      connected,
      ...(errorCode ? { errorCode } : {}),
      schemaReady,
      tables,
    },
  });
}
