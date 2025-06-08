import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import { getGmailConfig, getEmailAddresses } from "@/lib/gmail-config"

export async function GET(request: Request) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get Gmail configuration (mask password)
    const gmailConfig = getGmailConfig()
    const emailAddresses = getEmailAddresses()

    const maskedConfig = {
      ...gmailConfig,
      auth: {
        user: gmailConfig.auth.user,
        pass: "********", // Masked for security
      },
    }

    // Test connection to Gmail server
    let connectionResult = "Not tested"
    let verifyResult = "Not tested"

    try {
      // Create transporter
      const transporter = nodemailer.createTransport(gmailConfig)

      // Test connection
      connectionResult = "Connection test started..."
      await transporter.verify()
      connectionResult = "Connection successful"

      // Send test email
      verifyResult = "Sending test email..."
      const info = await transporter.sendMail({
        from: emailAddresses.from,
        to: emailAddresses.to,
        subject: "Gmail Diagnostic Test",
        html: `
          <h2>Gmail Diagnostic Test</h2>
          <p>This is a test email sent from the WebFuZsion Gmail diagnostic tool.</p>
          <p>Time: ${new Date().toISOString()}</p>
        `,
      })

      verifyResult = `Test email sent: ${info.messageId}`
    } catch (error) {
      if (connectionResult === "Connection test started...") {
        connectionResult = `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
      }

      if (verifyResult === "Sending test email...") {
        verifyResult = `Test email failed: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    }

    return NextResponse.json({
      success: true,
      config: maskedConfig,
      addresses: emailAddresses,
      connection: connectionResult,
      verification: verifyResult,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
    })
  } catch (error) {
    console.error("Error in email diagnostic:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run email diagnostic",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
