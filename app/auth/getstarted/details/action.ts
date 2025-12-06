"use server";

import db from "@/db/db";
import schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateUserName(email: string, name: string) {
  try {
    const response = await db
      .update(schema.users)
      .set({ name })
      .where(eq(schema.users.email, email));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error updating name",
    };
  }
}
