import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferSelectModel } from "drizzle-orm";

export const userSessions = pgTable("userSessions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type UserSession = InferSelectModel<typeof userSessions>;
