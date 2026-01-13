"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export type ProductType = {
  id: string;

  name: string;
  title: string;
  category:
    | "Uncategorized"
    | "Health & Fitness"
    | "Suppliments"
    | "Skin"
    | "Hygiene";
  medicineType: "powder" | "capsule" | "tablet" | "liquid";
  form: string;

  description: string;
  directions: string;
  warnings: string | null;

  price: number;
  discountPrice: number;

  inStock: number;

  allergens: string;
  ingredients: string;
  certifications: string;
  goal: string;

  galleryImages: string[];

  manufacturedDate: string; // ISO
  expiryDate: string; // ISO
  createdAt: string; // ISO
};
const page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const fetchAllProducts = async () => {
    const response = await axios.get("/api/admin/products/getallproducts");
    console.log(response.data.response);
    setProducts(response.data.response);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-0">
      {products.map((product: any) => (
        <Card key={product.id} className="w-[320px]  overflow-hidden">
          {/* Image */}
          <img
            src={product.galleryImages?.[0]}
            alt={product.title}
            className="h-100 w-full object-cover"
          />

          <CardHeader className="space-y-1">
            <CardTitle className="text-base line-clamp-2">
              {product.title}
            </CardTitle>

            <CardDescription className="text-sm line-clamp-3">
              {product.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-end">
            <Link href={`/admin/inventory/product/${product.id}`}>
              <Button size="sm">Edit Product</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default page;
