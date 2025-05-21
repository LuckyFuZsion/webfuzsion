import { NextResponse, type NextRequest } from "next/server"

export function http2Middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add HTTP/2 related headers
  response.headers.set("X-DNS-Prefetch-Control", "on")

  // Enable preload and preconnect for critical resources
  response.headers.set(
    "Link",
    [
      // Preconnect to your main domain
      "<https://webfuzsion.com>; rel=preconnect",
      // If you're using a CDN, preconnect to it as well
      process.env.NEXT_PUBLIC_CDN_URL ? `<${process.env.NEXT_PUBLIC_CDN_URL}>; rel=preconnect` : "",
    ]
      .filter(Boolean)
      .join(", "),
  )

  return response
}
