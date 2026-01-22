"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}
type PayButtonProps = {
  productId: string;
};
export default function PayButton() {
  ///VARS......................///////////////////
  const [buyError, setBuyError] = useState("");
  const [buyLoading, setBuyLoading] = useState<boolean>(false);

  ///FUNCTIONS......................///////////////////
  const createOrder = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      setBuyError("");
      setBuyLoading(true);

      const { data } = await axios.post(
        "/api/razorpay/createorder/cartproducts",
      );

      if (!data?.success) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Tulsiveda",
        handler: async (response: any) => {
          console.log("@@RESPONSE: ", response);
          await fetch("/api/razorpay/verifypayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          alert("Payment verified");
        },
        modal: {
          ondismiss: () => {
            fetch("/api/razorpay/updateorder/cancel", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.order.id,
                reason: "USER_CANCELLED",
              }),
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // use data.orderId, data.amount, etc.
    } catch (err: any) {
      setBuyError(err?.response?.data?.message || "Failed to create order");
    } finally {
      setBuyLoading(false);
    }
  };

  ///RENDERING......................///////////////////
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Button
        onClick={createOrder}
        variant="default"
        className="w-full"
        disabled={buyLoading}
      >
        {buyLoading ? "Processing..." : "Buy Now"}
      </Button>

      {buyError && <p className="text-red-500 text-sm mt-2">{buyError}</p>}
    </>
  );
}
