import db from "@/db/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
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
  const newExpiryDate = new Date(expiryDate);
  const newManufacturedDate = new Date(manufacturedDate);
  const { id } = await params;
  try {
    const update = await db
      .update(products)
      .set({
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
        expiryDate: newExpiryDate,
        manufacturedDate: newManufacturedDate,
        createdAt,
      })
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return Response.json({
      update,
      msg: "Succesfully updated",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      error,
      msg: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
