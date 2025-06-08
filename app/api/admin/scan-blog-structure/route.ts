import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Add authentication check
    const authHeader = request.headers.get("authorization")
    // For now, let's skip auth check to debug the core functionality

    // Path to the blog directory
    const blogDir = path.join(process.cwd(), "app", "blog")

    console.log("Scanning blog directory:", blogDir)

    // Check if the directory exists
    if (!fs.existsSync(blogDir)) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog directory not found",
          path: blogDir,
        },
        { status: 404 },
      )
    }

    // Get all entries in the blog folder
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })

    // Log what we found for debugging
    const entriesInfo = entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
    }))

    // Different blog post patterns to check
    const patterns = [
      // Pattern 1: Each blog is a directory with page.tsx inside
      {
        type: "directory-with-page",
        items: entries
          .filter((entry) => entry.isDirectory() && !["[slug]", "components", "utils", "db"].includes(entry.name))
          .map((dir) => dir.name),
      },
      // Pattern 2: Each blog is a direct TSX file named like blog-name.tsx
      {
        type: "direct-tsx-files",
        items: entries
          .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx") && entry.name !== "page.tsx")
          .map((file) => file.name.replace(".tsx", "")),
      },
    ]

    // Find blog posts in each pattern
    const blogPosts = []

    // Check Pattern 1: Directories with page.tsx
    for (const slug of patterns[0].items) {
      try {
        const pagePath = path.join(blogDir, slug, "page.tsx")
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, "utf8")
          const post = extractBlogMetadata(content, slug)
          if (post) {
            post.pattern = "directory-with-page"
            post.filePath = pagePath
            blogPosts.push(post)
          }
        }
      } catch (err) {
        console.error(`Error processing blog post ${slug}:`, err)
      }
    }

    // Check Pattern 2: Direct TSX files
    for (const fileName of patterns[1].items) {
      try {
        const filePath = path.join(blogDir, `${fileName}.tsx`)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf8")
          const post = extractBlogMetadata(content, fileName)
          if (post) {
            post.pattern = "direct-tsx-file"
            post.filePath = filePath
            blogPosts.push(post)
          }
        }
      } catch (err) {
        console.error(`Error processing blog file ${fileName}:`, err)
      }
    }

    // Sort posts by date (newest first)
    blogPosts.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return isNaN(dateA.getTime()) || isNaN(dateB.getTime()) ? 0 : dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({
      success: true,
      posts: blogPosts,
      debug: {
        blogDir,
        entriesFound: entries.length,
        entriesInfo,
        patterns,
      },
    })
  } catch (error) {
    console.error("Error scanning blog structure:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      { status: 500 },
    )
  }
}

function extractBlogMetadata(content: string, slug: string) {
  // Try different patterns for blog metadata

  // Pattern 1: Standard metadata object
  const metadataMatch = content.match(
    /{\s*title:\s*["'](.+?)["'],\s*date:\s*["'](.+?)["'],\s*excerpt:\s*["'](.+?)["'],\s*author:\s*["'](.+?)["']/s,
  )

  // Pattern 2: Individual metadata variables
  const titleMatch = content.match(/title\s*=\s*["'](.+?)["']/) || content.match(/title:\s*["'](.+?)["']/)
  const dateMatch = content.match(/date\s*=\s*["'](.+?)["']/) || content.match(/date:\s*["'](.+?)["']/)
  const excerptMatch = content.match(/excerpt\s*=\s*["'](.+?)["']/) || content.match(/excerpt:\s*["'](.+?)["']/)
  const authorMatch = content.match(/author\s*=\s*["'](.+?)["']/) || content.match(/author:\s*["'](.+?)["']/)
  const imageMatch = content.match(/image\s*=\s*["'](.+?)["']/) || content.match(/image:\s*["'](.+?)["']/)
  const categoryMatch = content.match(/category\s*=\s*["'](.+?)["']/) || content.match(/category:\s*["'](.+?)["']/)

  // Pattern 3: JSX metadata
  const jsxTitleMatch = content.match(/<title>(.+?)<\/title>/)
  const metaDescriptionMatch =
    content.match(/content=["'](.+?)["']\s*name=["']description["']/) ||
    content.match(/name=["']description["']\s*content=["'](.+?)["']/)

  // Extract content - try different patterns
  let extractedContent = ""

  // Try to find content in a content property
  const contentMatch =
    content.match(/content:\s*["']([\s\S]*?)["'],/) || content.match(/content\s*=\s*["']([\s\S]*?)["']/)

  // Try to find content in the main component body
  const componentBodyMatch =
    content.match(/<main[^>]*>([\s\S]*?)<\/main>/) ||
    content.match(/<article[^>]*>([\s\S]*?)<\/article>/) ||
    content.match(/<div[^>]*>([\s\S]*?)<\/div>/)

  if (contentMatch && contentMatch[1]) {
    extractedContent = contentMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t")
  } else if (componentBodyMatch && componentBodyMatch[1]) {
    // Clean up HTML to make it more markdown-like
    extractedContent = componentBodyMatch[1]
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n\n")
      .replace(/<p[^>]*>(.*?)<\/p>/g, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")
      .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, list) => {
        return list.replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n")
      })
      .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, list) => {
        return list.replace(/<li[^>]*>(.*?)<\/li>/g, "1. $1\n")
      })
      .replace(/<[^>]+>/g, "") // Remove any remaining HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with just two
  }

  // Determine title, date, excerpt, author from the matches
  let title, date, excerpt, author, image, category

  if (metadataMatch) {
    ;[, title, date, excerpt, author] = metadataMatch
  } else {
    title = titleMatch ? titleMatch[1] : jsxTitleMatch ? jsxTitleMatch[1] : slug.replace(/-/g, " ")
    date = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0]
    excerpt = excerptMatch ? excerptMatch[1] : metaDescriptionMatch ? metaDescriptionMatch[1] : ""
    author = authorMatch ? authorMatch[1] : "WebFuZsion"
  }

  image = imageMatch ? imageMatch[1] : "/blog-post-image.png"
  category = categoryMatch ? categoryMatch[1] : "Web Design"

  // Only return if we have at least a title
  if (title) {
    return {
      slug,
      title,
      date,
      excerpt,
      author,
      image,
      category,
      content: extractedContent,
    }
  }

  return null
}
