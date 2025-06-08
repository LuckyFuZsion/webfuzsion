import { NextResponse } from "next/server"

// List of critical API endpoints to test
const ENDPOINTS_TO_TEST = [
  "/api/contact",
  "/api/admin/auth",
  "/api/admin/check-auth",
  "/api/admin/invoices",
  "/api/admin/blog-posts",
  "/api/debug/env-check",
  "/api/debug/database-diagnostics",
  "/api/debug/email-test",
]

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    endpoints: {},
  }

  // Test each endpoint
  for (const endpoint of ENDPOINTS_TO_TEST) {
    try {
      // Use a HEAD request when possible to avoid heavy processing
      const method = endpoint.includes("/auth") ? "GET" : "HEAD"
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || ""}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      results.endpoints[endpoint] = {
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
      }
    } catch (error) {
      results.endpoints[endpoint] = {
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return NextResponse.json(results)
}
