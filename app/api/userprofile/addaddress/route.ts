import db from "@/db/db";
import { addresses } from "@/db/schema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: Request) {
  const data = await req.json();
  const session = await getServerSession();

  if (!session) return new Response("Unauthorized", { status: 401 });

  console.log("@@@@@@@@@ID", data.id.id);
  try {
    const response = await db.insert(addresses).values({
      userId: data.id.id,
      phoneNumber: data.phone,
      houseNumber: data.house,
      area: data.road,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      nearby: data.nearby,
    });
    return NextResponse.json({
      message: "Successfully added address",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error adding address",
      error,
      success: false,
    });
  }
}
