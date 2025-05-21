import { NextResponse } from "next/server"

export async function GET() {
  // IMPORTANT: Remove this file before deploying to production!
  // This is only for local debugging
  return NextResponse.json({
    adminUsernameSet: !!process.env.ADMIN_USERNAME,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    nodeEnv: process.env.NODE_ENV,
  })
}
