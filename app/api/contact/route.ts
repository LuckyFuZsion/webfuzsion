import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// Handle HEAD request (often used for health checks)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    let name, email, message, phone, service, recaptchaToken

    const contentType = request.headers.get("content-type") || ""

    // Handle both JSON and FormData
    if (contentType.includes("application/json")) {
      const body = await request.json()
      ;({ name, email, message, phone, service, recaptchaToken } = body)
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      name = formData.get("name") as string
      email = formData.get("email") as string
      message = formData.get("message") as string
      phone = formData.get("phone") as string
      service = formData.get("service") as string
      recaptchaToken = formData.get("recaptchaToken") as string
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415, headers: corsHeaders })
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400, headers: corsHeaders },
      )
    }

    // Send email
    const emailResult = await sendEmail({
      to: process.env.EMAIL_TO || process.env.CONTACT_EMAIL || "",
      subject: `New Contact Form Submission - ${service || "General Inquiry"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Service:</strong> ${service || "General Inquiry"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500, headers: corsHeaders })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders })
  }
}
