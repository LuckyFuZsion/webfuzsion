import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      // Check if we're in v0 environment and bypass auth
      const isV0Environment =
        process.env.NEXT_RUNTIME === "edge" ||
        process.env.VERCEL_ENV === "development" ||
        process.env.NODE_ENV === "development"

      if (!isV0Environment) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Always return success for localStorage-only mode
    return NextResponse.json({
      success: true,
      isSetup: true,
      setupComplete: true,
      method: "localStorage",
      message: "Using localStorage for all data storage",
    })
  } catch (error) {
    console.error("Error checking invoice setup:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check invoice setup",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
