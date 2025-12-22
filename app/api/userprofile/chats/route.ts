import db from "@/db/db";
import { chats } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json(
        { success: false, msg: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return Response.json(
        { success: false, msg: "ticketId missing" },
        { status: 400 }
      );
    }

    const response = await db
      .select()
      .from(chats)
      .where(and(eq(chats.userEmail, userEmail), eq(chats.ticketId, ticketId)));

    return Response.json({
      success: true,
      chats: response,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
