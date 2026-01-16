import db from "@/db/db";
import { cart, cartItems } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    //@ts-ignore
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    //@ts-ignore
    const userId = session.user.id;

    // 1️⃣ Get or create active cart
    const [existingCart] = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.status, "active")));

    const cartId =
      existingCart?.id ??
      (
        await db
          .insert(cart)
          .values({ userId, status: "active" })
          .returning({ id: cart.id })
      )[0].id;

    // 2️⃣ Check item
    const [item] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
      );

    if (item) {
      await db
        .update(cartItems)
        .set({ quantity: sql`${cartItems.quantity} + 1` })
        .where(eq(cartItems.id, item.id));
    } else {
      await db.insert(cartItems).values({
        cartId,
        productId,
        quantity: 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Error adding to cart" },
      { status: 500 }
    );
  }
}
