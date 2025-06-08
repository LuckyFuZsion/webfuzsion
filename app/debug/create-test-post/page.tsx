"use client"

import { useState } from "react"

export default function CreateTestPost() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const createTestPost = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/create-test-post", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ success: false, error: "Failed to create test post" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Test Post</h1>

      <button
        onClick={createTestPost}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Test Post"}
      </button>

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>

          {result.success && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              <p>✅ Test post created! Now try visiting:</p>
              <a href="/blog/test" target="_blank" className="text-blue-600 underline" rel="noreferrer">
                /blog/test
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
