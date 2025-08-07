import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    // Check authentication
    const authCookie = (await cookies()).get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get query parameters
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      // Get a specific quote with its items and customer
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single()

      if (quoteError) {
        console.error("Error fetching quote:", quoteError)
        return NextResponse.json({ success: false, error: quoteError.message }, { status: 404 })
      }

      // Parse customer_project_name to extract customer info
      const customerProjectParts = quote.customer_project_name?.split('-') || []
      const customerId = customerProjectParts[0] || ''
      const projectName = customerProjectParts.slice(1).join('-') || quote.customer_project_name || ''

      // Get customer data separately if we have a customer ID
      let customer = null
      if (customerId && customerId.length > 8) { // Valid UUID length
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("id, name, email, phone, address, city, postal_code, country")
          .eq("id", customerId)
          .single()
        
        if (!customerError && customerData) {
          customer = customerData
        } else {
          console.error("Error fetching customer:", customerError)
        }
      }

      // Get quote items separately
      const { data: items, error: itemsError } = await supabase
        .from("quote_items")
        .select("*")
        .eq("quote_id", id)

      if (itemsError) {
        console.error("Error fetching quote items:", itemsError)
      }

      const quoteWithRelations = {
        ...quote,
        customer: customer || null,
        items: items || [],
        // Map the existing fields to expected format
        project_name: projectName,
        due_date: quote.expiry_date,
        customer_id: customerId,
        customer_name: customer?.name || "Unknown",
        customer_email: customer?.email || "",
        customer_phone: customer?.phone || "",
        customer_address: customer?.address || "",
        customer_city: customer?.city || "",
        customer_postal_code: customer?.postal_code || "",
        customer_country: customer?.country || "United Kingdom",
      }

      return NextResponse.json({ success: true, quote: quoteWithRelations })
    } else {
      // Get all quotes with customer info
      console.log("Fetching all quotes from database...")
      
      const { data: quotes, error: quotesError } = await supabase
        .from("quotes")
        .select(`
          id, 
          quote_number, 
          customer_project_name,
          issue_date, 
          expiry_date, 
          total_amount, 
          status
        `)
        .order("issue_date", { ascending: false })

      if (quotesError) {
        console.error("Error fetching quotes:", quotesError)
        return NextResponse.json({ success: false, error: quotesError.message }, { status: 500 })
      }

      console.log(`Successfully fetched ${quotes?.length || 0} quotes`)

      // Format the response to match expected structure and fetch customer details
      const formattedQuotes = await Promise.all(quotes.map(async (quote) => {
        const customerProjectParts = quote.customer_project_name?.split('-') || []
        const customerId = customerProjectParts[0] || ''
        const projectName = customerProjectParts.slice(1).join('-') || quote.customer_project_name || ''

        // Fetch customer details if we have a customer ID
        let customer = null
        if (customerId && customerId.length > 8) { // Valid UUID length
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("id, name, email, phone, address, city, postal_code, country")
            .eq("id", customerId)
            .single()
          
          if (!customerError && customerData) {
            customer = customerData
          }
        }

        return {
          id: quote.id,
          quote_number: quote.quote_number,
          project_name: projectName,
          customer_name: customer?.name || "Unknown",
          customer_email: customer?.email || "",
          customer_phone: customer?.phone || "",
          customer_address: customer?.address || "",
          customer_city: customer?.city || "",
          customer_postal_code: customer?.postal_code || "",
          customer_country: customer?.country || "United Kingdom",
          issue_date: quote.issue_date,
          due_date: quote.expiry_date,
          total_amount: quote.total_amount,
          status: quote.status,
          customer: customer,
        }
      }))

      return NextResponse.json({ success: true, quotes: formattedQuotes })
    }
  } catch (error) {
    console.error("Unexpected error in quotes GET:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = (await cookies()).get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, customer, quote, items } = body

    if (!id || !customer || !quote || !items) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    console.log("Processing quote save request:", { id, quote: quote.quote_number })

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

      // 2. Insert or update quote
      try {
        // Basic quote data - adapted to existing table structure
        const quoteData = {
          id: id,
          quote_number: quote.quote_number,
          customer_project_name: `${customerId}-${quote.project_name}`,
          project_name: quote.project_name,
          issue_date: quote.issue_date,
          expiry_date: quote.due_date, // Map due_date to expiry_date
          subtotal: quote.subtotal,
          discount_amount: quote.discount_amount || 0,
          total_amount: quote.total_amount,
          status: quote.status || "draft",
          notes: quote.notes || null,
          terms: quote.terms || null,
          updated_at: new Date().toISOString(),
        }

        console.log("Quote data:", quoteData)

        // Check if quote already exists
        const { data: existingQuote, error: quoteQueryError } = await supabase
          .from("quotes")
          .select("id")
          .eq("id", quoteData.id)
          .maybeSingle()

        if (quoteQueryError) {
          console.error("Error querying quote:", quoteQueryError)
          throw new Error(`Quote query error: ${quoteQueryError.message}`)
        }

        if (existingQuote) {
          console.log("Updating existing quote:", existingQuote.id)
          // Update existing quote
          const { error: updateError } = await supabase.from("quotes").update(quoteData).eq("id", quoteData.id)

          if (updateError) {
            console.error("Error updating quote:", updateError)
            throw new Error(`Quote update error: ${updateError.message}`)
          }
        } else {
          console.log("Creating new quote")
          // Insert new quote
          const { error: insertError } = await supabase.from("quotes").insert({
            ...quoteData,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error inserting quote:", insertError)
            throw new Error(`Quote insert error: ${insertError.message}`)
          }
        }

        console.log("Quote processed successfully")

        // 3. Delete existing items for this quote (to handle removed items)
        console.log("Deleting existing quote items for quote:", id)
        const { error: deleteError } = await supabase.from("quote_items").delete().eq("quote_id", id)

        if (deleteError) {
          console.error("Error deleting quote items:", deleteError)
          throw new Error(`Delete items error: ${deleteError.message}`)
        }

        // 4. Insert quote items
        console.log("Processing quote items:", items.length)

        // Process items in batches
        const batchSize = 10
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize)

          const itemsData = batch.map((item: any) => {
            const quantity = Number(item.quantity) || 0
            const unitPrice = Number(item.unit_price) || 0
            const amount = Number(item.amount) || 0
            const discountPercentage = Number(item.discount_percentage) || 0
            const discountAmount = Number(item.discount_amount) || 0
            const originalAmount = Number(item.original_amount) || quantity * unitPrice

            return {
              id: item.id || crypto.randomUUID(),
              quote_id: id,
              description: item.description,
              quantity: quantity,
              unit_price: unitPrice,
              amount: amount,
              discount_percentage: discountPercentage,
              discount_amount: discountAmount,
              original_amount: originalAmount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          })

          console.log(`Inserting batch of ${itemsData.length} items`)
          const { error: itemsError } = await supabase.from("quote_items").insert(itemsData)

          if (itemsError) {
            console.error("Error inserting quote items:", itemsError)
            throw new Error(`Insert items error: ${itemsError.message}`)
          }
        }

        console.log("All quote items processed successfully")

        return NextResponse.json({
          success: true,
          quote_id: id,
          customer_id: customerId,
          message: "Quote saved to database",
        })
      } catch (quoteError) {
        console.error("Error in quote processing:", quoteError)
        throw quoteError
      }
    } catch (customerError) {
      console.error("Error in customer processing:", customerError)
      throw customerError
    }
  } catch (error) {
    console.error("Error in quotes API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save quote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const authCookie = (await cookies()).get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 })
    }

    console.log("Deleting quote:", id)

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete quote items first (foreign key constraint)
    console.log(`Deleting quote items for quote ID: ${id}`)
    const { error: itemsError } = await supabase.from("quote_items").delete().eq("quote_id", id)

    if (itemsError) {
      console.error("Error deleting quote items:", itemsError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete quote items",
          details: itemsError.message,
        },
        { status: 500 },
      )
    }

    // Delete the quote
    console.log(`Deleting quote with ID: ${id}`)
    const { error: quoteError } = await supabase.from("quotes").delete().eq("id", id)

    if (quoteError) {
      console.error("Error deleting quote:", quoteError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete quote",
          details: quoteError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    })
  } catch (error) {
    console.error("Error in quotes API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete quote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
} 