import db from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  const userId = token?.sub;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const response = await db.select().from(users).where(eq(users.id, userId));
    return NextResponse.json({ message: "Fetched details", response });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Internal server error",
      success: false,
    });
  }
}
