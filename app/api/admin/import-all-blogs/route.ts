import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    // First, scan for blog posts
    const scanResponse = await fetch(
      new URL("/api/admin/scan-blog-structure", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    )
    if (!scanResponse.ok) {
      throw new Error(`Failed to scan blog structure: ${scanResponse.statusText}`)
    }

    const scanData = await scanResponse.json()
    if (!scanData.success) {
      return NextResponse.json(
        {
          success: false,
          error: scanData.error || "Failed to scan blog structure",
        },
        { status: 500 },
      )
    }

    const posts = scanData.posts || []
    if (posts.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No blog posts found to import",
      })
    }

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()

    // Check if the blog_posts table exists, if not create it
    const { error: tableCheckError } = await supabase.from("blog_posts").select("id").limit(1)

    if (tableCheckError) {
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
        return NextResponse.json(
          {
            success: false,
            error: `Failed to create blog posts table: ${createError.message}`,
          },
          { status: 500 },
        )
      }
    }

    // Import each post
    const results = []

    for (const post of posts) {
      try {
        // Calculate reading time (rough estimate: 200 words per minute)
        const wordCount = (post.content || "").split(/\s+/).length
        const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read"

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
              author: post.author,
              image: post.image || "/blog-post-image.png",
              tags: [],
              reading_time: readingTime,
              category: post.category || "Web Design",
              updated_at: new Date().toISOString(),
            })
            .eq("slug", post.slug)

          if (updateError) {
            results.push({
              slug: post.slug,
              success: false,
              message: `Failed to update: ${updateError.message}`,
            })
            continue
          }

          results.push({
            slug: post.slug,
            success: true,
            message: "Updated existing post",
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
              author: post.author,
              image: post.image || "/blog-post-image.png",
              tags: [],
              reading_time: readingTime,
              category: post.category || "Web Design",
              published: true,
            },
          ])

          if (insertError) {
            results.push({
              slug: post.slug,
              success: false,
              message: `Failed to insert: ${insertError.message}`,
            })
            continue
          }

          results.push({
            slug: post.slug,
            success: true,
            message: "Imported successfully",
          })
        }
      } catch (error) {
        results.push({
          slug: post.slug,
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      message: `Imported ${successCount} of ${posts.length} blog posts`,
      results,
    })
  } catch (error) {
    console.error("Error importing all blogs:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
