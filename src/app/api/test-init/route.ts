import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { questionPapers } from "@/db/schema/questionPapers";
import { questions } from "@/db/schema/questions";
import { responses } from "@/db/schema/responses";
import { testSessions } from "@/db/schema/testSession";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export const GET = async (request: NextRequest) => {
  const slug = request.nextUrl.searchParams.get("slug");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !slug) {
    return NextResponse.json(null, { status: 400 });
  }

  const [questionPaper] = await db
    .select()
    .from(questionPapers)
    .where(
      and(
        eq(questionPapers.id, slug),
        eq(questionPapers.userId, session.user.id),
      ),
    );

  if (!questionPaper) {
    return NextResponse.json(null, { status: 404 });
  }

  // if (
  //   new Date(questionPaper.createdAt).getTime() +
  //     questionPaper.timeLimit * 1000 <=
  //   Date.now()
  // ) {
  //   console.log(
  //     new Date(questionPaper.createdAt).getTime() +
  //       questionPaper.timeLimit * 1000 <=
  //       Date.now(),
  //   );

  //   return NextResponse.json(null, { status: 404 });
  // }

  const [testSession] = await db
    .select()
    .from(testSessions)
    .where(eq(testSessions.qpId, questionPaper.id));

  if (testSession.submittedAt !== null) {
    return NextResponse.json(null, { status: 404 });
  }

  const questionList = await db
    .select()
    .from(questions)
    .where(eq(questions.qpId, questionPaper.id))
    .orderBy(questions.order);

  const responsesList = await db
    .select()
    .from(responses)
    .where(
      inArray(
        responses.questionId,
        questionList.map((e) => e.id),
      ),
    )
    .then((list) =>
      list.sort((a, b) => {
        return (
          questionList.find((q) => q.id === a.questionId)!.order -
          questionList.find((q) => q.id === b.questionId)!.order
        );
      }),
    );

  return NextResponse.json(
    {
      questionPaper,
      questionList,
      testSession,
      responsesList,
    },
    { status: 200 },
  );
};
