"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DatabaseDebugPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [repairLoading, setRepairLoading] = useState<Record<string, boolean>>({})

  // Run the diagnostics
  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/database-diagnostics")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error running diagnostics:", error)
      setResults({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  // Run a repair
  const runRepair = async (type: string) => {
    setRepairLoading((prev) => ({ ...prev, [type]: true }))
    try {
      const response = await fetch(`/api/debug/database-diagnostics?action=repair&repair=${type}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error(`Error repairing ${type}:`, error)
      setResults((prev: any) => ({
        ...prev,
        repairs: {
          ...prev?.repairs,
          [type]: {
            attempted: true,
            success: false,
            message: error instanceof Error ? error.message : String(error),
          },
        },
      }))
    } finally {
      setRepairLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  // Run diagnostics on page load
  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Database Diagnostics</h1>
          <p className="mb-6 text-gray-600">
            This page diagnoses database connection issues and provides repair options.
          </p>

          <div className="flex gap-4 mb-8">
            <Button onClick={runDiagnostics} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Running Diagnostics..." : "Run Diagnostics"}
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-md font-medium mb-1">Supabase Anon Connection</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.connectionTests.supabaseAnon?.success ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">{results.connectionTests.supabaseAnon?.message || "Not tested"}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-1">Supabase Admin Connection</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.connectionTests.supabaseAdmin?.success ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">{results.connectionTests.supabaseAdmin?.message || "Not tested"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-md font-medium mb-1">Connection Variables</h3>
                    <ul className="text-sm space-y-1">
                      {Object.entries(results.connectionVariables || {}).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`} />
                          <span>
                            {key}: {String(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-1">Database Variables</h3>
                    <p className="text-sm mb-1">
                      Found {results.environmentVariables?.databaseRelated || 0} database-related variables out of{" "}
                      {results.environmentVariables?.total || 0} total variables.
                    </p>
                    {Object.keys(results.databaseVariables || {}).length > 0 ? (
                      <details>
                        <summary className="text-sm text-blue-600 cursor-pointer">View Details</summary>
                        <ul className="mt-2 text-sm space-y-1">
                          {Object.entries(results.databaseVariables).map(([key, value]: [string, any]) => (
                            <li key={key}>
                              {key}: {value.exists ? `✓ (length: ${value.length})` : "✗"}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <p className="text-sm text-red-500">No database variables found!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Status */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Database Tables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-md font-medium mb-1">Invoices Table</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.tableStatus?.invoicesTable?.exists ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">
                        {results.tableStatus?.invoicesTable?.exists
                          ? `Exists (${results.recordCounts?.invoices || 0} records)`
                          : "Does not exist"}
                      </span>
                    </div>
                    {!results.tableStatus?.invoicesTable?.exists && (
                      <Button
                        onClick={() => runRepair("invoices")}
                        disabled={repairLoading.invoices}
                        size="sm"
                        className="mt-2"
                      >
                        {repairLoading.invoices ? "Creating..." : "Create Invoice Tables"}
                      </Button>
                    )}
                    {results.repairs?.invoices && (
                      <p
                        className={`text-sm mt-2 ${
                          results.repairs.invoices.success ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {results.repairs.invoices.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-1">Blog Posts Table</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.tableStatus?.blogPostsTable?.exists ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">
                        {results.tableStatus?.blogPostsTable?.exists
                          ? `Exists (${results.recordCounts?.blogPosts || 0} records)`
                          : "Does not exist"}
                      </span>
                    </div>
                    {!results.tableStatus?.blogPostsTable?.exists && (
                      <Button
                        onClick={() => runRepair("blog")}
                        disabled={repairLoading.blog}
                        size="sm"
                        className="mt-2"
                      >
                        {repairLoading.blog ? "Creating..." : "Create Blog Table"}
                      </Button>
                    )}
                    {results.repairs?.blog && (
                      <p className={`text-sm mt-2 ${results.repairs.blog.success ? "text-green-600" : "text-red-600"}`}>
                        {results.repairs.blog.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations && results.recommendations.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw Results */}
              <details className="mt-4">
                <summary className="text-sm text-blue-600 cursor-pointer">View Raw Diagnostic Data</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
