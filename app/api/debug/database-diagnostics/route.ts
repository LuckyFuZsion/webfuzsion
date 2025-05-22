import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

// Update the diagnostic queries to check both schemas
const DIAGNOSTIC_QUERIES = {
  // Check if tables exist in both schemas
  checkPublicInvoiceTable:
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices')",
  checkInvoiceSystemTable:
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'invoice_system' AND table_name = 'invoices')",
  checkBlogTable: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts')",

  // Count records in both schemas
  countPublicInvoices: "SELECT COUNT(*) FROM public.invoices",
  countInvoiceSystemInvoices: "SELECT COUNT(*) FROM invoice_system.invoices",
  countBlogPosts: "SELECT COUNT(*) FROM blog_posts",
}

// Update the GET function to check both schemas
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
    schemaIssues: {
      duplicateTables: [],
      details: {},
    },
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Add this section to check for duplicate tables
  if (supabaseUrl && supabaseServiceKey) {
    try {
      console.log(`Testing for duplicate tables across schemas`)
      const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Check invoices table in both schemas
      const publicInvoiceResult = await adminSupabase.rpc("execute_sql", {
        query: DIAGNOSTIC_QUERIES.checkPublicInvoiceTable,
      })

      const invoiceSystemResult = await adminSupabase.rpc("execute_sql", {
        query: DIAGNOSTIC_QUERIES.checkInvoiceSystemTable,
      })

      const publicInvoiceExists = publicInvoiceResult.data?.[0]?.exists || false
      const invoiceSystemExists = invoiceSystemResult.data?.[0]?.exists || false

      // Check for duplicate tables
      if (publicInvoiceExists && invoiceSystemExists) {
        results.schemaIssues.duplicateTables.push("invoices")

        // Get counts from both tables
        const publicCountResult = await adminSupabase.rpc("execute_sql", {
          query: DIAGNOSTIC_QUERIES.countPublicInvoices,
        })

        const systemCountResult = await adminSupabase.rpc("execute_sql", {
          query: DIAGNOSTIC_QUERIES.countInvoiceSystemInvoices,
        })

        results.schemaIssues.details.invoices = {
          public: {
            exists: true,
            count: publicCountResult.data?.[0]?.count || 0,
          },
          invoice_system: {
            exists: true,
            count: systemCountResult.data?.[0]?.count || 0,
          },
        }

        results.recommendations.push(
          "Found duplicate 'invoices' tables in both 'public' and 'invoice_system' schemas. Consider consolidating them.",
        )
      }

      // Update the tableStatus to reflect both schemas
      results.tableStatus.invoicesTable = {
        public: publicInvoiceExists,
        invoice_system: invoiceSystemExists,
        exists: publicInvoiceExists || invoiceSystemExists,
      }
    } catch (e) {
      console.error("Error checking for duplicate tables:", e)
    }
  }

  return NextResponse.json(results)
}
