import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Set a cookie that indicates the setup is complete
    // Use a longer expiration and ensure the path is correct
    cookies().set("invoice-setup-complete", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    console.log("Force setup complete cookie set successfully")

    return NextResponse.json({
      success: true,
      message: "Invoice system setup has been marked as complete",
    })
  } catch (error) {
    console.error("Error forcing setup complete:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to mark setup as complete",
      details: error,
    })
  }
}
