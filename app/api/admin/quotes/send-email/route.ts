import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import { createClient } from "@supabase/supabase-js"
import { getGmailConfig, getEmailAddresses } from "@/lib/gmail-config"

export async function POST(request: Request) {
  try {
    // Check authentication
    const authCookie = (await cookies()).get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { quoteId, emailContent, subject, recipientEmail, pdfBuffer } = body

    if (!quoteId || !emailContent || !subject || !recipientEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Get Gmail configuration
    const gmailConfig = getGmailConfig()
    const emailAddresses = getEmailAddresses()

    console.log("Creating email transporter with Gmail config")

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport(gmailConfig)

    // Prepare email options
    const mailOptions = {
      from: emailAddresses.from,
      to: recipientEmail,
      cc: emailAddresses.cc,
      subject: subject,
      html: emailContent,
      attachments: pdfBuffer
        ? [
            {
              filename: `Quote-${quoteId}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    }

    console.log(`Sending email to ${recipientEmail}`)

    // Send email
    await transporter.sendMail(mailOptions)

    // After successful email sending, log it to the database
    try {
      // Create a single supabase client for the API route
      const supabaseUrl = process.env.SUPABASE_URL!
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Log the email to the database
      const { error: logError } = await supabase.from("email_logs").insert({
        quote_id: quoteId,
        recipient: recipientEmail,
        cc: emailAddresses.cc.join(", "),
        subject: subject,
        content: emailContent,
        sent_at: new Date().toISOString(),
        status: "sent",
      })

      if (logError) {
        console.error("Error logging email:", logError)
      }
    } catch (logErr) {
      console.error("Error logging email to database:", logErr)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 