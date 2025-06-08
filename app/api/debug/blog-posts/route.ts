import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")

    console.log("Debug blog posts - slug:", slug)

    const supabase = createClient(supabaseUrl, supabaseKey)

    if (slug) {
      // Check specific blog post
      console.log(`Checking for blog post with slug: ${slug}`)

      const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

      console.log("Post query result:", { post, error: postError })

      return NextResponse.json({
        success: true,
        slug,
        post,
        error: postError,
        found: !!post,
      })
    } else {
      // Get all blog posts
      console.log("Fetching all blog posts for debug")

      const { data: posts, error: postsError } = await supabase
        .from("blog_posts")
        .select("slug, title, created_at")
        .order("created_at", { ascending: false })

      console.log("Posts query result:", { count: posts?.length, error: postsError })

      return NextResponse.json({
        success: true,
        posts: posts || [],
        error: postsError,
        count: posts?.length || 0,
      })
    }
  } catch (error) {
    console.error("Debug blog posts error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
