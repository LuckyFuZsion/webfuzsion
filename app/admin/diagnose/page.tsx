"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import Link from "next/link"

export default function DiagnosePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunningTest, setIsRunningTest] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/diagnose-db")
      const data = await response.json()

      if (data.success) {
        setDiagnosticResults(data.diagnosticResults)
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runSimpleInvoiceTest = async () => {
    try {
      setIsRunningTest(true)
      setError(null)

      const response = await fetch("/api/admin/simple-invoice-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Test successful! Invoice saved to database.")
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsRunningTest(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <AdminHeader />

          <div className="mb-6">
            <Link href="/admin" className="text-blue-400 hover:underline">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold mt-2">Database Diagnostics</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">{error}</div>
          )}

          <div className="mb-6">
            <button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mr-4"
            >
              {isLoading ? "Running Diagnostics..." : "Run Diagnostics"}
            </button>

            <button
              onClick={runSimpleInvoiceTest}
              disabled={isRunningTest}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              {isRunningTest ? "Testing..." : "Run Simple Invoice Test"}
            </button>
          </div>

          {diagnosticResults && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Connection Test</h2>
                <div className={`text-${diagnosticResults.connection.success ? "green" : "red"}-400`}>
                  {diagnosticResults.connection.message}
                </div>
                {diagnosticResults.connection.error && (
                  <div className="mt-2 text-red-400 text-sm">Error: {diagnosticResults.connection.error}</div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Invoice Schema</h2>
                {diagnosticResults.invoiceSchema.success ? (
                  <div>
                    <div className="text-green-400 mb-2">Schema retrieved successfully</div>
                    <div className="grid grid-cols-3 gap-2">
                      {diagnosticResults.invoiceSchema.columns.map((column: string) => (
                        <div key={column} className="bg-gray-700 px-3 py-1 rounded">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400">Failed to retrieve schema: {diagnosticResults.invoiceSchema.error}</div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Invoice Items Schema</h2>
                {diagnosticResults.itemsSchema.success ? (
                  <div>
                    <div className="text-green-400 mb-2">Schema retrieved successfully</div>
                    <div className="grid grid-cols-3 gap-2">
                      {diagnosticResults.itemsSchema.columns.map((column: string) => (
                        <div key={column} className="bg-gray-700 px-3 py-1 rounded">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400">Failed to retrieve schema: {diagnosticResults.itemsSchema.error}</div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Test Insert</h2>
                <div className={`text-${diagnosticResults.testInsert.success ? "green" : "red"}-400`}>
                  {diagnosticResults.testInsert.message}
                </div>
                {diagnosticResults.testInsert.error && (
                  <div className="mt-2 text-red-400 text-sm">Error: {diagnosticResults.testInsert.error}</div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
                <div className="space-y-1">
                  <div>SUPABASE_URL: {diagnosticResults.environment.supabaseUrl}</div>
                  <div>SUPABASE_SERVICE_ROLE_KEY: {diagnosticResults.environment.supabaseKey}</div>
                  <div>NEXT_RUNTIME: {diagnosticResults.environment.nextRuntime}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
