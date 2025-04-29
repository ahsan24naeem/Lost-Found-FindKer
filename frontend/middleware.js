import { NextResponse } from "next/server"

// Define public paths that don't require authentication
const publicPaths = new Set([
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/faq",
  "/contact",
  "/login",
  "/register",
])

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Allow public paths
  if (publicPaths.has(path)) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get("auth")
  if (!authCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Don't verify token with backend - just check if cookie exists
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
