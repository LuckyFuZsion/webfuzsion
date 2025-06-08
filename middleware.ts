import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Paths that are always public (no authentication required)
const PUBLIC_PATHS = [
  "/api/admin/auth",
  "/api/admin/check-auth",
  "/api/admin/auth-simple",
  "/api/admin/auth-debug",
  "/api/contact",
  "/admin/login",
  "/admin/login-simple",
  "/login",
  "/login-debug",
  "/test-basic",
  "/admin/simple",
  "/admin/test",
  "/v0-admin",
  "/debug",
  "/api/debug",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`Middleware: Processing ${pathname}`)

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    console.log(`Middleware: Public path allowed: ${pathname}`)
    return NextResponse.next()
  }

  // Only protect /admin and /api/admin paths (excluding auth)
  const needsAuth =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api/admin") &&
      !pathname.startsWith("/api/admin/auth") &&
      !pathname.startsWith("/api/admin/check-auth"))

  if (!needsAuth) {
    console.log(`Middleware: Path doesn't need auth: ${pathname}`)
    return NextResponse.next()
  }

  console.log(`Middleware: Checking auth for: ${pathname}`)

  // Get the auth token from cookies
  const token = request.cookies.get("admin-auth-token")?.value
  const legacyAuth = request.cookies.get("admin-auth")?.value

  // Check legacy auth first
  if (legacyAuth === "authenticated") {
    console.log(`Middleware: Legacy auth found for ${pathname}`)
    return NextResponse.next()
  }

  if (!token) {
    console.log(`Middleware: No token found, redirecting to login`)
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  try {
    // Verify the token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured")
      throw new Error("JWT_SECRET not configured")
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    console.log(`Middleware: Token verified for ${pathname}`)

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware auth error:", error)
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
    // Match admin API routes except auth and check-auth
    "/api/admin/((?!auth|check-auth).*)",
  ],
}
