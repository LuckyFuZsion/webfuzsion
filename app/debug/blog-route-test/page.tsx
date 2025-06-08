"use client"

import { useState } from "react"

export default function BlogRouteTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRoute = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/test-blog-route?slug=test")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  const revalidate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/revalidate-blog", { method: "POST" })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Blog Route Test</h1>

      <div className="space-y-4">
        <button
          onClick={testRoute}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Blog Route"}
        </button>

        <button
          onClick={revalidate}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
        >
          {loading ? "Revalidating..." : "Revalidate Cache"}
        </button>

        <div className="mt-4">
          <a
            href="/blog/test"
            target="_blank"
            className="bg-purple-500 text-white px-4 py-2 rounded inline-block"
            rel="noreferrer"
          >
            Open /blog/test in new tab
          </a>
        </div>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
