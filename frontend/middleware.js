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

  // For protected routes, let the client-side handle the auth check
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
