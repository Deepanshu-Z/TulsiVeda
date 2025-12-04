import db from "@/db/db";
import { products } from "@/db/schema";
import { NextResponse } from "next/server";

export default async function POST(request: Request) {
  const {
    name,
    category,
    description,
    price,
    discountPrice,
    inStock,
    images,
    brand,
    form,
    goal,
    ingredients,
    allergens,
    warnings,
    directions,
    certifications,
    expiryDate,
    manufacturedDate,
    createdAt,
  } = await request.json();
  try {
    const response = await db.insert(products).values({
      name,
      category,
      description,
      price,
      discountPrice,
      inStock,
      images,
      form,
      goal,
      ingredients,
      allergens,
      warnings,
      directions,
      certifications,
      expiryDate,
      manufacturedDate,
      createdAt,
    });
    return NextResponse.json({
      success: true,
      data: response,
      message: "Product added successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
      message: "Error adding product: Internal Server Error",
    });
  }
}
