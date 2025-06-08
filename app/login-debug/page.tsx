"use client"

import type React from "react"

import { useState } from "react"

export default function LoginDebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/admin/auth-debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to connect to API" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh" }}>
      <h1>Login Debug</h1>
      <p>This will help us debug the authentication issue.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <br />
          <input type="text" name="username" required style={{ padding: "5px", marginTop: "5px", color: "black" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            required
            style={{ padding: "5px", marginTop: "5px", color: "black" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
          {loading ? "Testing..." : "Test Login"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#2a2a2a", borderRadius: "5px" }}>
          <h3>Debug Result:</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <a href="/test-basic" style={{ color: "#3b82f6" }}>
          Back to Test
        </a>
      </div>
    </div>
  )
}
