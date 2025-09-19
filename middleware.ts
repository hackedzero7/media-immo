import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token
    const { pathname } = request.nextUrl

    const userRole = token?.role as string

    // Stop authenticated users from visiting login/signup
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    // Dashboard requires authentication (any role)
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    // Profile requires authentication (any role)
    if (pathname.startsWith("/profile")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico") ||
          pathname.startsWith("/unauthorized")
        ) {
          return true
        }

        // Auth pages always allowed (redirect handled above if logged in)
        if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
          return true
        }

        // Protected routes
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile") ||
          pathname.startsWith("/admin")
        ) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
