import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to validate UUID
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Helper function to generate a valid UUID
function generateValidUUID(existingId?: string) {
  // If the existing ID is a valid UUID, use it
  if (existingId && isValidUUID(existingId)) {
    return existingId
  }
  // Otherwise generate a new UUID
  return crypto.randomUUID()
}

export async function POST(request: Request) {
  // Create a debug log to track the migration process
  const debugLog: string[] = []
  const logDebug = (message: string) => {
    console.log(`[Migration Debug] ${message}`)
    debugLog.push(message)
  }

  try {
    logDebug("Starting migration process")

    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      logDebug("Authentication failed")
      return NextResponse.json({ error: "Unauthorized", debugLog }, { status: 401 })
    }

    logDebug("Authentication successful")

    // Get invoices data from request body
    const requestBody = await request.json()
    logDebug(`Request body received: ${JSON.stringify(requestBody).substring(0, 200)}...`)

    const { invoices } = requestBody

    if (!invoices) {
      logDebug("No invoices property in request body")
      return NextResponse.json(
        {
          success: false,
          error: "No invoices property in request body",
          requestBody: JSON.stringify(requestBody).substring(0, 500),
          debugLog,
        },
        { status: 400 },
      )
    }

    if (!Array.isArray(invoices)) {
      logDebug(`Invoices is not an array: ${typeof invoices}`)
      return NextResponse.json(
        {
          success: false,
          error: "Invoices is not an array",
          invoicesType: typeof invoices,
          invoicesValue: JSON.stringify(invoices).substring(0, 500),
          debugLog,
        },
        { status: 400 },
      )
    }

    if (invoices.length === 0) {
      logDebug("Invoices array is empty")
      return NextResponse.json({ success: false, error: "No invoices to migrate", debugLog }, { status: 400 })
    }

    logDebug(`Found ${invoices.length} invoices to migrate`)

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    logDebug("Supabase client initialized")

    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabase.from("customers").select("count").limit(1)

    if (connectionError) {
      logDebug(`Database connection test failed: ${connectionError.message}`)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError.message,
          debugLog,
        },
        { status: 500 },
      )
    }

    logDebug("Database connection successful")

    // Track migration results
    const results = {
      customers: { success: 0, error: 0, details: [] as any[] },
      invoices: { success: 0, error: 0, details: [] as any[] },
      items: { success: 0, error: 0, details: [] as any[] },
    }

    // Process each invoice
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i]
      logDebug(`Processing invoice ${i + 1}/${invoices.length}: ${invoice.id || "unknown id"}`)

      try {
        // Validate invoice structure
        if (!invoice) {
          logDebug(`Invoice ${i} is null or undefined`)
          results.invoices.error++
          results.invoices.details.push({
            index: i,
            error: "Invoice is null or undefined",
          })
          continue
        }

        if (!invoice.id) {
          logDebug(`Invoice ${i} is missing ID`)
          results.invoices.error++
          results.invoices.details.push({
            index: i,
            invoice: JSON.stringify(invoice).substring(0, 200),
            error: "Invoice is missing ID",
          })
          continue
        }

        // Ensure invoice ID is a valid UUID
        const invoiceId = generateValidUUID(invoice.id)
        logDebug(`Using invoice ID: ${invoiceId} (original: ${invoice.id})`)

        // Extract customer data from invoice
        let customerData = null
        if (invoice.customer) {
          // If invoice has a customer object, use it
          customerData = invoice.customer
          logDebug(`Using customer object from invoice: ${JSON.stringify(customerData).substring(0, 100)}...`)
        } else if (invoice.customer_name || invoice.customer_email) {
          // If invoice has customer_name or customer_email fields, create a customer object
          customerData = {
            name: invoice.customer_name || "Unknown Customer",
            email: invoice.customer_email || `unknown-${Date.now()}@example.com`,
            phone: invoice.customer_phone || null,
            address: invoice.customer_address || null,
            city: invoice.customer_city || null,
            postal_code: invoice.customer_postal_code || null,
            country: invoice.customer_country || "United Kingdom",
          }
          logDebug(`Created customer object from invoice fields: ${JSON.stringify(customerData).substring(0, 100)}...`)
        }

        if (!customerData) {
          logDebug(`Invoice ${invoiceId} has no customer data`)
          results.invoices.error++
          results.invoices.details.push({
            id: invoiceId,
            error: "No customer data",
          })
          continue
        }

        // Process customer
        logDebug(`Processing customer for invoice ${invoiceId}`)

        try {
          // Generate a valid UUID for the customer
          const customerId = generateValidUUID(customerData.id)
          logDebug(`Using customer ID: ${customerId} (original: ${customerData.id || "none"})`)

          const customer = {
            id: customerId,
            name: customerData.name || "Unknown",
            email: customerData.email || `unknown-${Date.now()}@example.com`,
            phone: customerData.phone || null,
            address: customerData.address || null,
            city: customerData.city || null,
            postal_code: customerData.postal_code || null,
            country: customerData.country || "United Kingdom",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          logDebug(`Customer data prepared: ${JSON.stringify(customer).substring(0, 200)}`)

          // Check if customer already exists by email
          const { data: existingCustomer, error: customerQueryError } = await supabase
            .from("customers")
            .select("id")
            .eq("email", customer.email)
            .maybeSingle()

          if (customerQueryError) {
            logDebug(`Error querying existing customer: ${customerQueryError.message}`)
            throw customerQueryError
          }

          if (existingCustomer) {
            logDebug(`Found existing customer with email ${customer.email}, id: ${existingCustomer.id}`)

            // Update existing customer
            const { error: updateError } = await supabase
              .from("customers")
              .update({
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                postal_code: customer.postal_code,
                country: customer.country,
                updated_at: customer.updated_at,
              })
              .eq("id", existingCustomer.id)

            if (updateError) {
              logDebug(`Error updating customer: ${updateError.message}`)
              throw updateError
            }

            // Use existing customer ID
            customer.id = existingCustomer.id
            logDebug(`Updated existing customer: ${existingCustomer.id}`)
          } else {
            logDebug(`No existing customer found with email ${customer.email}, creating new`)

            // Insert new customer
            const { error: insertError } = await supabase.from("customers").insert(customer)

            if (insertError) {
              logDebug(`Error inserting customer: ${insertError.message}`)
              throw insertError
            }

            logDebug(`Created new customer with id: ${customer.id}`)
          }

          results.customers.success++
          results.customers.details.push({
            id: customer.id,
            email: customer.email,
            status: "success",
          })

          // 2. Insert invoice
          logDebug(`Preparing invoice data for ${invoiceId}`)

          const invoiceData = {
            id: invoiceId,
            invoice_number: invoice.invoice_number || `INV-${Date.now()}`,
            customer_id: customer.id,
            project_name: invoice.project_name || null,
            issue_date: invoice.issue_date || new Date().toISOString().split("T")[0],
            due_date: invoice.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            subtotal: invoice.subtotal || invoice.total_amount || 0,
            discount_amount: invoice.discount_amount || 0,
            total_amount: invoice.total_amount || 0,
            status: invoice.status || "draft",
            notes: invoice.notes || null,
            terms: invoice.terms || null,
            created_at: invoice.created_at || new Date().toISOString(),
            updated_at: invoice.updated_at || new Date().toISOString(),
            paid_at: invoice.status === "paid" ? invoice.paid_at || new Date().toISOString() : null,
          }

          logDebug(`Invoice data prepared: ${JSON.stringify(invoiceData).substring(0, 200)}`)

          // Check if invoice already exists
          const { data: existingInvoice, error: invoiceQueryError } = await supabase
            .from("invoices")
            .select("id")
            .eq("id", invoiceData.id)
            .maybeSingle()

          if (invoiceQueryError) {
            logDebug(`Error querying existing invoice: ${invoiceQueryError.message}`)
            throw invoiceQueryError
          }

          if (existingInvoice) {
            logDebug(`Found existing invoice with id: ${existingInvoice.id}, updating`)

            // Update existing invoice
            const { error: updateError } = await supabase.from("invoices").update(invoiceData).eq("id", invoiceData.id)

            if (updateError) {
              logDebug(`Error updating invoice: ${updateError.message}`)
              throw updateError
            }

            logDebug(`Updated existing invoice: ${existingInvoice.id}`)
          } else {
            logDebug(`No existing invoice found with id: ${invoiceData.id}, creating new`)

            // Insert new invoice
            const { error: insertError } = await supabase.from("invoices").insert(invoiceData)

            if (insertError) {
              logDebug(`Error inserting invoice: ${insertError.message}`)
              throw insertError
            }

            logDebug(`Created new invoice with id: ${invoiceData.id}`)
          }

          results.invoices.success++
          results.invoices.details.push({
            id: invoiceData.id,
            invoice_number: invoiceData.invoice_number,
            status: "success",
          })

          // 3. Insert invoice items
          if (invoice.items && Array.isArray(invoice.items)) {
            logDebug(`Processing ${invoice.items.length} items for invoice ${invoiceId}`)

            // First, delete any existing items for this invoice to avoid duplicates
            const { error: deleteError } = await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId)

            if (deleteError) {
              logDebug(`Error deleting existing invoice items: ${deleteError.message}`)
              // Continue anyway, as this is not critical
            } else {
              logDebug(`Deleted existing items for invoice ${invoiceId}`)
            }

            for (let j = 0; j < invoice.items.length; j++) {
              const item = invoice.items[j]
              logDebug(`Processing item ${j + 1}/${invoice.items.length} for invoice ${invoiceId}`)

              try {
                if (!item) {
                  logDebug(`Item ${j} is null or undefined`)
                  results.items.error++
                  results.items.details.push({
                    invoice_id: invoiceId,
                    index: j,
                    error: "Item is null or undefined",
                  })
                  continue
                }

                // Generate a valid UUID for the item
                const itemId = generateValidUUID(item.id)
                logDebug(`Using item ID: ${itemId} (original: ${item.id || "none"})`)

                const itemData = {
                  id: itemId,
                  invoice_id: invoiceId,
                  description: item.description || "No description",
                  quantity: item.quantity || 1,
                  unit_price: item.unit_price || 0,
                  amount: item.amount || item.quantity * item.unit_price || 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }

                logDebug(`Item data prepared: ${JSON.stringify(itemData).substring(0, 200)}`)

                // Insert new item (we already deleted existing ones)
                const { error: insertError } = await supabase.from("invoice_items").insert(itemData)

                if (insertError) {
                  logDebug(`Error inserting invoice item: ${insertError.message}`)
                  throw insertError
                }

                logDebug(`Created invoice item with id: ${itemData.id}`)

                results.items.success++
                results.items.details.push({
                  id: itemData.id,
                  invoice_id: itemData.invoice_id,
                  status: "success",
                })
              } catch (itemError: any) {
                logDebug(`Error processing item ${j} for invoice ${invoiceId}: ${itemError.message}`)
                results.items.error++
                results.items.details.push({
                  invoice_id: invoiceId,
                  index: j,
                  error: itemError.message,
                  item: JSON.stringify(item).substring(0, 200),
                })
              }
            }
          } else {
            logDebug(`No items found for invoice ${invoiceId} or items is not an array`)
          }
        } catch (customerError: any) {
          logDebug(`Error processing customer for invoice ${invoiceId}: ${customerError.message}`)
          results.customers.error++
          results.customers.details.push({
            invoice_id: invoiceId,
            error: customerError.message,
            customer: JSON.stringify(customerData).substring(0, 200),
          })
        }
      } catch (invoiceError: any) {
        logDebug(`Error processing invoice ${i}: ${invoiceError.message}`)
        results.invoices.error++
        results.invoices.details.push({
          index: i,
          id: invoice?.id,
          error: invoiceError.message,
          invoice: JSON.stringify(invoice).substring(0, 200),
        })
      }
    }

    logDebug("Migration completed")

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      results,
      debugLog,
    })
  } catch (error: any) {
    logDebug(`Critical error in migration process: ${error.message}`)
    console.error("Error in migration process:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Migration failed",
        details: error instanceof Error ? error.message : String(error),
        debugLog,
      },
      { status: 500 },
    )
  }
}
