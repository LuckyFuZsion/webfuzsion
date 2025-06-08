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

    // Step 1: Get all invoices (without joins)
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*")
      .order("issue_date", { ascending: false })

    if (invoicesError) {
      console.error("Error fetching invoices:", invoicesError)
      return NextResponse.json(
        {
          success: false,
          error: invoicesError.message,
          step: "fetching invoices",
        },
        { status: 500 },
      )
    }

    // Step 2: Get all customers
    const { data: customers, error: customersError } = await supabase.from("customers").select("*")

    if (customersError) {
      console.error("Error fetching customers:", customersError)
      return NextResponse.json(
        {
          success: false,
          error: customersError.message,
          step: "fetching customers",
        },
        { status: 500 },
      )
    }

    // Step 3: Get all invoice items
    const { data: allItems, error: itemsError } = await supabase.from("invoice_items").select("*")

    if (itemsError) {
      console.error("Error fetching invoice items:", itemsError)
      return NextResponse.json(
        {
          success: false,
          error: itemsError.message,
          step: "fetching invoice items",
        },
        { status: 500 },
      )
    }

    // Create a map of customers by ID for faster lookup
    const customersMap = new Map()
    customers.forEach((customer) => {
      customersMap.set(customer.id, customer)
    })

    // Format the invoices for localStorage
    const formattedInvoices = invoices.map((invoice) => {
      // Get customer for this invoice
      const customer = customersMap.get(invoice.customer_id) || {}

      // Get items for this invoice
      const invoiceItems = allItems.filter((item) => item.invoice_id === invoice.id)

      // Format the invoice with customer data
      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number || "",
        project_name: invoice.project_name || "",
        issue_date: invoice.issue_date || "",
        due_date: invoice.due_date || "",
        subtotal: invoice.subtotal || 0,
        discount_amount: invoice.discount_amount || 0,
        total_amount: invoice.total_amount || 0,
        status: invoice.status || "draft",
        notes: invoice.notes || "",
        terms: invoice.terms || "",
        created_at: invoice.created_at || "",
        updated_at: invoice.updated_at || "",
        // Add customer data directly to the invoice
        customer_name: customer.name || "Unknown",
        customer_email: customer.email || "",
        customer_phone: customer.phone || "",
        customer_address: customer.address || "",
        customer_city: customer.city || "",
        customer_postal_code: customer.postal_code || "",
        customer_country: customer.country || "United Kingdom",
        // Include the items
        items: invoiceItems.map((item) => ({
          id: item.id,
          description: item.description || "",
          quantity: item.quantity || 0,
          unit_price: item.unit_price || 0,
          amount: item.amount || 0,
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
