"use client"

import { useState } from "react"
import { CopyIcon, CheckIcon } from "lucide-react"

export default function EnvVarUpdateGuide() {
  const [appPassword, setAppPassword] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateEnvVars = () => {
    if (!appPassword) return ""
    return `GMAIL_APP_PASSWORD=${appPassword}\nEMAIL_SERVER_PASSWORD=${appPassword}`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Gmail App Password</h2>

      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-700">
          After generating a new app password in your Google Account, paste it here to update your environment
          variables.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="app-password" className="block text-sm font-medium text-gray-700 mb-1">
          New App Password (without spaces)
        </label>
        <input
          id="app-password"
          type="password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          placeholder="Paste your new app password here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Environment Variables to Update</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm text-gray-800">GMAIL_APP_PASSWORD</span>
              <button
                onClick={() => copyToClipboard(`GMAIL_APP_PASSWORD=${appPassword}`, "gmail")}
                className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                disabled={!appPassword}
              >
                {copied === "gmail" ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                <span className="ml-1">{copied === "gmail" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="font-mono bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              {appPassword ? appPassword : "• • • • • • • • • • • • • • • •"}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm text-gray-800">EMAIL_SERVER_PASSWORD</span>
              <button
                onClick={() => copyToClipboard(`EMAIL_SERVER_PASSWORD=${appPassword}`, "email")}
                className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                disabled={!appPassword}
              >
                {copied === "email" ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                <span className="ml-1">{copied === "email" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="font-mono bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              {appPassword ? appPassword : "• • • • • • • • • • • • • • • •"}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Copy All Environment Variables</h3>
        <div className="relative">
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
            {generateEnvVars() || "# Paste your app password above to generate environment variables"}
          </pre>
          <button
            onClick={() => copyToClipboard(generateEnvVars(), "all")}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex items-center"
            disabled={!appPassword}
          >
            {copied === "all" ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            <span className="ml-1">{copied === "all" ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h4 className="font-semibold text-yellow-800 mb-1">Important Reminders</h4>
        <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
          <li>
            Make sure to enter the app password <strong>without spaces</strong>
          </li>
          <li>Update both environment variables with the same password</li>
          <li>After updating, redeploy your application or restart your local server</li>
          <li>Use the direct email test tool to verify your new credentials</li>
        </ul>
      </div>
    </div>
  )
}
