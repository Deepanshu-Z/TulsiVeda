import db from "@/db/db";
import { addresses } from "@/db/schema";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const id = token.sub;
  try {
    const response = await db.insert(addresses).values({
      userId: id,
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
