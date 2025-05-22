import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function DELETE(request: Request) {
  // Check authentication
  const authCookie = cookies().get("admin-auth")
  const isAuthenticated = authCookie && authCookie.value === "authenticated"

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { schemaName } = await request.json()

    // Validate input
    if (!schemaName) {
      return NextResponse.json({ error: "Missing required parameter: schemaName" }, { status: 400 })
    }

    // Only allow deletion of invoice_system schema for safety
    if (schemaName !== "invoice_system") {
      return NextResponse.json({ error: "Only invoice_system schema can be deleted" }, { status: 400 })
    }

    // Get Supabase connection details
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create admin Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if schema exists before attempting to delete
    const checkSchemaQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.schemata 
        WHERE schema_name = '${schemaName}'
      )
    `

    const { data: schemaExists, error: checkError } = await supabase.rpc("execute_sql", {
      query: checkSchemaQuery,
    })

    if (checkError) {
      return NextResponse.json({ error: `Error checking schema: ${checkError.message}` }, { status: 500 })
    }

    if (!schemaExists?.[0]?.exists) {
      return NextResponse.json({ error: `Schema '${schemaName}' does not exist` }, { status: 404 })
    }

    // Delete the schema and all its contents
    // CASCADE will remove all tables, functions, and other objects in the schema
    const deleteSchemaQuery = `DROP SCHEMA ${schemaName} CASCADE`

    const { error: deleteError } = await supabase.rpc("execute_sql", {
      query: deleteSchemaQuery,
    })

    if (deleteError) {
      return NextResponse.json({ error: `Error deleting schema: ${deleteError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Schema '${schemaName}' and all its contents have been successfully deleted`,
      details: {
        schemaDeleted: schemaName,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Schema deletion error:", error)
    return NextResponse.json(
      { error: `Schema deletion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
