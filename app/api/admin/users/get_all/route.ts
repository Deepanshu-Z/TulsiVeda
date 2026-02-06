import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/db/db";
import { users } from "@/db/schema";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const role = session?.user.role;

  if (!role || role != "admin")
    return Response.json({
      success: false,
      message: "Is not admin!",
      status: 401,
    });
  try {
    const response = await db.select().from(users);
    return Response.json({
      users: response,
      success: true,
      message: "Successfuly fetched",
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      error,
      success: false,
      message: "error getting users",
    });
  }
};
