import db from "@/db/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = token.sub;

  try {
    const response = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId));

    return NextResponse.json({
      success: true,
      message: "Address fetched successfully",
      response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching address" },
      { status: 500 }
    );
  }
}
