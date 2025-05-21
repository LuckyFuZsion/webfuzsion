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

    // Get all invoices with their customers
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers (*)
      `)
      .order("issue_date", { ascending: false })

    if (invoicesError) {
      return NextResponse.json({ success: false, error: invoicesError.message }, { status: 500 })
    }

    // Get all invoice items
    const { data: allItems, error: itemsError } = await supabase.from("invoice_items").select("*")

    if (itemsError) {
      return NextResponse.json({ success: false, error: itemsError.message }, { status: 500 })
    }

    // Format the invoices for localStorage
    const formattedInvoices = invoices.map((invoice) => {
      // Get items for this invoice
      const invoiceItems = allItems.filter((item) => item.invoice_id === invoice.id)

      // Format the invoice with customer data
      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        project_name: invoice.project_name,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        discount_amount: invoice.discount_amount,
        total_amount: invoice.total_amount,
        status: invoice.status,
        notes: invoice.notes,
        terms: invoice.terms,
        created_at: invoice.created_at,
        updated_at: invoice.updated_at,
        // Add customer data directly to the invoice
        customer_name: invoice.customers?.name || "Unknown",
        customer_email: invoice.customers?.email || "",
        customer_phone: invoice.customers?.phone || "",
        customer_address: invoice.customers?.address || "",
        customer_city: invoice.customers?.city || "",
        customer_postal_code: invoice.customers?.postal_code || "",
        customer_country: invoice.customers?.country || "United Kingdom",
        // Include the items
        items: invoiceItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        })),
      }
    })

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
    })
  } catch (error) {
    console.error("Error syncing invoices from database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync invoices from database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
