import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

import db from "@/db/db";
import { products, ratings, cartItems, orderItems } from "@/db/schema";

import { eq } from "drizzle-orm";

export const DELETE = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    //@ts-ignore
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // 2️⃣ Read productId
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId required" },
        { status: 400 },
      );
    }

    // 3️⃣ Transaction = all-or-nothing
    await db.transaction(async (tx) => {
      // 🔹 delete dependent tables FIRST
      await tx.delete(ratings).where(eq(ratings.productId, productId));
      await tx.delete(cartItems).where(eq(cartItems.productId, productId));
      await tx.delete(orderItems).where(eq(orderItems.product_id, productId));

      // 🔹 finally delete product
      await tx.delete(products).where(eq(products.id, productId));
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 },
    );
  }
};
