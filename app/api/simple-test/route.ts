import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({ success: true, message: "Simple test successful" })
  } catch (error) {
    console.error("Simple test error:", error)
    return NextResponse.json({ success: false, message: "Error in simple test", error: String(error) }, { status: 500 })
  }
}
