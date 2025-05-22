import { NextResponse } from "next/server"

export async function GET() {
  // Check for existence of environment variables without revealing their values
  const envStatus = {
    // Admin authentication
    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    JWT_SECRET: !!process.env.JWT_SECRET,

    // Email configuration
    GMAIL_USER: !!process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    EMAIL_TO: !!process.env.EMAIL_TO,
    EMAIL_CC: !!process.env.EMAIL_CC,

    // Other configuration
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    environmentVariables: envStatus,
  })
}
