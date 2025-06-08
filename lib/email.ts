import nodemailer from "nodemailer"
import { withTrace, addTraceAttributes, addTraceEvent } from "@/lib/tracing"

interface EmailOptions {
  to: string
  subject: string
  html: string
  cc?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  return withTrace(
    {
      name: "send-email",
      attributes: {
        "email.to": options.to,
        "email.subject": options.subject,
        "email.has_cc": !!options.cc,
      },
    },
    async () => {
      try {
        addTraceEvent("email-transport-creation-start")

        // Create transporter
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST,
          port: Number.parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER || process.env.EMAIL_SERVER_USER,
            pass: process.env.SMTP_PASSWORD || process.env.EMAIL_SERVER_PASSWORD,
          },
        })

        addTraceEvent("email-transport-created")

        // Verify connection
        addTraceEvent("email-connection-verification-start")
        await transporter.verify()
        addTraceEvent("email-connection-verified")

        // Send email
        addTraceEvent("email-sending-start")
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
          to: options.to,
          cc: options.cc,
          subject: options.subject,
          html: options.html,
        })

        addTraceAttributes({
          "email.message_id": info.messageId,
          "email.response": info.response,
        })

        addTraceEvent("email-sent-successfully")

        return {
          success: true,
          messageId: info.messageId,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        addTraceEvent("email-sending-failed", {
          "error.message": errorMessage,
          "error.code": error instanceof Error && "code" in error ? String(error.code) : "",
        })

        console.error("Email sending failed:", error)

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
  )
}
