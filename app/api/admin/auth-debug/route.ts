import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== AUTH DEBUG START ===")

    // Check if we can read the request body
    const body = await request.json()
    console.log("Request body:", body)

    // Check environment variables
    console.log("Environment check:")
    console.log("- ADMIN_USERNAME exists:", !!process.env.ADMIN_USERNAME)
    console.log("- ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD)
    console.log("- JWT_SECRET exists:", !!process.env.JWT_SECRET)

    if (process.env.ADMIN_USERNAME) {
      console.log("- ADMIN_USERNAME value:", process.env.ADMIN_USERNAME)
    }

    const { username, password } = body

    console.log("Credentials check:")
    console.log("- Provided username:", username)
    console.log("- Provided password:", password ? "[PROVIDED]" : "[MISSING]")
    console.log("- Expected username:", process.env.ADMIN_USERNAME)
    console.log("- Expected password:", process.env.ADMIN_PASSWORD ? "[SET]" : "[MISSING]")

    // Test credential matching
    const usernameMatch = username === process.env.ADMIN_USERNAME
    const passwordMatch = password === process.env.ADMIN_PASSWORD

    console.log("Match results:")
    console.log("- Username match:", usernameMatch)
    console.log("- Password match:", passwordMatch)

    console.log("=== AUTH DEBUG END ===")

    return NextResponse.json({
      success: true,
      debug: {
        hasUsername: !!username,
        hasPassword: !!password,
        hasEnvUsername: !!process.env.ADMIN_USERNAME,
        hasEnvPassword: !!process.env.ADMIN_PASSWORD,
        hasJwtSecret: !!process.env.JWT_SECRET,
        usernameMatch,
        passwordMatch,
        providedUsername: username,
        expectedUsername: process.env.ADMIN_USERNAME,
      },
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Debug failed",
    })
  }
}
