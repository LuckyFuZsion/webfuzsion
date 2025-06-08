"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../../components/admin-header"
import {
  ArrowLeft,
  Database,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Bug,
  ChevronDown,
  ChevronUp,
  Download,
  Clipboard,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"

export default function MigrateInvoicesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [localInvoices, setLocalInvoices] = useState<any[]>([])
  const [migrationResults, setMigrationResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [showRawInvoices, setShowRawInvoices] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    customers: false,
    invoices: false,
    items: false,
    debugLog: false,
  })

  useEffect(() => {
    // Check if authenticated on client side
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)
          loadLocalInvoices()
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  const loadLocalInvoices = () => {
    try {
      if (typeof window !== "undefined") {
        const storedInvoices = localStorage.getItem("invoices")
        if (storedInvoices) {
          const parsedInvoices = JSON.parse(storedInvoices)
          if (Array.isArray(parsedInvoices)) {
            setLocalInvoices(parsedInvoices)
            console.log("Local invoices loaded:", parsedInvoices.length)
          }
        }
      }
    } catch (error) {
      console.error("Error loading local invoices:", error)
      setError("Failed to load invoices from localStorage")
    }
  }

  const migrateInvoices = async () => {
    if (localInvoices.length === 0) {
      setError("No invoices found in localStorage to migrate")
      return
    }

    try {
      setIsMigrating(true)
      setError(null)
      setDebugLog([])
      setMigrationResults(null)

      // Log the start of migration
      console.log("Starting migration with invoices:", localInvoices)

      const response = await fetch("/api/admin/invoices/migrate-to-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoices: localInvoices }),
      })

      const data = await response.json()
      console.log("Migration response:", data)

      if (response.ok && data.success) {
        setMigrationResults(data.results)
        if (data.debugLog) {
          setDebugLog(data.debugLog)
        }
      } else {
        setDebugLog(data.debugLog || [])
        throw new Error(data.error || "Migration failed")
      }
    } catch (error) {
      console.error("Error migrating invoices:", error)
      setError(`Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setShowDebugPanel(true)
    } finally {
      setIsMigrating(false)
    }
  }

  const clearLocalStorage = () => {
    if (confirm("Are you sure you want to clear all invoices from localStorage? This cannot be undone.")) {
      try {
        localStorage.removeItem("invoices")
        setLocalInvoices([])
        alert("Local invoices cleared successfully")
      } catch (error) {
        console.error("Error clearing localStorage:", error)
        setError("Failed to clear localStorage")
      }
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const downloadDebugLog = () => {
    const debugContent = JSON.stringify(
      {
        debugLog,
        migrationResults,
        error,
        localInvoices: localInvoices.map((invoice) => ({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          customer: invoice.customer
            ? {
                id: invoice.customer.id,
                name: invoice.customer.name,
                email: invoice.customer.email,
              }
            : null,
          items: Array.isArray(invoice.items) ? invoice.items.length : "not an array",
        })),
      },
      null,
      2,
    )

    const blob = new Blob([debugContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-migration-debug-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <AdminHeader />

          <div className="flex items-center mb-8">
            <Link href="/admin/invoices" className="mr-4">
              <button className="flex items-center text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Invoices</span>
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Migrate Invoices to Database</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Migration Information</h2>
            <p className="text-gray-300 mb-4">
              This tool will migrate your invoices from browser localStorage to the database. This provides several
              benefits:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Your invoices will be accessible from any device</li>
              <li>Data will persist even if you clear your browser cache</li>
              <li>Better data security and backup options</li>
              <li>Improved performance for large numbers of invoices</li>
            </ul>

            <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <HardDrive className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-medium">Local Storage</h3>
                  <p className="text-sm text-gray-300">
                    {localInvoices.length} invoice{localInvoices.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Current storage method</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="font-medium">Database</h3>
                  <p className="text-sm text-gray-300">Persistent, secure storage</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Target storage method</p>
              </div>
            </div>
          </div>

          {/* Debug Panel Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-900/70 text-white rounded-lg transition-colors"
            >
              <Bug className="h-4 w-4" />
              <span>{showDebugPanel ? "Hide" : "Show"} Debug Panel</span>
              {showDebugPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Debug Panel */}
          {showDebugPanel && (
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-300">Debug Information</h2>
                <div className="flex gap-2">
                  <button
                    onClick={downloadDebugLog}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-md text-sm"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowRawInvoices(!showRawInvoices)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    {showRawInvoices ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showRawInvoices ? "Hide" : "Show"} Raw Data</span>
                  </button>
                </div>
              </div>

              {/* Raw Invoice Data */}
              {showRawInvoices && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-purple-200 mb-2">Raw Invoice Data</h3>
                  <div className="bg-black/50 p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(localInvoices, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(localInvoices, null, 2))}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
                    >
                      <Clipboard className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Debug Log */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection("debugLog")}
                >
                  <h3 className="text-lg font-medium text-purple-200">Debug Log ({debugLog.length} entries)</h3>
                  {expandedSections.debugLog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>

                {expandedSections.debugLog && (
                  <div className="mt-2 bg-black/50 p-4 rounded-md overflow-auto max-h-60">
                    {debugLog.length > 0 ? (
                      <ul className="text-xs text-gray-300 space-y-1">
                        {debugLog.map((log, index) => (
                          <li key={index} className="border-b border-gray-800 pb-1">
                            {log}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No debug logs available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Migration Results Details */}
              {migrationResults && (
                <>
                  {/* Customers Details */}
                  <div className="mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("customers")}
                    >
                      <h3 className="text-lg font-medium text-purple-200">
                        Customers ({migrationResults.customers.success} success, {migrationResults.customers.error}{" "}
                        errors)
                      </h3>
                      {expandedSections.customers ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>

                    {expandedSections.customers && migrationResults.customers.details && (
                      <div className="mt-2 bg-black/50 p-4 rounded-md overflow-auto max-h-60">
                        {migrationResults.customers.details.length > 0 ? (
                          <ul className="text-xs text-gray-300 space-y-2">
                            {migrationResults.customers.details.map((detail: any, index: number) => (
                              <li
                                key={index}
                                className={`p-2 rounded ${detail.error ? "bg-red-900/30" : "bg-green-900/30"}`}
                              >
                                {detail.error ? (
                                  <>
                                    <span className="text-red-400 font-medium">Error: </span>
                                    <span>{detail.error}</span>
                                    {detail.customer && (
                                      <div className="mt-1 text-gray-400">
                                        <span>Customer data: </span>
                                        <span>{detail.customer}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-green-400 font-medium">Success: </span>
                                    <span>
                                      ID: {detail.id}, Email: {detail.email}
                                    </span>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No customer details available</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Invoices Details */}
                  <div className="mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("invoices")}
                    >
                      <h3 className="text-lg font-medium text-purple-200">
                        Invoices ({migrationResults.invoices.success} success, {migrationResults.invoices.error} errors)
                      </h3>
                      {expandedSections.invoices ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>

                    {expandedSections.invoices && migrationResults.invoices.details && (
                      <div className="mt-2 bg-black/50 p-4 rounded-md overflow-auto max-h-60">
                        {migrationResults.invoices.details.length > 0 ? (
                          <ul className="text-xs text-gray-300 space-y-2">
                            {migrationResults.invoices.details.map((detail: any, index: number) => (
                              <li
                                key={index}
                                className={`p-2 rounded ${detail.error ? "bg-red-900/30" : "bg-green-900/30"}`}
                              >
                                {detail.error ? (
                                  <>
                                    <span className="text-red-400 font-medium">Error: </span>
                                    <span>{detail.error}</span>
                                    {detail.invoice && (
                                      <div className="mt-1 text-gray-400">
                                        <span>Invoice data: </span>
                                        <span>{detail.invoice}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-green-400 font-medium">Success: </span>
                                    <span>
                                      ID: {detail.id}, Invoice #: {detail.invoice_number}
                                    </span>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No invoice details available</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Items Details */}
                  <div className="mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("items")}
                    >
                      <h3 className="text-lg font-medium text-purple-200">
                        Invoice Items ({migrationResults.items.success} success, {migrationResults.items.error} errors)
                      </h3>
                      {expandedSections.items ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>

                    {expandedSections.items && migrationResults.items.details && (
                      <div className="mt-2 bg-black/50 p-4 rounded-md overflow-auto max-h-60">
                        {migrationResults.items.details.length > 0 ? (
                          <ul className="text-xs text-gray-300 space-y-2">
                            {migrationResults.items.details.map((detail: any, index: number) => (
                              <li
                                key={index}
                                className={`p-2 rounded ${detail.error ? "bg-red-900/30" : "bg-green-900/30"}`}
                              >
                                {detail.error ? (
                                  <>
                                    <span className="text-red-400 font-medium">Error: </span>
                                    <span>{detail.error}</span>
                                    {detail.item && (
                                      <div className="mt-1 text-gray-400">
                                        <span>Item data: </span>
                                        <span>{detail.item}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-green-400 font-medium">Success: </span>
                                    <span>
                                      ID: {detail.id}, Invoice ID: {detail.invoice_id}
                                    </span>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No item details available</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {migrationResults ? (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-semibold">Migration Complete</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Customers</h3>
                  <p className="text-2xl font-bold text-green-400">{migrationResults.customers.success} migrated</p>
                  {migrationResults.customers.error > 0 && (
                    <p className="text-sm text-red-400 mt-1">{migrationResults.customers.error} failed</p>
                  )}
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Invoices</h3>
                  <p className="text-2xl font-bold text-green-400">{migrationResults.invoices.success} migrated</p>
                  {migrationResults.invoices.error > 0 && (
                    <p className="text-sm text-red-400 mt-1">{migrationResults.invoices.error} failed</p>
                  )}
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Invoice Items</h3>
                  <p className="text-2xl font-bold text-green-400">{migrationResults.items.success} migrated</p>
                  {migrationResults.items.error > 0 && (
                    <p className="text-sm text-red-400 mt-1">{migrationResults.items.error} failed</p>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                Your invoices have been successfully migrated to the database. You can now access them from any device.
              </p>

              <div className="flex gap-4">
                <Link href="/admin/invoices">
                  <button className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-lg transition-colors">
                    Return to Invoices
                  </button>
                </Link>
                <button
                  onClick={clearLocalStorage}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear Local Storage
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Start Migration</h2>
              <p className="text-gray-300 mb-6">
                Click the button below to start migrating your invoices from localStorage to the database. This process
                may take a few moments depending on how many invoices you have.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={migrateInvoices}
                  disabled={isMigrating || localInvoices.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isMigrating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Migrating...</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      <span>Migrate to Database</span>
                    </>
                  )}
                </button>
                <Link href="/admin/invoices">
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
