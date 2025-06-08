import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const testPost = {
      slug: "test",
      title: "Test Blog Post",
      content:
        "<h1>This is a test blog post</h1><p>This content was created directly via API to test the blog system.</p>",
      excerpt: "This is a test blog post created to debug the blog system.",
      author: "WebFuZsion",
      date: new Date().toISOString().split("T")[0],
      image: "/blog-post-image.png",
      tags: ["test", "debug"],
      category: "Web Design",
      reading_time: "1 min read",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // First, delete any existing test post
    await supabase.from("blog_posts").delete().eq("slug", "test")

    // Then create the new test post
    const { data, error } = await supabase.from("blog_posts").insert(testPost).select().single()

    if (error) {
      throw new Error(`Failed to create test post: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Test post created successfully",
      post: data,
    })
  } catch (error) {
    console.error("Error creating test post:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
