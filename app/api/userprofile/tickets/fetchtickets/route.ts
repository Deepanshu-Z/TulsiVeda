import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/db/db";
import { ticket } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user.id;
  try {
    const response = await db
      .select()
      .from(ticket)
      .where(eq(ticket.userId, userId));

    return Response.json({
      success: true,
      tickets: response,
      msg: "Succesfully fetched",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
      msg: "Error fetching tickets",
    });
  }
};
