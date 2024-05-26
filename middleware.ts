import { storage } from "@/app/helpers/storage";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default function middleware(req: NextRequest) {
  console.log("middleware");
  const url = req.nextUrl;
  const { getToken } = storage;
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    // Check for authentication token in cookies (replace with your token storage mechanism)
    const token = getToken();

    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
