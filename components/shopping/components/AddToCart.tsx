import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const AddToCart = (id: any) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>();

  async function handleCart() {
    if (status === "authenticated") {
      setLoading(true);
      const response = await axios.post("/api/cart/addtocart", {
        session,
        productId: id,
      });
      if (response.data.success) {
        console.log("Ok");
        setLoading(false);
      } else {
        console.log(response.data.error);
        console.log("Not ok");
      }
    }
    // lookfor = LOCAL-STORAGE
    else {
      console.log(id.id);
      const productId = id.id;
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
        (item: any) => item.productId == productId
      );

      // Step 3: If product exists, update quantity
      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity += 1;
      }

      // Step 4: If product does not exist, insert new product
      else {
        console.log(existingItemIndex);
        localCart.push({
          productId: productId,
          quantity: 1,
        });
      }

      // Step 5: Save updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(localCart));
    }
  }

  return (
    <div>
      {loading ? (
        <Button className="w-full">
          <Loader2 className="w-full animate-spin" />
        </Button>
      ) : (
        <Button className="w-full cursor-pointer" onClick={handleCart}>
          Add To Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
