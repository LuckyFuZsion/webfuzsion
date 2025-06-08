import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if invoices table exists
    const { data: tableExists, error: tableError } = await supabase.rpc("check_table_exists", {
      table_name: "invoices",
    })

    if (tableError) {
      // Fallback to a direct query if the RPC fails
      const { data: tables, error: fallbackError } = await supabase
        .from("pg_tables")
        .select("tablename")
        .eq("schemaname", "public")
        .eq("tablename", "invoices")

      if (fallbackError) {
        return NextResponse.json({
          success: false,
          error: "Failed to check if invoices table exists",
          details: fallbackError.message,
        })
      }

      const exists = tables && tables.length > 0

      if (!exists) {
        return NextResponse.json({
          success: false,
          error: "Invoices table does not exist",
        })
      }
    }

    // Get table structure
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", "invoices")

    if (columnsError) {
      return NextResponse.json({
        success: false,
        error: "Failed to get invoices table structure",
        details: columnsError.message,
      })
    }

    // Count invoices
    const { count, error: countError } = await supabase.from("invoices").select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json({
        success: false,
        error: "Failed to count invoices",
        details: countError.message,
      })
    }

    // Get a sample invoice
    const { data: sampleInvoice, error: sampleError } = await supabase.from("invoices").select("*").limit(1)

    if (sampleError) {
      return NextResponse.json({
        success: false,
        error: "Failed to get sample invoice",
        details: sampleError.message,
      })
    }

    // Check if invoice_items table exists and get count
    const { count: itemsCount, error: itemsCountError } = await supabase
      .from("invoice_items")
      .select("*", { count: "exact", head: true })

    // Return the results
    return NextResponse.json({
      success: true,
      table_exists: true,
      columns: columns,
      invoice_count: count,
      sample_invoice: sampleInvoice && sampleInvoice.length > 0 ? sampleInvoice[0] : null,
      invoice_items_count: itemsCountError ? "Error counting items" : itemsCount,
      invoice_items_error: itemsCountError ? itemsCountError.message : null,
    })
  } catch (error) {
    console.error("Error checking invoices:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to check invoices",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
