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

    const diagnosticResults = {
      connection: { success: false, message: "", error: null },
      invoiceSchema: { success: false, columns: [], error: null },
      itemsSchema: { success: false, columns: [], error: null },
      testInsert: { success: false, message: "", error: null },
      testUpdate: { success: false, message: "", error: null },
      environment: {
        supabaseUrl: supabaseUrl ? "Set" : "Not set",
        supabaseKey: supabaseKey ? "Set (length: " + supabaseKey.length + ")" : "Not set",
        nextRuntime: process.env.NEXT_RUNTIME || "Not set",
      },
    }

    // Test 1: Database connection
    try {
      const { data, error } = await supabase.from("invoices").select("count").limit(1)

      if (error) throw error

      diagnosticResults.connection.success = true
      diagnosticResults.connection.message = "Successfully connected to database"
    } catch (error: any) {
      diagnosticResults.connection.success = false
      diagnosticResults.connection.message = "Failed to connect to database"
      diagnosticResults.connection.error = error.message
    }

    // Test 2: Get invoice schema
    try {
      const { data, error } = await supabase.from("invoices").select("*").limit(1)

      if (error) throw error

      const columns = data && data.length > 0 ? Object.keys(data[0]) : []
      diagnosticResults.invoiceSchema.success = true
      diagnosticResults.invoiceSchema.columns = columns
    } catch (error: any) {
      diagnosticResults.invoiceSchema.success = false
      diagnosticResults.invoiceSchema.error = error.message
    }

    // Test 3: Get invoice_items schema
    try {
      const { data, error } = await supabase.from("invoice_items").select("*").limit(1)

      if (error) throw error

      const columns = data && data.length > 0 ? Object.keys(data[0]) : []
      diagnosticResults.itemsSchema.success = true
      diagnosticResults.itemsSchema.columns = columns
    } catch (error: any) {
      diagnosticResults.itemsSchema.success = false
      diagnosticResults.itemsSchema.error = error.message
    }

    // Test 4: Try a simple insert
    try {
      const testId = crypto.randomUUID()

      const { error } = await supabase.from("invoices").insert({
        id: testId,
        invoice_number: "TEST-" + Date.now(),
        customer_id: null,
        project_name: "Diagnostic Test",
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date().toISOString().split("T")[0],
        subtotal: 0,
        total_amount: 0,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      diagnosticResults.testInsert.success = true
      diagnosticResults.testInsert.message = "Successfully inserted test invoice"

      // Clean up the test data
      await supabase.from("invoices").delete().eq("id", testId)
    } catch (error: any) {
      diagnosticResults.testInsert.success = false
      diagnosticResults.testInsert.message = "Failed to insert test invoice"
      diagnosticResults.testInsert.error = error.message
    }

    return NextResponse.json({
      success: true,
      diagnosticResults,
    })
  } catch (error) {
    console.error("Error in diagnostic API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostic failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
