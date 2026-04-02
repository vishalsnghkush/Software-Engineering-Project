import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { questionPapers } from "./questionPapers";
import { InferSelectModel } from "drizzle-orm";
import { users } from "./auth-schema";

export const testSessions = pgTable("test_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  qpId: uuid().references(() => questionPapers.id, { onDelete: "cascade" }),
  userId: text().references(() => users.id, { onDelete: "cascade" }),
  attemptedAt: timestamp().notNull(),
  submittedAt: timestamp(),
});

export type TestSession = InferSelectModel<typeof testSessions>;
