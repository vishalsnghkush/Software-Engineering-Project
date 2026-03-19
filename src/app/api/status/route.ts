import { db } from "@/db/schema";
import { users } from "@/db/schema/users";
import { InferInsertModel } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  type insertData = InferInsertModel<typeof users>;

  const insertionData: insertData = {
    email: "test@email.com",
    name: "Test",
    password: "test",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  };

  const data = await db.insert(users).values(insertionData).returning();

  return NextResponse.json({ ...data, status: 200 });
};
