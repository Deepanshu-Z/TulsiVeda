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
import { useEffect, useState } from "react";
import getproductdetails from "./actions/getproductdetals";
import { string } from "zod";
import AddToCart from "@/components/shopping/components/AddToCart";
import he from "he";
import axios from "axios";
import PayButton from "../payment/pay/PayButton";

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
  createdAt: string;

  galleryImages: string[];

  warnings: string | null;
};

export default function SingleProduct({ id }: { id: string }) {
  ////VARS..............................
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState("");

  ////FUNCTION/////////////..............................
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const response = await getproductdetails(id);
      console.log(response);
      setProduct(response);
      setSelectedImage(response.galleryImages[0]);
      setLoading(false);
    }
    fetchProduct();
  }, []);

  ////RENDERING/////////////..............................
  if (loading) {
    return (
      <div className="p-10 space-y-4">
        <div className="bg-gray-200 h-6 w-1/3 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* PRODUCT IMAGES + INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: PRODUCT IMAGE */}
        <Card className="overflow-hidden ">
          {/* Main Image */}
          <CardContent className="p-0">
            <Image
              src={selectedImage}
              alt="Product Image"
              width={600}
              height={500}
              className="w-full h-[400px] object-cover"
              priority
            />
          </CardContent>

          {/* Thumbnails */}
          <CardContent className="flex gap-2 p-3 overflow-x-auto">
            {product?.galleryImages?.map((image, index) => (
              <button
                key={index}
                className="border rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index}`}
                  width={80}
                  height={80}
                  className="object-cover w-20 h-20"
                />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* RIGHT: INFO */}
        <div className="space-y-4">
          <Badge className="cursor-pointer" variant="secondary">
            {product?.category}
          </Badge>

          <h1 className="text-3xl font-bold">{product?.name}</h1>

          <p className="text-muted-foreground">{product?.title}</p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">
              ₹{product?.discountPrice}
            </span>
            <span className="line-through text-muted-foreground">
              ₹{product?.price}
            </span>
          </div>

          <Separator />

          <div className="space-y-3">
            <AddToCart id={id} />

            <PayButton productId={product?.id!} />
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="mt-12">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* DESCRIPTION */}
          <TabsContent value="description">
            <Card className="rounded-xl border bg-background shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Product Description
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: he.decode(product?.description ?? ""),
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPECIFICATIONS */}
          <TabsContent value="specs">
            <Card className="p-5 space-y-2">
              <p>
                <strong>Form:</strong>{" "}
                <span>
                  {" "}
                  <Badge className="cursor-pointer" variant="outline">
                    {product?.form}
                  </Badge>
                </span>
              </p>
              <p>
                <strong>Goal:</strong>{" "}
                {product?.goal.map((g) => (
                  <span>
                    {" "}
                    <Badge className="cursor-pointer" variant="outline">
                      {g}
                    </Badge>
                  </span>
                ))}
              </p>
              <p>
                <strong>Ingredients:</strong>{" "}
                {product?.ingredients.map((i) => (
                  <span>
                    {" "}
                    <Badge className="cursor-pointer" variant="outline">
                      {i}
                    </Badge>
                  </span>
                ))}
              </p>
              <p>
                <strong>Allergens:</strong>
                {product?.allergens.map((a) => (
                  <span>
                    {" "}
                    <Badge className="cursor-pointer" variant="outline">
                      {a}
                    </Badge>
                  </span>
                ))}
              </p>
              <p>
                <strong>Directions:</strong>{" "}
                <Badge className="cursor-pointer" variant="outline">
                  {product?.directions}
                </Badge>
              </p>
              <p>
                <strong>Certifications:</strong>
                {product?.certifications.map((c) => (
                  <span>
                    {" "}
                    <Badge className="cursor-pointer" variant="outline">
                      {c}
                    </Badge>
                  </span>
                ))}
              </p>
              <p>
                <strong>Manufactured Date:</strong>{" "}
                <Badge className="cursor-pointer" variant="outline">
                  {product?.manufacturedDate}
                </Badge>
              </p>
              <p>
                <strong>Expiry date:</strong>{" "}
                <Badge className="cursor-pointer" variant="outline">
                  {product?.expiryDate}
                </Badge>
              </p>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is the shoe waterproof?</AccordionTrigger>
                <AccordionContent>
                  Yes, the leather is water-resistant for mild conditions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a return policy?</AccordionTrigger>
                <AccordionContent>
                  7-day replacement available for manufacturing defects.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
