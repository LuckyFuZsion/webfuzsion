import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ success: false, message: "SQL query is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if the execute_sql function exists
    try {
      const { error: checkError } = await supabase.rpc("execute_sql", { query: "SELECT 1" })

      // If the function doesn't exist, create it
      if (checkError && checkError.message.includes("function") && checkError.message.includes("does not exist")) {
        console.log("Creating execute_sql function")

        // Create the function using raw SQL
        const { error: createError } = await supabase
          .from("_rpc")
          .select("*")
          .execute(`
          CREATE OR REPLACE FUNCTION execute_sql(query text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE query;
          END;
          $$;
        `)

        if (createError) {
          console.error("Error creating execute_sql function:", createError)
          return NextResponse.json(
            { success: false, message: "Failed to create SQL execution function" },
            { status: 500 },
          )
        }
      }
    } catch (error) {
      console.error("Error checking for execute_sql function:", error)
    }

    // Execute the query
    const { error } = await supabase.rpc("execute_sql", { query })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ success: false, message: `Failed to execute SQL: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "SQL executed successfully",
    })
  } catch (error) {
    console.error("Error in execute-sql API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
