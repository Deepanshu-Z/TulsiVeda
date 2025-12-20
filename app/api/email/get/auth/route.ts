import db from "@/db/db";
import { mails } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  try {
    const response = await db
      .select({
        subject: mails.subject,
        email: mails.userEmail,
        content: mails.content,
        createdAt: mails.createdAt,
      })
      .from(mails)
      .where(eq(mails.userEmail, session?.user?.email!));

    return Response.json({
      success: true,
      mails: response,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
