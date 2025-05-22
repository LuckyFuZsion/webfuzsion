"use server"

import { z } from "zod"
import nodemailer from "nodemailer"
import { getGmailConfig, getEmailAddresses } from "@/lib/gmail-config"
import type { FormState, FormErrors } from "@/lib/form-types"

// Define validation schema
const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  enquiryType: z.string(),
  message: z.string().min(1, { message: "Message is required" }),
})

function formatZodErrors(error: z.ZodError): FormErrors {
  const formattedErrors: FormErrors = {}
  const fieldErrors = error.format()

  Object.entries(fieldErrors).forEach(([key, value]) => {
    if (key !== "_errors" && typeof value === "object" && value !== null) {
      const fieldValue = value as { _errors?: string[] }
      if (fieldValue._errors && fieldValue._errors.length > 0) {
        const fieldKey = key as keyof FormErrors
        formattedErrors[fieldKey] = fieldValue._errors
      }
    }
  })

  return formattedErrors
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Extract form data
    const rawFormData = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      subject: formData.get("subject")?.toString().trim() || "",
      enquiryType: formData.get("enquiryType")?.toString() || "Business Site",
      message: formData.get("message")?.toString().trim() || "",
    }

    console.log("Form data received:", rawFormData)

    // Validate form data
    const validationResult = FormSchema.safeParse(rawFormData)

    // If validation fails, return errors
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.format())
      return {
        success: false,
        message: "Please check the form for errors",
        errors: formatZodErrors(validationResult.error),
      }
    }

    const { name, email, subject, enquiryType, message } = validationResult.data

    // Get Gmail configuration
    const gmailConfig = getGmailConfig()
    if (!gmailConfig) {
      console.error("Gmail configuration is missing")
      return {
        success: false,
        message: "Server configuration error. Please try again later.",
        errors: {},
      }
    }

    console.log("Gmail config retrieved successfully")

    const emailAddresses = getEmailAddresses()
    if (!emailAddresses) {
      console.error("Email addresses configuration is missing")
      return {
        success: false,
        message: "Server configuration error. Please try again later.",
        errors: {},
      }
    }

    console.log("Email addresses retrieved successfully")

    // If there's a hardcoded recipient email, update it
    const recipientEmail = process.env.EMAIL_TO || "info.webfuzsion@gmail.com"
    console.log("Recipient email:", recipientEmail)

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport(gmailConfig)
    console.log("Transporter created successfully")

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

    console.log("Attempting to send email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", info)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      throw emailError
    }

    return {
      success: true,
      message: "Your message has been sent successfully! We'll be in touch soon.",
      errors: {},
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    }
  }
}
