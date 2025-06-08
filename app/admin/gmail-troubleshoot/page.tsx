"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Copy, ExternalLink } from "lucide-react"

export default function GmailTroubleshootPage() {
  const [copied, setCopied] = useState(false)

  const copyEnvVars = () => {
    const envVars = `GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here`

    navigator.clipboard.writeText(envVars)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <AdminHeader />

          <div className="flex items-center mb-8">
            <Link href="/admin" className="mr-4">
              <button className="flex items-center text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Admin</span>
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Gmail Authentication Error Fix</h1>
          </div>

          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2 text-red-200">Error: Username and Password not accepted</h2>
            <p className="text-gray-300">
              <code className="bg-black/30 px-2 py-1 rounded text-sm">
                Invalid login: 535-5.7.8 Username and Password not accepted. For more information, go to 535 5.7.8
                https://support.google.com/mail/?p=BadCredentials
              </code>
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                  1
                </span>
                Enable 2-Step Verification (Required)
              </h2>
              <p className="mb-4 text-gray-300">
                App Passwords are only available if you have 2-Step Verification enabled on your Google Account.
              </p>
              <ol className="list-decimal pl-8 space-y-2 text-gray-300">
                <li>
                  Go to your{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center"
                  >
                    Google Account Security settings <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>Find "2-Step Verification" and click on it</li>
                <li>Follow the steps to turn on 2-Step Verification</li>
                <li>You may need to add a phone number if you haven't already</li>
              </ol>
            </section>

            <section className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                  2
                </span>
                Create an App Password
              </h2>
              <p className="mb-4 text-gray-300">
                <strong>Important:</strong> You must use an App Password, not your regular Gmail password.
              </p>
              <ol className="list-decimal pl-8 space-y-2 text-gray-300">
                <li>
                  Go to your{" "}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center"
                  >
                    App passwords page <ExternalLink className="h-3 w-3 ml-1" />
                  </a>{" "}
                  (you must have 2-Step Verification enabled to see this page)
                </li>
                <li>At the bottom, click "Select app" and choose "Mail" (or "Other" and type "WebFuZsion")</li>
                <li>Click "Generate"</li>
                <li>
                  <strong className="text-yellow-300">Copy the 16-character password</strong> - you won't see it again!
                </li>
                <li>Click "Done"</li>
              </ol>
              <div className="mt-4 bg-black/30 p-4 rounded-lg">
                <p className="text-sm text-yellow-200 mb-2">
                  <strong>What an App Password looks like:</strong>
                </p>
                <p className="font-mono bg-gray-800 p-2 rounded text-center">xxxx xxxx xxxx xxxx</p>
                <p className="text-xs text-gray-400 mt-2">
                  It's a 16-character code with spaces. Enter it exactly as shown (with or without spaces).
                </p>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                  3
                </span>
                Update Environment Variables
              </h2>
              <p className="mb-4 text-gray-300">Make sure your environment variables are set correctly:</p>

              <div className="bg-gray-800/50 p-4 rounded-md mb-4 font-mono text-sm">
                <pre>GMAIL_USER=your.email@gmail.com</pre>
                <pre>GMAIL_APP_PASSWORD=your-app-password-here</pre>
              </div>

              <button
                onClick={copyEnvVars}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>

              <div className="mt-4 space-y-2 text-gray-300">
                <p>
                  <strong>GMAIL_USER:</strong> Your full Gmail address (e.g., example@gmail.com)
                </p>
                <p>
                  <strong>GMAIL_APP_PASSWORD:</strong> The 16-character App Password you generated (not your regular
                  password)
                </p>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                  4
                </span>
                Common Issues & Solutions
              </h2>
              <div className="space-y-4">
                <div className="p-3 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-1">Using a Google Workspace Account?</h3>
                  <p className="text-gray-300 text-sm">
                    If you're using a Google Workspace account (business Gmail), your admin might need to enable "Less
                    secure app access" or specifically allow SMTP access.
                  </p>
                </div>

                <div className="p-3 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-1">Recently Changed Your Password?</h3>
                  <p className="text-gray-300 text-sm">
                    If you recently changed your Google account password, you'll need to generate a new App Password.
                  </p>
                </div>

                <div className="p-3 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-1">Advanced Security Features Enabled?</h3>
                  <p className="text-gray-300 text-sm">
                    If you have Advanced Protection Program enabled, you might need to adjust your security settings to
                    allow App Passwords.
                  </p>
                </div>

                <div className="p-3 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-1">Check for Typos</h3>
                  <p className="text-gray-300 text-sm">
                    Double-check that you've entered your email address and App Password correctly, with no extra
                    spaces.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                  5
                </span>
                Test Your Configuration
              </h2>
              <p className="mb-4 text-gray-300">
                After updating your environment variables with the correct App Password, test your email configuration:
              </p>

              <Link
                href="/admin/email-diagnostic"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-block"
              >
                Go to Email Diagnostic Tool
              </Link>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
