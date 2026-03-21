import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { questionPapers } from "./questionPapers";
import { users } from "./users";
import { InferSelectModel } from "drizzle-orm";

export const testSessions = pgTable("test_sessions", {
  id: uuid().primaryKey(),
  qpId: uuid().references(() => questionPapers.id, { onDelete: "cascade" }),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  attemptedAt: timestamp().notNull(),
});

export type TestSession = InferSelectModel<typeof testSessions>;
