import { storage } from "@/app/helpers/storage";
import { NextRequest, NextResponse } from "next/server";
import { useEffect } from "react";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { getToken } = storage;

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    // Check for authentication token in cookies (replace with your token storage mechanism)
    if (typeof window !== "undefined") {
      const token = getToken();
      if (!token) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
