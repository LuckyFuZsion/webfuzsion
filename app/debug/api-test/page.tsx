"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ApiTestPage() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}')
  const [body, setBody] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResponse("")
    setError("")

    try {
      let parsedHeaders = {}
      try {
        parsedHeaders = JSON.parse(headers)
      } catch (e) {
        setError("Invalid headers JSON")
        setLoading(false)
        return
      }

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      }

      if (method !== "GET" && method !== "HEAD" && body) {
        try {
          options.body = body
        } catch (e) {
          // If it's not JSON, send as is
          options.body = body
        }
      }

      const res = await fetch(url, options)

      // Get response headers
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Try to parse as JSON first
      let responseText = ""
      let responseData: any

      try {
        responseText = await res.text()
        try {
          responseData = JSON.parse(responseText)
          responseText = JSON.stringify(responseData, null, 2)
        } catch (e) {
          // Not JSON, keep as text
        }
      } catch (e) {
        responseText = "Error reading response body"
      }

      setResponse(`Status: ${res.status} ${res.statusText}
      
Headers:
${JSON.stringify(responseHeaders, null, 2)}

Body:
${responseText}`)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>API Test Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div className="w-32">
              <label className="block mb-2 text-sm font-medium">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border rounded">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Headers (JSON)</label>
            <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} rows={3} />
          </div>

          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <div>
              <label className="block mb-2 text-sm font-medium">Body</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Request body (JSON or raw)"
              />
            </div>
          )}

          <Button onClick={testApi} disabled={loading}>
            {loading ? "Testing..." : "Test API"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {response && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">{response}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
