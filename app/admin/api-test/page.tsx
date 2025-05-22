"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminApiTest() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const runTest = async (name: string, url: string, options: RequestInit = {}) => {
    setLoading((prev) => ({ ...prev, [name]: true }))
    try {
      console.log(`Testing ${name}: ${url}`)
      const response = await fetch(url, options)
      const text = await response.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        data = { parseError: true, rawText: text.substring(0, 500) + "..." }
      }

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        timestamp: new Date().toISOString(),
      }

      console.log(`${name} result:`, result)
      setResults((prev) => ({ ...prev, [name]: result }))
    } catch (error) {
      const errorResult = {
        error: true,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }
      console.error(`${name} error:`, errorResult)
      setResults((prev) => ({ ...prev, [name]: errorResult }))
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }))
    }
  }

  const adminTests = [
    {
      name: "Check Auth",
      url: "/api/admin/check-auth",
      description: "Test admin authentication status",
    },
    {
      name: "Invoice Setup",
      url: "/api/admin/check-invoice-setup",
      description: "Check if invoice system is configured",
    },
    {
      name: "Invoice Tables",
      url: "/api/admin/check-invoice-tables",
      description: "Check invoice database tables",
    },
    {
      name: "Get Invoices",
      url: "/api/admin/invoices",
      description: "Fetch invoices from database",
    },
    {
      name: "Get Customers",
      url: "/api/admin/customers",
      description: "Fetch customers from database",
    },
    {
      name: "Blog Posts",
      url: "/api/admin/blog-posts",
      description: "Fetch blog posts",
    },
    {
      name: "Environment Check",
      url: "/api/debug/env-check",
      description: "Check environment variables",
    },
  ]

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-6">Admin API Tester</h1>
          <p className="text-gray-300 mb-8">Test your admin API endpoints to diagnose issues</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminTests.map((test) => (
              <div key={test.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">{test.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{test.description}</p>

                <Button
                  onClick={() => runTest(test.name, test.url)}
                  disabled={loading[test.name]}
                  className="w-full mb-3"
                >
                  {loading[test.name] ? "Testing..." : "Test"}
                </Button>

                {results[test.name] && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          results[test.name].error || results[test.name].status >= 400 ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm">
                        {results[test.name].error
                          ? "Error"
                          : `${results[test.name].status} ${results[test.name].statusText}`}
                      </span>
                    </div>

                    <details className="mt-2">
                      <summary className="text-sm text-blue-400 cursor-pointer">View Details</summary>
                      <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-auto max-h-40 text-gray-300">
                        {JSON.stringify(results[test.name], null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <a href="/admin/invoices" className="text-blue-400 hover:underline">
                Invoices
              </a>
              <a href="/admin/blog/dashboard" className="text-blue-400 hover:underline">
                Blog Dashboard
              </a>
              <a href="/debug/dashboard" className="text-blue-400 hover:underline">
                Full Debug Dashboard
              </a>
              <a href="/admin/login" className="text-blue-400 hover:underline">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
