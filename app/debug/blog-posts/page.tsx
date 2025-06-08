"use client"

import { useState, useEffect } from "react"

export default function BlogPostsDebugPage() {
  const [allPosts, setAllPosts] = useState<any>(null)
  const [specificPost, setSpecificPost] = useState<any>(null)
  const [testSlug, setTestSlug] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch all posts on load
  useEffect(() => {
    fetchAllPosts()
  }, [])

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/debug/blog-posts")
      const data = await response.json()
      setAllPosts(data)
    } catch (error) {
      console.error("Error fetching all posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecificPost = async () => {
    if (!testSlug) return

    try {
      setLoading(true)
      const response = await fetch(`/api/debug/blog-posts?slug=${encodeURIComponent(testSlug)}`)
      const data = await response.json()
      setSpecificPost(data)
    } catch (error) {
      console.error("Error fetching specific post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts Debug</h1>

      {/* All Posts Section */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>
        <button
          onClick={fetchAllPosts}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh All Posts"}
        </button>

        {allPosts && (
          <div>
            <p className="mb-2">
              <strong>Count:</strong> {allPosts.count}
            </p>
            <p className="mb-2">
              <strong>Success:</strong> {allPosts.success ? "Yes" : "No"}
            </p>
            {allPosts.error && (
              <p className="mb-2 text-red-600">
                <strong>Error:</strong> {JSON.stringify(allPosts.error)}
              </p>
            )}
            <div className="mt-4">
              <strong>Posts:</strong>
              <pre className="bg-white p-4 rounded mt-2 overflow-auto text-sm">
                {JSON.stringify(allPosts.posts, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Specific Post Section */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Test Specific Post</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={testSlug}
            onChange={(e) => setTestSlug(e.target.value)}
            placeholder="Enter blog post slug"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={fetchSpecificPost}
            disabled={loading || !testSlug}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test Slug"}
          </button>
        </div>

        {/* Quick test buttons */}
        <div className="mb-4">
          <p className="mb-2">Quick test with common slugs:</p>
          <div className="flex gap-2 flex-wrap">
            {[
              "importance-of-business-website",
              "local-seo-tips",
              "webfuzsion-launch-announcement",
              "early-bird-website-pricing-offer",
            ].map((slug) => (
              <button
                key={slug}
                onClick={() => {
                  setTestSlug(slug)
                  fetchSpecificPost()
                }}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
              >
                {slug}
              </button>
            ))}
          </div>
        </div>

        {specificPost && (
          <div>
            <p className="mb-2">
              <strong>Found:</strong> {specificPost.found ? "Yes" : "No"}
            </p>
            <p className="mb-2">
              <strong>Success:</strong> {specificPost.success ? "Yes" : "No"}
            </p>
            {specificPost.error && (
              <p className="mb-2 text-red-600">
                <strong>Error:</strong> {JSON.stringify(specificPost.error)}
              </p>
            )}
            <div className="mt-4">
              <strong>Post Data:</strong>
              <pre className="bg-white p-4 rounded mt-2 overflow-auto text-sm">
                {JSON.stringify(specificPost.post, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Test Frontend Links */}
      <div className="p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Test Frontend Links</h2>
        <p className="mb-4">Try these links to test the frontend blog post viewing:</p>
        <div className="space-y-2">
          {allPosts?.posts?.slice(0, 5).map((post: any) => (
            <div key={post.slug}>
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                /blog/{post.slug} - {post.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
