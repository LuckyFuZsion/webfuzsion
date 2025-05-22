import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only check if variables exist, don't access their values
    const envCheck = {
      // Admin authentication
      ADMIN_USERNAME_EXISTS: typeof process.env.ADMIN_USERNAME !== "undefined",
      ADMIN_PASSWORD_EXISTS: typeof process.env.ADMIN_PASSWORD !== "undefined",
      JWT_SECRET_EXISTS: typeof process.env.JWT_SECRET !== "undefined",

      // Email configuration
      GMAIL_USER_EXISTS: typeof process.env.GMAIL_USER !== "undefined",
      GMAIL_APP_PASSWORD_EXISTS: typeof process.env.GMAIL_APP_PASSWORD !== "undefined",
      EMAIL_FROM_EXISTS: typeof process.env.EMAIL_FROM !== "undefined",
      EMAIL_TO_EXISTS: typeof process.env.EMAIL_TO !== "undefined",
      EMAIL_CC_EXISTS: typeof process.env.EMAIL_CC !== "undefined",

      // Environment info
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV || "unknown",
      variables: envCheck,
    })
  } catch (error) {
    console.error("Safe env check error:", error)
    return NextResponse.json(
      { success: false, message: "Error checking environment", error: String(error) },
      { status: 500 },
    )
  }
}
