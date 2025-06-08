"use client"

import { useState } from "react"

export default function MinimalBlogTest() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const createTestPost = async () => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/admin/test-blog-post")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Minimal Blog Test</h1>

      <div className="mb-6">
        <button
          onClick={createTestPost}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Test Blog Post"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-800 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>

          {result.success && (
            <div className="mt-4">
              <p>
                Test blog post created successfully! View it at:{" "}
                <a href={`/blog/${result.slug}`} className="text-blue-600 hover:underline">
                  /blog/{result.slug}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
