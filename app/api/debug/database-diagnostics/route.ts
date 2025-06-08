import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  // Check authentication for sensitive operations
  const authCookie = cookies().get("admin-auth")
  const isAuthenticated = authCookie && authCookie.value === "authenticated"

  // Get URL parameters
  const url = new URL(request.url)
  const action = url.searchParams.get("action")

  // Results object
  const results: any = {
    timestamp: new Date().toISOString(),
    authentication: {
      status: isAuthenticated ? "authenticated" : "not authenticated",
      cookie: Boolean(authCookie),
    },
    environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
    databaseVariables: {},
    connectionTests: {},
    tableStatus: {},
    recordCounts: {},
    repairs: {},
    recommendations: [],
  }

  // Check for database environment variables
  const envVarNames = Object.keys(process.env).sort()
  const dbVarPrefixes = ["SUPABASE", "POSTGRES", "DATABASE"]

  // Count total environment variables
  results.environmentVariables = {
    total: envVarNames.length,
    databaseRelated: 0,
  }

  // Check for database-related variables
  dbVarPrefixes.forEach((prefix) => {
    const matchingVars = envVarNames.filter((name) => name.includes(prefix))
    results.environmentVariables[prefix] = matchingVars.length
    results.environmentVariables.databaseRelated += matchingVars.length

    // Add details about each variable (existence and length only, not values)
    matchingVars.forEach((name) => {
      results.databaseVariables[name] = {
        exists: true,
        length: process.env[name]?.length || 0,
      }
    })
  })

  // Extract connection variables with fallbacks
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const postgresUrl = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || ""

  // Check if we have the minimum required variables
  results.connectionVariables = {
    supabaseUrl: Boolean(supabaseUrl),
    supabaseAnonKey: Boolean(supabaseAnonKey),
    supabaseServiceKey: Boolean(supabaseServiceKey),
    postgresUrl: Boolean(postgresUrl),
  }

  // Add recommendations based on missing variables
  if (!supabaseUrl) {
    results.recommendations.push("Add SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL environment variables")
  }
  if (!supabaseAnonKey) {
    results.recommendations.push("Add SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables")
  }
  if (!supabaseServiceKey) {
    results.recommendations.push("Add SUPABASE_SERVICE_ROLE_KEY environment variable for admin operations")
  }

  // Test Supabase connection with anon key
  if (supabaseUrl && supabaseAnonKey) {
    try {
      console.log(`Testing Supabase connection with anon key to: ${supabaseUrl.substring(0, 20)}...`)
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Try a simple query that doesn't use a specific table
      const { data, error } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "public").limit(1)

      results.connectionTests.supabaseAnon = {
        success: !error,
        message: error ? `Error: ${error.message} (${error.code})` : "Connection successful",
        data: data || null,
      }

      if (error) {
        if (error.code === "PGRST401") {
          results.recommendations.push("Authentication failed. Check your SUPABASE_ANON_KEY value.")
        } else if (error.code.startsWith("PGRST")) {
          results.recommendations.push(`PostgREST error: ${error.message}. Check Supabase configuration.`)
        }
      }
    } catch (e) {
      results.connectionTests.supabaseAnon = {
        success: false,
        message: `Exception: ${e instanceof Error ? e.message : String(e)}`,
      }

      results.recommendations.push(
        "Supabase connection failed with an exception. Check URL format and network connectivity.",
      )
    }
  } else {
    results.connectionTests.supabaseAnon = {
      success: false,
      message: "Missing required variables for Supabase anon connection",
    }
  }

  // Test Supabase connection with service role key (for admin operations)
  if (supabaseUrl && supabaseServiceKey) {
    try {
      console.log(`Testing Supabase connection with service role key`)
      const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Check if tables exist using pg_tables instead of information_schema
      const { data: tablesData, error: tablesError } = await adminSupabase
        .from("pg_tables")
        .select("tablename")
        .eq("schemaname", "public")

      if (tablesError) {
        throw new Error(`Failed to query tables: ${tablesError.message}`)
      }

      const tableNames = tablesData?.map((t) => t.tablename) || []

      results.tableStatus.invoicesTable = {
        exists: tableNames.includes("invoices"),
        error: null,
      }

      results.tableStatus.blogPostsTable = {
        exists: tableNames.includes("blog_posts"),
        error: null,
      }

      results.tableStatus.customersTable = {
        exists: tableNames.includes("customers"),
        error: null,
      }

      results.tableStatus.invoiceItemsTable = {
        exists: tableNames.includes("invoice_items"),
        error: null,
      }

      results.tableStatus.allTables = tableNames

      // If tables exist, get record counts
      if (results.tableStatus.invoicesTable.exists) {
        try {
          const { count, error: countError } = await adminSupabase
            .from("invoices")
            .select("*", { count: "exact", head: true })

          results.recordCounts.invoices = countError ? "Error counting" : count
        } catch (e) {
          results.recordCounts.invoices = "Error counting"
        }
      }

      if (results.tableStatus.blogPostsTable.exists) {
        try {
          const { count, error: countError } = await adminSupabase
            .from("blog_posts")
            .select("*", { count: "exact", head: true })

          results.recordCounts.blogPosts = countError ? "Error counting" : count
        } catch (e) {
          results.recordCounts.blogPosts = "Error counting"
        }
      }

      results.connectionTests.supabaseAdmin = {
        success: true,
        message: "Admin connection successful",
      }

      // Add recommendations based on table status
      if (!results.tableStatus.invoicesTable.exists) {
        results.recommendations.push("The invoices table doesn't exist in the public schema.")
      }

      if (!results.tableStatus.blogPostsTable.exists) {
        results.recommendations.push("The blog_posts table doesn't exist in the public schema.")
      }
    } catch (e) {
      results.connectionTests.supabaseAdmin = {
        success: false,
        message: `Exception: ${e instanceof Error ? e.message : String(e)}`,
      }

      results.recommendations.push("Admin connection failed. Check your SUPABASE_SERVICE_ROLE_KEY value.")
    }
  } else {
    results.connectionTests.supabaseAdmin = {
      success: false,
      message: "Missing required variables for Supabase admin connection",
    }
  }

  // Check admin variables
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.JWT_SECRET

  results.adminVariables = {
    ADMIN_USERNAME: Boolean(adminUsername),
    ADMIN_PASSWORD: Boolean(adminPassword),
    JWT_SECRET: Boolean(jwtSecret),
    allPresent: Boolean(adminUsername && adminPassword && jwtSecret),
  }

  // Final recommendations
  if (results.recommendations.length === 0 && results.connectionTests.supabaseAnon?.success) {
    results.recommendations.push(
      "Database connection is working correctly. If you're still having issues, check your application code.",
    )
  }

  return NextResponse.json(results)
}
