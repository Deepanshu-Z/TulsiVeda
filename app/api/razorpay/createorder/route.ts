import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import db from "@/db/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  console.log(productId);
  if (!productId)
    return Response.json({ status: 500, messaage: "No product ID " });
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
      amount: (product[0].price - product[0].discountPrice!) * 100, // ₹500 → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
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
