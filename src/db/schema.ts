import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: varchar({ length: 255 }).notNull(),

  email: varchar({ length: 255 }).notNull().unique(),

  password: varchar({ length: 255 }).notNull(),

  role: varchar({ length: 50 }).notNull().default("student"), 

  createdAt: timestamp().defaultNow().notNull(),

  updatedAt: timestamp().defaultNow().notNull(),
});
