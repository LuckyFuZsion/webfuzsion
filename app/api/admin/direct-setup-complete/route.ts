import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Set a cookie that lasts for 1 year
    cookies().set({
      name: "invoice-setup-complete",
      value: "true",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting up invoice system:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up invoice system",
        details: error,
      },
      { status: 500 },
    )
  }
}
