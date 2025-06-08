"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuickImportBlogs() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/import-all-blogs")
      const data = await response.json()

      setResults(data)
      if (!data.success) {
        setError(data.error || "Failed to import blogs")
      }
    } catch (err) {
      console.error("Error importing blogs:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quick Blog Import</h1>
        <button
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Blog List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">One-Click Blog Import</h2>
          <p className="mb-4">
            This tool will scan your project for all blog posts and import them into the database. It will automatically
            detect different blog formats and structures.
          </p>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleImport}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-medium"
            >
              {loading ? "Importing..." : "Import All Blog Posts"}
            </button>
          </div>

          {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

          {results && (
            <div
              className={`p-4 rounded-lg mb-6 ${results.success ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              <p className="font-medium">{results.message}</p>

              {results.results && results.results.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Import Results:</h3>
                  <div className="max-h-60 overflow-y-auto border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.results.map((result: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{result.slug}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {result.success ? "Success" : "Failed"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">{result.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Next Steps:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Go to{" "}
                <a href="/admin/blog/manage" className="text-blue-600 hover:underline">
                  Blog Management
                </a>{" "}
                to view and manage imported posts
              </li>
              <li>Use the publish/unpublish controls to control which posts are visible on your site</li>
              <li>Edit any posts that need updates or corrections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
