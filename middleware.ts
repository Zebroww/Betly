import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /betting)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // Get the token from the request
  const token = request.cookies.get("auth-token")?.value || ""

  // If the path is public and user has token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
  }

  // If the path is not public and no token, redirect to auth
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.nextUrl))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
