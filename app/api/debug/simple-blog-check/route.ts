import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    console.log("=== BLOG DEBUG CHECK ===")
    console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set")
    console.log("Supabase Key:", supabaseKey ? "Set" : "Not set")

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all posts
    const { data: allPosts, error: allError } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("All posts query result:", {
      found: allPosts?.length || 0,
      error: allError?.message || "None",
    })

    // Check specifically for 'test' post
    const { data: testPost, error: testError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", "test")
      .single()

    console.log("Test post query result:", {
      found: !!testPost,
      error: testError?.message || "None",
    })

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl ? "Set" : "Not set",
        supabaseKey: supabaseKey ? "Set" : "Not set",
      },
      allPosts: allPosts || [],
      allPostsError: allError?.message || null,
      testPost: testPost || null,
      testPostError: testError?.message || null,
      totalPosts: allPosts?.length || 0,
    })
  } catch (error) {
    console.error("Debug check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
