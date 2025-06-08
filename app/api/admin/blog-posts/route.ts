import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to check authentication
function isAuthenticated() {
  const authCookie = cookies().get("admin-auth")
  return authCookie && authCookie.value === "authenticated"
}

// Helper function to generate a slug from a title
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return `${readingTime} min read`
}

export async function GET(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      console.log("GET /api/admin/blog-posts - Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get query parameters
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")

    console.log("GET /api/admin/blog-posts - Slug:", slug)

    if (slug) {
      // Get a specific blog post
      console.log("Fetching specific blog post:", slug)

      try {
        const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

        if (postError) {
          console.error("Supabase error fetching blog post:", postError)
          return NextResponse.json(
            {
              success: false,
              error: `Database error: ${postError.message}`,
              details: postError,
            },
            { status: 404 },
          )
        }

        if (!post) {
          console.error("Blog post not found:", slug)
          return NextResponse.json(
            {
              success: false,
              error: "Blog post not found",
            },
            { status: 404 },
          )
        }

        console.log("Found blog post:", post.title)

        return NextResponse.json({ success: true, post })
      } catch (error) {
        console.error("Error processing blog post request:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Error processing blog post request",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    } else {
      // Get all blog posts
      console.log("Fetching all blog posts")

      try {
        const { data: posts, error: postsError } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false })

        if (postsError) {
          console.error("Supabase error fetching blog posts:", postsError)
          return NextResponse.json(
            {
              success: false,
              error: `Database error: ${postsError.message}`,
              details: postsError,
            },
            { status: 500 },
          )
        }

        console.log(`Found ${posts?.length || 0} blog posts`)

        return NextResponse.json({ success: true, posts: posts || [] })
      } catch (error) {
        console.error("Error processing blog posts request:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Error processing blog posts request",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Unexpected error in blog posts API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      console.log("POST /api/admin/blog-posts - Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { slug, post } = body

    console.log("POST /api/admin/blog-posts - Request body:", { slug, postTitle: post?.title })

    if (!post || !post.title || !post.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required data (title and content are required)",
        },
        { status: 400 },
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
      // Prepare post data
      const postSlug = post.slug || slug || generateSlugFromTitle(post.title)

      const postData = {
        slug: postSlug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        author: post.author || "WebFuZsion",
        date: post.date || new Date().toISOString().split("T")[0],
        image: post.image || "/blog-post-image.png",
        tags: Array.isArray(post.tags) ? post.tags : [],
        category: post.category || "Web Design",
        reading_time: post.reading_time || calculateReadingTime(post.content),
        updated_at: new Date().toISOString(),
      }

      console.log("Prepared post data:", { ...postData, content: `${postData.content.substring(0, 100)}...` })

      // Check if post already exists
      const { data: existingPost, error: postQueryError } = await supabase
        .from("blog_posts")
        .select("slug")
        .eq("slug", postSlug)
        .maybeSingle()

      if (postQueryError) {
        console.error("Error querying existing blog post:", postQueryError)
        throw new Error(`Blog post query error: ${postQueryError.message}`)
      }

      if (existingPost) {
        console.log("Updating existing blog post:", existingPost.slug)
        // Update existing post
        const { error: updateError } = await supabase.from("blog_posts").update(postData).eq("slug", postSlug)

        if (updateError) {
          console.error("Error updating blog post:", updateError)
          throw new Error(`Blog post update error: ${updateError.message}`)
        }
      } else {
        console.log("Creating new blog post")
        // Insert new post
        const { error: insertError } = await supabase.from("blog_posts").insert({
          ...postData,
          created_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error inserting blog post:", insertError)
          throw new Error(`Blog post insert error: ${insertError.message}`)
        }
      }

      console.log("Blog post processed successfully")

      return NextResponse.json({
        success: true,
        slug: postSlug,
        message: "Blog post saved successfully",
      })
    } catch (error) {
      console.error("Error in blog post processing:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in blog post API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      console.log("DELETE request unauthorized - missing or invalid admin-auth cookie")
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
    }

    // Get blog post slug from URL
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")

    console.log(`Processing DELETE request for blog post slug: ${slug}`)

    if (!slug) {
      console.log("DELETE request missing blog post slug")
      return NextResponse.json({ success: false, error: "Missing blog post slug" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete the blog post
    console.log(`Deleting blog post with slug: ${slug}`)
    const { error: postError } = await supabase.from("blog_posts").delete().eq("slug", slug)

    if (postError) {
      console.error("Error deleting blog post:", postError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to delete blog post: ${postError.message}`,
          details: postError,
        },
        { status: 500 },
      )
    }

    console.log(`Successfully deleted blog post with slug: ${slug}`)
    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE handler:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Add support for HEAD requests
export async function HEAD(request: Request) {
  // Just return a 200 OK for health checks
  return new Response(null, { status: 200 })
}
