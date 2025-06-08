import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET() {
  try {
    // Check email configuration
    const emailConfig = {
      GMAIL_USER: {
        exists: !!process.env.GMAIL_USER,
        length: process.env.GMAIL_USER?.length || 0,
      },
      GMAIL_APP_PASSWORD: {
        exists: !!process.env.GMAIL_APP_PASSWORD,
        length: process.env.GMAIL_APP_PASSWORD?.length || 0,
      },
      EMAIL_FROM: {
        exists: !!process.env.EMAIL_FROM,
        length: process.env.EMAIL_FROM?.length || 0,
      },
      EMAIL_TO: {
        exists: !!process.env.EMAIL_TO,
        length: process.env.EMAIL_TO?.length || 0,
      },
      EMAIL_CC: {
        exists: !!process.env.EMAIL_CC,
        length: process.env.EMAIL_CC?.length || 0,
      },
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Email configuration check",
        config: emailConfig,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Email test error:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Email test error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function POST() {
  try {
    // Check if required environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email configuration missing",
          details: "GMAIL_USER or GMAIL_APP_PASSWORD not set",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      logger: true,
      debug: true,
    })

    // Verify connection
    try {
      console.log("Verifying email connection...")
      await transporter.verify()
      console.log("Email connection verified successfully")
    } catch (verifyError) {
      console.error("Email connection verification failed:", verifyError)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email connection verification failed",
          error: verifyError instanceof Error ? verifyError.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Send test email
    const to = process.env.EMAIL_TO || process.env.GMAIL_USER
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"WebFuZsion Test" <${process.env.GMAIL_USER}>`,
      to,
      subject: "WebFuZsion Email Test",
      html: `
        <h2>Email Test</h2>
        <p>This is a test email from the WebFuZsion debug endpoint.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    }

    console.log("Sending test email to:", to)
    const info = await transporter.sendMail(mailOptions)
    console.log("Test email sent successfully:", info.messageId)

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Test email sent successfully",
        details: {
          messageId: info.messageId,
          recipient: to,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Email test error:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Email test error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }
}
