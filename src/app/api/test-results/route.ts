import { NextResponse } from "next/server";
import { db } from "@/db/schema";
import { testResults } from "@/db/schema/testResults";
import { desc, eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, session.user.id))
      .orderBy(desc(testResults.createdAt))
      .limit(50);

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { examName, generationType, subject, difficulty, totalQuestions, marks, maxMarks, correct, incorrect, unattempted, accuracy } = body;

    const [inserted] = await db.insert(testResults).values({
      userId: session.user.id,
      examName,
      generationType,
      subject: subject || "General",
      difficulty,
      totalQuestions,
      marks,
      maxMarks,
      correct,
      incorrect,
      unattempted,
      accuracy,
    }).returning();

    return NextResponse.json({ result: inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const all = url.searchParams.get("all");

    if (all === "true") {
      await db.delete(testResults).where(eq(testResults.userId, session.user.id));
    } else if (id) {
      await db.delete(testResults).where(
        and(eq(testResults.id, Number(id)), eq(testResults.userId, session.user.id))
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
