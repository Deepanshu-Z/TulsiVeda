import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AddToCart = (id: any) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
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
    } else {
      router.replace("/auth/getstarted");
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
