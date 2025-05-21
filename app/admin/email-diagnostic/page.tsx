"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import Link from "next/link"
import { ArrowLeft, Send, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function EmailDiagnosticPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [testEmailTo, setTestEmailTo] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)
          runDiagnostic()
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  const runDiagnostic = async () => {
    try {
      setIsRunningTest(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const response = await fetch("/api/admin/email-diagnostic")
      if (!response.ok) {
        throw new Error(`Failed to run diagnostic: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticResult(data)
      setSuccessMessage("Email diagnostic ran successfully.")
    } catch (error) {
      console.error("Error running diagnostic:", error)
      setErrorMessage(`Error: ${error instanceof Error ? error.message : "Failed to run diagnostic"}`)
    } finally {
      setIsRunningTest(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmailTo) {
      setErrorMessage("Please enter an email address to send the test to")
      return
    }

    try {
      setIsSendingTest(true)
      setErrorMessage(null)
      setTestResult(null)
      setSuccessMessage(null)

      const response = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: testEmailTo,
        }),
      })

      const data = await response.json()
      setTestResult(data)

      if (!data.success) {
        throw new Error(data.error || "Failed to send test email")
      }

      setSuccessMessage("Test email sent successfully!")
    } catch (error) {
      console.error("Error sending test email:", error)
      setErrorMessage(`Error: ${error instanceof Error ? error.message : "Failed to send test email"}`)
    } finally {
      setIsSendingTest(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
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
              <h1 className="text-3xl font-bold">Email Diagnostic</h1>
            </div>

            <button
              onClick={runDiagnostic}
              disabled={isRunningTest}
              className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/80 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isRunningTest ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Run Diagnostic</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>

              {diagnosticResult ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Server Settings</h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{JSON.stringify(diagnosticResult.config, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Connection Test</h3>
                    <div className="flex items-center">
                      {diagnosticResult.connection.includes("successful") ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>{diagnosticResult.connection}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Test Email</h3>
                    <div className="flex items-center">
                      {diagnosticResult.verification.includes("sent") ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>{diagnosticResult.verification}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Environment</h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{JSON.stringify(diagnosticResult.environment, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Run the diagnostic to see email configuration details</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Send Test Email</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={testEmailTo}
                    onChange={(e) => setTestEmailTo(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                  />
                </div>

                <button
                  onClick={sendTestEmail}
                  disabled={isSendingTest || !testEmailTo}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Test Email</span>
                    </>
                  )}
                </button>

                {testResult && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      testResult.success ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"
                    } border`}
                  >
                    <div className="flex items-start gap-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{testResult.message}</p>
                        {testResult.details && <p className="text-sm mt-1">{testResult.details}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  Common Email Issues
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>SMTP Authentication Failure:</strong> Check that your email username and password are
                    correct.
                  </li>
                  <li>
                    <strong>Connection Timeout:</strong> Your server might be blocking outgoing SMTP connections or the
                    SMTP server is down.
                  </li>
                  <li>
                    <strong>Rate Limiting:</strong> Some email providers limit how many emails you can send in a period.
                  </li>
                  <li>
                    <strong>Spam Filters:</strong> Your emails might be getting caught in spam filters.
                  </li>
                  <li>
                    <strong>Environment Variables:</strong> Make sure all required email environment variables are set
                    correctly.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Required Environment Variables</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-username
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=sender@example.com
EMAIL_TO=recipient@example.com`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                <p>
                  If you're still having issues after running the diagnostic, check your server logs for more detailed
                  error messages. You might need to contact your email provider or hosting service for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
