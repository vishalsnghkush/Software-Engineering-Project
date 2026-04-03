import { eq } from "drizzle-orm";
import { db } from "../schema";
import { questionPapers } from "../schema/questionPapers";
import { questions } from "../schema/questions";
import { tagsQp } from "../schema/tagsQp";
import { tags } from "../schema/tags";
import { tagsQuestions } from "../schema/tagsQuestion";
import { map } from "zod";

export const getQuestionPaper = async (
  qpId: string,
  options: { showAnswers?: boolean; showTags?: boolean } = {
    showAnswers: false,
    showTags: false,
  },
) => {
  const [questionPaper] = await db
    .select({
      name: questionPapers.name,
      timeLimit: questionPapers.timeLimit,
      createdAt: questionPapers.createdAt,
    })
    .from(questionPapers)
    .where(eq(questionPapers.id, qpId));
  if (!questionPaper) return null;

  const questionsRow = await db
    .select({
      id: questions.id,
      questionText: questions.questionText,
      questionType: questions.questionType,
      order: questions.order,
      questionArguments: questions.questionArguments,
      marksCorrect: questions.marksCorrect,
      marksIncorrect: questions.marksIncorrect,
      ...(options.showAnswers && {
        solution: questions.solution,
        answer: questions.answer,
      }),
      ...(options.showTags && { tags: { name: tags.name, label: tags.label } }),
    })
    .from(questions)
    .leftJoin(tagsQuestions, eq(questions.id, tagsQuestions.questionId))
    .leftJoin(tags, eq(tagsQuestions.tagId, tags.id))
    .where(eq(questions.qpId, qpId));
  if (!questionsRow) return null;

  const questionSets = questionsRow.reduce((acc: any[], row, ind) => {
    const existingIndex = acc.map((e) => e.id).indexOf(row.id);
    if (existingIndex != -1) {
      if (options.showTags) acc[existingIndex].tags.push(row.tags);
    } else {
      acc.push({ ...row, tags: options.showTags ? [row.tags] : null });
    }

    return acc;
  }, []);

  const qpTags = await db
    .select({ label: tags.label, name: tags.name })
    .from(tagsQp)
    .innerJoin(tags, eq(tags.id, tagsQp.tagId))
    .where(eq(tagsQp.qpId, qpId));

  const completeQuestionPaper = {
    ...questionPaper,
    ...(options.showTags && qpTags),
    questions: questionSets,
  };

  return completeQuestionPaper;
};

export const getQuestionPaperOwnerId = async (qpId: string) => {
  const [{ userId }] = await db
    .select({ userId: questionPapers.userId })
    .from(questionPapers)
    .where(eq(questionPapers.id, qpId));

  if (!userId) return null;

  return userId;
};
