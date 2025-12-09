import db from "@/db/db";
import { cart, cartItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const action = async ({ session, status, id }: any) => {
  //lookfor = DB
  if (status === "authenticated") {
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
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, id)));

    if (product.length > 0) {
      // 4️⃣ Update quantity
      const existingQty = product[0].quantity;

      await db
        .update(cartItems)
        .set({ quantity: existingQty + 1 })
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, id)));
    } else {
      // 5️⃣ Insert new cart item
      await db.insert(cartItems).values({
        cartId,
        productId: id,
        quantity: 1,
      });
    }
  }

  // lookfor = LOCAL-STORAGE
  else {
    // Step 1: Get existing cart from localStorage
    // If it doesn't exist, initialize an empty array
    let localCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // localCart format:
    // [
    //   { productId: "xxx", quantity: 2 },
    //   { productId: "yyy", quantity: 1 }
    // ]

    // Step 2: Check if the product already exists in the cart
    const existingItemIndex = localCart.findIndex(
      (item: any) => item.productId === id
    );

    // Step 3: If product exists, update quantity
    if (existingItemIndex !== -1) {
      localCart[existingItemIndex].quantity += 1;
    }

    // Step 4: If product does not exist, insert new product
    else {
      localCart.push({
        productId: id,
        quantity: 1,
      });
    }

    // Step 5: Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(localCart));
  }
};

export default action;
