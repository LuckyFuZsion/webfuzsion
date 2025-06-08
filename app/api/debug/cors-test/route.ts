import { NextResponse } from "next/server"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "CORS test successful",
      headers: corsHeaders,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST() {
  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "CORS POST test successful",
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  )
}
