"use server"

import { z } from "zod"
import type { FormState } from "../lib/form-types"
import { verifyRecaptchaToken } from "../lib/recaptcha"
import { sendEmail } from "../lib/email"

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),
})

export async function submitContactForm(currentState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries())
    const result = contactFormSchema.safeParse(rawData)

    if (!result.success) {
      return {
        success: false,
        message: "Please check your input and try again",
        errors: result.error.flatten().fieldErrors,
      }
    }

    const data = result.data

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptchaToken(data.recaptchaToken)
    if (!recaptchaResult.success) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        errors: {
          recaptchaToken: ["reCAPTCHA verification failed"],
        },
      }
    }

    // Send email
    const emailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL || "default@example.com",
      subject: `Contact Form: ${data.subject}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Subject: ${data.subject}

Message:
${data.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<h3>Message:</h3>
<p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
        errors: {},
      }
    }

    return {
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      errors: {},
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
