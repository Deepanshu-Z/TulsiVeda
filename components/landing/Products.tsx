"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Products() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* @@@@@@@@@@@@@@@@@@@@@@@Heading@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Our Best Sellers
          </h2>
          <p className="text-muted-foreground text-lg">
            Premium quality. Modern design. Made for everyday use.
          </p>
        </div>

        {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@2-Product Grid @@@@@@@@@@@@@@@@@@@@@@@@@*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* PRODUCT 1 */}
          <Link href={"/shop/1"}>
            <Card className="rounded-3xl border border-black/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-300">
              <CardContent className="p-6 space-y-6">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/product1.jpg"
                    alt="Product 1"
                    width={600}
                    height={500}
                    className="w-full h-[360px] object-cover rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    New Arrival
                  </Badge>
                  <h3 className="text-2xl font-semibold">
                    Premium Leather Shoes
                  </h3>
                  <p className="text-muted-foreground">
                    Crafted for comfort & style, made with high-grade leather.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold">₹2,499</span>
                  <Button className="rounded-full px-6">Shop Now</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ PRODUCT 2@@@@@@@@@@@@@@@@@@@@@@ */}
          <Link href={"/shop/1"}>
            <Card className="rounded-3xl border border-black/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-300">
              <CardContent className="p-6 space-y-6">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="/product2.jpg"
                    alt="Product 2"
                    width={600}
                    height={500}
                    className="w-full h-[360px] object-cover rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Trending
                  </Badge>
                  <h3 className="text-2xl font-semibold">
                    Luxury Handcrafted Wallet
                  </h3>
                  <p className="text-muted-foreground">
                    Minimal, durable, and built with genuine premium leather.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold">₹1,299</span>
                  <Button className="rounded-full px-6">Shop Now</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
