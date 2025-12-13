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
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const response = await axios.get("/api/cart/fetchcart");

    if (response.data.success) {
      console.log(response.data.items);

      setProducts(response.data.items);
      setLoading(false);
    } else {
      console.log("error fetching cart from DB", response.data.error);
    }
  }

  return (
    <CartItems
      loading={loading}
      products={products}
      setProducts={setProducts}
    />
  );
};

export default page;
