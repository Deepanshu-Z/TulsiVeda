import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/db/db";
import { cart } from "@/db/schema";
import { getProductsById } from "@/lib/products/getProductsById";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";

export const POST = async () => {
  const session = await getServerSession(authOptions);
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  //@ts-ignore
  const userId = session?.user.id;
  console.log("@YO YO YO");
  try {
    const response = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.status, "active")));

    if (!response[0].id)
      return Response.json({
        status: 404,
        message: "Does not found Cart ID",
        success: false,
      });
    const price = await getProductsById(response[0].id);

    const order = await razorpay.orders.create({
      amount: price * 100, // ₹500 → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return Response.json({ order, success: true });
  } catch (error) {
    return Response.json({ success: false });
  }
};
