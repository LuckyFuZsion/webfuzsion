import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// SQL queries to test and fix common issues
const DIAGNOSTIC_QUERIES = {
  // Check if tables exist
  checkInvoiceTable: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'invoices')",
  checkBlogTable: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts')",

  // Get table schemas
  getInvoiceSchema: `
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'invoices'
    ORDER BY ordinal_position
  `,
  getBlogSchema: `
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'blog_posts'
    ORDER BY ordinal_position
  `,

  // Count records
  countInvoices: "SELECT COUNT(*) FROM invoices",
  countBlogPosts: "SELECT COUNT(*) FROM blog_posts",

  // Create blog table if missing
  createBlogTable: `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      author TEXT,
      published BOOLEAN DEFAULT false,
      featured_image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      published_at TIMESTAMP WITH TIME ZONE
    )
  `,

  // Create invoice tables if missing
  createInvoiceTables: `
    -- Create customers table if it doesn't exist
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      postal_code TEXT,
      country TEXT DEFAULT 'United Kingdom',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create invoices table if it doesn't exist
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id UUID NOT NULL REFERENCES customers(id),
      project_name TEXT,
      issue_date DATE NOT NULL,
      due_date DATE NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      discount_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'draft',
      notes TEXT,
      terms TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      paid_at TIMESTAMP WITH TIME ZONE,
      CONSTRAINT fk_customer FOREIGN KEY(customer_id) REFERENCES customers(id)
    );
    
    -- Create invoice items table if it doesn't exist
    CREATE TABLE IF NOT EXISTS invoice_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id UUID NOT NULL REFERENCES invoices(id),
      description TEXT NOT NULL,
      quantity DECIMAL(10,2) NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      discount_percentage DECIMAL(5,2) DEFAULT 0,
      discount_amount DECIMAL(10,2) DEFAULT 0,
      original_amount DECIMAL(10,2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT fk_invoice FOREIGN KEY(invoice_id) REFERENCES invoices(id)
    );
  `,
}

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

      // Try a simple query
      const { data, error } = await supabase.from("_prisma_migrations").select("count(*)").limit(1).maybeSingle()

      results.connectionTests.supabaseAnon = {
        success: !error,
        message: error ? `Error: ${error.message} (${error.code})` : "Connection successful",
        data: data || null,
      }

      if (error) {
        if (error.code === "PGRST301") {
          results.recommendations.push(
            "The _prisma_migrations table doesn't exist. This might be a new database or the wrong database.",
          )
        } else if (error.code === "PGRST401") {
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

      // Check if tables exist
      const invoiceTableResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.checkInvoiceTable })
      const blogTableResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.checkBlogTable })

      results.tableStatus.invoicesTable = {
        exists: invoiceTableResult.data?.[0]?.exists || false,
        error: invoiceTableResult.error ? invoiceTableResult.error.message : null,
      }

      results.tableStatus.blogPostsTable = {
        exists: blogTableResult.data?.[0]?.exists || false,
        error: blogTableResult.error ? blogTableResult.error.message : null,
      }

      // If tables exist, get record counts
      if (results.tableStatus.invoicesTable.exists) {
        const countResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.countInvoices })
        results.recordCounts.invoices = countResult.data?.[0]?.count || 0
      }

      if (results.tableStatus.blogPostsTable.exists) {
        const countResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.countBlogPosts })
        results.recordCounts.blogPosts = countResult.data?.[0]?.count || 0
      }

      // Get table schemas if tables exist
      if (results.tableStatus.invoicesTable.exists) {
        const schemaResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.getInvoiceSchema })
        results.tableStatus.invoicesSchema = schemaResult.data || []
      }

      if (results.tableStatus.blogPostsTable.exists) {
        const schemaResult = await adminSupabase.rpc("execute_sql", { query: DIAGNOSTIC_QUERIES.getBlogSchema })
        results.tableStatus.blogPostsSchema = schemaResult.data || []
      }

      results.connectionTests.supabaseAdmin = {
        success: true,
        message: "Admin connection successful",
      }

      // Add recommendations based on table status
      if (!results.tableStatus.invoicesTable.exists) {
        results.recommendations.push(
          "The invoices table doesn't exist. Use the 'repair=invoices' parameter to create it.",
        )
      }

      if (!results.tableStatus.blogPostsTable.exists) {
        results.recommendations.push(
          "The blog_posts table doesn't exist. Use the 'repair=blog' parameter to create it.",
        )
      }

      // Perform repairs if requested and authenticated
      if (isAuthenticated && action === "repair") {
        const repair = url.searchParams.get("repair")

        if (repair === "blog" && !results.tableStatus.blogPostsTable.exists) {
          const repairResult = await adminSupabase.rpc("execute_sql", {
            query: DIAGNOSTIC_QUERIES.createBlogTable,
          })

          results.repairs.blog = {
            attempted: true,
            success: !repairResult.error,
            message: repairResult.error ? repairResult.error.message : "Blog table created successfully",
          }
        }

        if (repair === "invoices" && !results.tableStatus.invoicesTable.exists) {
          const repairResult = await adminSupabase.rpc("execute_sql", {
            query: DIAGNOSTIC_QUERIES.createInvoiceTables,
          })

          results.repairs.invoices = {
            attempted: true,
            success: !repairResult.error,
            message: repairResult.error ? repairResult.error.message : "Invoice tables created successfully",
          }
        }
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

  // Final recommendations
  if (results.recommendations.length === 0 && results.connectionTests.supabaseAnon?.success) {
    results.recommendations.push(
      "Database connection is working correctly. If you're still having issues, check your application code.",
    )
  }

  return NextResponse.json(results)
}
