import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be merged with your existing middleware
export function middlewareCache(request: NextRequest) {
  const response = NextResponse.next()

  // Check if the request is for a static asset
  const url = request.nextUrl.pathname

  // Add cache headers for static assets that might be missed by next.config.mjs
  if (
    url.match(/\.(css|js|json|xml|txt|pdf|docx|xlsx|pptx|zip|rar|gz|mp4|mp3|wav|ogg)$/) ||
    url.startsWith("/api/static/") ||
    url.includes("/templates/")
  ) {
    // Set cache control header
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  return response
}
