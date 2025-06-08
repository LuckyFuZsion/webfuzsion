import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug") || "test"

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the specific post exists
    const { data: specificPost, error: specificError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()

    // Get all posts to see what's actually in the database
    const { data: allPosts, error: allError } = await supabase
      .from("blog_posts")
      .select("slug, title, created_at")
      .order("created_at", { ascending: false })

    return NextResponse.json({
      success: true,
      searchedSlug: slug,
      specificPost: specificPost || null,
      specificError: specificError?.message || null,
      allPosts: allPosts || [],
      allError: allError?.message || null,
      totalPosts: allPosts?.length || 0,
    })
  } catch (error) {
    console.error("Error checking blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
