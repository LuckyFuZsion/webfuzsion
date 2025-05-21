import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { invoice, customer, items } = body

    if (!invoice || !customer || !items) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    // Ensure customer data is properly formatted with fallbacks for missing fields
    const formattedCustomer = {
      name: customer.name || "No Name Provided",
      email: customer.email || "No Email Provided",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      postal_code: customer.postal_code || "",
      country: customer.country || "United Kingdom",
    }

    // Calculate the original amount and discount amount for each item if needed
    const formattedItems = items.map((item) => {
      const originalUnitPrice = item.unit_price
      const quantity = item.quantity || 1

      // Calculate the original amount (before discount)
      const calculatedOriginalAmount = originalUnitPrice * quantity

      // If the item has a discounted price (amount less than quantity * unit_price)
      const hasDiscount = item.amount < calculatedOriginalAmount

      if (hasDiscount) {
        const discountAmount = calculatedOriginalAmount - item.amount
        const discountPercentage = ((discountAmount / calculatedOriginalAmount) * 100).toFixed(1)

        return {
          ...item,
          original_amount: calculatedOriginalAmount,
          discount_amount: discountAmount,
          discount_percentage: Number.parseFloat(discountPercentage),
        }
      }

      return {
        ...item,
        original_amount: calculatedOriginalAmount,
      }
    })

    // Calculate correct totals
    const originalSubtotal = formattedItems.reduce((sum, item) => sum + (item.original_amount || 0), 0)
    const actualSubtotal = formattedItems.reduce((sum, item) => sum + (item.amount || 0), 0)
    const totalItemDiscounts = originalSubtotal - actualSubtotal

    // Update invoice with correct totals
    const updatedInvoice = {
      ...invoice,
      original_subtotal: originalSubtotal,
      subtotal: actualSubtotal,
      total_item_discounts: totalItemDiscounts,
    }

    // Return the formatted data for client-side PDF generation
    return NextResponse.json({
      success: true,
      data: {
        invoice: updatedInvoice,
        customer: formattedCustomer,
        items: formattedItems,
      },
    })
  } catch (error) {
    console.error("Error processing PDF data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process PDF data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
