"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Download, Mail } from "lucide-react"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  discount_percentage: number
  discount_amount: number
  original_amount: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

interface Quote {
  id: string
  quote_number: string
  project_name: string
  issue_date: string
  due_date: string
  subtotal: number
  discount_amount: number
  total_amount: number
  status: string
  notes?: string
  terms?: string
  customer?: Customer
  items?: QuoteItem[]
}

export default function QuoteViewPage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params.id as string

  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  useEffect(() => {
    loadQuote()
  }, [quoteId])

  const loadQuote = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/quotes?id=${quoteId}`)
      const data = await response.json()

      if (data.success) {
        setQuote(data.quote)
      } else {
        setError(data.error || "Failed to load quote")
      }
    } catch (err) {
      setError("Failed to load quote")
      console.error("Error loading quote:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quote?")) return

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: quoteId }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/quotes")
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
        return "bg-gray-500"
      case "sent":
        return "bg-blue-500"
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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

  const sendQuoteEmail = async () => {
    if (!quote) return

    try {
      setIsEmailSending(true)

      if (!quote.customer?.email) {
        alert("Customer email is required to send the quote")
        return
      }

      // Generate email content
      const emailContent = await generateEmailContent(quote)

      // Show sending notification
      alert(`Sending quote ${quote.quote_number} to ${quote.customer.email}...`)

      // Send email with quote
      const response = await fetch("/api/admin/quotes/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId: quoteId,
          emailContent: emailContent,
          subject: `Quote ${quote.quote_number} from WebFuZsion`,
          recipientEmail: quote.customer.email,
        }),
      })

      if (response.ok) {
        // Update the quote status to "sent" if it was "draft"
        if (quote.status === "draft") {
          updateQuoteStatus("sent")
        }
        alert(`Email for quote ${quote.quote_number} has been sent to ${quote.customer.email}.`)
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
      name: quote.customer?.name || "No Name Provided",
      email: quote.customer?.email || "No Email Provided",
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

  const downloadQuotePdf = async () => {
    if (!quote) return

    try {
      setIsPdfLoading(true)

      // Extract customer data with fallbacks
      const customerData = {
        name: quote.customer?.name || "No Name Provided",
        email: quote.customer?.email || "No Email Provided",
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

  const updateQuoteStatus = async (newStatus: "draft" | "sent" | "accepted" | "rejected") => {
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: quoteId,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQuote(quote ? { ...quote, status: newStatus } : null)
      } else {
        console.error("Failed to update quote status:", data.error)
      }
    } catch (err) {
      console.error("Error updating quote status:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading quote...</div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error || "Quote not found"}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/quotes")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
          <h1 className="text-3xl font-bold">Quote: {quote.quote_number}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => sendQuoteEmail()}
            disabled={isEmailSending}
          >
            <Mail className={`w-4 h-4 mr-2 ${isEmailSending ? "animate-pulse" : ""}`} />
            {isEmailSending ? "Sending..." : "Send Email"}
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadQuotePdf()}
            disabled={isPdfLoading}
          >
            <Download className={`w-4 h-4 mr-2 ${isPdfLoading ? "animate-pulse" : ""}`} />
            {isPdfLoading ? "Generating..." : "Download PDF"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/quotes/${quoteId}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Quote Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{quote.quote_number}</CardTitle>
                <p className="text-gray-600 mt-2">{quote.project_name}</p>
              </div>
              <Badge className={`${getStatusColor(quote.status)} text-white`}>
                {quote.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Quote Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Issue Date:</span> {formatDate(quote.issue_date)}</p>
                  <p><span className="font-medium">Due Date:</span> {formatDate(quote.due_date)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {quote.customer?.name || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {quote.customer?.email || "N/A"}</p>
                  <p><span className="font-medium">Phone:</span> {quote.customer?.phone || "N/A"}</p>
                  {quote.customer?.address && (
                    <p><span className="font-medium">Address:</span> {quote.customer.address}</p>
                  )}
                  {(quote.customer?.city || quote.customer?.postal_code) && (
                    <p><span className="font-medium">Location:</span> {quote.customer.city} {quote.customer.postal_code}</p>
                  )}
                  {quote.customer?.country && (
                    <p><span className="font-medium">Country:</span> {quote.customer.country}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quote.items && quote.items.length > 0 ? (
                <>
                  <div className="grid grid-cols-6 gap-4 font-semibold text-sm border-b pb-2">
                    <div>Description</div>
                    <div>Qty</div>
                    <div>Unit Price</div>
                    <div>Discount</div>
                    <div>Amount</div>
                  </div>
                  {quote.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-6 gap-4 text-sm border-b pb-2">
                      <div>{item.description}</div>
                      <div>{item.quantity}</div>
                      <div>{formatCurrency(item.unit_price)}</div>
                      <div>{item.discount_percentage}%</div>
                      <div>{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500">No items found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatCurrency(quote.discount_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(quote.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        {(quote.notes || quote.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quote.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{quote.notes}</p>
                </CardContent>
              </Card>
            )}
            {quote.terms && (
              <Card>
                <CardHeader>
                  <CardTitle>Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{quote.terms}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 