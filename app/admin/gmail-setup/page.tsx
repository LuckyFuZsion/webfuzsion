"use client"

import { useState } from "react"
import Link from "next/link"

export default function GmailSetupPage() {
  const [copied, setCopied] = useState(false)

  const copyEnvVars = () => {
    const envVars = `GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here`

    navigator.clipboard.writeText(envVars)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gmail Setup Guide</h1>

      <div className="bg-purple-50 p-6 rounded-lg mb-8 border border-purple-200">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">⚠️ Urgent Email Configuration</h2>
        <p className="mb-4">
          You need to set up your Gmail account to work with WebFuZsion. Follow these steps carefully to ensure emails
          work properly.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 1: Create an App Password in Gmail</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              Go to your{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Account Security settings
              </a>
            </li>
            <li>Make sure 2-Step Verification is enabled (required for App Passwords)</li>
            <li>Scroll down to "App passwords" and click on it</li>
            <li>Select "Mail" as the app and "Other" as the device (name it "WebFuZsion")</li>
            <li>Click "Generate"</li>
            <li>
              Google will display a 16-character password - <strong>copy this password immediately</strong> (you won't
              be able to see it again)
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 2: Update Environment Variables</h2>
          <p className="mb-4">Add these environment variables to your Vercel project:</p>

          <div className="bg-gray-800 text-white p-4 rounded-md mb-4 font-mono">
            <pre>GMAIL_USER=your.email@gmail.com GMAIL_APP_PASSWORD=your-app-password-here</pre>
          </div>

          <button onClick={copyEnvVars} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>

          <div className="mt-4">
            <p>Add these variables to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                Your local <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file
              </li>
              <li>Your Vercel project environment variables</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 3: Test Your Configuration</h2>
          <p className="mb-4">After updating your environment variables, test your email configuration:</p>

          <Link
            href="/admin/email-diagnostic"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-block"
          >
            Go to Email Diagnostic Tool
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Make sure 2-Step Verification is enabled on your Google account</li>
            <li>Ensure you're using an App Password, not your regular Gmail password</li>
            <li>Check that you've added both environment variables correctly</li>
            <li>Verify that your Gmail account doesn't have additional security restrictions</li>
            <li>If using Gmail for business/workspace, ensure SMTP access is enabled by your admin</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
