import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function proxy(req: any) {
  const token = await getToken({ req });
  if (token?.role != "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};
