import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function GET() {
  try {
    console.log("Check-auth: Starting authentication check")

    // Set proper content type
    const headers = {
      "Content-Type": "application/json",
    }

    const cookieStore = await cookies()

    // Check for JWT token first
    const tokenCookie = cookieStore.get("admin-auth-token")
    const legacyCookie = cookieStore.get("admin-auth")

    console.log("Check-auth: Cookies found", {
      hasToken: !!tokenCookie,
      hasLegacy: !!legacyCookie,
      legacyValue: legacyCookie?.value,
    })

    // Check legacy auth first (for backward compatibility)
    if (legacyCookie && legacyCookie.value === "authenticated") {
      console.log("Check-auth: Legacy authentication valid")
      return NextResponse.json(
        {
          success: true,
          message: "Authenticated via legacy cookie",
          authenticated: true,
        },
        { headers },
      )
    }

    // Check JWT token
    if (tokenCookie) {
      try {
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
          console.error("Check-auth: JWT_SECRET not configured")
          return NextResponse.json(
            {
              success: false,
              message: "Server configuration error",
              authenticated: false,
            },
            { status: 500, headers },
          )
        }

        const secret = new TextEncoder().encode(jwtSecret)
        const { payload } = await jwtVerify(tokenCookie.value, secret)

        console.log("Check-auth: JWT token valid", { sub: payload.sub })
        return NextResponse.json(
          {
            success: true,
            message: "Authenticated via JWT token",
            authenticated: true,
            user: payload.sub,
          },
          { headers },
        )
      } catch (jwtError) {
        console.error("Check-auth: JWT verification failed", jwtError)
        // Clear invalid token
        const response = NextResponse.json(
          {
            success: false,
            message: "Invalid token",
            authenticated: false,
          },
          { status: 401, headers },
        )

        response.cookies.delete("admin-auth-token")
        return response
      }
    }

    console.log("Check-auth: No valid authentication found")
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
        authenticated: false,
      },
      { status: 401, headers },
    )
  } catch (error) {
    console.error("Check-auth: Unexpected error", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication check failed",
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
