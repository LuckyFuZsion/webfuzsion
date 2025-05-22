"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase-client"
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

// Function to save a blog post to Supabase
export async function saveBlogPostToDb(
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
    const blogPost: BlogPost & { created_at?: string } = {
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
      created_at: new Date().toISOString(),
    }

    console.log("Blog post object created:", blogPost)

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()

    // Check if the blog_posts table exists, if not create it
    const { error: tableCheckError } = await supabase.from("blog_posts").select("id").limit(1)

    if (tableCheckError) {
      console.log("Table doesn't exist, creating it...")
      // Create the table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          image TEXT,
          tags TEXT[],
          reading_time TEXT,
          category TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
      const { error: createError } = await supabase.rpc("execute_sql", { query: createTableQuery })
      if (createError) {
        console.error("Error creating table:", createError)
        return {
          success: false,
          message: "Failed to create blog posts table",
          error: createError.message,
        }
      }
    }

    // Check if a post with this slug already exists
    const { data: existingPost } = await supabase.from("blog_posts").select("id").eq("slug", slug).single()

    if (existingPost) {
      // Update existing post
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: blogPost.title,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          author: blogPost.author,
          image: blogPost.image,
          tags: blogPost.tags,
          reading_time: blogPost.readingTime,
          category: blogPost.category,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)

      if (updateError) {
        console.error("Error updating blog post:", updateError)
        return {
          success: false,
          message: "Failed to update blog post",
          error: updateError.message,
        }
      }

      console.log("Blog post updated successfully")
    } else {
      // Insert new post
      const { error: insertError } = await supabase.from("blog_posts").insert([
        {
          slug: blogPost.slug,
          title: blogPost.title,
          date: blogPost.date,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          author: blogPost.author,
          image: blogPost.image,
          tags: blogPost.tags,
          reading_time: blogPost.readingTime,
          category: blogPost.category,
        },
      ])

      if (insertError) {
        console.error("Error inserting blog post:", insertError)
        return {
          success: false,
          message: "Failed to insert blog post",
          error: insertError.message,
        }
      }

      console.log("Blog post inserted successfully")
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

// Function to get all blog posts
export async function getAllBlogPosts() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return { success: false, posts: [], error: error.message }
    }

    return { success: true, posts: data || [] }
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    return {
      success: false,
      posts: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Function to get a blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return { success: false, post: null, error: error.message }
    }

    return { success: true, post: data }
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    return {
      success: false,
      post: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
