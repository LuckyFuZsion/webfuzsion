import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Middleware test endpoint",
    timestamp: new Date().toISOString(),
    path: "/api/debug/middleware-test",
  })
}
