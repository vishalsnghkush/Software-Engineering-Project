import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: uuid().primaryKey(),
  name: text().notNull().unique(),
  label: text().notNull(),
});

export type Tag = InferSelectModel<typeof tags>;
