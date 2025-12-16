import db from "@/db/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const response = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId));
    return NextResponse.json({
      message: "Address fetched successfully",
      success: true,
      response,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching address: ",
      error,
      success: false,
    });
  }
}
