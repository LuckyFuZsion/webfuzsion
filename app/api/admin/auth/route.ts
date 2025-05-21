import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Auth API error (invalid JSON):", e);
      return NextResponse.json({ success: false, message: "Invalid JSON (or empty body) in request." }, { status: 400 });
    }
    const { username, password } = body;

    // Debug log (will appear in server console)
    console.log("Auth attempt:", {
      usernameProvided: !!username,
      passwordProvided: !!password,
      envUsernameExists: !!process.env.ADMIN_USERNAME,
      envPasswordExists: !!process.env.ADMIN_PASSWORD,
    })

    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error("Admin credentials not configured in environment variables")
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: Admin credentials not set",
        },
        { status: 500 },
      )
    }

    // Check credentials against environment variables
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Set authentication cookie (using await)
      const cookieStore = await cookies();
      cookieStore.set({
         name: "admin-auth",
         value: "authenticated",
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 60 * 24, // 1 day
         path: "/",
      });

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
