import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

// Constants for token management
const TOKEN_EXPIRY = "24h"
const COOKIE_NAME = "admin-auth-token"

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Auth API error (invalid JSON):", e);
      return NextResponse.json({ success: false, message: "Invalid request format" }, { status: 400 });
    }
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      console.error("Required environment variables not configured");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Generate a unique session ID
      const sessionId = nanoid();
      
      // Create JWT token
      const token = await new SignJWT({ 
        sub: username,
        sid: sessionId,
        role: "admin"
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      // Set secure cookie
      const cookieStore = await cookies();
      await cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return NextResponse.json({ 
        success: true,
        message: "Authentication successful"
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid credentials" 
    }, { status: 401 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add a logout endpoint
export async function DELETE() {
  const cookieStore = await cookies();
  await cookieStore.delete(COOKIE_NAME);
  
  return NextResponse.json({ 
    success: true,
    message: "Logged out successfully"
  });
}
