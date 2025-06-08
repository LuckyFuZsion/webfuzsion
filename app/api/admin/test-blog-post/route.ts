import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Create a test blog post
    const slug = "test-blog-post-" + Date.now()
    const dirPath = path.join(process.cwd(), "app/blog", slug)

    // Create directory
    await fs.mkdir(dirPath, { recursive: true })

    // Create a simple page.tsx file
    const pageContent = `
export default function TestBlogPost() {
  return (
    <div>
      <h1>Test Blog Post</h1>
      <p>This is a test blog post created at ${new Date().toISOString()}</p>
    </div>
  )
}
`

    await fs.writeFile(path.join(dirPath, "page.tsx"), pageContent)

    return NextResponse.json({
      success: true,
      message: "Test blog post created successfully",
      slug,
      path: dirPath,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
