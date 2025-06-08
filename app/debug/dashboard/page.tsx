"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DebugDashboard() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Run a test and store the result
  const runTest = async (name: string, url: string, options: RequestInit = {}) => {
    setLoading((prev) => ({ ...prev, [name]: true }))
    try {
      const response = await fetch(url, options)
      const text = await response.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        data = { parseError: true, rawText: text }
      }

      setResults((prev) => ({
        ...prev,
        [name]: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: {
          error: true,
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }))
    }
  }

  // Define all tests
  const tests = [
    {
      name: "Environment Variables",
      url: "/api/debug/env-check",
      description: "Check environment variables",
    },
    {
      name: "Admin Auth Check",
      url: "/api/admin/check-auth",
      description: "Test admin authentication",
    },
    {
      name: "Invoice Setup Check",
      url: "/api/admin/check-invoice-setup",
      description: "Check if invoice system is set up",
    },
    {
      name: "Invoice Tables Check",
      url: "/api/admin/check-invoice-tables",
      description: "Check invoice database tables",
    },
    {
      name: "Get Invoices",
      url: "/api/admin/invoices",
      description: "Fetch all invoices from database",
    },
    {
      name: "Blog Posts API",
      url: "/api/admin/blog-posts",
      description: "Test blog posts API",
    },
    {
      name: "CORS Test (GET)",
      url: "/api/debug/cors-test",
      description: "Test CORS headers with GET request",
    },
    {
      name: "CORS Test (OPTIONS)",
      url: "/api/debug/cors-test",
      options: { method: "OPTIONS" },
      description: "Test CORS preflight with OPTIONS request",
    },
    {
      name: "CORS Test (POST)",
      url: "/api/debug/cors-test",
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      },
      description: "Test CORS with POST request",
    },
    {
      name: "Middleware Test",
      url: "/api/debug/middleware-test",
      description: "Test middleware execution",
    },
    {
      name: "Email Configuration",
      url: "/api/debug/email-test",
      description: "Check email configuration",
    },
  ]

  // Run all tests
  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.url, test.options)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Debug Dashboard</h1>
          <p className="mb-6 text-gray-600">
            This dashboard runs tests against various API endpoints to diagnose issues in your production environment.
          </p>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={runAllTests}
              disabled={Object.values(loading).some(Boolean)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Run All Tests
            </Button>

            <Button onClick={() => setResults({})} variant="outline">
              Clear Results
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test.name} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{test.name}</h2>
                  <Button
                    onClick={() => runTest(test.name, test.url, test.options)}
                    disabled={loading[test.name]}
                    size="sm"
                  >
                    {loading[test.name] ? "Running..." : "Run Test"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-3">{test.description}</p>

                {results[test.name] && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results[test.name].error || results[test.name].status >= 400 ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {results[test.name].error
                          ? "Error"
                          : `Status: ${results[test.name].status} ${results[test.name].statusText}`}
                      </span>
                    </div>

                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                        {JSON.stringify(results[test.name], null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Manual Tests</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Send Test Email</h3>
              <p className="text-sm text-gray-500 mb-3">Send a test email to verify email functionality</p>
              <Button
                onClick={() => {
                  runTest("Send Test Email", "/api/debug/email-test", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ test: true }),
                  })
                }}
                disabled={loading["Send Test Email"]}
              >
                {loading["Send Test Email"] ? "Sending..." : "Send Test Email"}
              </Button>

              {results["Send Test Email"] && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        results["Send Test Email"].error ||
                        results["Send Test Email"].status >= 400 ||
                        !results["Send Test Email"].data?.success
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {results["Send Test Email"].error
                        ? "Error"
                        : results["Send Test Email"].data?.message || "Unknown result"}
                    </span>
                  </div>

                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer">View Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(results["Send Test Email"], null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Test Login API</h3>
              <p className="text-sm text-gray-500 mb-3">Test the admin login API with your credentials</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input type="text" placeholder="Username" id="username" className="p-2 border rounded" />
                <input type="password" placeholder="Password" id="password" className="p-2 border rounded" />
              </div>
              <Button
                onClick={() => {
                  const username = (document.getElementById("username") as HTMLInputElement).value
                  const password = (document.getElementById("password") as HTMLInputElement).value

                  runTest("Test Login API", "/api/admin/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                  })
                }}
                disabled={loading["Test Login API"]}
              >
                {loading["Test Login API"] ? "Testing..." : "Test Login"}
              </Button>

              {results["Test Login API"] && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        results["Test Login API"].error ||
                        results["Test Login API"].status >= 400 ||
                        !results["Test Login API"].data?.success
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {results["Test Login API"].error
                        ? "Error"
                        : results["Test Login API"].data?.message || "Unknown result"}
                    </span>
                  </div>

                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer">View Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(results["Test Login API"], null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
