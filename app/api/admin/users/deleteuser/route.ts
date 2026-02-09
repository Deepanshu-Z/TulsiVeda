import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import db from "@/db/db";
import { addresses, cart, chats, ticket, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const DELETE = async (req: Request) => {
  const { userId } = await req.json();
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const role = session?.user.role;
  console.log(role);
  console.log("id", userId);
  try {
    await db.transaction(async (tx) => {
      // 1️⃣ delete chats linked to user's tickets
      const userTickets = await tx
        .select({ id: ticket.id })
        .from(ticket)
        .where(eq(ticket.userId, userId));

      const ticketIds = userTickets.map((t) => t.id);

      if (ticketIds.length) {
        await tx.delete(chats).where(inArray(chats.ticketId, ticketIds));
      }

      // 2️⃣ delete tickets
      await tx.delete(ticket).where(eq(ticket.userId, userId));

      // 3️⃣ other direct children
      await tx.delete(cart).where(eq(cart.userId, userId));
      await tx.delete(addresses).where(eq(addresses.userId, userId));

      // 4️⃣ finally delete user
      await tx.delete(users).where(eq(users.id, userId));
    });
    return Response.json({ message: "Successfully deleted", success: true });
  } catch (error) {
    return Response.json({
      message: "failed to delete",
      success: false,
      error,
    });
  }
};
