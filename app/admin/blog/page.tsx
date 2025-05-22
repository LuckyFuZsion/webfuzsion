"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
}

export default function BlogList() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/admin/blog-posts")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()
        setBlogPosts(data.posts)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Post
        </button>
      </div>

      {error && <div className="p-4 mb-6 bg-red-100 text-red-800 rounded">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading blog posts...</div>
      ) : blogPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">No blog posts found.</p>
          <p>
            <button
              onClick={() => router.push("/admin/blog/new")}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Create your first blog post
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 truncate">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {post.date} • {post.author}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800">
                    View Post
                  </Link>
                  <button
                    onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
