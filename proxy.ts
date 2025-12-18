import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // 🔐 Admin routes
  if (pathname.startsWith("/admin")) {
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 🛒 Cart route (different condition)
  if (pathname.startsWith("/cart")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/getstarted", req.url));
    }
  }

  if (pathname.startsWith("/details")) {
    if (token?.name) {
      return NextResponse.redirect("/");
    }
  }

  if (pathname.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/auth/getstarted", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/profile/:path*"],
};
