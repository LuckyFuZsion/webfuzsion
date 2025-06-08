import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST() {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Create email_logs table
    const { error } = await supabase.rpc("execute_sql", {
      query: `
        -- Create email_logs table
        CREATE TABLE IF NOT EXISTS public.email_logs (
          id SERIAL PRIMARY KEY,
          invoice_id TEXT NOT NULL,
          recipient TEXT NOT NULL,
          cc TEXT,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL DEFAULT 'sent',
          error_message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for faster lookups
        CREATE INDEX IF NOT EXISTS idx_email_logs_invoice_id ON public.email_logs(invoice_id);
        CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);
        CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
      `,
    })

    if (error) {
      console.error("Error creating email_logs table:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create email_logs table",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email logs table created successfully",
    })
  } catch (error) {
    console.error("Error in create-email-logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create email logs table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 