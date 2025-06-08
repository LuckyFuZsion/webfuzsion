import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug") || "test"

  try {
    // Use the same logic as the blog page
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log(`[test-blog-route] Testing slug: ${slug}`)
    console.log(`[test-blog-route] Using URL: ${supabaseUrl ? "Set" : "Not set"}`)
    console.log(`[test-blog-route] Using Key: ${supabaseKey ? "Set" : "Not set"}`)

    const supabase = createClient(supabaseUrl!, supabaseKey!)
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    console.log(`[test-blog-route] Query result:`, {
      found: !!data,
      error: error?.message || "None",
      slug: slug,
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        slug,
      })
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        error: "No data returned",
        slug,
      })
    }

    // Format exactly like the blog page does
    const blogPost = {
      title: data.title,
      date: data.date,
      author: data.author,
      readTime: data.reading_time || data.readingTime,
      category: data.category,
      imageUrl: data.image,
      content: data.content,
      tags: data.tags || [],
      excerpt: data.excerpt,
    }

    return NextResponse.json({
      success: true,
      post: data,
      formattedPost: blogPost,
      slug,
    })
  } catch (error) {
    console.error("[test-blog-route] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        slug,
      },
      { status: 500 },
    )
  }
}
