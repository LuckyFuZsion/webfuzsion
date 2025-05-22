import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic" // Disable caching
export const runtime = "edge" // Use edge runtime for better performance

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-auth-token")

    // Check for token and JWT secret
    if (!token?.value) {
      return NextResponse.json(
        { success: false, message: "No authentication token found" },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured")
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      )
    }

    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token.value, secret)

      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.json(
          { success: false, message: "Token expired" },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { 
          success: true, 
          message: "Authenticated",
          user: {
            username: payload.sub,
            role: payload.role
          }
        },
        { status: 200 }
      )
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError)
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Authentication check failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
