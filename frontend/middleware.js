import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/about" ||
    path === "/privacy" ||
    path === "/terms" ||
    path === "/faq" ||
    path === "/contact" ||
    path === "/login" ||
    path === "/register"

  // Check if the user is authenticated by looking for the user cookie
  const isAuthenticated = request.cookies.has("user")

  // If the path is not public and the user is not authenticated, redirect to the login page
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the path is the login/register page and the user is authenticated, redirect to the home page
  if ((path === "/login" || path === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
