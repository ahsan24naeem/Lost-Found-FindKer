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
  "/register"
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

  // Verify token with backend
  try {
    const response = fetch("http://localhost:5000/api/user/verify", {
      headers: {
        Cookie: `auth=${authCookie.value}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  } catch (error) {
    console.error("Auth verification failed:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
