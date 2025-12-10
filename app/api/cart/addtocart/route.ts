import db from "@/db/db";
import { cart, cartItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: Request) {
  const body = await req.json();
  const { session, productId } = body;
  console.log("HI FROM SERVER", session, productId.id);
  try {
    //@ts-ignore
    const userId = session.user?.id;

    // 1️⃣ Check for existing active cart
    const existingCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.status, "active")));

    let cartId;

    if (existingCart.length > 0) {
      // cart already exists
      cartId = existingCart[0].id;
    } else {
      // 2️⃣ Create a new cart
      const newCart = await db
        .insert(cart)
        .values({
          userId,
          status: "active",
        })
        .returning({ id: cart.id });

      cartId = newCart[0].id;
    }

    // 3️⃣ Check if product exists in cartItems
    const product = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId.id))
      );

    if (product.length > 0) {
      // 4️⃣ Update quantity
      const existingQty = product[0].quantity;

      await db
        .update(cartItems)
        .set({ quantity: existingQty + 1 })
        .where(
          and(
            eq(cartItems.cartId, cartId),
            eq(cartItems.productId, productId.id)
          )
        );
    } else {
      // 5️⃣ Insert new cart item
      await db.insert(cartItems).values({
        cartId,
        productId: productId.id,
        quantity: 1,
      });
    }

    return NextResponse.json({
      message: "Successfully added to cart & updated quantity",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      error,
      message: "Error adding to cart",
      success: false,
    });
  }
}
