import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    // Check authentication (simplified)
    // In a real app, you'd use a more robust auth check
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      // For simplicity, we're not enforcing auth in this example
      console.log("No auth header, but proceeding anyway for testing")
    }

    // Parse the request body
    const { title, content } = await request.json()

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    // Create the blog post directory
    const dirPath = path.join(process.cwd(), "app/blog", slug)
    await fs.mkdir(dirPath, { recursive: true })

    // Create a simple page.tsx file
    const pageContent = `
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")} | WebFuZsion',
  description: 'Blog post',
}

export default function BlogPost() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${title.replace(/'/g, "\\'")}</h1>
      <div className="prose max-w-none">
        ${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </div>
    </div>
  )
}
`

    await fs.writeFile(path.join(dirPath, "page.tsx"), pageContent)

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
