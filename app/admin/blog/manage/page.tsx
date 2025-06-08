"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAllBlogPosts } from "../../../actions/blog-db-actions"

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  published: boolean
  created_at: string
}

export default function ManageBlogPosts() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [filter, setFilter] = useState("all") // "all", "published", "draft"

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const result = await getAllBlogPosts()
      if (result.success) {
        setBlogPosts(result.posts)
      } else {
        setError(result.error || "Failed to load blog posts")
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError("An unexpected error occurred while loading blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleTogglePublished = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/toggle-blog-published", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, published: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`)
      }

      const result = await response.json()
      if (result.success) {
        // Update the local state
        setBlogPosts((prevPosts) =>
          prevPosts.map((post) => (post.slug === slug ? { ...post, published: !currentStatus } : post)),
        )
        setMessage({
          type: "success",
          text: `Blog post ${!currentStatus ? "published" : "unpublished"} successfully`,
        })
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update blog post status" })
      }
    } catch (err) {
      console.error("Error toggling published status:", err)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: "", text: "" })
    }, 3000)
  }

  const filteredPosts = blogPosts.filter((post) => {
    if (filter === "all") return true
    if (filter === "published") return post.published
    if (filter === "draft") return !post.published
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/admin/blog/db-editor")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Post
          </button>
          <button
            onClick={() => router.push("/admin/blog/import")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Import Posts
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {error && <div className="p-4 mb-6 bg-red-100 text-red-800 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Blog Posts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-3 py-1 rounded ${
                  filter === "published" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter("draft")}
                className={`px-3 py-1 rounded ${
                  filter === "draft" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Drafts
              </button>
              <button
                onClick={fetchPosts}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                title="Refresh"
              >
                ↻
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading blog posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            {filter === "all"
              ? "No blog posts found."
              : filter === "published"
                ? "No published blog posts found."
                : "No draft blog posts found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.slug}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <button
                          onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublished(post.slug, post.published)}
                          className={`${
                            post.published
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
