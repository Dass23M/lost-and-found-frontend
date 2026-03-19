import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/post", "/my-account"];
  const authRoutes = ["/auth/login", "/auth/register"];

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post", "/my-account", "/auth/login", "/auth/register"],
};