"use client"

import { useState, useEffect } from "react"

export default function SimpleBlogCheck() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkBlog = async () => {
      try {
        const response = await fetch("/api/debug/simple-blog-check")
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error("Error:", error)
        setResult({ success: false, error: "Failed to check" })
      } finally {
        setLoading(false)
      }
    }

    checkBlog()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Blog Check</h1>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Raw Result:</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      </div>

      {result?.success && (
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-bold">Database Connection:</h3>
            <p>Supabase URL: {result.environment.supabaseUrl}</p>
            <p>Supabase Key: {result.environment.supabaseKey}</p>
            <p>Total Posts Found: {result.totalPosts}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="font-bold">Test Post Status:</h3>
            {result.testPost ? (
              <div>
                <p>✅ Test post found!</p>
                <p>Title: {result.testPost.title}</p>
                <p>Slug: {result.testPost.slug}</p>
                <p>Content length: {result.testPost.content?.length || 0} characters</p>
              </div>
            ) : (
              <div>
                <p>❌ Test post not found</p>
                <p>Error: {result.testPostError || "No error"}</p>
              </div>
            )}
          </div>

          {result.allPosts && result.allPosts.length > 0 && (
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-bold">All Posts in Database:</h3>
              {result.allPosts.map((post: any, index: number) => (
                <div key={index} className="border-b py-2">
                  <p>
                    <strong>{post.title}</strong>
                  </p>
                  <p>Slug: {post.slug}</p>
                  <p>Created: {post.created_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
