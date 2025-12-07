import db from "@/db/db";
import { products } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    name,
    category,
    description,
    price,
    discountPrice,
    inStock,
    galleryImages,
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
  console.log("@@@@@@@", galleryImages);
  const newExpiryDate = new Date(expiryDate);
  const newManufacturedDate = new Date(manufacturedDate);

  try {
    const id = await db
      .insert(products)
      .values({
        name,
        category,
        description,
        price,
        discountPrice,
        inStock,
        galleryImages,
        form,
        goal,
        ingredients,
        allergens,
        warnings,
        directions,
        certifications,
        expiryDate: newExpiryDate,
        manufacturedDate: newManufacturedDate,
        createdAt,
      })
      .returning({ id: products.id });

    return NextResponse.json({
      success: true,
      id: id,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: error,
      message: "Error adding product: Internal Server Error",
    });
  }
}
