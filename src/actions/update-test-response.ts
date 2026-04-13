"use server";

import { db } from "@/db/schema";
import { responses } from "@/db/schema/responses";
import { responsesHistory } from "@/db/schema/responsesHistory";
import { auth } from "@/lib/auth";
import { ResponseValueSchema } from "@/lib/zod/responses";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

export const updateTestResponse = async (
  responseId: string,
  timeSpent: number,
  payload?: z.infer<typeof ResponseValueSchema>,
  marked?: boolean,
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const currentTime = new Date(Date.now());

  const [{ id, ...oldResponse }] = await db
    .select()
    .from(responses)
    .where(eq(responses.id, responseId));

  await db
    .insert(responsesHistory)
    .values({ ...oldResponse, responseId, attemptedAt: currentTime });

  await db
    .update(responses)
    .set({
      ...(marked !== undefined && { marked }),
      ...(payload !== undefined && { responseValue: payload }),
      timeTaken: timeSpent,
      attemptedAt: currentTime,
    })
    .where(eq(responses.id, responseId));

  return { sucess: "Successfully updated response" };
};
