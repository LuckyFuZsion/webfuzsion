"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function DebugPage() {
  // Login test state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginResult, setLoginResult] = useState<any>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginRawResponse, setLoginRawResponse] = useState("")

  // Contact form test state
  const [name, setName] = useState("Test User")
  const [email, setEmail] = useState("test@example.com")
  const [subject, setSubject] = useState("Debug Test")
  const [enquiryType, setEnquiryType] = useState("Business Site")
  const [message, setMessage] = useState("This is a test message from the debug page.")
  const [contactResult, setContactResult] = useState<any>(null)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactRawResponse, setContactRawResponse] = useState("")

  // Environment variable check state
  const [envCheckResult, setEnvCheckResult] = useState<any>(null)
  const [envCheckLoading, setEnvCheckLoading] = useState(false)

  // Test login API
  const testLogin = async () => {
    setLoginLoading(true)
    setLoginResult(null)
    setLoginRawResponse("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      // Get raw response text
      const rawText = await response.text()
      setLoginRawResponse(rawText)

      // Try to parse as JSON
      try {
        const data = JSON.parse(rawText)
        setLoginResult({
          status: response.status,
          statusText: response.statusText,
          success: data.success,
          message: data.message,
          data,
        })
      } catch (parseError) {
        setLoginResult({
          status: response.status,
          statusText: response.statusText,
          error: "Failed to parse response as JSON",
          parseError: String(parseError),
        })
      }
    } catch (error) {
      setLoginResult({
        error: "Request failed",
        details: String(error),
      })
    } finally {
      setLoginLoading(false)
    }
  }

  // Test contact form API
  const testContactForm = async () => {
    setContactLoading(true)
    setContactResult(null)
    setContactRawResponse("")

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("subject", subject)
      formData.append("enquiryType", enquiryType)
      formData.append("message", message)

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      // Get raw response text
      const rawText = await response.text()
      setContactRawResponse(rawText)

      // Try to parse as JSON
      try {
        const data = JSON.parse(rawText)
        setContactResult({
          status: response.status,
          statusText: response.statusText,
          success: data.success,
          message: data.message,
          data,
        })
      } catch (parseError) {
        setContactResult({
          status: response.status,
          statusText: response.statusText,
          error: "Failed to parse response as JSON",
          parseError: String(parseError),
        })
      }
    } catch (error) {
      setContactResult({
        error: "Request failed",
        details: String(error),
      })
    } finally {
      setContactLoading(false)
    }
  }

  // Check environment variables
  const checkEnvironmentVariables = async () => {
    setEnvCheckLoading(true)
    setEnvCheckResult(null)

    try {
      const response = await fetch("/api/debug-env", {
        method: "GET",
      })

      const data = await response.json()
      setEnvCheckResult(data)
    } catch (error) {
      setEnvCheckResult({
        error: "Request failed",
        details: String(error),
      })
    } finally {
      setEnvCheckLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">API Debug Page</h1>
          <p className="mb-4 text-gray-600">
            Use this page to test API endpoints and diagnose issues with login and contact form functionality.
          </p>

          {/* Environment Variables Check */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables Check</h2>
            <Button onClick={checkEnvironmentVariables} disabled={envCheckLoading} className="mb-4">
              {envCheckLoading ? "Checking..." : "Check Environment Variables"}
            </Button>

            {envCheckResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm">{JSON.stringify(envCheckResult, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Login API Test */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Login API</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <Button onClick={testLogin} disabled={loginLoading} className="mb-4">
              {loginLoading ? "Testing..." : "Test Login API"}
            </Button>

            {loginResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm">{JSON.stringify(loginResult, null, 2)}</pre>
              </div>
            )}

            {loginRawResponse && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="text-sm">{loginRawResponse}</pre>
              </div>
            )}
          </div>

          {/* Contact Form API Test */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Test Contact Form API</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Business Site">Business Site</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            <Button onClick={testContactForm} disabled={contactLoading} className="mb-4">
              {contactLoading ? "Testing..." : "Test Contact Form API"}
            </Button>

            {contactResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm">{JSON.stringify(contactResult, null, 2)}</pre>
              </div>
            )}

            {contactRawResponse && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="text-sm">{contactRawResponse}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Login API Issues:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>405 Method Not Allowed: Check if the API route is properly handling POST requests</li>
              <li>500 Internal Server Error: Check server logs for detailed error information</li>
              <li>JSON Parse Error: The API is not returning valid JSON</li>
              <li>Authentication Failed: Check if your credentials match the environment variables</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact Form Issues:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email Not Sending: Check GMAIL_USER and GMAIL_APP_PASSWORD environment variables</li>
              <li>404 Not Found: Ensure the contact form API endpoint exists</li>
              <li>500 Internal Server Error: Check server logs for detailed error information</li>
              <li>Validation Errors: Ensure all required fields are provided</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
