"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, Plus, Eye, RefreshCw } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  tags: string[]
  reading_time: string
  created_at: string
  updated_at: string
}

export default function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/blog-posts")

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setPosts(data.posts || [])
      } else {
        throw new Error(data.error || "Failed to load blog posts")
      }
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      setDeleting(slug)

      const response = await fetch(`/api/admin/blog-posts?slug=${slug}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Remove the post from the local state
        setPosts(posts.filter((post) => post.slug !== slug))
        alert("Blog post deleted successfully!")
      } else {
        throw new Error(data.error || "Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert(`Failed to delete blog post: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <span className="ml-2">Loading blog posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link href="/admin/blog/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {posts.length === 0 && !loading && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">No Blog Posts Found</p>
          <p>You haven't created any blog posts yet, or they haven't been imported to the database.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/admin/blog/new">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Create New Post
              </button>
            </Link>
            <Link href="/admin/blog/manual-import">
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                Import Existing Posts
              </button>
            </Link>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.slug}`}>
                          <button className="text-indigo-600 hover:text-indigo-900 p-1">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          disabled={deleting === post.slug}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                        >
                          {deleting === post.slug ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>Total posts: {posts.length}</p>
      </div>
    </div>
  )
}
