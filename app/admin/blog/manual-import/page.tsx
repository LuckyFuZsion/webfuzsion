"use client"

import { useState } from "react"

export default function ManualBlogImport() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runImport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/manual-blog-import", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manual Blog Import</h1>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Notice</h2>
        <p className="text-yellow-700">
          This will import your existing blog posts manually into the database. This is a one-time operation to restore
          your blog content.
        </p>
      </div>

      <button
        onClick={runImport}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import Blog Posts"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          {result.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Successfully imported {result.imported} blog posts. Failed: {result.failed}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Import failed: {result.error}</p>
            </div>
          )}
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm mt-4 max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
