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

    // Get query parameters
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      // Get a specific customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single()

      if (customerError) {
        return NextResponse.json({ success: false, error: customerError.message }, { status: 404 })
      }

      return NextResponse.json({ success: true, customer })
    } else {
      // Get all customers
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .order("name", { ascending: true })

      if (customersError) {
        return NextResponse.json({ success: false, error: customersError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, customers })
    }
  } catch (error) {
    console.error("Error in customers API:", error)
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
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const customer = body.customer

    // Validate required fields
    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer name and email are required",
        },
        { status: 400 },
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if customer already exists by email
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .maybeSingle()

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "A customer with this email already exists",
        },
        { status: 409 },
      )
    }

    // Generate a UUID for the customer
    const customerId = crypto.randomUUID()

    // Insert the customer
    const { error } = await supabase.from("customers").insert({
      id: customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || null,
      address: customer.address || null,
      city: customer.city || null,
      postal_code: customer.postal_code || null,
      country: customer.country || "United Kingdom",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      customer_id: customerId,
      message: "Customer created successfully",
    })
  } catch (error) {
    console.error("Error in customer API:", error)
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
