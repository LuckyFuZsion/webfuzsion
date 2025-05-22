import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { BlogPost } from "../../../blog/types"

export async function GET() {
  try {
    // This is a simplified approach - in a real app, you might use a database
    const blogDir = path.join(process.cwd(), "app/blog")

    // Get all directories in the blog folder (each directory is a blog post)
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    const blogDirs = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "[slug]")
      .map((dir) => dir.name)

    // Collect blog post data
    const posts: Partial<BlogPost>[] = []

    for (const slug of blogDirs) {
      try {
        // Try to import the page.tsx file to extract blog post data
        // This is a simplified approach - in a real app, you might use a database
        const filePath = path.join(blogDir, slug, "page.tsx")

        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf8")

          // Extract blog post data using regex (this is a simplified approach)
          const titleMatch = content.match(/title: ['"](.+?)['"]/i)
          const dateMatch = content.match(/date: ['"](.+?)['"]/i)
          const authorMatch = content.match(/author: ['"](.+?)['"]/i)
          const categoryMatch = content.match(/category: ['"](.+?)['"]/i)

          if (titleMatch && dateMatch) {
            posts.push({
              slug,
              title: titleMatch[1],
              date: dateMatch[1],
              author: authorMatch ? authorMatch[1] : "WebFuZsion",
              category: categoryMatch ? categoryMatch[1] : "Web Design",
            })
          }
        }
      } catch (error) {
        console.error(`Error processing blog post ${slug}:`, error)
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
