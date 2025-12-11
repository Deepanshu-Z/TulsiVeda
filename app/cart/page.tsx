"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CartItems } from "./components/CartItems";
export type ProductType = {
  cartItemId: string;
  discountPrice: number;
  image: string[];
  name: string;
  price: number;
  productId: number;
  quantity: number;
};
const page = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    fetchCart();
  }, [status]);
  async function fetchCart() {
    if (status === "authenticated") {
      const response = await axios.get("/api/cart/fetchcart");

      if (response.data.success) {
        console.log(response.data.items);
        setProducts(response.data.items);
      } else {
        console.log("error fetching cart from DB", response.data.error);
      }
    } else if (status == "loading") {
      console.log("Waiting for status");
    } else {
      console.log("looking for localstorage");
    }
  }

  return (
    <CartItems products={products} setProducts={setProducts} />
    // <div className="pt-40 bg-red-500 w-full">
    //   {products?.map((m: ProductType, i) => (
    //     <div key={i}>
    //       <p>{m.cartItemId}</p>
    //       <p>{m.cartItemId}</p>
    //     </div>
    //   ))}
    // </div>
  );
};

export default page;
