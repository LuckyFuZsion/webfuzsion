import { NextResponse } from "next/server"
import { submitContactForm } from "@/actions/contact-form"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Call the server action
    const result = await submitContactForm(
      {
        success: false,
        message: "",
        errors: {},
      },
      formData,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred processing your request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
