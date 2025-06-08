"use client"

import { useState } from "react"

export default function BlogDebugPage() {
  const [results, setResults] = useState<{ test: string; result: string; success: boolean }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    setResults([])

    try {
      const response = await fetch("/api/admin/blog-debug")
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      setResults([
        {
          test: "API Call",
          result: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          success: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blog System Diagnostics</h1>

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Running Tests..." : "Run Diagnostic Tests"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.test}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap">{result.result}</pre>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.success ? "Success" : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manual Testing Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Check if you're logged in as an admin</li>
          <li>Verify that your deployment environment allows file system writes</li>
          <li>
            Try the simple blog editor at{" "}
            <a href="/admin/blog/simple" className="text-blue-600 hover:underline">
              /admin/blog/simple
            </a>
          </li>
          <li>Check browser console for JavaScript errors</li>
          <li>Check server logs in your Vercel dashboard</li>
        </ol>
      </div>
    </div>
  )
}
