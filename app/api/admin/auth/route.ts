import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

// Constants for token management
const TOKEN_EXPIRY = "24h"
const COOKIE_NAME = "admin-auth-token"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// Handle GET requests
export async function GET() {
  return new NextResponse(
    JSON.stringify({
      success: false,
      message: "Authentication requires a POST request",
    }),
    {
      status: 405,
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

    let body
    try {
      const text = await request.text()
      console.log("Auth API: Request body text:", text)

      if (!text) {
        return new NextResponse(JSON.stringify({ success: false, message: "Empty request body" }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        })
      }

      body = JSON.parse(text)
      console.log("Auth API: Parsed body:", {
        username: body.username ? "provided" : "missing",
        password: body.password ? "provided" : "missing",
      })
    } catch (e) {
      console.error("Auth API error (invalid JSON):", e)
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid request format", error: String(e) }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    const { username, password } = body

    // Validate input
    if (!username || !password) {
      console.log("Auth API: Missing username or password")
      return new NextResponse(JSON.stringify({ success: false, message: "Username and password are required" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      console.error("Auth API: Required environment variables not configured")
      return new NextResponse(JSON.stringify({ success: false, message: "Server configuration error" }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    // Verify credentials
    console.log("Auth API: Verifying credentials")
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      console.log("Auth API: Credentials verified successfully")

      // Generate a unique session ID
      const sessionId = nanoid()

      // Create JWT token
      console.log("Auth API: Creating JWT token")
      const token = await new SignJWT({
        sub: username,
        sid: sessionId,
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))

      // Set secure cookie
      console.log("Auth API: Setting cookie")
      const cookieStore = cookies()
      cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      console.log("Auth API: Authentication successful")
      return new NextResponse(JSON.stringify({ success: true, message: "Authentication successful" }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    }

    console.log("Auth API: Invalid credentials")
    return new NextResponse(JSON.stringify({ success: false, message: "Invalid credentials" }), {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Auth API error:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Authentication error",
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
    const cookieStore = cookies()
    cookieStore.delete(COOKIE_NAME)

    return new NextResponse(JSON.stringify({ success: true, message: "Logged out successfully" }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
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
