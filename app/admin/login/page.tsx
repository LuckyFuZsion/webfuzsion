"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Login page: Checking if already authenticated")
        setDebugInfo("Checking authentication status...")

        const response = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        console.log("Login page: Auth check response status:", response.status)
        setDebugInfo((prev) => `${prev}\nAuth check response: ${response.status}`)

        // Check if response is actually JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Login page: Response is not JSON, got:", contentType)
          setDebugInfo((prev) => `${prev}\nInvalid response type: ${contentType}`)
          return
        }

        const data = await response.json()
        console.log("Login page: Auth check data:", data)
        setDebugInfo((prev) => `${prev}\nAuth data: ${JSON.stringify(data)}`)

        if (data.success && data.authenticated) {
          // Already authenticated, redirect to admin
          const from = searchParams.get("from") || "/admin"
          console.log(`Login page: Already authenticated, redirecting to ${from}`)
          setDebugInfo((prev) => `${prev}\nRedirecting to: ${from}`)
          router.push(from)
          return
        }
      } catch (error) {
        console.error("Login page: Auth check error:", error)
        setDebugInfo((prev) => `${prev}\nError: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    checkAuth()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo("Submitting login form...")

    try {
      console.log("Login page: Submitting credentials")

      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      console.log("Login page: Auth response status:", response.status)
      setDebugInfo((prev) => `${prev}\nAuth response: ${response.status}`)

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Login page: Response is not JSON, got:", contentType)
        setDebugInfo((prev) => `${prev}\nInvalid response type: ${contentType}`)
        setError("Server returned invalid response format")
        setIsLoading(false)
        return
      }

      // Check if it's a redirect response
      if (response.redirected) {
        console.log("Login page: Received redirect to", response.url)
        setDebugInfo((prev) => `${prev}\nRedirected to: ${response.url}`)
        window.location.href = response.url
        return
      }

      const data = await response.json()
      console.log("Login page: Auth response data:", data)
      setDebugInfo((prev) => `${prev}\nResponse data: ${JSON.stringify(data)}`)

      if (response.ok && data.success) {
        console.log("Login page: Authentication successful")
        setDebugInfo((prev) => `${prev}\nAuthentication successful`)

        // Verify the authentication worked by checking auth status
        const verifyResponse = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        const verifyData = await verifyResponse.json().catch(() => ({ success: false }))
        console.log("Login page: Verification response:", verifyData)
        setDebugInfo((prev) => `${prev}\nVerification: ${JSON.stringify(verifyData)}`)

        if (verifyData.success) {
          const from = searchParams.get("from") || "/admin"
          console.log(`Login page: Redirecting to ${from}`)
          setDebugInfo((prev) => `${prev}\nRedirecting to: ${from}`)
          router.push(from)
        } else {
          setError("Authentication succeeded but verification failed")
          console.error("Login page: Auth verification failed")
          setDebugInfo((prev) => `${prev}\nVerification failed`)
        }
      } else {
        setError(data.message || "Invalid credentials")
        console.error("Login page: Authentication failed:", data.message)
        setDebugInfo((prev) => `${prev}\nAuth failed: ${data.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
      setDebugInfo((prev) => `${prev}\nError: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Alternative simple login for debugging
  const handleSimpleLogin = async () => {
    try {
      setIsLoading(true)
      setError("")
      setDebugInfo("Trying simple login...")

      const response = await fetch("/api/admin/auth-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await response.json().catch(() => ({ success: false }))
      setDebugInfo((prev) => `${prev}\nSimple login response: ${JSON.stringify(data)}`)

      if (data.success) {
        router.push("/admin")
      } else {
        setError("Simple login failed")
      }
    } catch (error) {
      setError("Simple login error")
      setDebugInfo((prev) => `${prev}\nSimple login error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your admin credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            onClick={handleSimpleLogin}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Debug Login
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">Having trouble? Contact your administrator.</p>
        </div>

        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
            <p className="font-semibold mb-1">Debug Info:</p>
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  )
}
