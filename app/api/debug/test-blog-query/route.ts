import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug") || "test"

  try {
    // Try multiple credential combinations
    const credentials = [
      {
        name: "SERVICE_ROLE_KEY",
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      {
        name: "ANON_KEY",
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY,
      },
      {
        name: "PUBLIC_ANON_KEY",
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    ]

    const results = []

    for (const cred of credentials) {
      if (cred.url && cred.key) {
        try {
          const supabase = createClient(cred.url, cred.key)
          const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

          results.push({
            credential: cred.name,
            success: !error,
            error: error?.message,
            found: !!data,
            title: data?.title,
          })
        } catch (err) {
          results.push({
            credential: cred.name,
            success: false,
            error: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        results.push({
          credential: cred.name,
          success: false,
          error: "Missing credentials",
          url: !!cred.url,
          key: !!cred.key,
        })
      }
    }

    return NextResponse.json({
      slug,
      results,
      environment: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
