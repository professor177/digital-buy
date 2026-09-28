import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

/**
 * Managed Postgres providers (Neon, Supabase, Vercel Postgres, RDS) require
 * SSL; local Postgres does not. Honor an explicit sslmode in the URL
 * (node-postgres parses it itself), otherwise enable SSL for any non-local
 * host. This is the classic "works locally, breaks everywhere on Vercel"
 * mismatch, so it is inferred here instead of left to chance.
 */
function resolveSsl(connectionString: string):
  | { rejectUnauthorized: boolean }
  | undefined {
  if (/[?&]sslmode=/i.test(connectionString)) return undefined;
  if (/(@|\/\/)(localhost|127\.0\.0\.1|db|postgres)(:\d+)?\//i.test(connectionString))
    return undefined;
  return { rejectUnauthorized: false };
}

const globalForDb = globalThis as typeof globalThis & {
  __digitalbuyPool?: Pool;
};

function createPool(): Pool {
  let pool: Pool;
  if (!databaseUrl) {
    // Do NOT throw at module import time: a missing env var must produce a
    // graceful per-page error (caught by error boundaries), not a crash of
    // every serverless function that imports this module.
    pool = new Pool({
      connectionString: "postgresql://127.0.0.1:9/unconfigured",
      max: 1,
      connectionTimeoutMillis: 1000,
    });
  } else {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: resolveSsl(databaseUrl),
      max: 3,
      connectionTimeoutMillis: 8000,
      // Serverless hosts freeze idle functions; keep idle sockets short-lived
      // and let the process exit when nothing is using the pool.
      idleTimeoutMillis: 10000,
      keepAlive: true,
      allowExitOnIdle: true,
    });
  }
  // CRITICAL: node-postgres re-emits errors from idle clients (Neon/Supabase
  // close idle connections, serverless freeze/thaw breaks sockets) as an
  // "error" event on the pool. With no listener Node treats that as an
  // uncaught exception and kills the function, which shows up on Vercel as
  // "500: This page couldn't load". Swallow + log it; the dead client is
  // discarded by the pool and the next query opens a fresh connection.
  pool.on("error", (err) => {
    console.error("Postgres idle client error (ignored):", err.message);
  });
  return pool;
}

// Reuse the pool across warm serverless invocations and dev hot reloads.
export const pool = globalForDb.__digitalbuyPool ?? createPool();
globalForDb.__digitalbuyPool = pool;

export const db = drizzle(pool);
