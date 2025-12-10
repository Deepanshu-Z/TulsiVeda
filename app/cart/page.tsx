"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const page = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState();
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
        console.log("Not authenticated fetching from localstorage");
      }
    } else if (status == "loading") {
      console.log("Waiting for status");
    } else {
      console.log("looking for localstorage");
    }
  }
  return <div className="bg-red-500 w-full">"HEY"</div>;
};

export default page;
