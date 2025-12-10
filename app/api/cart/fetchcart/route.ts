import db from "@/db/db";
import { cart, cartItems, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const response = await db
      .select()
      .from(cart)
      //@ts-ignore
      .where(and(eq(cart.userId, session?.user.id), eq(cart.status, "active")));
    if (response.length === 0)
      return NextResponse.json({ message: "No cart exists", success: false });

    const cartid = response[0]?.id;
    const items = await db
      .select({
        cartItemId: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        name: products.name,
        price: products.price,
        discountPrice: products.discountPrice,
        image: products.galleryImages,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartid));

    return NextResponse.json({ items, status: 200, success: true });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
}
