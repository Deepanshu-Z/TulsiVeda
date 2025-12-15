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
    name: "Ayurvedic Glow Support Cream",
    description:
      "An Ayurvedic skincare formulation designed to support daily skin nourishment and a healthy-looking glow when used as part of a regular skincare routine.",
    price: "₹599",
    image: "/products/glow-cream.png",
    inStock: false,
  },
  {
    id: "2",
    name: "Herbal Skin Hydration Gel",
    description:
      "A lightweight herbal gel formulated to support skin hydration and comfort for everyday use.",
    price: "₹499",
    image: "/products/hydration-gel.png",
    inStock: false,
  },
  {
    id: "3",
    name: "Ayurvedic Skin Balance Serum",
    description:
      "Carefully selected Ayurvedic ingredients designed to support balanced-looking skin as part of a consistent skincare routine.",
    price: "₹799",
    image: "/products/skin-serum.png",
    inStock: false,
  },
  {
    id: "4",
    name: "Daily Herbal Face Cleanser",
    description:
      "A gentle herbal cleanser created to support daily cleansing without stripping natural skin moisture.",
    price: "₹399",
    image: "/products/face-cleanser.png",
    inStock: false,
  },
  {
    id: "5",
    name: "Ayurvedic Skin Nourish Lotion",
    description:
      "A smooth Ayurvedic lotion designed to support skin softness and everyday care with regular use.",
    price: "₹699",
    image: "/products/skin-lotion.png",
    inStock: false,
  },
];

export default function Page() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">Skin Products</h2>
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
