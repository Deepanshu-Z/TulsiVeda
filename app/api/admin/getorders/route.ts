import db from "@/db/db";
import { orders } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm"; // 1. Import 'eq'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit")) || 5;
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("statusFilter");
  const offset = (page - 1) * limit;
  type OrderStatus = "created" | "paid" | "failed" | "cancelled";

  console.log(status);
  try {
    const whereCondition =
      status && status !== "ALL"
        ? eq(orders.order_status, status as OrderStatus)
        : undefined;

    // Paginated data
    const recentOrders = await db
      .select()
      .from(orders)
      .where(whereCondition)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereCondition);

    const totalPages = Math.ceil(count / limit);

    return Response.json({
      success: true,
      recentOrders,
      meta: {
        page,
        limit,
        totalRecords: count,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return Response.json(
      {
        success: false,
        message: "Error fetching orders",
      },
      { status: 500 },
    );
  }
};
