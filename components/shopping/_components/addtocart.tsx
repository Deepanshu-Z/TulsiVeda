import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cart, cartItems, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { useSession } from "next-auth/react";
import action from "./action";

export default function AddToCart(id: any) {
  const { data: session, status } = useSession();

  return (
    <Button
      className="cursor-pointer"
      onClick={() => action({ session, status, id })}
    >
      Add to Cart
    </Button>
  );
}
