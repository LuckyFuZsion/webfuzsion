import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import { getGmailConfig, getEmailAddresses } from "@/lib/gmail-config"

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing recipient email",
        },
        { status: 400 },
      )
    }

    // Get Gmail configuration
    const gmailConfig = getGmailConfig()
    const emailAddresses = getEmailAddresses()

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport(gmailConfig)

    // Prepare email options
    const mailOptions = {
      from: emailAddresses.from,
      to: to,
      cc: emailAddresses.cc,
      subject: "WebFuZsion Test Email",
      html: `
        <h2>Test Email from WebFuZsion</h2>
        <p>This is a test email sent from the WebFuZsion email diagnostic tool.</p>
        <p>If you're receiving this, your Gmail configuration is working correctly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      details: `Message ID: ${info.messageId}`,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
