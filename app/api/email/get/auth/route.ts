import db from "@/db/db";
import { chats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  try {
    const response = await db
      .select({
        email: chats.userEmail,
        content: chats.content,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(eq(chats.userEmail, session?.user?.email!));

    return Response.json({
      success: true,
      chats: response,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
