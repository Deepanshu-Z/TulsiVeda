"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      name: "Health & Fitness",
      image:
        "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765791589/Beige_and_Black_Illustrated_Fitness_Promotional_Instagram_Post_ho8pbl.webp",
      link: "/categories/health",
    },
    {
      name: "Suppliments",
      image:
        "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765793345/Blue_Modern_Kids_Multivitamin_Instagram_Post_2_noacln.webp",
      link: "/categories/suppliments",
    },
    {
      name: "Skin",
      image:
        "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765793742/Beige_Pink_Beauty_Skin_Care_Instagram_Post_cxic5e.webp",
      link: "/categories/skin",
    },
    {
      name: "Hygiene",
      image:
        "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765799627/Pink_Playful_Biotechnology_Investor_Pitch_Deck_Presentation_ayeets.webp",
      link: "/categories/hygiene",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our premium collection across categories.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((item, idx) => (
            <Link href={item.link}>
              <Card
                key={idx}
                className="rounded-2xl border hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="h-80 relative  overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={100}
                      className=" object-cover"
                    />
                  </div>

                  <div className="p-4 text-center space-y-2">
                    <h3 className="font-semibold text-xl">{item.name}</h3>
                    <Button
                      variant="outline"
                      className="rounded-full mt-2 px-6"
                    >
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
