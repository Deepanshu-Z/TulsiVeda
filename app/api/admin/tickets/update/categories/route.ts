import db from "@/db/db";
import { ticket } from "@/db/schema";
import { eq } from "drizzle-orm";

export const PUT = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const id = searchParams.get("ticketId");
  console.log("details are: ", status, id);
  if (
    !status ||
    !id ||
    !["open", "completed", "pending", "replied"].includes(status)
  )
    return Response.json({
      status: 500,
      message: "Please provide ID & Status",
    });
  try {
    const validStatuses = status as
      | "open"
      | "completed"
      | "pending"
      | "replied";
    const response = await db
      .update(ticket)
      .set({
        status: validStatuses,
      })
      .where(eq(ticket.id, id));

    return Response.json({
      status: 200,
      message: "Successfully updated category",
    });
  } catch (error) {
    return Response.json({ message: "Error updating categories", error });
  }
};
