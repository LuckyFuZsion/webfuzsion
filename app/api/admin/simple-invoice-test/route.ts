import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate test data
    const testId = crypto.randomUUID()
    const testInvoiceNumber = "TEST-" + Date.now()

    console.log("Creating test invoice with ID:", testId)

    // Step 1: Create a test customer
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .insert({
        id: testId,
        name: "Test Customer",
        email: `test-${Date.now()}@example.com`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (customerError) {
      console.error("Error creating test customer:", customerError)
      return NextResponse.json({
        success: false,
        error: `Customer creation failed: ${customerError.message}`,
        details: customerError,
      })
    }

    console.log("Created test customer:", customerData)

    // Step 2: Create a test invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        id: testId,
        invoice_number: testInvoiceNumber,
        customer_id: testId, // This is required
        project_name: "Test Project",
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date().toISOString().split("T")[0],
        subtotal: 100,
        discount_amount: 0,
        total_amount: 100,
        status: "draft",
        notes: "Test notes",
        terms: "Test terms",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (invoiceError) {
      console.error("Error creating test invoice:", invoiceError)
      return NextResponse.json({
        success: false,
        error: `Invoice creation failed: ${invoiceError.message}`,
        details: invoiceError,
      })
    }

    console.log("Created test invoice:", invoiceData)

    // Step 3: Create a test invoice item
    const { data: itemData, error: itemError } = await supabase
      .from("invoice_items")
      .insert({
        id: testId,
        invoice_id: testId,
        description: "Test Item",
        quantity: 1,
        unit_price: 100,
        amount: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (itemError) {
      console.error("Error creating test invoice item:", itemError)
      return NextResponse.json({
        success: false,
        error: `Invoice item creation failed: ${itemError.message}`,
        details: itemError,
      })
    }

    console.log("Created test invoice item:", itemData)

    // Success!
    return NextResponse.json({
      success: true,
      message: "Test invoice created successfully",
      testId,
      testInvoiceNumber,
    })
  } catch (error) {
    console.error("Error in simple invoice test:", error)
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
