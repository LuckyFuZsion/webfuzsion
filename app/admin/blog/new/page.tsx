"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RichTextEditor from "../../components/rich-text-editor"
import BlogPreview from "../../components/blog-preview"

export default function NewBlogPost() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("WebFuZsion")
  const [category, setCategory] = useState("Web Design")
  const [tags, setTags] = useState("web design, website")
  const [image, setImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "", details: "" })
  const [activeTab, setActiveTab] = useState("edit") // "edit" or "preview"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "", details: "" })

    try {
      // Prepare post data
      const postData = {
        slug,
        post: {
          title,
          slug,
          excerpt,
          content,
          author,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
          image,
          date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        },
      }

      // Send create request
      const response = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Blog post published successfully!", details: "" })
        // Redirect to the blog post or dashboard after a delay
        setTimeout(() => {
          router.push(`/admin/blog/dashboard`)
        }, 2000)
      } else {
        throw new Error(data.error || "Failed to publish blog post")
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sample content for testing formatting
  const addSampleContent = () => {
    const sampleContent = `# This is a Heading 1

## This is a Heading 2

This is a paragraph with **bold text** and *italic text*.

[This is a link](https://example.com)

![This is an image](https://example.com/image.jpg)

- List item 1
- List item 2
- List item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

> This is a blockquote

\`\`\`
This is a code block
\`\`\`

---

### This is a Heading 3

Another paragraph with more content.`

    setContent(sampleContent)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <Link href="/admin/blog/dashboard">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Back to Blog List</button>
        </Link>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <p className="font-medium">{message.text}</p>
          {message.details && <p className="mt-2 text-sm">{message.details}</p>}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === "edit" ? "bg-white border-b-2 border-blue-500" : "bg-gray-100"}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "preview" ? "bg-white border-b-2 border-blue-500" : "bg-gray-100"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className="px-4 py-2 ml-auto text-sm text-blue-600 hover:text-blue-800"
            onClick={addSampleContent}
            type="button"
          >
            Add Sample Content
          </button>
        </div>

        {activeTab === "edit" ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (optional - will be generated from title if empty)
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Web Design">Web Design</option>
                    <option value="SEO">SEO</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated) *
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <RichTextEditor initialValue={content} onChange={setContent} minHeight="400px" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Blog Post"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <BlogPreview title={title} excerpt={excerpt} content={content} author={author} image={image} />
          </div>
        )}
      </div>
    </div>
  )
}
