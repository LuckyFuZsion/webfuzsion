"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Trash2, 
  Edit, 
  Plus, 
  Eye, 
  Mail, 
  Download, 
  Search, 
  Filter,
  ChevronDown,
  FileText,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdminHeader from "@/app/admin/components/admin-header"

interface Quote {
  id: string
  quote_number: string
  project_name: string
  customer_name: string
  customer_email: string
  issue_date: string
  due_date: string
  total_amount: number
  status: "draft" | "sent" | "accepted" | "rejected"
  subtotal?: number
  discount_amount?: number
  notes?: string
  terms?: string
  customer?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    country?: string
  }
  items?: any[]
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadQuotes()
  }, [])

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown="status"]')) {
        setStatusDropdownOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/quotes")
      const data = await response.json()

      if (data.success) {
        setQuotes(data.quotes || [])
      } else {
        setError(data.error || "Failed to load quotes")
      }
    } catch (err) {
      setError("Failed to load quotes")
      console.error("Error loading quotes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (data.success) {
        setQuotes(quotes.filter((quote) => quote.id !== id))
      } else {
        alert("Failed to delete quote: " + data.error)
      }
    } catch (err) {
      alert("Failed to delete quote")
      console.error("Error deleting quote:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-500 text-white"
      case "sent":
        return "bg-blue-500 text-white"
      case "accepted":
        return "bg-green-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return <Edit className="h-3 w-3" />
      case "sent":
        return <Send className="h-3 w-3" />
      case "accepted":
        return <CheckCircle className="h-3 w-3" />
      case "rejected":
        return <XCircle className="h-3 w-3" />
      default:
        return <Edit className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const sendQuoteEmail = async (id: string, quoteNumber: string) => {
    try {
      setIsEmailSending(true)

      const quote = quotes.find((q) => q.id === id)

      if (!quote) {
        alert("Quote not found")
        return
      }

      if (!quote.customer_email) {
        alert("Customer email is required to send the quote")
        return
      }

      // Generate email content
      const emailContent = await generateEmailContent(quote)

      // Show sending notification
      alert(`Sending quote ${quoteNumber} to ${quote.customer_email}...`)

      // Send email with quote
      const response = await fetch("/api/admin/quotes/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId: id,
          emailContent: emailContent,
          subject: `Quote ${quoteNumber} from WebFuZsion`,
          recipientEmail: quote.customer_email,
        }),
      })

      if (response.ok) {
        // Update the quote status to "sent" if it was "draft"
        if (quote.status === "draft") {
          updateQuoteStatus(quote.id, "sent")
        }
        alert(`Email for quote ${quoteNumber} has been sent to ${quote.customer_email}.`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsEmailSending(false)
    }
  }

  const generateEmailContent = async (quote: Quote) => {
    // Create HTML email content with quote details
    const customerData = {
      name: quote.customer_name,
      email: quote.customer_email || "",
      phone: quote.customer?.phone || "",
      address: quote.customer?.address || "",
      city: quote.customer?.city || "",
      postal_code: quote.customer?.postal_code || "",
      country: quote.customer?.country || "United Kingdom",
    }

    const quoteItems = quote.items || []

    // Generate HTML email content
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h2>WebFuZsion</h2>
          <p>Grantham, UK<br />steve@webfuzsion.co.uk</p>
        </div>
        <div style="text-align: right;">
          <h1>QUOTE</h1>
          <p><strong>Quote #:</strong> ${quote.quote_number}</p>
          <p><strong>Date:</strong> ${quote.issue_date}</p>
          <p><strong>Due Date:</strong> ${quote.due_date}</p>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3>Bill To:</h3>
          <p>${customerData.name}<br />
          ${customerData.email}<br />
          ${customerData.phone || ""}<br />
          ${customerData.address || ""}<br />
          ${customerData.city || ""} ${customerData.postal_code || ""}<br />
          ${customerData.country || ""}</p>
        </div>
        <div>
          <h3>Project:</h3>
          <p>${quote.project_name}</p>
          <p><strong>Status:</strong> ${quote.status}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Description</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${quoteItems
            .map(
              (item: any) => `
            <tr>
              <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.description}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">£${Number(item.unit_price).toFixed(2)}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">£${Number(item.amount).toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div style="margin-left: auto; width: 300px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Subtotal:</span>
          <span>£${Number(quote.subtotal || quote.total_amount).toFixed(2)}</span>
        </div>
        ${
          Number(quote.discount_amount || 0) > 0
            ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Discount:</span>
            <span>-£${Number(quote.discount_amount).toFixed(2)}</span>
          </div>
        `
            : ""
        }
        <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">
          <span>Total:</span>
          <span>£${Number(quote.total_amount).toFixed(2)}</span>
        </div>
      </div>
      
      ${
        quote.notes
          ? `
        <div style="background-color: #f9f9f9; padding: 15px; margin-top: 30px;">
          <h3>Notes</h3>
          <p>${quote.notes}</p>
        </div>
      `
          : ""
      }
      
      ${
        quote.terms
          ? `
        <div style="background-color: #f9f9f9; padding: 15px; margin-top: 30px;">
          <h3>Terms & Conditions</h3>
          <p>${quote.terms}</p>
        </div>
      `
          : ""
      }
      
      <div style="text-align: center; margin-top: 50px; color: #666; font-size: 12px;">
        <p>Thank you for considering WebFuZsion for your project!</p>
        <p>This quote is valid for 30 days from the date of issue.</p>
        <p>Please make payment to: Steven Platts • Sort Code: 110333 • Account: 00577966</p>
      </div>
    </div>
    `
    return emailContent
  }

  const downloadQuotePdf = async (id: string, quoteNumber: string) => {
    try {
      setIsPdfLoading(true)

      const quote = quotes.find((q) => q.id === id)

      if (!quote) {
        alert("Quote not found")
        return
      }

      // Extract customer data with fallbacks
      const customerData = {
        name: quote.customer_name || "No Name Provided",
        email: quote.customer_email || "No Email Provided",
        phone: quote.customer?.phone || "",
        address: quote.customer?.address || "",
        city: quote.customer?.city || "",
        postal_code: quote.customer?.postal_code || "",
        country: quote.customer?.country || "United Kingdom",
      }

      // Get quote items
      const quoteItems = quote.items || []

      // Generate PDF on the client side
      if (quoteItems.length === 0) {
        // If no items found, create a sample item
        quoteItems.push({
          description: "Service",
          quantity: 1,
          unit_price: quote.total_amount,
          amount: quote.total_amount,
        })
      }

      // Prepare quote data for PDF generation
      const quoteData = {
        ...quote,
        subtotal: quote.subtotal || quote.total_amount,
        discount_amount: quote.discount_amount || 0,
        notes: quote.notes || "",
        terms:
          quote.terms ||
          "This quote is valid for 30 days from the date of issue. Payment is due within 14 days of quote acceptance.",
      }

      // Use the quote PDF generator
      const { generateQuotePdf } = await import("@/lib/generate-quote-pdf")
      generateQuotePdf(quoteData, customerData, quoteItems)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsPdfLoading(false)
    }
  }

  const updateQuoteStatus = async (id: string, newStatus: "draft" | "sent" | "accepted" | "rejected") => {
    try {
      setStatusUpdateLoading(id)
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQuotes(quotes.map((quote) => (quote.id === id ? { ...quote, status: newStatus } : quote)))
      } else {
        console.error("Failed to update quote status:", data.error)
      }
    } catch (err) {
      console.error("Error updating quote status:", err)
    } finally {
      setStatusUpdateLoading(null)
      setStatusDropdownOpen(null)
    }
  }

  const toggleStatusDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStatusDropdownOpen(statusDropdownOpen === id ? null : id)
  }

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.customer_email && quote.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <AdminHeader />

          <div className="flex justify-between items-center mb-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Quote Management</h1>
              <p className="text-gray-400">Manage your quotes and track their status</p>
            </div>
            <Button onClick={() => router.push("/admin/quotes/new")}>
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quotes Table */}
          {filteredQuotes.length > 0 ? (
            <>
              {/* Mobile view - card layout */}
              <div className="md:hidden space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <button 
                          onClick={() => router.push(`/admin/quotes/${quote.id}`)}
                          className="text-brand-blue hover:underline font-semibold"
                        >
                          {quote.quote_number}
                        </button>
                        <p className="text-sm text-gray-400">{quote.project_name}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => toggleStatusDropdown(quote.id, e)}
                          className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}
                          disabled={statusUpdateLoading === quote.id}
                          data-dropdown="status"
                        >
                          {statusUpdateLoading === quote.id ? (
                            <div className="flex items-center">
                              <span className="inline-block h-3 w-3 mr-1 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <>
                              {getStatusIcon(quote.status)}
                              <span>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</span>
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </button>

                        {statusDropdownOpen === quote.id && (
                          <div className="absolute z-50 mt-1 w-36 bg-white rounded-md shadow-lg" style={{ zIndex: 9999 }}>
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateQuoteStatus(quote.id, "draft")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                Draft
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateQuoteStatus(quote.id, "sent")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Send className="h-4 w-4 mr-2 text-blue-500" />
                                Sent
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateQuoteStatus(quote.id, "accepted")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Accepted
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateQuoteStatus(quote.id, "rejected")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Rejected
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Customer:</span>
                        <p className="font-medium">{quote.customer_name}</p>
                        {quote.customer_email && (
                          <p className="text-xs text-gray-400">{quote.customer_email}</p>
                        )}
                        {quote.customer_phone && (
                          <p className="text-xs text-gray-400">{quote.customer_phone}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-400">Amount:</span>
                        <p>{formatCurrency(quote.total_amount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Issue Date:</span>
                        <p>{formatDate(quote.issue_date)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Due Date:</span>
                        <p>{formatDate(quote.due_date)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          title="View Quote"
                          className="text-gray-400 hover:text-white transition-colors"
                          onClick={() => router.push(`/admin/quotes/${quote.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          title="Send Email"
                          className="text-gray-400 hover:text-white transition-colors"
                          onClick={() => sendQuoteEmail(quote.id, quote.quote_number)}
                          disabled={isEmailSending}
                        >
                          <Mail className={`h-4 w-4 ${isEmailSending ? "animate-pulse" : ""}`} />
                        </button>
                        <button
                          title="Download PDF"
                          className="text-gray-400 hover:text-white transition-colors"
                          onClick={() => downloadQuotePdf(quote.id, quote.quote_number)}
                          disabled={isPdfLoading}
                        >
                          <Download className={`h-4 w-4 ${isPdfLoading ? "animate-pulse" : ""}`} />
                        </button>
                        <button
                          title="Edit Quote"
                          className="text-gray-400 hover:text-white transition-colors"
                          onClick={() => router.push(`/admin/quotes/${quote.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete Quote"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDelete(quote.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredQuotes.length === 0 && (
                  <div className="bg-white/5 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No quotes found. Create your first quote!</p>
                  </div>
                )}
              </div>

              {/* Desktop view - table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Quote #</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Issue Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Notes/Terms</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map((quote) => (
                      <tr key={quote.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-sm">
                          <button onClick={() => router.push(`/admin/quotes/${quote.id}`)} className="text-brand-blue hover:underline">
                            {quote.quote_number}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm">{quote.project_name}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{quote.customer_name}</div>
                            {quote.customer_email && (
                              <div className="text-xs text-gray-400">{quote.customer_email}</div>
                            )}
                            {quote.customer_phone && (
                              <div className="text-xs text-gray-400">{quote.customer_phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(quote.issue_date)}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(quote.due_date)}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(quote.total_amount)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={(e) => toggleStatusDropdown(quote.id, e)}
                              className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}
                              disabled={statusUpdateLoading === quote.id}
                              data-dropdown="status"
                            >
                              {statusUpdateLoading === quote.id ? (
                                <div className="flex items-center">
                                  <span className="inline-block h-3 w-3 mr-1 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                <>
                                  {getStatusIcon(quote.status)}
                                  <span>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</span>
                                  <ChevronDown className="h-3 w-3 ml-1" />
                                </>
                              )}
                            </button>

                            {statusDropdownOpen === quote.id && (
                              <div className="absolute z-50 mt-1 w-36 bg-white rounded-md shadow-lg" style={{ zIndex: 9999 }}>
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      updateQuoteStatus(quote.id, "draft")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                    Draft
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      updateQuoteStatus(quote.id, "sent")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <Send className="h-4 w-4 mr-2 text-blue-500" />
                                    Sent
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      updateQuoteStatus(quote.id, "accepted")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Accepted
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      updateQuoteStatus(quote.id, "rejected")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Rejected
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {(quote.notes || quote.terms) && (
                            <div className="flex flex-wrap gap-1">
                              {quote.notes && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                  Notes
                                </span>
                              )}
                              {quote.terms && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                                  Terms
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              title="View Quote"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => router.push(`/admin/quotes/${quote.id}`)}
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              title="Send Email"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => sendQuoteEmail(quote.id, quote.quote_number)}
                              disabled={isEmailSending}
                            >
                              <Mail className={`h-4 w-4 ${isEmailSending ? "animate-pulse" : ""}`} />
                            </button>
                            <button
                              title="Download PDF"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => downloadQuotePdf(quote.id, quote.quote_number)}
                              disabled={isPdfLoading}
                            >
                              <Download className={`h-4 w-4 ${isPdfLoading ? "animate-pulse" : ""}`} />
                            </button>
                            <button
                              title="Edit Quote"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => router.push(`/admin/quotes/${quote.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              title="Delete Quote"
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => handleDelete(quote.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredQuotes.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                          No quotes found. Create your first quote!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No quotes found. Create your first quote!</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-brand-purple/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">About the Quote System</h3>
                <p className="text-gray-300 text-sm mt-1">
                  This quote system uses a database to store your quote data. Your data is stored securely in the database
                  and will persist between sessions. The system automatically syncs with the database to ensure your data
                  is always up to date.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  <strong>Email Feature:</strong> The system is configured to send emails using the SMTP settings from
                  your environment variables. When sending a quote, the system will use the customer's email address
                  from the quote details.
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