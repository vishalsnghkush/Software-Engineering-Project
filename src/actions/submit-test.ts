"use server";

import { db } from "@/db/schema";
import { testSessions } from "@/db/schema/testSession";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOGGEDUSER_REDIRECT } from "../../routes";
import { questionPapers } from "@/db/schema/questionPapers";
import { responses } from "@/db/schema/responses";
import { questions } from "@/db/schema/questions";
import z from "zod";
import { singleCorrectOptionQuestionAnswerSchema } from "@/lib/zod/questions";
import { singleCorrectOptionResponseValueSchema } from "@/lib/zod/responses";
import { testResults } from "@/db/schema/testResults";

export const submitTest = async (qpId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const [questionPaperSession] = await db
    .select()
    .from(questionPapers)
    .innerJoin(testSessions, eq(testSessions.qpId, questionPapers.id))
    .where(eq(questionPapers.id, qpId));

  const {
    test_sessions: { id: sessionId },
    question_papers: { name, subject, difficulty, generationType, userId },
  } = questionPaperSession;

  const currentTime = new Date(Date.now());
  await db
    .update(testSessions)
    .set({ submittedAt: currentTime })
    .where(eq(testSessions.id, sessionId));

  const questionList = await db
    .select()
    .from(questions)
    .where(eq(questions.qpId, qpId));

  const responseList = await db
    .select()
    .from(responses)
    .where(eq(responses.sessionId, sessionId));

  const evaluation: {
    evaluation: boolean | undefined;
    marksAwarded: number;
  }[] = responseList.map((response) => {
    const question = questionList.find((e) => e.id === response.questionId);

    if (!response.attemptedAt) {
      return { evaluation: undefined, marksAwarded: 0 };
    }

    if (!response.responseValue) {
      return { evaluation: undefined, marksAwarded: 0 };
    }

    const answerKey = (
      question?.answer as z.infer<
        typeof singleCorrectOptionQuestionAnswerSchema
      >
    ).correctOption;

    const responseValue = (
      response.responseValue as z.infer<
        typeof singleCorrectOptionResponseValueSchema
      >
    ).selectedOption;

    const evaluation = answerKey.includes(responseValue);
    const marksAwarded =
      (evaluation ? question?.marksCorrect : question?.marksIncorrect) ?? 0;

    return { evaluation, marksAwarded };
  });

  const maxMarks = questionList.reduce((acc, question) => {
    return acc + question.marksCorrect;
  }, 0);

  const { correct, incorrect, unattempted } = evaluation.reduce(
    (acc, evaluated) => {
      if (evaluated.evaluation === true) {
        return { ...acc, correct: acc.correct + 1 };
      } else if (evaluated.evaluation === false) {
        return { ...acc, incorrect: acc.incorrect + 1 };
      } else {
        return { ...acc, unattempted: acc.unattempted + 1 };
      }
    },
    {
      correct: 0,
      incorrect: 0,
      unattempted: 0,
    },
  );

  let accuracy = Math.floor((correct / (correct + incorrect)) * 100);
  if (isNaN(accuracy)) accuracy = 0;

  const marks = evaluation.reduce(
    (acc, evaluated) => acc + evaluated.marksAwarded,
    0,
  );

  const totalQuestions = questionList.length;

  const testResultInserted: typeof testResults.$inferInsert = {
    examName: name,
    subject,
    marks,
    maxMarks,
    correct,
    incorrect,
    unattempted,
    difficulty,
    generationType,
    accuracy,
    totalQuestions,
    createdAt: currentTime,
    userId: userId ?? "",
  };

  await db.insert(testResults).values(testResultInserted);

  // export const testResults = pgTable("test_results", {
  //   id: serial("id").primaryKey(),
  //   userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  //   examName: text("exam_name").notNull(),
  //   generationType: text("generation_type").notNull(),
  //   subject: text("subject").notNull().default("General"),
  //   difficulty: text("difficulty").notNull(),
  //   totalQuestions: integer("total_questions").notNull(),
  //   marks: real("marks").notNull(),
  //   maxMarks: real("max_marks").notNull(),
  //   correct: integer("correct").notNull(),
  //   incorrect: integer("incorrect").notNull(),
  //   unattempted: integer("unattempted").notNull(),
  //   accuracy: integer("accuracy").notNull(),
  //   createdAt: timestamp("created_at").defaultNow().notNull(),
  // });

  redirect(DEFAULT_LOGGEDUSER_REDIRECT);
};
