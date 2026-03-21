import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferSelectModel } from "drizzle-orm";

export const questionPapers = pgTable("question_papers", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  timeLimit: integer().notNull(),
});

export type QuestionPaper = InferSelectModel<typeof questionPapers>;
