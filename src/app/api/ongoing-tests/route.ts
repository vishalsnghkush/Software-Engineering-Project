import { db } from "@/db/schema";
import { questionPapers } from "@/db/schema/questionPapers";
import { testSessions } from "@/db/schema/testSession";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { lte } from "zod";

export const GET = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const questionPaperList = await db
    .select({ questionPaper: questionPapers })
    .from(questionPapers)
    .innerJoin(testSessions, eq(testSessions.qpId, questionPapers.id))
    .where(
      and(
        eq(questionPapers.userId, session.user.id),
        isNull(testSessions.submittedAt),
      ),
    )
    .then((list) =>
      list.filter(
        (e) =>
          e.questionPaper.createdAt.getTime() +
            e.questionPaper.timeLimit * 1000 >
          Date.now(),
      ),
    );

  return NextResponse.json({ questionPaperList }, { status: 200 });
};
