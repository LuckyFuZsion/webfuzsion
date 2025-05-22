"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function BlogDashboard() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log("Fetching blog posts...")
        const response = await fetch("/api/admin/blog-posts")
        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error response:", errorText)
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Received data:", data)

        if (data.success) {
          setBlogPosts(data.posts || [])
          setDebugInfo(data)
        } else {
          setError(data.error || "Failed to load blog posts")
          setDebugInfo(data)
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setDebugInfo({ error: err instanceof Error ? err.message : String(err) })
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Calculate statistics
  const totalPosts = blogPosts.length
  const publishedPosts = blogPosts.filter((post) => post.published).length
  const draftPosts = totalPosts - publishedPosts
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/blog/db-editor")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Post
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-800 rounded">
          <p className="font-medium">Error loading blog posts:</p>
          <p>{error}</p>
        </div>
      )}

      {showDebug && debugInfo && (
        <div className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-60">
          <h3 className="font-medium mb-2">Debug Information:</h3>
          <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Total Posts</h2>
          <p className="text-3xl font-bold">{totalPosts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Published</h2>
          <p className="text-3xl font-bold text-green-600">{publishedPosts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Drafts</h2>
          <p className="text-3xl font-bold text-yellow-600">{draftPosts}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/blog/db-editor"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-center">Create New Post</span>
          </Link>
          <Link
            href="/admin/blog/manage"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-center">Manage Posts</span>
          </Link>
          <Link
            href="/admin/blog/quick-import"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-center">Import Posts</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-center">View Blog</span>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {loading ? (
          <div className="text-center py-8">Loading blog posts...</div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No blog posts found.</p>
            <div className="flex justify-center">
              <Link href="/admin/blog/db-editor" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Your First Post
              </Link>
              <span className="mx-2">or</span>
              <Link
                href="/admin/blog/quick-import"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Import Existing Posts
              </Link>
            </div>
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
                {recentPosts.map((post) => (
                  <tr key={post.slug}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.date}</div>
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
                        <Link href={`/admin/blog/edit/${post.slug}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Diagnostic */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Database Diagnostic</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Check Database Connection</h3>
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/admin/check-db-connection")
                  const data = await response.json()
                  setDebugInfo(data)
                  setShowDebug(true)
                } catch (err) {
                  console.error("Error checking database:", err)
                  setDebugInfo({ error: err instanceof Error ? err.message : String(err) })
                  setShowDebug(true)
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Database Connection
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Create Blog Posts Table</h3>
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/admin/create-blog-table")
                  const data = await response.json()
                  setDebugInfo(data)
                  setShowDebug(true)
                } catch (err) {
                  console.error("Error creating table:", err)
                  setDebugInfo({ error: err instanceof Error ? err.message : String(err) })
                  setShowDebug(true)
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create/Update Blog Table
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Create Test Blog Post</h3>
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/admin/create-test-post")
                  const data = await response.json()
                  setDebugInfo(data)
                  setShowDebug(true)
                  // Refresh the page after creating a test post
                  if (data.success) {
                    setTimeout(() => {
                      window.location.reload()
                    }, 1000)
                  }
                } catch (err) {
                  console.error("Error creating test post:", err)
                  setDebugInfo({ error: err instanceof Error ? err.message : String(err) })
                  setShowDebug(true)
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create Test Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
