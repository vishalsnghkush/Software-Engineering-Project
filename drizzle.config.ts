import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    host: "localhost",
    database: process.env.POSTGRES_DB!,
    port: +process.env.POSTGRES_PORT!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    ssl: false,
  },
  migrations: {
    table: "my-migrations-table", // `__drizzle_migrations` by default
    schema: "public", // used in PostgreSQL only, `drizzle` by default
  },
});
