import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Simple response without any complex operations
    return NextResponse.json({
      success: true,
      message: "Auth endpoint responding (simplified version)",
    })
  } catch (error) {
    console.error("Simple auth error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error in simplified auth endpoint",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
