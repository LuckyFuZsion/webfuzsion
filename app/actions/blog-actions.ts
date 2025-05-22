"use server"

import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import type { BlogPost } from "../blog/types"

// Function to generate a slug from a title
export async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Function to save a blog post
export async function saveBlogPost(
  formData: FormData,
): Promise<{ success: boolean; message: string; slug?: string; error?: string }> {
  try {
    // Extract data from form
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const author = formData.get("author") as string
    const tagsInput = formData.get("tags") as string
    const tags = tagsInput ? tagsInput.split(",").map((tag) => tag.trim()) : []
    const category = formData.get("category") as string
    const image = formData.get("image") as string
    const userSlug = formData.get("slug") as string

    console.log("Form data received:", { title, excerpt, author, tagsInput, category, image, userSlug })

    // Validate required fields
    if (!title) return { success: false, message: "Title is required", error: "Missing title" }
    if (!content) return { success: false, message: "Content is required", error: "Missing content" }
    if (!excerpt) return { success: false, message: "Excerpt is required", error: "Missing excerpt" }
    if (!author) return { success: false, message: "Author is required", error: "Missing author" }
    if (!category) return { success: false, message: "Category is required", error: "Missing category" }

    // Generate slug from title or use provided slug
    const slug = userSlug ? userSlug : await generateSlug(title)
    console.log("Generated slug:", slug)

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read"

    // Create blog post object
    const blogPost: BlogPost = {
      slug,
      title,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      excerpt,
      content,
      author,
      image: image || "/blog-post-image.png",
      tags,
      readingTime,
      category,
    }

    console.log("Blog post object created:", blogPost)

    // Create the blog post directory and file
    const dirPath = path.join(process.cwd(), "app/blog", slug)
    console.log("Directory path:", dirPath)

    try {
      await fs.mkdir(dirPath, { recursive: true })
      console.log("Directory created successfully")
    } catch (error) {
      console.error("Error creating directory:", error)
      return {
        success: false,
        message: "Failed to create blog directory",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Create the page.tsx file with the blog post content
    const pageContent = `
import { Metadata } from 'next'
import BlogPostClient from '../[slug]/BlogPostClient'

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")} | WebFuZsion',
  description: '${excerpt.replace(/'/g, "\\'")}',
}

const blogPost = {
  slug: '${slug}',
  title: '${title.replace(/'/g, "\\'")}',
  date: '${blogPost.date}',
  excerpt: '${excerpt.replace(/'/g, "\\'")}',
  content: \`${content.replace(/`/g, "\\`")}\`,
  author: '${author.replace(/'/g, "\\'")}',
  image: '${blogPost.image}',
  tags: ${JSON.stringify(tags)},
  readingTime: '${readingTime}',
  category: '${category.replace(/'/g, "\\'")}'
}

export default function BlogPostPage() {
  return <BlogPostClient post={blogPost} />
}
`

    const filePath = path.join(dirPath, "page.tsx")
    console.log("File path:", filePath)

    try {
      await fs.writeFile(filePath, pageContent)
      console.log("File written successfully")
    } catch (error) {
      console.error("Error writing file:", error)
      return {
        success: false,
        message: "Failed to write blog file",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Revalidate the blog path to update the site
    revalidatePath("/blog")
    console.log("Blog path revalidated")

    return {
      success: true,
      message: "Blog post published successfully!",
      slug,
    }
  } catch (error) {
    console.error("Error saving blog post:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
