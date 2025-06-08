import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  try {
    // Log environment variables (masked for security)
    console.log("Testing with these credentials:")
    console.log(`GMAIL_USER: ${process.env.GMAIL_USER?.substring(0, 3)}...`)
    console.log(
      `GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? "Set (length: " + process.env.GMAIL_APP_PASSWORD.length + ")" : "Not set"}`,
    )

    // Create transporter with direct credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      debug: true, // Enable debug output
      logger: true, // Log information into the console
    })

    // Test connection
    const verifyResult = await transporter.verify()

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      verifyResult,
      credentials: {
        user: `${process.env.GMAIL_USER?.substring(0, 3)}...`,
        pass: process.env.GMAIL_APP_PASSWORD
          ? "Set (length: " + process.env.GMAIL_APP_PASSWORD.length + ")"
          : "Not set",
      },
    })
  } catch (error) {
    console.error("Direct email test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
        credentials: {
          user: `${process.env.GMAIL_USER?.substring(0, 3)}...`,
          pass: process.env.GMAIL_APP_PASSWORD
            ? "Set (length: " + process.env.GMAIL_APP_PASSWORD.length + ")"
            : "Not set",
        },
      },
      { status: 500 },
    )
  }
}
