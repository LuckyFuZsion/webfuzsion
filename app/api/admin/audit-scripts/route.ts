// This file is no longer needed, but we'll keep a minimal version
// to avoid 404 errors if it's called
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    tags: [],
    recommendations: [],
  })
}
