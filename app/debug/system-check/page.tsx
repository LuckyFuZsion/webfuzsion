"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle, XCircle, Copy, Download } from "lucide-react"

export default function SystemCheck() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [selectedTests, setSelectedTests] = useState<string[]>(["env", "api", "database", "email", "auth", "forms"])
  const [summary, setSummary] = useState("")
  const [copied, setCopied] = useState(false)

  // Define all the tests we can run
  const availableTests = [
    { id: "env", name: "Environment Variables", endpoint: "/api/debug/env-check" },
    { id: "api", name: "API Endpoints", endpoint: "/api/debug/api-check" },
    { id: "database", name: "Database Connection", endpoint: "/api/debug/database-diagnostics" },
    { id: "email", name: "Email Configuration", endpoint: "/api/debug/email-test" },
    { id: "auth", name: "Authentication", endpoint: "/api/admin/check-auth" },
    { id: "forms", name: "Contact Forms", endpoint: "/api/debug/form-test" },
  ]

  // Toggle a test selection
  const toggleTest = (id: string) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  // Run all selected tests
  const runTests = async () => {
    setLoading(true)
    setResults({})
    const newResults: any = {}

    // Run each selected test
    for (const test of availableTests.filter((t) => selectedTests.includes(t.id))) {
      try {
        const response = await fetch(test.endpoint)
        const contentType = response.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
          const data = await response.json()
          newResults[test.id] = {
            status: response.status,
            success: response.ok,
            data,
          }
        } else {
          // Handle non-JSON responses
          const text = await response.text()
          newResults[test.id] = {
            status: response.status,
            success: false,
            error: "Non-JSON response",
            data: { rawResponse: text.substring(0, 500) + (text.length > 500 ? "..." : "") },
          }
        }
      } catch (error) {
        newResults[test.id] = {
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    setResults(newResults)
    generateSummary(newResults)
    setLoading(false)
  }

  // Generate a summary of all test results
  const generateSummary = (results: any) => {
    const timestamp = new Date().toISOString()
    let summaryText = `WEBFUZSION SYSTEM DIAGNOSTIC REPORT (${timestamp})\n\n`

    // Environment summary
    if (results.env) {
      const envData = results.env.data
      summaryText += "ENVIRONMENT:\n"
      summaryText += `- Node Environment: ${envData?.environment || "unknown"}\n`
      summaryText += `- Vercel Environment: ${envData?.variables?.VERCEL_ENV || "unknown"}\n`

      // Count environment variables by type
      const envVars = {
        database: Object.keys(envData?.variables || {}).filter(
          (k) => k.includes("POSTGRES") || k.includes("SUPABASE") || k.includes("DATABASE"),
        ).length,
        email: Object.keys(envData?.variables || {}).filter(
          (k) => k.includes("EMAIL") || k.includes("SMTP") || k.includes("GMAIL"),
        ).length,
        auth: Object.keys(envData?.variables || {}).filter(
          (k) => k.includes("AUTH") || k.includes("JWT") || k.includes("ADMIN"),
        ).length,
      }

      summaryText += `- Database Env Vars: ${envVars.database}\n`
      summaryText += `- Email Env Vars: ${envVars.email}\n`
      summaryText += `- Auth Env Vars: ${envVars.auth}\n\n`
    }

    // Database summary
    if (results.database) {
      const dbData = results.database.data
      summaryText += "DATABASE:\n"
      summaryText += `- Connection: ${dbData?.connectionTests?.supabaseAnon?.success ? "SUCCESS" : "FAILED"}\n`
      if (dbData?.connectionTests?.supabaseAnon?.message) {
        summaryText += `- Message: ${dbData.connectionTests.supabaseAnon.message}\n`
      }

      // Table status
      if (dbData?.tableStatus) {
        summaryText += `- Invoices Table: ${dbData.tableStatus.invoicesTable?.exists ? "EXISTS" : "MISSING"}\n`
        summaryText += `- Blog Posts Table: ${dbData.tableStatus.blogPostsTable?.exists ? "EXISTS" : "MISSING"}\n`
      }

      // Record counts
      if (dbData?.recordCounts) {
        if (dbData.recordCounts.invoices !== undefined) {
          summaryText += `- Invoice Records: ${dbData.recordCounts.invoices}\n`
        }
        if (dbData.recordCounts.blogPosts !== undefined) {
          summaryText += `- Blog Post Records: ${dbData.recordCounts.blogPosts}\n`
        }
      }
      summaryText += "\n"
    }

    // Email summary
    if (results.email) {
      const emailData = results.email.data
      summaryText += "EMAIL:\n"
      summaryText += `- Configuration: ${emailData?.config ? "PRESENT" : "MISSING"}\n`

      // Check specific email variables
      if (emailData?.config) {
        summaryText += `- GMAIL_USER: ${emailData.config.GMAIL_USER?.exists ? "SET" : "MISSING"}\n`
        summaryText += `- GMAIL_APP_PASSWORD: ${emailData.config.GMAIL_APP_PASSWORD?.exists ? "SET" : "MISSING"}\n`
        summaryText += `- EMAIL_FROM: ${emailData.config.EMAIL_FROM?.exists ? "SET" : "MISSING"}\n`
        summaryText += `- EMAIL_TO: ${emailData.config.EMAIL_TO?.exists ? "SET" : "MISSING"}\n`
      }
      summaryText += "\n"
    }

    // Auth summary
    if (results.auth) {
      const authData = results.auth.data
      summaryText += "AUTHENTICATION:\n"
      summaryText += `- Status: ${authData?.authenticated ? "AUTHENTICATED" : "NOT AUTHENTICATED"}\n`
      summaryText += `- Admin Variables: ${authData?.adminVarsSet ? "SET" : "MISSING"}\n\n`
    }

    // Forms summary
    if (results.forms) {
      const formsData = results.forms.data
      summaryText += "CONTACT FORMS:\n"
      summaryText += `- Status: ${formsData?.success ? "WORKING" : "NOT WORKING"}\n`
      if (formsData?.message) {
        summaryText += `- Message: ${formsData.message}\n`
      }
      if (formsData?.errors) {
        summaryText += `- Errors: ${JSON.stringify(formsData.errors)}\n`
      }
      summaryText += "\n"
    }

    // API endpoints summary
    if (results.api) {
      const apiData = results.api.data
      summaryText += "API ENDPOINTS:\n"

      if (apiData?.endpoints) {
        Object.entries(apiData.endpoints).forEach(([endpoint, status]: [string, any]) => {
          summaryText += `- ${endpoint}: ${status.success ? "OK" : "FAILED"} (${status.status})\n`
        })
      }
      summaryText += "\n"
    }

    // Add recommendations
    summaryText += "RECOMMENDATIONS:\n"

    // Database recommendations
    if (results.database?.data?.recommendations) {
      results.database.data.recommendations.forEach((rec: string) => {
        summaryText += `- ${rec}\n`
      })
    }

    // Email recommendations
    if (!results.email?.data?.config?.GMAIL_USER?.exists) {
      summaryText += "- Set up GMAIL_USER environment variable\n"
    }
    if (!results.email?.data?.config?.GMAIL_APP_PASSWORD?.exists) {
      summaryText += "- Set up GMAIL_APP_PASSWORD environment variable\n"
    }

    // Auth recommendations
    if (results.auth?.data?.authenticated === false) {
      summaryText += "- Check ADMIN_USERNAME and ADMIN_PASSWORD environment variables\n"
      summaryText += "- Verify JWT_SECRET is properly set\n"
    }

    // General recommendations
    summaryText += "- After GitHub sync, verify all environment variables are correctly set in Vercel\n"
    summaryText += "- Check for any changes in database schema or connection strings\n"

    setSummary(summaryText)
  }

  // Copy summary to clipboard
  const copySummary = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download summary as text file
  const downloadSummary = () => {
    const element = document.createElement("a")
    const file = new Blob([summary], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `webfuzsion-diagnostic-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">WebFuZsion System Diagnostic</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Tests to Run</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableTests.map((test) => (
              <div key={test.id} className="flex items-center space-x-2">
                <Checkbox
                  id={test.id}
                  checked={selectedTests.includes(test.id)}
                  onCheckedChange={() => toggleTest(test.id)}
                />
                <label
                  htmlFor={test.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {test.name}
                </label>
              </div>
            ))}
          </div>

          <Button onClick={runTests} disabled={loading || selectedTests.length === 0} className="mt-4">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              "Run System Diagnostic"
            )}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Results</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Diagnostic Summary</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copySummary}>
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSummary}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap text-sm">{summary}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTests
                .filter((t) => results[t.id])
                .map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {test.name}
                        {results[test.id]?.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p>Status: {results[test.id]?.status}</p>
                        {results[test.id]?.error && <p className="text-red-500">Error: {results[test.id].error}</p>}
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-blue-500">View Raw Data</summary>
                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                          {JSON.stringify(results[test.id]?.data, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
