import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth-token")

  return NextResponse.json({ success: true })
}
