"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function FixDatabasePage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [repairLoading, setRepairLoading] = useState(false)

  // Run the diagnostics
  const checkDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/database-fix")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error checking database:", error)
      setResults({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  // Run a repair
  const repairDatabase = async (type: string) => {
    setRepairLoading(true)
    try {
      const response = await fetch(`/api/debug/database-fix?action=repair&repair=${type}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error(`Error repairing database:`, error)
      setResults((prev: any) => ({
        ...prev,
        repairs: {
          ...prev?.repairs,
          [type]: {
            success: false,
            message: error instanceof Error ? error.message : String(error),
          },
        },
      }))
    } finally {
      setRepairLoading(false)
    }
  }

  // Run diagnostics on page load
  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Database Repair Tool</h1>
          <p className="mb-6 text-gray-600">This tool will help you fix your database tables.</p>

          <div className="flex gap-4 mb-8">
            <Button onClick={checkDatabase} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Checking..." : "Check Database"}
            </Button>

            <Button
              onClick={() => repairDatabase("all")}
              disabled={repairLoading || !results?.connectionStatus?.success}
              className="bg-green-600 hover:bg-green-700"
            >
              {repairLoading ? "Repairing..." : "Repair All Tables"}
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      results.connectionStatus?.success ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span>{results.connectionStatus?.message || "Unknown"}</span>
                </div>
              </div>

              {/* Table Status */}
              {results.connectionStatus?.success && (
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">Table Status</h2>

                  <div className="mb-4">
                    <h3 className="text-md font-medium mb-1">Invoice Tables</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.tableStatus?.invoices?.exists ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span>{results.tableStatus?.invoices?.exists ? "Exists" : "Missing"}</span>
                    </div>

                    {!results.tableStatus?.invoices?.exists && (
                      <Button onClick={() => repairDatabase("invoices")} disabled={repairLoading} size="sm">
                        Create Invoice Tables
                      </Button>
                    )}

                    {results.repairs?.invoices && (
                      <p className={`mt-2 ${results.repairs.invoices.success ? "text-green-600" : "text-red-600"}`}>
                        {results.repairs.invoices.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-1">Blog Posts Table</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results.tableStatus?.blogPosts?.exists ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span>{results.tableStatus?.blogPosts?.exists ? "Exists" : "Missing"}</span>
                    </div>

                    {!results.tableStatus?.blogPosts?.exists && (
                      <Button onClick={() => repairDatabase("blog")} disabled={repairLoading} size="sm">
                        Create Blog Table
                      </Button>
                    )}

                    {results.repairs?.blog && (
                      <p className={`mt-2 ${results.repairs.blog.success ? "text-green-600" : "text-red-600"}`}>
                        {results.repairs.blog.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Raw Results */}
              <details className="mt-4">
                <summary className="text-sm text-blue-600 cursor-pointer">View Raw Data</summary>
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
