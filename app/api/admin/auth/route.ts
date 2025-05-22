import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

// Constants for token management
const TOKEN_EXPIRY = "24h"
const COOKIE_NAME = "admin-auth-token"

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error("Auth API error (invalid JSON):", e)
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid request format" }), {
        status: 400,
        headers,
      })
    }

    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return new NextResponse(JSON.stringify({ success: false, message: "Username and password are required" }), {
        status: 400,
        headers,
      })
    }

    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      console.error("Required environment variables not configured")
      return new NextResponse(JSON.stringify({ success: false, message: "Server configuration error" }), {
        status: 500,
        headers,
      })
    }

    // Verify credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Generate a unique session ID
      const sessionId = nanoid()

      // Create JWT token
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
      const cookieStore = cookies()
      cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return new NextResponse(JSON.stringify({ success: true, message: "Authentication successful" }), {
        status: 200,
        headers,
      })
    }

    return new NextResponse(JSON.stringify({ success: false, message: "Invalid credentials" }), {
      status: 401,
      headers,
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}

// Add a logout endpoint
export async function DELETE() {
  try {
    const cookieStore = cookies()
    cookieStore.delete(COOKIE_NAME)

    return new NextResponse(JSON.stringify({ success: true, message: "Logged out successfully" }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}
