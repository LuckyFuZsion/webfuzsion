"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BlogDashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/blog-posts")

        // Store the raw response for debugging
        const responseText = await response.text()
        let responseData

        try {
          responseData = JSON.parse(responseText)
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            responseText,
            responseData,
          })

          if (responseData.posts) {
            setPosts(responseData.posts)
          } else {
            setPosts([])
            setError("No posts found in response")
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError)
          setError(`Error parsing response: ${parseError.message}`)
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            responseText,
            parseError: parseError.message,
          })
        }
      } catch (fetchError) {
        console.error("Error fetching posts:", fetchError)
        setError(`Error fetching posts: ${fetchError.message}`)
        setDebugInfo({
          fetchError: fetchError.message,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const refreshData = () => {
    setLoading(true)
    setError(null)
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={refreshData} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Refresh
          </button>
          <Link href="/admin/blog/new">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">New Post</button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">No blog posts found</p>
          <p>You haven't created any blog posts yet. Click the "New Post" button to create your first post.</p>
          <div className="mt-4">
            <p className="font-bold">Quick Links:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Link href="/admin/blog/new">
                <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-bold">Create New Post</h3>
                  <p>Write a new blog post from scratch</p>
                </div>
              </Link>
              <Link href="/admin/blog/import">
                <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-bold">Import Posts</h3>
                  <p>Import existing posts from files</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    {post.excerpt && <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <span className="text-blue-600 hover:text-blue-900 mr-4">View</span>
                    </Link>
                    <Link href={`/admin/blog/edit/${post.slug}`}>
                      <span className="text-indigo-600 hover:text-indigo-900">Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <details className="bg-gray-100 p-4 rounded">
          <summary className="font-bold cursor-pointer">Debug Information</summary>
          <div className="mt-2 p-4 bg-gray-800 text-white rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </details>
      </div>
    </div>
  )
}
