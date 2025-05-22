import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Update the GET function to include more detailed error handling and logging

export async function GET() {
  try {
    // Path to the blog directory
    const blogDir = path.join(process.cwd(), "app", "blog")
    console.log(`Checking blog directory: ${blogDir}`)

    // Check if the directory exists
    if (!fs.existsSync(blogDir)) {
      console.error(`Blog directory does not exist: ${blogDir}`)
      return NextResponse.json(
        {
          error: "Blog directory not found",
          path: blogDir,
          exists: false,
        },
        { status: 404 },
      )
    }

    // Get all directories in the blog folder (each blog post has its own directory)
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    console.log(`Found ${entries.length} entries in blog directory`)

    // Filter out directories and exclude non-blog post directories
    const blogSlugs = entries
      .filter((entry) => entry.isDirectory() && !["[slug]", "components", "utils"].includes(entry.name))
      .map((dir) => dir.name)

    console.log(`Found ${blogSlugs.length} potential blog posts`)

    // Collect blog post data
    const posts = []
    for (const slug of blogSlugs) {
      try {
        // Try to read the page.tsx file to extract metadata
        const pagePath = path.join(blogDir, slug, "page.tsx")
        console.log(`Checking page file: ${pagePath}`)

        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, "utf8")

          // Extract title
          const titleMatch = content.match(/title: ["'](.+?)["']/)
          const title = titleMatch ? titleMatch[1] : slug

          // Extract date
          const dateMatch = content.match(/date: ["'](.+?)["']/)
          const date = dateMatch ? dateMatch[1] : "Unknown date"

          // Extract excerpt
          const excerptMatch = content.match(/excerpt: ["'](.+?)["']/)
          const excerpt = excerptMatch ? excerptMatch[1] : ""

          // Extract author
          const authorMatch = content.match(/author: ["'](.+?)["']/)
          const author = authorMatch ? authorMatch[1] : "Unknown author"

          posts.push({
            slug,
            title,
            excerpt,
            date,
            author,
          })
          console.log(`Successfully processed blog post: ${slug}`)
        } else {
          console.log(`Page file does not exist for slug: ${slug}`)
        }
      } catch (err) {
        console.error(`Error processing blog post ${slug}:`, err)
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return isNaN(dateA.getTime()) || isNaN(dateB.getTime()) ? 0 : dateB.getTime() - dateA.getTime()
    })

    console.log(`Returning ${posts.length} blog posts`)
    return NextResponse.json({ posts, count: posts.length })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
