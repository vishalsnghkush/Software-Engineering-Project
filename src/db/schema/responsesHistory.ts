import {
  boolean,
  integer,
  json,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { responses } from "./responses";

export const responsesHistory = pgTable("responses_history", {
  id: uuid().primaryKey().defaultRandom(),
  responseId: uuid().references(() => responses.id, { onDelete: "cascade" }),
  attemptedAt: timestamp().notNull(),
  responseValue: json(),
  marked: boolean().notNull().default(false),
  timeTaken: integer(),
});
