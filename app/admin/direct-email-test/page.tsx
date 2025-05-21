"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import Link from "next/link"
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react"

export default function DirectEmailTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runTest = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/admin/direct-email-test")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to run test",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <AdminHeader />

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <button className="flex items-center text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Back to Admin</span>
                </button>
              </Link>
              <h1 className="text-3xl font-bold">Direct Email Test</h1>
            </div>

            <button
              onClick={runTest}
              disabled={isLoading}
              className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/80 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Run Direct Test</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Direct Gmail Connection Test</h2>
            <p className="mb-6 text-gray-300">
              This test attempts to connect directly to Gmail using your credentials without any additional
              configuration. It will help identify if there are issues with your Gmail account settings or credentials.
            </p>

            {result && (
              <div
                className={`p-4 rounded-lg ${result.success ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"} border`}
              >
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{result.success ? "Connection Successful!" : "Connection Failed"}</p>
                    {result.message && <p className="text-sm mt-1">{result.message}</p>}
                    {result.error && <p className="text-sm mt-1 text-red-300">{result.error}</p>}

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Credentials Used:</h3>
                      <div className="bg-black/30 p-3 rounded text-xs font-mono">
                        <p>User: {result.credentials?.user || "Not available"}</p>
                        <p>Password: {result.credentials?.pass || "Not available"}</p>
                      </div>
                    </div>

                    {result.stack && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Error Details:</h3>
                        <div className="bg-black/30 p-3 rounded text-xs font-mono overflow-x-auto max-h-60 overflow-y-auto">
                          <pre>{result.stack}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h3 className="font-medium mb-2">Troubleshooting Tips</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
                <li>
                  <strong>App Password Format:</strong> Enter without spaces (e.g., "abcdefghijklmnop")
                </li>
                <li>
                  <strong>Gmail Account:</strong> Ensure 2-Step Verification is enabled
                </li>
                <li>
                  <strong>Security Settings:</strong> Check for any security alerts in your Google Account
                </li>
                <li>
                  <strong>Try a New App Password:</strong> Generate a completely new app password
                </li>
                <li>
                  <strong>Alternative Email:</strong> Consider trying a different Gmail account
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
