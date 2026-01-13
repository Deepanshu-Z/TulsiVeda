import db from "@/db/db";
import { products } from "@/db/schema";

export const PUT = async (
  { params }: { params: { id: string } },
  req: Request
) => {
  const {
    name,
    title,
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
  } = await req.json();

  try {
    const update = await db.update(products).set({
      name: name,
      title: title,
      category: category,
      description: description,
      price: price,
      discountPrice: discountPrice,
      inStock: inStock,
      galleryImages: galleryImages,
      form: form,
      goal: goal,
      ingredients: ingredients,
      allergens: allergens,
      warnings: warnings,
      directions: directions,
      certifications: certifications,
      expiryDate: expiryDate,
      manufacturedDate: manufacturedDate,
      createdAt,
    });
    return Response.json({
      msg: "Succesfully updated",
      status: 200,
      success: true,
    });
  } catch (error) {
    return Response.json({
      msg: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
