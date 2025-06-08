"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SetupDatabase() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const setupDatabase = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/debug/setup-database")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Database Setup Tool</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Setup Database Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This tool will create all necessary database tables in the public schema. Use this if your diagnostic report
            shows missing tables.
          </p>

          <Button onClick={setupDatabase} disabled={loading} className="mb-4">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up Database...
              </>
            ) : (
              "Setup Database Tables"
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-md ${
                result.success ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <p className="font-medium">{result.message}</p>
              </div>

              {result.tables && (
                <div className="mt-2">
                  <p className="font-medium">Tables:</p>
                  <ul className="list-disc list-inside ml-2">
                    {Object.entries(result.tables).map(([name, status]: [string, any]) => (
                      <li key={name}>
                        {name}: {status.success ? "Created" : "Failed"}{" "}
                        {status.message && <span className="text-sm">({status.message})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
