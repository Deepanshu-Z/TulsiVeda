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
  const [createdOrders] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(orders)
    .where(
      sql`${orders.user_id} = ${userId} AND ${orders.order_status} = 'created'`,
    );

  const [paidAmountResult] = await db
    .select({
      sum: sql<number>`cast(COALESCE(SUM(${orders.amount}), 0) as int)`,
    })
    .from(orders)
    .where(
      sql`${orders.user_id} = ${userId} AND ${orders.order_status} = 'paid'`,
    );
  const monthlyRevenue = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'YYYY-MM')`,
      total: sql<number>`cast(sum(${orders.amount}) as int)`,
    })
    .from(orders)
    .where(
      sql`
      ${orders.user_id} = ${userId}
      AND ${orders.order_status} = 'paid'
      AND ${orders.createdAt} >= date_trunc('month', now()) - interval '3 months'
    `,
    )
    .groupBy(sql`date_trunc('month', ${orders.createdAt})`)
    .orderBy(sql`date_trunc('month', ${orders.createdAt}) DESC`);
  console.log("HEY@@", monthlyRevenue);
  return Response.json({
    success: true,
    stats: {
      totalOrders: totalOrders.count || 0,
      cancelledOrders: cancelledOrders.count || 0,
      failedPayments: failedPayments.count || 0,
      createdOrders: createdOrders.count || 0,
      totalAmount: paidAmountResult.sum || 0,
      monthlyRevenue: monthlyRevenue,
    },
  });
}
