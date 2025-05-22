import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET() {
  // Check authentication
  const authCookie = cookies().get("admin-auth")
  const isAuthenticated = authCookie && authCookie.value === "authenticated"

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
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

    const results: any = {
      schemas: {
        public: {
          exists: true,
          tables: {},
        },
        invoice_system: {
          exists: false,
          tables: {},
        },
      },
    }

    // Check if invoice_system schema exists
    const checkSchemaQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.schemata 
        WHERE schema_name = 'invoice_system'
      )
    `

    const { data: schemaExists, error: schemaError } = await supabase.rpc("execute_sql", {
      query: checkSchemaQuery,
    })

    if (schemaError) {
      return NextResponse.json({ error: `Error checking schema: ${schemaError.message}` }, { status: 500 })
    }

    results.schemas.invoice_system.exists = schemaExists?.[0]?.exists || false

    // Check tables in public schema
    const publicTables = ["invoices", "customers", "invoice_items"]
    for (const tableName of publicTables) {
      try {
        const countQuery = `SELECT COUNT(*) FROM public.${tableName}`
        const { data: countResult, error: countError } = await supabase.rpc("execute_sql", {
          query: countQuery,
        })

        results.schemas.public.tables[tableName] = {
          exists: !countError,
          count: countError ? 0 : countResult?.[0]?.count || 0,
          error: countError?.message || null,
        }
      } catch (err) {
        results.schemas.public.tables[tableName] = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    }

    // Check tables in invoice_system schema if it exists
    if (results.schemas.invoice_system.exists) {
      for (const tableName of publicTables) {
        try {
          const countQuery = `SELECT COUNT(*) FROM invoice_system.${tableName}`
          const { data: countResult, error: countError } = await supabase.rpc("execute_sql", {
            query: countQuery,
          })

          results.schemas.invoice_system.tables[tableName] = {
            exists: !countError,
            count: countError ? 0 : countResult?.[0]?.count || 0,
            error: countError?.message || null,
          }
        } catch (err) {
          results.schemas.invoice_system.tables[tableName] = {
            exists: false,
            count: 0,
            error: err instanceof Error ? err.message : "Unknown error",
          }
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json(
      { error: `Schema check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
