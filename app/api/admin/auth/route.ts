import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

// Constants for token management
const TOKEN_EXPIRY = "24h"
const COOKIE_NAME = "admin-auth-token"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  })
}

// Handle HEAD request (often used for health checks)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  })
}

// Handle GET requests
export async function GET() {
  // Check if already authenticated
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  const tokenCookie = cookieStore.get(COOKIE_NAME)

  const isAuthenticated = (authCookie && authCookie.value === "authenticated") || tokenCookie

  if (isAuthenticated) {
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Already authenticated",
        authenticated: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }

  return new NextResponse(
    JSON.stringify({
      success: false,
      message: "Not authenticated",
      authenticated: false,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    console.log("Auth API: POST request received")

    let username: string
    let password: string

    // Check content type to determine how to parse the request
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      // Handle JSON requests (from JavaScript)
      const body = await request.json()
      username = body.username
      password = body.password
      console.log("Auth API: Parsed JSON body")
    } else {
      // Handle form data (from HTML forms)
      const formData = await request.formData()
      username = formData.get("username") as string
      password = formData.get("password") as string
      console.log("Auth API: Parsed form data")
    }

    console.log("Auth API: Credentials received", {
      username: username ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    // Validate input
    if (!username || !password) {
      console.log("Auth API: Missing username or password")
      return new NextResponse(JSON.stringify({ success: false, message: "Missing username or password" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    // Check if environment variables are set
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    const jwtSecret = process.env.JWT_SECRET

    if (!adminUsername || !adminPassword || !jwtSecret) {
      console.error("Auth API: Required environment variables not configured")
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Server configuration error",
          debug: {
            hasUsername: !!adminUsername,
            hasPassword: !!adminPassword,
            hasJwtSecret: !!jwtSecret,
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Verify credentials
    console.log("Auth API: Verifying credentials")
    if (username === adminUsername && password === adminPassword) {
      console.log("Auth API: Credentials verified successfully")

      // Create JWT token
      console.log("Auth API: Creating JWT token")
      const secret = new TextEncoder().encode(jwtSecret)
      const token = await new SignJWT({
        sub: username,
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(secret)

      // Create success response
      console.log("Auth API: Creating success response")
      const response = NextResponse.json(
        { success: true, message: "Login successful" },
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )

      // Set secure cookies
      console.log("Auth API: Setting cookies")
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      // Also set the admin-auth cookie for backward compatibility
      response.cookies.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      console.log("Auth API: Authentication successful")
      return response
    }

    console.log("Auth API: Invalid credentials")
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Invalid credentials",
        debug: {
          providedUsername: username,
          expectedUsername: adminUsername,
          passwordMatch: password === adminPassword,
        },
      }),
      {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Auth API error:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// Add a logout endpoint
export async function DELETE() {
  try {
    console.log("Auth API: DELETE request (logout)")
    const cookieStore = await cookies()

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      {
        status: 200,
        headers: corsHeaders,
      },
    )

    // Clear both cookies
    response.cookies.delete(COOKIE_NAME)
    response.cookies.delete("admin-auth")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Logout error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }
}
