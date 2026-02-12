"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddToCart from "@/components/shopping/components/AddToCart";
import PayButton from "../payment/razorpay/singleproduct/PayButton";
import Link from "next/link";
import he from "he";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getproductdetails from "./actions/getproductdetals";
import { useEffect, useState } from "react";

// ---------------- TYPES ----------------
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  title: string;
  ingredients: string[];
  allergens: string[];
  goal: string[];
  certifications: string[];
  directions: string;
  form: string;
  manufacturedDate: string;
  expiryDate: string;
  galleryImages: string[];
  warnings: string | null;
};

// ---------------- COMPONENT ----------------
export default function SingleProduct({ id }: { id: string }) {
  const { status } = useSession();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getproductdetails(id),
    staleTime: 5 * 60 * 1000, // 5 min (products don't change often)
  });

  const selectedImage = product?.galleryImages?.[0] ?? "";

  // ---------------- STATES ----------------
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product?.galleryImages?.length) {
      setActiveImage(product.galleryImages[0]);
    }
  }, [product]);

  // ---------------- LOADING / ERROR ----------------
  if (isLoading) {
    return (
      <div className="p-10 space-y-4">
        <div className="bg-gray-200 h-6 w-1/3 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse"></div>
      </div>
    );
  }

  if (isError || !product) {
    return <p className="p-10">Failed to load product</p>;
  }

  // ---------------- RENDER ----------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE SECTION */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={activeImage || selectedImage}
              alt={product.name}
              width={600}
              height={500}
              className="w-full h-[400px] object-cover"
              priority
            />
          </CardContent>

          <CardContent className="flex gap-2 p-3 overflow-x-auto">
            {product.galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="border rounded-md overflow-hidden hover:ring-2 hover:ring-primary"
              >
                <Image
                  src={img}
                  alt={`thumb-${i}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <Badge variant="secondary">{product.category}</Badge>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.title}</p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.discountPrice}</span>
            <span className="line-through text-muted-foreground">
              ₹{product.price}
            </span>
          </div>

          <Separator />

          <AddToCart id={id} />

          {status === "unauthenticated" ? (
            <Link href={`/auth/getstarted/?path=/shop/${id}`}>
              <Button variant="outline" className="w-full">
                Buy Now
              </Button>
            </Link>
          ) : (
            <PayButton productId={product.id} />
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardContent className="p-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: he.decode(product.description),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs">
            <Card className="p-5 space-y-2">
              <p>
                <strong>Form:</strong> {product.form}
              </p>
              <p>
                <strong>Goals:</strong> {product.goal.join(", ")}
              </p>
              <p>
                <strong>Ingredients:</strong> {product.ingredients.join(", ")}
              </p>
              <p>
                <strong>Allergens:</strong> {product.allergens.join(", ")}
              </p>
              <p>
                <strong>Certifications:</strong>{" "}
                {product.certifications.join(", ")}
              </p>
              <p>
                <strong>Expiry:</strong> {product.expiryDate}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Accordion type="single" collapsible>
              <AccordionItem value="1">
                <AccordionTrigger>Is return available?</AccordionTrigger>
                <AccordionContent>
                  7-day replacement for manufacturing defects.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
