import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/db/db";
import { ticket } from "@/db/schema";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { input } = await req.json();
  const session = await getServerSession(authOptions);

  //@ts-ignore
  const userId = session?.user.id;
  try {
    const response = await db
      .insert(ticket)
      .values({
        subject: input,
        userId: userId,
      })
      .returning({ id: ticket.id });
    return Response.json(
      { success: true, ticketId: response[0].id },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
