import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import db from "@/db/db";
import { orders, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = await session?.user.id;
  if (!productId)
    return Response.json({ status: 500, message: "No product ID " });
  try {
    const product = await db
      .select({
        price: products.price,
        discountPrice: products.discountPrice,
      })
      .from(products)
      .where(eq(products.id, productId));

    if (!product)
      return Response.json({ status: 404, message: "Product does not found" });

    const order = await razorpay.orders.create({
      amount:
        (product[0].price - product[0].discountPrice!) * 100 +
        ((product[0].price - product[0].discountPrice!) * 100 * 5) / 100, // ₹500 → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const response = await db.insert(orders).values({
      order_id: order.id,
      user_id: userId,
      amount: order.amount_due / 100,
      currency: order.currency,
      order_status: "created ",
    });

    return Response.json({
      order,
      success: true,
      message: "Successfully created",
    });
  } catch (error) {
    return Response.json({
      error,
      success: false,
      message: "error creating orders",
    });
  }
}
