import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Conexión singleton a Postgres (Supabase).
 * Lazy para que el build no falle si DATABASE_URL todavía no está seteada.
 */
export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(url, {
    prepare: false,
    max: 1,
  });
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
