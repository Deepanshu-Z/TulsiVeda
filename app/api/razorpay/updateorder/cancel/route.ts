import db from "@/db/db";
import { orders } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export const PATCH = async (req: Request) => {
  const { orderId } = await req.json();
  try {
    const result = await db
      .update(orders)
      .set({ order_status: "cancelled" })
      .where(
        and(eq(orders.order_id, orderId), ne(orders.order_status, "failed")),
      );

    return Response.json({
      success: true,
      message: "Successfully cancelled order",
    });
  } catch (error) {
    return Response.json({
      error,
      success: false,
      message: "error cancelling order",
    });
  }
};
