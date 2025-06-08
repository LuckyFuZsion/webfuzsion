import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const post = await request.json()

    if (!post.title || !post.slug) {
      return NextResponse.json({ success: false, message: "Title and slug are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if the blog_posts table exists, if not create it
    const { error: tableCheckError } = await supabase.from("blog_posts").select("id").limit(1)

    if (tableCheckError) {
      console.log("Table doesn't exist, creating it...")
      // Create the table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          image TEXT,
          tags TEXT[],
          reading_time TEXT,
          category TEXT,
          published BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
      const { error: createError } = await supabase.rpc("execute_sql", { query: createTableQuery })
      if (createError) {
        console.error("Error creating table:", createError)
        return NextResponse.json({ success: false, message: "Failed to create blog posts table" }, { status: 500 })
      }
    }

    // Check if a post with this slug already exists
    const { data: existingPost } = await supabase.from("blog_posts").select("id").eq("slug", post.slug).single()

    if (existingPost) {
      // Update existing post
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content || "",
          author: post.author || "Unknown",
          image: post.image || "/blog-post-image.png",
          tags: post.tags || [],
          reading_time: post.readingTime || "5 min read",
          category: post.category || "Web Design",
          updated_at: new Date().toISOString(),
        })
        .eq("slug", post.slug)

      if (updateError) {
        console.error("Error updating blog post:", updateError)
        return NextResponse.json({ success: false, message: "Failed to update blog post" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Blog post updated successfully",
      })
    } else {
      // Insert new post
      const { error: insertError } = await supabase.from("blog_posts").insert([
        {
          slug: post.slug,
          title: post.title,
          date: post.date || new Date().toISOString().split("T")[0],
          excerpt: post.excerpt || "",
          content: post.content || "",
          author: post.author || "Unknown",
          image: post.image || "/blog-post-image.png",
          tags: post.tags || [],
          reading_time: post.readingTime || "5 min read",
          category: post.category || "Web Design",
          published: true,
        },
      ])

      if (insertError) {
        console.error("Error inserting blog post:", insertError)
        return NextResponse.json({ success: false, message: "Failed to insert blog post" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Blog post imported successfully",
      })
    }
  } catch (error) {
    console.error("Error importing blog post:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
