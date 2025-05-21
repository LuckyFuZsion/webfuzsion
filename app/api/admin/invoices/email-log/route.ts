import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the API route
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Fetch email logs from the database
    const { data, error, count } = await supabase
      .from("email_logs")
      .select("*", { count: "exact" })
      .order("sent_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching email logs:", error)
      return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error in email logs API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch email logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
