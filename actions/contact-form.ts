"use server"

import { z } from "zod"
import nodemailer from "nodemailer"
import { getGmailConfig, getEmailAddresses } from "@/lib/gmail-config"

// Define validation schema
const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  enquiryType: z.string(),
  message: z.string().min(1, { message: "Message is required" }),
})

type FormState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
    enquiryType?: string[]
  }
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  // Extract form data
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    enquiryType: formData.get("enquiryType"),
    message: formData.get("message"),
  }

  console.log("Form data received:", rawFormData)

  // Validate form data
  const validationResult = FormSchema.safeParse({
    name: rawFormData.name,
    email: rawFormData.email,
    subject: rawFormData.subject,
    enquiryType: rawFormData.enquiryType || "Business Site",
    message: rawFormData.message,
  })

  // If validation fails, return errors
  if (!validationResult.success) {
    console.log("Validation failed:", validationResult.error.format())
    return {
      success: false,
      message: "Please check the form for errors",
      errors: validationResult.error.format(),
    }
  }

  const { name, email, subject, enquiryType, message } = validationResult.data

  try {
    // Get Gmail configuration
    const gmailConfig = getGmailConfig()
    const emailAddresses = getEmailAddresses()

    // If there's a hardcoded recipient email, update it
    const recipientEmail = process.env.EMAIL_TO || "info.webfuzsion@gmail.com"

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport(gmailConfig)

    // Email content
    const mailOptions = {
      from: emailAddresses.from,
      to: recipientEmail,
      cc: emailAddresses.cc,
      subject: `WebFuZsion Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email, // Allow replying directly to the sender
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return {
      success: true,
      message: "Your message has been sent successfully! We'll be in touch soon.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    }
  }
}
