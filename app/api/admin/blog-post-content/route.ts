import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")
    const source = searchParams.get("source") || "db" // Default to database

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    console.log(`Fetching blog post content for slug: ${slug} from source: ${source}`)

    // Try to get from database first if source is 'db'
    if (source === "db") {
      try {
        const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        if (data) {
          console.log(`Found blog post in database: ${slug}`)
          return NextResponse.json({ post: data })
        }
      } catch (dbError) {
        console.error(`Error fetching from database: ${dbError.message}`)
        // If database fetch fails, continue to file system
      }
    }

    // If database fetch failed or source is 'file', try file system
    const blogDir = path.join(process.cwd(), "app", "blog")
    const postDir = path.join(blogDir, slug)
    const pagePath = path.join(postDir, "page.tsx")

    if (!fs.existsSync(pagePath)) {
      console.error(`Blog post file not found: ${pagePath}`)
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const content = fs.readFileSync(pagePath, "utf8")

    // Extract metadata
    const titleMatch = content.match(/title: ["'](.+?)["']/)
    const dateMatch = content.match(/date: ["'](.+?)["']/)
    const excerptMatch = content.match(/excerpt: ["'](.+?)["']/)
    const authorMatch = content.match(/author: ["'](.+?)["']/)

    // Extract content (simplified approach)
    let postContent = ""
    const contentMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/)
    if (contentMatch && contentMatch[1]) {
      postContent = contentMatch[1]
    }

    const post = {
      slug,
      title: titleMatch ? titleMatch[1] : slug,
      date: dateMatch ? dateMatch[1] : "Unknown date",
      excerpt: excerptMatch ? excerptMatch[1] : "",
      author: authorMatch ? authorMatch[1] : "Unknown author",
      content: postContent,
      source: "file",
    }

    console.log(`Successfully retrieved blog post from file: ${slug}`)
    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching blog post content:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog post content",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
