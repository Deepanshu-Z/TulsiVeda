import db from "@/db/db";
import { products } from "@/db/schema";

export const GET = async () => {
  try {
    const response = await db.select().from(products);
    return Response.json({
      response,
      message: "Successfully fetched products",
      status: 200,
    });
  } catch (error) {
    return Response.json({
      error,
      message: "Error fetching products",
      status: 500,
    });
  }
};
