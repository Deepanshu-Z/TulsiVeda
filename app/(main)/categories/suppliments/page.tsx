import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  inStock: boolean;
};

const products: Product[] = [
  {
    id: "1",
    name: "Ayurvedic Fat Burner",
    description:
      "An Ayurvedic formulation designed to support metabolism and active daily routines when combined with proper diet and exercise.",
    price: "₹600",
    image:
      "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765780898/nutrivya2_titil6.png",
    inStock: true,
  },
  {
    id: "2",
    name: "Ayurvedic Weight Support Formula",
    description:
      "Carefully selected Ayurvedic ingredients to support overall nutrition and consistent lifestyle habits.",
    price: "₹1,299",
    image: "/products/weight-support.png",
    inStock: false,
  },
  {
    id: "3",
    name: "Daily Wellness Combo",
    description:
      "A balanced combination formulated to complement everyday wellness and recovery routines.",
    price: "₹2,499",
    image: "/products/combo.png",
    inStock: false,
  },
  {
    id: "4",
    name: "Herbal Metabolism Support",
    description:
      "Designed to support metabolic activity and daily energy as part of an active lifestyle.",
    price: "₹1,199",
    image: "/products/metabolism-support.png",
    inStock: false,
  },
  {
    id: "5",
    name: "Ayurvedic Nutrition Blend",
    description:
      "A clean Ayurvedic blend created to support daily nutritional intake and overall wellness.",
    price: "₹999",
    image: "/products/nutrition-blend.png",
    inStock: false,
  },
  {
    id: "6",
    name: "Active Lifestyle Support",
    description:
      "Formulated to complement regular physical activity, balanced meals, and disciplined routines.",
    price: "₹1,499",
    image: "/products/active-lifestyle.png",
    inStock: false,
  },
  {
    id: "7",
    name: "Herbal Wellness Formula",
    description:
      "Traditional Ayurvedic ingredients selected to support general wellness and consistency.",
    price: "₹899",
    image: "/products/wellness-formula.png",
    inStock: false,
  },
];

export default function Page() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">Suppliments</h2>
          <p className="mt-4 text-muted-foreground">
            Thoughtfully formulated Ayurvedic nutrition for modern lifestyles.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className={cn(
                "cursor-pointer group relative overflow-hidden transition hover:shadow-lg",
                !product.inStock && "pointer-events-none opacity-80"
              )}
            >
              {/* IMAGE */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-transform group-hover:scale-105",
                    !product.inStock && "blur-sm"
                  )}
                />

                {/* OUT OF STOCK OVERLAY */}
                {!product.inStock && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                    <span className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="flex items-center justify-between">
                <span className="text-lg font-semibold">{product.price}</span>
                <Button size="sm" disabled={!product.inStock}>
                  {product.inStock ? "View Product" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
