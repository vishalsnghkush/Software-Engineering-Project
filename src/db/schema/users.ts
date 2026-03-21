import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
