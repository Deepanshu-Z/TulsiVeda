import db from "@/db/db";
import { orders } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit")) || 5;
  const page = Number(searchParams.get("page")) || 1;
  const offset = (page - 1) * limit;

  try {
    // Paginated data
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const totalPages = Math.ceil(count / limit);

    return Response.json({
      success: true,
      data: recentOrders,
      meta: {
        page,
        limit,
        totalRecords: count,
        totalPages,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error fetching orders",
      },
      { status: 500 },
    );
  }
};
