"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export default function HttpCheckPage() {
  const [httpInfo, setHttpInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkHttp() {
      try {
        setLoading(true)
        const res = await fetch("/api/http-check")
        if (!res.ok) throw new Error("Failed to fetch HTTP info")
        const data = await res.json()
        setHttpInfo(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setLoading(false)
      }
    }

    checkHttp()
  }, [])

  // Function to check if HTTP/2 is likely being used
  const isHttp2Likely = () => {
    if (!httpInfo) return false

    // Check for HTTP/2 specific headers
    const headers = httpInfo.headers || {}
    return Object.keys(headers).some(
      (key) =>
        key.toLowerCase().includes("http2") || (headers[key] && headers[key].toString().toLowerCase().includes("h2")),
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">HTTP Protocol Check</h1>

      {loading && <p>Loading HTTP information...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>
      )}

      {httpInfo && (
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">HTTP Protocol Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Protocol:</p>
                <p>{httpInfo.httpVersion || "Unknown"}</p>
              </div>
              <div>
                <p className="font-medium">HTTP/2 Detection:</p>
                <p className={isHttp2Likely() ? "text-green-600" : "text-yellow-600"}>
                  {isHttp2Likely() ? "HTTP/2 likely enabled" : "HTTP/2 may not be enabled"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Request Headers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Header</th>
                    <th className="py-2 px-4 border-b text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(httpInfo.headers || {}).map(([key, value]) => (
                    <tr key={key}>
                      <td className="py-2 px-4 border-b">{key}</td>
                      <td className="py-2 px-4 border-b">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-800">Next Steps</h3>
            <p className="text-blue-700">
              If HTTP/2 is not enabled, please check your hosting configuration or contact your hosting provider. For
              Vercel deployments, HTTP/2 should be enabled by default for all production deployments.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
