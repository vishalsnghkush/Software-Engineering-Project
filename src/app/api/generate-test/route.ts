import { db } from "@/db/schema";
import { questionPapers } from "@/db/schema/questionPapers";
import { questions } from "@/db/schema/questions";
import { responses } from "@/db/schema/responses";
import { testSessions } from "@/db/schema/testSession";
import { auth } from "@/lib/auth";
import { QuestionType } from "@/lib/enums/question-type";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      apiKey,
      examName,
      generationType,
      difficulty,
      subject,
      numQuestions,
      timeLimit,
    } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key is required" },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionCount = numQuestions || 5;

    const payload = {
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `You are an expert academic test creator. Create high-quality MCQ questions.

RESPONSE FORMAT: Your ENTIRE response must be a valid JSON array. Nothing else. No markdown, no explanation, no code fences.

Each element must be: {"question": "string", "options": ["A", "B", "C", "D"], "correctAnswer": "string"}

CRITICAL RULES:
- Exactly ${questionCount} question objects in the array.
- Exactly 4 options per question. Never 3, never 5.
- correctAnswer must exactly match one of the 4 options.
- DO NOT use LaTeX, backslashes, or math symbols like \\frac, \\vec, \\alpha etc. Write math in plain text (e.g. "x^2 + 3x + 2 = 0", "sqrt(3)/2", "a/b").
- DO NOT wrap the response in code fences or markdown.
- Output ONLY the raw JSON array starting with [ and ending with ].`,
        },
        {
          role: "user",
          content: `Create EXACTLY ${questionCount} MCQ questions:
- Exam: ${examName}
- Type: ${generationType}
- Subject: ${subject || "General"}
- Difficulty: ${difficulty}

Remember: plain text only, no LaTeX. Output raw JSON array only.`,
        },
      ],
    };

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "[]";

    content = content.trim();

    // Strip markdown code fences
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    if (content.startsWith("```")) {
      content = content.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    content = content.trim();

    // Try to extract just the JSON array if there's extra text around it
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      content = arrayMatch[0];
    }

    // Replace common LaTeX patterns with plain text
    content = content.replace(/\\\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1/$2)");
    content = content.replace(/\\\\dfrac\{([^}]*)\}\{([^}]*)\}/g, "($1/$2)");
    content = content.replace(/\\\\sqrt\{([^}]*)\}/g, "sqrt($1)");
    content = content.replace(/\\\\vec\{([^}]*)\}/g, "vec($1)");
    content = content.replace(/\\\\text\{([^}]*)\}/g, "$1");
    content = content.replace(/\\\\left/g, "");
    content = content.replace(/\\\\right/g, "");
    content = content.replace(/\\\\times/g, "x");
    content = content.replace(/\\\\div/g, "/");
    content = content.replace(/\\\\pm/g, "+/-");
    content = content.replace(/\\\\alpha/g, "alpha");
    content = content.replace(/\\\\beta/g, "beta");
    content = content.replace(/\\\\gamma/g, "gamma");
    content = content.replace(/\\\\theta/g, "theta");
    content = content.replace(/\\\\pi/g, "pi");
    content = content.replace(/\\\\infty/g, "infinity");
    content = content.replace(/\\\\geq/g, ">=");
    content = content.replace(/\\\\leq/g, "<=");
    content = content.replace(/\\\\neq/g, "!=");
    content = content.replace(/\\\\\(/g, "");
    content = content.replace(/\\\\\)/g, "");
    content = content.replace(/\\\\\[/g, "");
    content = content.replace(/\\\\\]/g, "");

    // Final pass: strip remaining unescaped backslashes that break JSON
    // Replace \X (where X is not a valid JSON escape char) with just X
    content = content.replace(/\\([^"\\\/bfnrtu\n])/g, "$1");

    let localQuestions: {
      question: string;
      options: string[];
      correctAnswer: string;
    }[] = [];
    try {
      localQuestions = JSON.parse(content);

      // Fallback normalizer: guarantee exactly 4 options so the UI never breaks
      localQuestions = localQuestions.map((q) => {
        if (!Array.isArray(q.options))
          q.options = ["Option A", "Option B", "Option C", "Option D"];
        while (q.options.length < 4) {
          q.options.push("None of the above");
        }
        if (q.options.length > 4) {
          q.options = q.options.slice(0, 4);
          if (!q.options.includes(q.correctAnswer)) {
            q.correctAnswer = q.options[0];
          }
        }
        return q;
      });
    } catch {
      // Last resort: try to manually extract questions using regex
      try {
        const questionRegex =
          /\{"question"\s*:\s*"([^"]*?)"\s*,\s*"options"\s*:\s*\[([^\]]*?)\]\s*,\s*"correctAnswer"\s*:\s*"([^"]*?)"\}/g;
        let match;
        while ((match = questionRegex.exec(content)) !== null) {
          const opts = match[2]
            .split(",")
            .map((s) => s.trim().replace(/^"|"$/g, ""));
          localQuestions.push({
            question: match[1],
            options:
              opts.length >= 4
                ? opts.slice(0, 4)
                : [
                    ...opts,
                    ...Array(4 - opts.length).fill("None of the above"),
                  ],
            correctAnswer: match[3],
          });
        }
        if (localQuestions.length === 0) {
          return NextResponse.json(
            { error: "AI returned malformed content. Please try again." },
            { status: 500 },
          );
        }
      } catch {
        return NextResponse.json(
          { error: "AI returned malformed content. Please try again." },
          { status: 500 },
        );
      }
    }

    const [questionPaper] = await db
      .insert(questionPapers)
      .values({
        name: examName,
        timeLimit: timeLimit,
        createdAt: new Date(Date.now()),
        subject: subject,
        difficulty: difficulty,
        generationType: generationType,
        userId: session.user.id,
      })
      .returning();

    const questionsInserted: (typeof questions.$inferInsert)[] =
      localQuestions.map((e, i) => {
        return {
          order: i,
          questionText: e.question,
          questionArguments: {
            options: e.options,
          },
          answer: {
            correctOption: [e.options.findIndex((f) => f === e.correctAnswer)],
          },
          questionType: QuestionType.SingleCorrectOption,
          marksCorrect: 4,
          marksIncorrect: -1,

          qpId: questionPaper.id,
          solution: null,
        };
      });

    const questionList = await db
      .insert(questions)
      .values(questionsInserted)
      .returning();

    const [testSession] = await db
      .insert(testSessions)
      .values({
        attemptedAt: new Date(Date.now()),
        qpId: questionPaper.id,
        userId: session.user.id,
        submittedAt: undefined,
      })
      .returning();

    const responsesInserted: (typeof responses.$inferInsert)[] =
      questionList.map((e) => ({
        timeTaken: null,
        responseType: QuestionType.SingleCorrectOption,
        marked: false,
        questionId: e.id,
        sessionId: testSession.id,
        responseValue: null,
      }));

    const responseList = await db.insert(responses).values(responsesInserted);

    return NextResponse.json({
      questions: localQuestions,
      questionPaperId: questionPaper.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
