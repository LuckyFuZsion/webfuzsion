"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      // Check if environment variables are set (client-side check)
      if (!username || !password) {
        setError("Username and password are required")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log("Raw response:", responseText)

      let data
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        setError(
          `Server returned invalid response: ${responseText.substring(0, 100)}${responseText.length > 100 ? "..." : ""}`,
        )
        setDebugInfo(`Status: ${response.status}, Response parsing error: ${parseError}`)
        setIsLoading(false)
        return
      }

      if (response.ok && data.success) {
        // Add a small delay to ensure cookie is set
        setTimeout(() => {
          router.push(callbackUrl)
        }, 500)
      } else {
        setError(data.message || "Invalid credentials")
        setDebugInfo(`Status: ${response.status}, Success: ${data.success}`)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
      setDebugInfo(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-300 overflow-auto">
              <p className="font-bold mb-1">Debug Info:</p>
              <pre>{debugInfo}</pre>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-400">
            <p>Note: Make sure your environment variables are properly set in your local environment.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
