import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register']
  
  // If the path is public, allow access
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // If there's no token and the path is not public, redirect to login
  if (!token && !publicPaths.includes(pathname)) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
