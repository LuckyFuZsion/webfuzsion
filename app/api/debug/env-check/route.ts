import { NextResponse } from "next/server"

export async function GET() {
  // Check environment variables without exposing values
  const envCheck = {
    // Admin authentication
    ADMIN_USERNAME: {
      exists: !!process.env.ADMIN_USERNAME,
      length: process.env.ADMIN_USERNAME?.length || 0,
    },
    ADMIN_PASSWORD: {
      exists: !!process.env.ADMIN_PASSWORD,
      length: process.env.ADMIN_PASSWORD?.length || 0,
    },
    JWT_SECRET: {
      exists: !!process.env.JWT_SECRET,
      length: process.env.JWT_SECRET?.length || 0,
    },

    // Email configuration
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

    // Environment info
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
    variables: envCheck,
  })
}
