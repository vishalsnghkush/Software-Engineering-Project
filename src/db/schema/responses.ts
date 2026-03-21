import {
  boolean,
  integer,
  json,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { testSessions } from "./testSession";
import { questions } from "./questions";
import { InferSelectModel } from "drizzle-orm";

export const responses = pgTable("responses", {
  id: uuid().primaryKey(),
  sessionId: uuid().references(() => testSessions.id, { onDelete: "cascade" }),
  questionId: uuid().references(() => questions.id, { onDelete: "cascade" }),
  responseValue: json(),
  attemptedAt: timestamp().notNull(),
  marked: boolean().notNull().default(false),
  timeTaken: integer(),
});

export type Response = InferSelectModel<typeof responses>;
