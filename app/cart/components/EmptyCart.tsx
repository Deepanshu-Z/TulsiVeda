import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function EmptyCartPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold">Your cart is empty</h1>

          <p className="text-sm text-muted-foreground">
            Looks like you haven’t added anything to your cart yet.
          </p>

          <Link href="/">
            <Button className="cursor-pointer w-full">Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
