import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the HTTP version from the request
  const httpVersion = request.headers.get("x-forwarded-proto") || "unknown"
  const secCh = request.headers.get("sec-ch-ua") || "unknown"

  // Return all headers for debugging
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  return NextResponse.json({
    message: "HTTP Protocol Check",
    httpVersion,
    secCh,
    headers,
    timestamp: new Date().toISOString(),
  })
}
