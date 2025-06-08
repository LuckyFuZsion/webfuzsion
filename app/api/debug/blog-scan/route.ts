import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const blogDir = path.join(process.cwd(), "app", "blog")

    console.log("=== Blog Directory Debug ===")
    console.log("Blog directory path:", blogDir)
    console.log("Directory exists:", fs.existsSync(blogDir))

    if (!fs.existsSync(blogDir)) {
      return NextResponse.json({
        error: "Blog directory not found",
        path: blogDir,
        cwd: process.cwd(),
      })
    }

    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    const entryDetails = entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
    }))

    console.log("Entries found:", entryDetails)

    // Look for blog post directories (exclude system directories)
    const blogDirs = entries
      .filter((entry) => entry.isDirectory() && !["[slug]", "components", "utils", "db"].includes(entry.name))
      .map((dir) => dir.name)

    console.log("Blog directories:", blogDirs)

    // Check each blog directory for page.tsx
    const blogPosts = []
    for (const slug of blogDirs) {
      const pagePath = path.join(blogDir, slug, "page.tsx")
      const hasPageFile = fs.existsSync(pagePath)

      console.log(`Checking ${slug}: page.tsx exists = ${hasPageFile}`)

      if (hasPageFile) {
        try {
          const content = fs.readFileSync(pagePath, "utf8")
          const titleMatch = content.match(/title: ["'](.+?)["']/)
          const title = titleMatch ? titleMatch[1] : slug

          blogPosts.push({
            slug,
            title,
            hasContent: content.length > 0,
            contentLength: content.length,
          })
        } catch (err) {
          console.error(`Error reading ${slug}:`, err)
        }
      }
    }

    return NextResponse.json({
      success: true,
      blogDir,
      entriesFound: entries.length,
      entryDetails,
      blogDirs,
      blogPosts,
      totalBlogPosts: blogPosts.length,
    })
  } catch (error) {
    console.error("Debug scan error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
