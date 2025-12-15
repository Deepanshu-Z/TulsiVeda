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
    name: "Herbal Daily Shampoo",
    description:
      "A gentle herbal shampoo designed to support everyday hair cleansing and freshness.",
    price: "₹399",
    image: "/products/herbal-shampoo.png",
    inStock: false,
  },
  {
    id: "2",
    name: "Ayurvedic Hair Cleanse Wash",
    description:
      "Formulated with traditional herbs to support regular hair washing as part of a hygiene routine.",
    price: "₹449",
    image: "/products/hair-wash.png",
    inStock: false,
  },
  {
    id: "3",
    name: "Herbal Hand Wash",
    description:
      "A mild hand wash designed to support daily hand hygiene while being gentle on skin.",
    price: "₹199",
    image: "/products/hand-wash.png",
    inStock: false,
  },
  {
    id: "4",
    name: "Ayurvedic Body Cleanser",
    description:
      "A refreshing body cleanser created for everyday cleansing and skin comfort.",
    price: "₹299",
    image: "/products/body-cleanser.png",
    inStock: false,
  },
  {
    id: "5",
    name: "Herbal Hair Removal Cream",
    description:
      "A personal care formulation designed to support easy and convenient hair removal.",
    price: "₹349",
    image: "/products/hair-removal.png",
    inStock: false,
  },
  {
    id: "6",
    name: "Daily Face Wash",
    description:
      "A gentle face wash formulated to support daily cleansing without harshness.",
    price: "₹249",
    image: "/products/face-wash.png",
    inStock: false,
  },
  {
    id: "7",
    name: "Herbal Intimate Wash",
    description:
      "Carefully formulated to support daily intimate hygiene as part of a personal care routine.",
    price: "₹299",
    image: "/products/intimate-wash.png",
    inStock: false,
  },
  {
    id: "8",
    name: "Ayurvedic Liquid Soap",
    description:
      "A smooth liquid soap designed for everyday hand and body cleansing.",
    price: "₹189",
    image: "/products/liquid-soap.png",
    inStock: false,
  },
  {
    id: "9",
    name: "Herbal Foaming Face Cleanser",
    description:
      "A lightweight foaming cleanser created to support fresh and clean-feeling skin.",
    price: "₹279",
    image: "/products/foaming-cleanser.png",
    inStock: false,
  },
  {
    id: "10",
    name: "Daily Hygiene Combo",
    description:
      "A curated set of essential hygiene products designed for everyday personal care needs.",
    price: "₹1,299",
    image: "/products/hygiene-combo.png",
    inStock: false,
  },
];

export default function Page() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">Hygiene Products</h2>
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
