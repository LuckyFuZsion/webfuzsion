"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import WysiwygEditor from "../../../components/wysiwyg-editor"
import BlogPreview from "../../../components/blog-preview"

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("edit")

  // Form fields
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("WebFuZsion")
  const [category, setCategory] = useState("Web Design")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100))

        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/blog-posts?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        })

        if (!mounted) return

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.post) {
          const post = data.post
          setTitle(post.title || "")
          setExcerpt(post.excerpt || "")
          setContent(post.content || "")
          setAuthor(post.author || "WebFuZsion")
          setCategory(post.category || "Web Design")
          setTags(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "")
          setImage(post.image || "")
        } else {
          throw new Error(data.error || "Post not found")
        }
      } catch (err) {
        if (!mounted) return
        console.error("Error fetching post:", err)
        setError(err instanceof Error ? err.message : "Failed to load post")
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPost()

    return () => {
      mounted = false
    }
  }, [slug])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const postData = {
        slug,
        post: {
          title,
          excerpt,
          content,
          author,
          category,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          image: image || "/blog-post-image.png",
        },
      }

      const response = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Blog post updated successfully!" })
        setTimeout(() => router.push("/admin/blog/dashboard"), 2000)
      } else {
        throw new Error(data.error || "Failed to save post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      setMessage({
        type: "error",
        text: `Failed to save post: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error Loading Post</p>
          <p>{error}</p>
        </div>
        <Link href="/admin/blog/dashboard">
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back to Dashboard</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <div className="flex gap-2">
          <Link href="/admin/blog/dashboard">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          </Link>
          <Link href={`/blog/${slug}`} target="_blank">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Post</button>
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 ${activeTab === "edit" ? "bg-white border-b-2 border-blue-500 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("edit")}
          >
            ✏️ Edit
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "preview" ? "bg-white border-b-2 border-blue-500 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("preview")}
          >
            👁️ Preview
          </button>
        </div>

        {activeTab === "edit" ? (
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Web Design">Web Design</option>
                    <option value="SEO">SEO</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technology">Technology</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="web design, seo, business"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/blog-post-image.png"
                  />
                </div>
              </div>

              <div className="xl:col-span-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <WysiwygEditor
                  initialValue={content}
                  onChange={setContent}
                  minHeight="600px"
                  placeholder="Start writing your blog post here. Use the toolbar above to format your text just like in Microsoft Word!"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Link href="/admin/blog/dashboard">
                <button type="button" className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
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
