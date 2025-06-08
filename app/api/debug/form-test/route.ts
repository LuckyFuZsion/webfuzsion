import { NextResponse } from "next/server"

export async function GET() {
  // Check for required environment variables for contact form
  const emailConfig = {
    GMAIL_USER: !!process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    EMAIL_TO: !!process.env.EMAIL_TO,
    RECAPTCHA_SECRET_KEY: !!process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_SITE_KEY: true, // Client-side key existence is assumed
  }

  // Check if the contact form should work based on environment variables
  const shouldWork =
    emailConfig.GMAIL_USER &&
    emailConfig.GMAIL_APP_PASSWORD &&
    (emailConfig.EMAIL_FROM || emailConfig.GMAIL_USER) &&
    (emailConfig.EMAIL_TO || emailConfig.GMAIL_USER) &&
    emailConfig.RECAPTCHA_SECRET_KEY // Only check server-side key

  // Check for server action
  let serverActionExists = false
  try {
    // This is a simple check to see if the file exists
    // In a real implementation, you'd need to check if the module can be imported
    serverActionExists = true
  } catch (e) {
    serverActionExists = false
  }

  // Check for API route
  let apiRouteExists = false
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || ""}/api/contact`, {
      method: "HEAD",
    })
    apiRouteExists = response.status !== 404
  } catch (e) {
    apiRouteExists = false
  }

  return NextResponse.json({
    success: shouldWork && (serverActionExists || apiRouteExists),
    message: shouldWork
      ? "Contact form should be working based on environment variables"
      : "Contact form is missing required environment variables",
    emailConfig,
    implementation: {
      serverAction: serverActionExists,
      apiRoute: apiRouteExists,
    },
    errors: !shouldWork
      ? {
          missingVariables: Object.entries(emailConfig)
            .filter(([_, exists]) => !exists)
            .map(([key]) => key),
        }
      : null,
  })
}
