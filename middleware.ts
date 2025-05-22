import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

function detectV0Environment(request: NextRequest): boolean {
  // Check various indicators that we might be in v0
  const userAgent = request.headers.get("user-agent") || ""
  const referer = request.headers.get("referer") || ""
  const host = request.headers.get("host") || ""

  return (
    userAgent.includes("Vercel") ||
    referer.includes("v0.dev") ||
    host.includes("v0.dev") ||
    host.includes("vercel.app") ||
    // Special query parameter for testing
    request.nextUrl.searchParams.has("v0_bypass")
  )
}

// Paths that require authentication
const PROTECTED_PATHS = ["/admin"]
// Paths that are always public
const PUBLIC_PATHS = [
  "/api/admin/auth",
  "/api/contact",
  "/admin/login", // Add login page to public paths
  "/v0-admin", // Also make v0-admin public
  "/v0-admin/login",
  "/debug", // Make debug pages public
  "/api/debug", // Make debug API endpoints public
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Log middleware execution for debugging
  console.log(`Middleware running for: ${pathname}`)

  // Special handling for middleware test endpoint
  if (pathname === "/api/debug/middleware-test") {
    console.log("Middleware test endpoint detected")
    // Continue processing
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    console.log(`Public path detected: ${pathname}`)
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  console.log(`Protected path detected: ${pathname}`)

  // Get the auth token from cookies
  const token = request.cookies.get("admin-auth-token")?.value

  // If no token is present, redirect to login
  if (!token) {
    console.log("No auth token found, redirecting to login")
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
    console.log("Token verified successfully")

    // Token is valid, allow the request
    return NextResponse.next()
  } catch (error) {
    // Token is invalid or expired, redirect to login
    console.error("Auth middleware error:", error)
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    // Match all admin routes except login and v0-admin
    "/admin/((?!login|v0-admin).)*",
    // Match all admin API routes except auth
    "/api/admin/((?!auth).)*",
    // Match debug middleware test endpoint
    "/api/debug/middleware-test",
  ],
}
