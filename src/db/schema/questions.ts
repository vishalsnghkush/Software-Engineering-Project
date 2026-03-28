import { integer, json, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { questionPapers } from "./questionPapers";
import { InferSelectModel } from "drizzle-orm";

export const questions = pgTable("questions", {
  id: uuid().primaryKey().defaultRandom(),
  qpId: uuid().references(() => questionPapers.id, { onDelete: "cascade" }),
  questionText: text().notNull(),
  questionType: integer().notNull(),
  order: integer().notNull(),
  questionArguments: json(),
  marksCorrect: integer().notNull(),
  marksIncorrect: integer().notNull(),
  solution: text(),
});

export type QuestionPaper = InferSelectModel<typeof questionPapers>;
