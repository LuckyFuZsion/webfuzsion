import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
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

    // Check if customer exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (checkError || !existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    // Check if email is already used by another customer
    const { data: emailCheck, error: emailCheckError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .neq("id", id)
      .maybeSingle()

    if (emailCheck) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already used by another customer",
        },
        { status: 409 },
      )
    }

    // Update the customer
    const { error } = await supabase
      .from("customers")
      .update({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
        address: customer.address || null,
        city: customer.city || null,
        postal_code: customer.postal_code || null,
        country: customer.country || "United Kingdom",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

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
      message: "Customer updated successfully",
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if customer exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (checkError || !existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found",
        },
        { status: 404 },
      )
    }

    // Check if customer is used in any invoices
    const { data: invoiceCheck, error: invoiceCheckError } = await supabase
      .from("invoices")
      .select("id")
      .eq("customer_id", id)
      .limit(1)
      .maybeSingle()

    if (invoiceCheck) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete customer that is used in invoices",
        },
        { status: 409 },
      )
    }

    // Delete the customer
    const { error } = await supabase.from("customers").delete().eq("id", id)

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
      message: "Customer deleted successfully",
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
