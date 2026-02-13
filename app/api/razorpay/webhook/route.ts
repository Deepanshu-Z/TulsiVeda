export const runtime = "nodejs";

import db from "@/db/db";
import { orders, payments } from "@/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user.id;
  console.log(
    "WEBHOOk RAANNNN!!!!!!!!!!",
    "USER ID is: ",
    userId,
    "session is: ",
    session,
  );
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload.payment.entity;

      await db.transaction(async (tx) => {
        // 1. Mark order as PAID
        await tx
          .update(orders)
          .set({
            order_status: "paid",
            updatedAt: new Date(),
          })
          .where(eq(orders.order_id, payment.order_id));

        // 2. Create payment record
        await tx.insert(payments).values({
          user_id: userId,
          order_id: payment.order_id, // 👈 FROM WEBHOOK
          payment_id: payment.id,
          signature, // webhook signature header
          amount: payment.amount / 100,
          method: payment.method,
          payment_status: "success",
        });
      });

      break;
    }

    case "payment.failed": {
      const payment = event.payload.payment.entity;

      await db.transaction(async (tx) => {
        await tx
          .update(orders)
          .set({
            order_status: "failed",
            updatedAt: new Date(),
          })
          .where(eq(orders.order_id, payment.order_id));

        await tx.insert(payments).values({
          user_id: userId,
          order_id: payment.order_id,
          payment_id: payment.id,
          amount: payment.amount / 100,
          method: payment.method,
          payment_status: "failed",
        });
      });

      break;
    }
  }

  return NextResponse.json({ status: "ok" });
}
