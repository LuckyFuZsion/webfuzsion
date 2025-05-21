"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import { Search, Mail, User, RefreshCw, AlertCircle, Download, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import Link from "next/link"

// Define types
type EmailLog = {
  id: number
  invoice_id: string
  recipient: string
  cc: string
  subject: string
  content: string
  sent_at: string
  status: string
  error_message?: string
  created_at: string
}

export default function EmailLogsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [detailView, setDetailView] = useState<EmailLog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check authentication and load email logs
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          fetchEmailLogs()
        }
      } catch (err) {
        console.error("Authentication check error:", err)
        setError("Failed to check authentication")
        setTimeout(() => {
          router.push("/admin/login")
        }, 1000)
      }
    }

    checkAuth()
  }, [router, page, limit])

  const fetchEmailLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const offset = (page - 1) * limit
      const response = await fetch(`/api/admin/invoices/email-log?limit=${limit}&offset=${offset}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch email logs: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setLogs(data.data || [])
        setTotalLogs(data.total || 0)
      } else {
        throw new Error(data.error || "Failed to fetch email logs")
      }
    } catch (err) {
      console.error("Error fetching email logs:", err)
      setError(`Error: ${err instanceof Error ? err.message : "Failed to load email logs"}`)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const refreshLogs = () => {
    setIsRefreshing(true)
    fetchEmailLogs()
  }

  const exportCsv = () => {
    if (logs.length === 0) return

    // Create CSV content
    const csvHeader = ["ID", "Invoice ID", "Recipient", "CC", "Subject", "Status", "Sent At", "Created At"]
    const csvContent = logs.map((log) => [
      log.id,
      log.invoice_id,
      log.recipient,
      log.cc || "",
      log.subject,
      log.status,
      new Date(log.sent_at).toLocaleString(),
      new Date(log.created_at).toLocaleString(),
    ])

    // Combine header and content
    const csv = [
      csvHeader.join(","),
      ...csvContent.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `email-logs-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(totalLogs / limit)

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <AdminHeader />

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Email Logs</h1>
            <Link href="/admin/invoices">
              <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                <FileText className="h-4 w-4" />
                <span>Back to Invoices</span>
              </button>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">{error}</div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row items-center w-full gap-2">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by recipient, subject..."
                  className="w-full pl-10 pr-4 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={refreshLogs}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={exportCsv}
                className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Email Logs Found</h2>
              <p className="text-gray-400">
                When you send invoices via email, they will be logged here for audit purposes.
              </p>
            </div>
          ) : (
            <>
              {detailView ? (
                <div className="bg-gray-800/80 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Email Details</h2>
                    <button onClick={() => setDetailView(null)} className="text-gray-400 hover:text-white">
                      &times; Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Invoice ID</p>
                      <p className="font-medium">{detailView.invoice_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Sent At</p>
                      <p className="font-medium">{formatDate(detailView.sent_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recipient</p>
                      <p className="font-medium">{detailView.recipient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">CC</p>
                      <p className="font-medium">{detailView.cc || "-"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-400">Subject</p>
                      <p className="font-medium">{detailView.subject}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Email Content</p>
                    <div className="bg-gray-900/80 border border-white/10 rounded-lg p-4 max-h-96 overflow-y-auto text-white">
                      <div dangerouslySetInnerHTML={{ __html: detailView.content }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Invoice ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Recipient</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Sent At</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-sm">{log.id}</td>
                          <td className="px-4 py-3 text-sm">{log.invoice_id}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-gray-400" />
                              {log.recipient}
                            </div>
                            {log.cc && <div className="text-xs text-gray-400 mt-1">CC: {log.cc}</div>}
                          </td>
                          <td className="px-4 py-3 text-sm">{log.subject}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                log.status === "sent"
                                  ? "bg-green-700 text-white"
                                  : log.status === "failed"
                                    ? "bg-red-700 text-white"
                                    : "bg-gray-700 text-white"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{formatDate(log.sent_at)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => setDetailView(log)}
                              className="text-brand-blue hover:text-brand-blue/80"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-400">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalLogs)} of {totalLogs} entries
                  </div>
                  <div className="flex space-x-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex items-center justify-center w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="flex items-center justify-center px-3 h-8 rounded bg-gray-700">
                      {page} / {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="flex items-center justify-center w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-8 p-4 bg-brand-purple/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">About Email Logs</h3>
                <p className="text-gray-300 text-sm mt-1">
                  This page shows all emails sent through the invoice system. Each log includes the recipient, subject,
                  and sent time. Email logs are stored in your database for audit purposes, even if they don't appear in
                  your email provider's "Sent" folder.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  <strong>Note:</strong> All invoice emails are automatically CC'd to steve@luckyfuzsion.com for your
                  records.
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
