import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    console.log("Starting blog posts scan...")

    // Path to the blog directory
    const blogDir = path.join(process.cwd(), "app", "blog")
    console.log("Blog directory path:", blogDir)

    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      console.log("Blog directory does not exist")
      return NextResponse.json({
        posts: [],
        error: "Blog directory not found",
        path: blogDir,
      })
    }

    // Get all directories in the blog folder (each blog post has its own directory)
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    console.log(
      "Found entries:",
      entries.map((e) => ({ name: e.name, isDir: e.isDirectory() })),
    )

    // Filter out directories and exclude non-blog post directories
    const blogSlugs = entries
      .filter((entry) => entry.isDirectory() && !["[slug]", "components", "utils"].includes(entry.name))
      .map((dir) => dir.name)

    // Collect blog post data
    const posts = blogSlugs.map((slug) => {
      try {
        // Try to read the page.tsx file to extract metadata
        const pagePath = path.join(blogDir, slug, "page.tsx")
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

          return {
            slug,
            title,
            excerpt,
            date,
            author,
          }
        }
      } catch (err) {
        console.error(`Error processing blog post ${slug}:`, err)
      }

      // Fallback if we couldn't extract metadata
      return {
        slug,
        title: slug.replace(/-/g, " "),
        excerpt: "",
        date: "Unknown date",
        author: "Unknown author",
      }
    })

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return isNaN(dateA.getTime()) || isNaN(dateB.getTime()) ? 0 : dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching existing blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch existing blog posts" }, { status: 500 })
  }
}
