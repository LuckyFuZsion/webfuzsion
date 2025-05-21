import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get("admin-auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      return new NextResponse(JSON.stringify({ success: false, message: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new NextResponse(JSON.stringify({ success: true, message: "Authenticated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return new NextResponse(JSON.stringify({ success: false, message: "Authentication check failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
