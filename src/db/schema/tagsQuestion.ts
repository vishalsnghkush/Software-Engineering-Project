import { pgTable, uuid } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { questions } from "./questions";

export const tagsQuestions = pgTable("tags_question", {
  id: uuid().primaryKey(),
  tagId: uuid().references(() => tags.id, { onDelete: "cascade" }),
  questionId: uuid().references(() => questions.id, { onDelete: "cascade" }),
});
