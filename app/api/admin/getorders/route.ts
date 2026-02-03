import db from "@/db/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export const GET = async () => {
  try {
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);
    console.log("RECENT ORDERS ARE: ", recentOrders);
    return Response.json({
      success: true,
      recentOrders,
      message: "Successfuly fetched orders",
    });
  } catch (error) {
    return Response.json({
      error,
      message: "error getting orders",
      success: false,
    });
  }
};
