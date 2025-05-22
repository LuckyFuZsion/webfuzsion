"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditBlogPost({ params }) {
  const { slug } = params
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        // First try to get the post from the database API
        const response = await fetch(`/api/admin/blog-post-content?slug=${slug}`)

        if (!response.ok) {
          // If that fails, try to get the post content from the file system
          const fileResponse = await fetch(`/api/admin/blog-post-content?slug=${slug}&source=file`)
          if (fileResponse.ok) {
            const data = await fileResponse.json()
            setPost(data.post)
          } else {
            throw new Error("Failed to fetch post content from both database and file system")
          }
        } else {
          const data = await response.json()
          setPost(data.post)
        }
      } catch (err) {
        console.error("Error fetching post:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading post...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Link href="/admin/blog/dashboard">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Back to Dashboard</button>
        </Link>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Post Not Found</p>
          <p>The blog post with slug "{slug}" could not be found.</p>
        </div>
        <Link href="/admin/blog/dashboard">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Back to Dashboard</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <div className="flex gap-2">
          <Link href="/admin/blog/dashboard">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          </Link>
          <Link href={`/blog/${slug}`} target="_blank">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Post</button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Post Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium">{post.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="font-medium">{post.slug}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{post.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Author</p>
              <p className="font-medium">{post.author}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Content Preview</h2>
          <div className="border p-4 rounded bg-gray-50 prose max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">
            Note: Direct editing is not available in this view. To edit this post, you need to modify the file directly
            or use the database editor.
          </p>
          <div className="flex gap-2">
            <Link href="/admin/blog/db-editor">
              <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                Open Database Editor
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
