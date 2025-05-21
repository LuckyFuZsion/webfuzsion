import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if tables exist
    const tables = ["customers", "invoices", "invoice_items"]
    const results: Record<string, boolean> = {}
    const errors: Record<string, string> = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("count").limit(1)

        if (error) {
          results[table] = false
          errors[table] = error.message
        } else {
          results[table] = true
        }
      } catch (err) {
        results[table] = false
        errors[table] = err instanceof Error ? err.message : String(err)
      }
    }

    // Check database connection
    let connectionStatus = "ok"
    let connectionError = null

    try {
      const { data, error } = await supabase.from("customers").select("count")
      if (error) {
        connectionStatus = "error"
        connectionError = error.message
      }
    } catch (err) {
      connectionStatus = "error"
      connectionError = err instanceof Error ? err.message : String(err)
    }

    return NextResponse.json({
      tables: results,
      errors,
      connection: {
        status: connectionStatus,
        error: connectionError,
      },
      supabaseUrl: supabaseUrl.replace(/^(https?:\/\/[^/]+).*$/, "$1"), // Only return the base URL for security
    })
  } catch (error) {
    console.error("Error checking invoice tables:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check invoice tables",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
