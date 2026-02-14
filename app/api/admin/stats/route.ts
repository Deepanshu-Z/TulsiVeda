import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { orders, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import db from "@/db/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    return Response.json({ success: false }, { status: 401 });
  }

  // 1. Total Orders
  const [totalOrders] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(orders)
    .where(eq(orders.user_id, userId));

  // 2. Cancelled Orders
  const [cancelledOrders] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(orders)
    .where(
      sql`${orders.user_id} = ${userId} AND ${orders.order_status} = 'cancelled'`,
    );

  // 3. Failed Payments (FIXED)
  // We use a LEFT JOIN to ensure we see the order even if the payment record is wonky,
  // OR we check the payments table specifically.
  const [failedPayments] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(payments)
    .leftJoin(orders, eq(payments.order_id, orders.order_id))
    .where(
      sql`${orders.user_id} = ${userId} AND ${payments.payment_status} = 'failed'`,
    );

  // 4. Total Amount
  const [totalResult] = await db
    .select({
      sum: sql<number>`cast(COALESCE(SUM(${orders.amount}), 0) as int)`,
    })
    .from(orders)
    .where(eq(orders.user_id, userId));

  return Response.json({
    success: true,
    stats: {
      totalOrders: totalOrders.count || 0,
      cancelledOrders: cancelledOrders.count || 0,
      failedPayments: failedPayments.count || 0,
      totalAmount: (totalResult.sum || 0) / 100, // Convert paise to Rupees if needed
    },
  });
}
