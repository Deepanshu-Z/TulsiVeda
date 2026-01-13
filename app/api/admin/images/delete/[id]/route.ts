import db from "@/db/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { data } = await req.json();
  const url = data.url;
  try {
    const result = await db
      .update(products)
      .set({
        galleryImages: sql`${products.galleryImages}::jsonb - ${url}::text`,
      })
      .where(eq(products.id, id));

    console.log("RESULTS ARE: ", result);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error, success: false });
  }
}
