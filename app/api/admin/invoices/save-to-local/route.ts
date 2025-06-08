import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { invoice } = body

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Missing invoice data" }, { status: 400 })
    }

    // This endpoint doesn't actually save to the database
    // It's meant to be used as a fallback when the main API fails
    // The client will handle saving to localStorage

    return NextResponse.json({
      success: true,
      message: "Invoice data validated successfully. Save to localStorage on the client.",
      invoice: invoice,
    })
  } catch (error) {
    console.error("Error in save-to-local API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
