import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * CDN-specific middleware
 * This adds appropriate headers for CDN integration
 */
export function cdnMiddleware(request: NextRequest) {
  // Get the current response
  const response = NextResponse.next()

  // Add basic cache control header
  response.headers.set("Cache-Control", "public, max-age=3600")

  // Add CDN-friendly headers
  response.headers.set("Timing-Allow-Origin", "*")
  response.headers.set("X-Content-Type-Options", "nosniff")

  return response
}
