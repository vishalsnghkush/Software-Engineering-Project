import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const pool = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

// export const db = drizzle(pool);

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

const db = globalThis._db || drizzle(pool);

if (process.env.NODE_ENV !== "production") {
  globalThis._db = db;
}

export { db };
