import db from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { phone, id } = await req.json();
  const userId = id;

  console.log(userId, phone, id);
  if (!userId || !phone)
    return Response.json({ message: "send correct details" }, { status: 500 });

  try {
    const response = await db
      .update(users)
      .set({
        phone: phone,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: "Phone number updated!",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error updating",
      success: true,
    });
  }
}
