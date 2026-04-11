import { pgTable, text, timestamp, integer, real, serial } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examName: text("exam_name").notNull(),
  generationType: text("generation_type").notNull(),
  subject: text("subject").notNull().default("General"),
  difficulty: text("difficulty").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  marks: real("marks").notNull(),
  maxMarks: real("max_marks").notNull(),
  correct: integer("correct").notNull(),
  incorrect: integer("incorrect").notNull(),
  unattempted: integer("unattempted").notNull(),
  accuracy: integer("accuracy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
