import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to check authentication
function isAuthenticated() {
  const authCookie = cookies().get("admin-auth")
  return authCookie && authCookie.value === "authenticated"
}

export async function GET(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get query parameters
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    console.log("GET /api/admin/invoices - ID:", id)

    if (id) {
      // Get a specific invoice
      console.log("Fetching specific invoice:", id)

      try {
        // First get the invoice
        const { data: invoice, error: invoiceError } = await supabase.from("invoices").select("*").eq("id", id).single()

        if (invoiceError) {
          console.error("Error fetching invoice:", invoiceError)
          return NextResponse.json({ success: false, error: invoiceError.message }, { status: 404 })
        }

        if (!invoice) {
          console.error("Invoice not found:", id)
          return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 })
        }

        console.log("Found invoice:", invoice.invoice_number)

        // Get the customer
        let customer = null
        if (invoice.customer_id) {
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("id", invoice.customer_id)
            .single()

          if (customerError) {
            console.error("Error fetching customer:", customerError)
          } else {
            customer = customerData
            console.log("Found customer:", customer.name)
          }
        }

        // Get the invoice items
        const { data: items, error: itemsError } = await supabase.from("invoice_items").select("*").eq("invoice_id", id)

        if (itemsError) {
          console.error("Error fetching invoice items:", itemsError)
          return NextResponse.json({ success: false, error: itemsError.message }, { status: 500 })
        }

        console.log(`Found ${items?.length || 0} invoice items`)

        // Format the response to match what the client expects
        const formattedInvoice = {
          ...invoice,
          customer: customer,
          items: items || [],
        }

        return NextResponse.json({ success: true, invoice: formattedInvoice })
      } catch (error) {
        console.error("Error processing invoice request:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Error processing invoice request",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    } else {
      // Get all invoices with basic info
      console.log("Fetching all invoices")

      try {
        const { data: invoices, error: invoicesError } = await supabase
          .from("invoices")
          .select("*")
          .order("issue_date", { ascending: false })

        if (invoicesError) {
          console.error("Error fetching invoices:", invoicesError)
          return NextResponse.json({ success: false, error: invoicesError.message }, { status: 500 })
        }

        console.log(`Found ${invoices?.length || 0} invoices`)

        // Get all customers to join with invoices
        const { data: customers, error: customersError } = await supabase.from("customers").select("*")

        if (customersError) {
          console.error("Error fetching customers:", customersError)
        }

        // Create a map of customer IDs to customers
        const customerMap = new Map()
        if (customers) {
          customers.forEach((customer) => {
            customerMap.set(customer.id, customer)
          })
        }

        // Format the response
        const formattedInvoices = (invoices || []).map((invoice) => {
          const customer = invoice.customer_id ? customerMap.get(invoice.customer_id) : null

          return {
            id: invoice.id,
            invoice_number: invoice.invoice_number,
            project_name: invoice.project_name,
            customer_name: customer?.name || "Unknown",
            customer_email: customer?.email || "",
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
            total_amount: invoice.total_amount,
            status: invoice.status,
          }
        })

        return NextResponse.json({ success: true, invoices: formattedInvoices })
      } catch (error) {
        console.error("Error processing invoices request:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Error processing invoices request",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Unexpected error in invoices API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, customer, invoice, items } = body

    if (!id || !customer || !invoice || !items) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    console.log("Processing invoice save request:", { id, invoice: invoice.invoice_number })

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Insert or update customer
    try {
      const customerData = {
        id: customer.id.startsWith("local-") ? crypto.randomUUID() : customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
        address: customer.address || null,
        city: customer.city || null,
        postal_code: customer.postal_code || null,
        country: customer.country || "United Kingdom",
        updated_at: new Date().toISOString(),
      }

      console.log("Customer data:", customerData)

      // Check if customer already exists by email
      const { data: existingCustomer, error: customerQueryError } = await supabase
        .from("customers")
        .select("id")
        .eq("email", customerData.email)
        .maybeSingle()

      if (customerQueryError) {
        console.error("Error querying customer:", customerQueryError)
        throw new Error(`Customer query error: ${customerQueryError.message}`)
      }

      let customerId = customerData.id

      if (existingCustomer) {
        console.log("Updating existing customer:", existingCustomer.id)
        // Update existing customer
        const { error: updateError } = await supabase
          .from("customers")
          .update({
            name: customerData.name,
            phone: customerData.phone,
            address: customerData.address,
            city: customerData.city,
            postal_code: customerData.postal_code,
            country: customerData.country,
            updated_at: customerData.updated_at,
          })
          .eq("id", existingCustomer.id)

        if (updateError) {
          console.error("Error updating customer:", updateError)
          throw new Error(`Customer update error: ${updateError.message}`)
        }

        // Use existing customer ID
        customerId = existingCustomer.id
      } else {
        console.log("Creating new customer")
        // Insert new customer
        const { error: insertError } = await supabase.from("customers").insert({
          ...customerData,
          created_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error inserting customer:", insertError)
          throw new Error(`Customer insert error: ${insertError.message}`)
        }
      }

      console.log("Customer processed successfully, ID:", customerId)

      // 2. Insert or update invoice
      try {
        // Basic invoice data - ONLY include fields that exist in the schema
        const invoiceData = {
          id: id,
          invoice_number: invoice.invoice_number,
          customer_id: customerId, // This is required and cannot be null
          project_name: invoice.project_name,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          subtotal: invoice.subtotal,
          discount_amount: invoice.discount_amount || 0,
          total_amount: invoice.total_amount,
          status: invoice.status || "draft",
          notes: invoice.notes || null,
          terms: invoice.terms || null,
          updated_at: new Date().toISOString(),
          paid_at: invoice.status === "paid" ? new Date().toISOString() : null,
        }

        console.log("Invoice data:", invoiceData)

        // Check if invoice already exists
        const { data: existingInvoice, error: invoiceQueryError } = await supabase
          .from("invoices")
          .select("id")
          .eq("id", invoiceData.id)
          .maybeSingle()

        if (invoiceQueryError) {
          console.error("Error querying invoice:", invoiceQueryError)
          throw new Error(`Invoice query error: ${invoiceQueryError.message}`)
        }

        if (existingInvoice) {
          console.log("Updating existing invoice:", existingInvoice.id)
          // Update existing invoice
          const { error: updateError } = await supabase.from("invoices").update(invoiceData).eq("id", invoiceData.id)

          if (updateError) {
            console.error("Error updating invoice:", updateError)
            throw new Error(`Invoice update error: ${updateError.message}`)
          }
        } else {
          console.log("Creating new invoice")
          // Insert new invoice
          const { error: insertError } = await supabase.from("invoices").insert({
            ...invoiceData,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error inserting invoice:", insertError)
            throw new Error(`Invoice insert error: ${insertError.message}`)
          }
        }

        console.log("Invoice processed successfully")

        // 3. Delete existing items for this invoice (to handle removed items)
        console.log("Deleting existing invoice items for invoice:", id)
        const { error: deleteError } = await supabase.from("invoice_items").delete().eq("invoice_id", id)

        if (deleteError) {
          console.error("Error deleting invoice items:", deleteError)
          throw new Error(`Delete items error: ${deleteError.message}`)
        }

        // 4. Insert new invoice items
        console.log("Inserting new invoice items:", items.length)

        // Process items in batches to avoid potential size limits
        const batchSize = 10
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize)

          const itemsData = batch.map((item: any) => {
            // Ensure all numeric fields are properly converted to numbers
            const quantity = Number(item.quantity) || 0
            const unitPrice = Number(item.unit_price) || 0
            const amount = Number(item.amount) || 0
            const discountPercentage = Number(item.discount_percentage) || 0
            const discountAmount = Number(item.discount_amount) || 0
            const originalAmount = Number(item.original_amount) || quantity * unitPrice

            return {
              id: item.id || crypto.randomUUID(),
              invoice_id: id,
              description: item.description,
              quantity: quantity,
              unit_price: unitPrice,
              amount: amount,
              // Now include the discount fields we added to the schema
              discount_percentage: discountPercentage,
              discount_amount: discountAmount,
              original_amount: originalAmount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          })

          console.log(`Inserting batch of ${itemsData.length} items`)
          const { error: itemsError } = await supabase.from("invoice_items").insert(itemsData)

          if (itemsError) {
            console.error("Error inserting invoice items:", itemsError)
            throw new Error(`Insert items error: ${itemsError.message}`)
          }
        }

        console.log("All invoice items processed successfully")

        return NextResponse.json({
          success: true,
          invoice_id: id,
          customer_id: customerId,
          message: "Invoice saved to database",
        })
      } catch (invoiceError) {
        console.error("Error in invoice processing:", invoiceError)
        throw invoiceError
      }
    } catch (customerError) {
      console.error("Error in customer processing:", customerError)
      throw customerError
    }
  } catch (error) {
    console.error("Error in invoice API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      console.log("DELETE request unauthorized - missing or invalid admin-auth cookie")
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
    }

    // Get invoice ID from URL
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    console.log(`Processing DELETE request for invoice ID: ${id}`)

    if (!id) {
      console.log("DELETE request missing invoice ID")
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete invoice items first (foreign key constraint)
    console.log(`Deleting invoice items for invoice ID: ${id}`)
    const { error: itemsError } = await supabase.from("invoice_items").delete().eq("invoice_id", id)

    if (itemsError) {
      console.error("Error deleting invoice items:", itemsError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to delete invoice items: ${itemsError.message}`,
          details: itemsError,
        },
        { status: 500 },
      )
    }

    // Delete the invoice
    console.log(`Deleting invoice with ID: ${id}`)
    const { error: invoiceError } = await supabase.from("invoices").delete().eq("id", id)

    if (invoiceError) {
      console.error("Error deleting invoice:", invoiceError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to delete invoice: ${invoiceError.message}`,
          details: invoiceError,
        },
        { status: 500 },
      )
    }

    console.log(`Successfully deleted invoice with ID: ${id}`)
    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE handler:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete invoice",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Add support for HEAD requests
export async function HEAD(request: Request) {
  // Just return a 200 OK for health checks
  return new Response(null, { status: 200 })
}
