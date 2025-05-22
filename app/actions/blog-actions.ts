"use server"

import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import type { BlogPost } from "../blog/types"

// Function to generate a slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Function to save a blog post
export async function saveBlogPost(formData: FormData): Promise<{ success: boolean; message: string; slug?: string }> {
  try {
    // Extract data from form
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const author = formData.get("author") as string
    const tags = (formData.get("tags") as string).split(",").map((tag) => tag.trim())
    const category = formData.get("category") as string
    const image = formData.get("image") as string

    // Validate required fields
    if (!title || !content || !excerpt || !author || !category) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Generate slug from title
    const slug = generateSlug(title)

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

    // Create the blog post directory and file
    const dirPath = path.join(process.cwd(), "app/blog", slug)

    try {
      await fs.mkdir(dirPath, { recursive: true })
    } catch (error) {
      console.error("Error creating directory:", error)
      return {
        success: false,
        message: "Failed to create blog directory",
      }
    }

    // Create the page.tsx file with the blog post content
    const pageContent = `
import { Metadata } from 'next'
import BlogPostClient from '../[slug]/BlogPostClient'

export const metadata: Metadata = {
  title: '${title} | WebFuZsion',
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

    try {
      await fs.writeFile(path.join(dirPath, "page.tsx"), pageContent)
    } catch (error) {
      console.error("Error writing file:", error)
      return {
        success: false,
        message: "Failed to write blog file",
      }
    }

    // Revalidate the blog path to update the site
    revalidatePath("/blog")

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
    }
  }
}
