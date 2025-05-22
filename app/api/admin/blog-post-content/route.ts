import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug parameter is required" }, { status: 400 })
    }

    // Path to the blog post directory
    const postDir = path.join(process.cwd(), "app", "blog", slug)
    const pagePath = path.join(postDir, "page.tsx")

    if (!fs.existsSync(pagePath)) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    const content = fs.readFileSync(pagePath, "utf8")

    // Extract metadata and content
    const titleMatch = content.match(/title: ["'](.+?)["']/)
    const dateMatch = content.match(/date: ["'](.+?)["']/)
    const excerptMatch = content.match(/excerpt: ["'](.+?)["']/)
    const authorMatch = content.match(/author: ["'](.+?)["']/)
    const imageMatch = content.match(/image: ["'](.+?)["']/)
    const tagsMatch = content.match(/tags: \[(.*?)\]/)
    const readingTimeMatch = content.match(/readingTime: ["'](.+?)["']/)
    const categoryMatch = content.match(/category: ["'](.+?)["']/)

    // Extract the main content
    const contentMatch = content.match(/content: ["']([\s\S]*?)["'],/)
    let mainContent = ""

    if (contentMatch && contentMatch[1]) {
      // Clean up escaped quotes and newlines
      mainContent = contentMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t")
    }

    // Parse tags
    let tags: string[] = []
    if (tagsMatch && tagsMatch[1]) {
      tags = tagsMatch[1]
        .split(",")
        .map((tag) => tag.trim().replace(/["']/g, ""))
        .filter(Boolean)
    }

    const post = {
      slug,
      title: titleMatch ? titleMatch[1] : slug.replace(/-/g, " "),
      date: dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0],
      excerpt: excerptMatch ? excerptMatch[1] : "",
      content: mainContent,
      author: authorMatch ? authorMatch[1] : "Unknown",
      image: imageMatch ? imageMatch[1] : "/blog-post-image.png",
      tags,
      readingTime: readingTimeMatch ? readingTimeMatch[1] : "5 min read",
      category: categoryMatch ? categoryMatch[1] : "Web Design",
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Error fetching blog post content:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
