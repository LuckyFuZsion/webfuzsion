"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../components/admin-header"
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Mail,
  Download,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  Database,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import "../../../app/admin/invoices/invoice-mobile.css"

// Dynamically import the PDF viewer to avoid SSR issues
const InvoicePDFViewer = dynamic(() => import("@/components/invoice-pdf-viewer"), {
  ssr: false,
})

// Define types
type Invoice = {
  id: string
  invoice_number: string
  project_name: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  customer_city?: string
  customer_postal_code?: string
  customer_country?: string
  issue_date: string
  due_date: string
  total_amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  subtotal?: number
  discount_amount?: number
  notes?: string
  terms?: string
  items?: any[]
  updated_at?: string
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
}

type Customer = {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

export default function InvoicesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [previewInvoice, setPreviewInvoice] = useState<any>(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)
  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [isSyncingWithDb, setIsSyncingWithDb] = useState(false)

  // Check if invoice system is set up
  const checkInvoiceSetup = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/check-invoice-setup")
      const data = await response.json()

      if (response.ok && data.success) {
        setSetupComplete(true)
        // Load invoices from localStorage
        loadInvoicesFromLocalStorage()
      } else {
        setSetupComplete(false)
        setSetupError(data.error || "Failed to check invoice setup")
      }
    } catch (err) {
      console.error("Error checking invoice setup:", err)
      setSetupError("Failed to check if invoice system is set up")
      setSetupComplete(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up invoice system
  const setupInvoiceSystem = async () => {
    try {
      setIsLoading(true)
      setSetupError(null)

      const response = await fetch("/api/admin/setup-invoice-tables", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSetupComplete(true)
        // Initialize empty invoices array in localStorage if it doesn't exist
        if (typeof window !== "undefined" && !localStorage.getItem("invoices")) {
          localStorage.setItem("invoices", JSON.stringify([]))
        }
        loadInvoicesFromLocalStorage()
      } else {
        setSetupError(data.error || "Failed to set up invoice system")
        console.error("Setup failed:", data)
      }
    } catch (err) {
      console.error("Error setting up invoice system:", err)
      setSetupError(`Setup failed: ${err instanceof Error ? err.message : "500"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Load invoices from localStorage
  const loadInvoicesFromLocalStorage = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const storedInvoices = localStorage.getItem("invoices")
        if (storedInvoices) {
          const parsedInvoices = JSON.parse(storedInvoices)
          if (Array.isArray(parsedInvoices)) {
            setInvoices(parsedInvoices)
            console.log("Invoices loaded from localStorage:", parsedInvoices.length)
          }
        } else {
          // Initialize empty invoices array
          localStorage.setItem("invoices", JSON.stringify([]))
          setInvoices([])
        }
      }
    } catch (error) {
      console.error("Error loading invoices from localStorage:", error)
    }
  }, [])

  // Sync invoices from database
  const syncInvoicesFromDatabase = async () => {
    try {
      setIsSyncingWithDb(true)
      console.log("Syncing invoices from database...")

      const response = await fetch("/api/admin/invoices/sync-from-db")

      if (!response.ok) {
        throw new Error(`Failed to sync invoices: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.invoices)) {
        // Update localStorage with the fetched invoices
        localStorage.setItem("invoices", JSON.stringify(data.invoices))

        // Update state
        setInvoices(data.invoices)

        alert(`Successfully synced ${data.invoices.length} invoices from the database.`)
        console.log(`Synced ${data.invoices.length} invoices from database`)
      } else {
        throw new Error(data.error || "Failed to sync invoices from database")
      }
    } catch (error) {
      console.error("Error syncing invoices from database:", error)
      alert(`Error syncing invoices: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSyncingWithDb(false)
    }
  }

  // Check authentication and invoice setup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")

        if (!res.ok) {
          console.log("Authentication failed, redirecting to login")
          router.push("/admin/login")
          setIsAuthenticated(false)
        } else {
          console.log("Authentication successful")
          setIsAuthenticated(true)
          // Check if invoice system is set up
          checkInvoiceSetup()
        }
      } catch (err) {
        console.error("Authentication check error:", err)
        setError("Failed to check authentication")
        // Don't redirect immediately to avoid redirect loops
        setTimeout(() => {
          router.push("/admin/login")
        }, 1000)
      }
    }

    checkAuth()
  }, [router, checkInvoiceSetup])

  // Add body class when dropdown is open
  useEffect(() => {
    if (statusDropdownOpen !== null || actionDropdownOpen !== null) {
      document.body.classList.add("dropdown-open")
    } else {
      document.body.classList.remove("dropdown-open")
    }

    return () => {
      document.body.classList.remove("dropdown-open")
    }
  }, [statusDropdownOpen, actionDropdownOpen])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown="status"]') && !target.closest('[data-dropdown="action"]')) {
        setStatusDropdownOpen(null)
        setActionDropdownOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Log invoices state updates
  useEffect(() => {
    console.log("Invoices state updated:", invoices.length)
  }, [invoices])

  const clearStoredInvoices = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("invoices")
        setInvoices([])
        alert("All stored invoices have been cleared.")
      }
    } catch (error) {
      console.error("Error clearing invoices:", error)
      alert("Failed to clear invoices. Please try again.")
    }
  }

  // Update the deleteInvoice function to better handle database deletion and add debugging

  const deleteInvoice = async (id: string, invoiceNumber: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      try {
        console.log(`Starting deletion of invoice ${id} (${invoiceNumber})`)

        // First delete from localStorage
        if (typeof window !== "undefined") {
          const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
          const updatedInvoices = storedInvoices.filter((invoice: Invoice) => invoice.id !== id)
          localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
          setInvoices(updatedInvoices)
          console.log(`Removed invoice ${id} from localStorage`)
        }

        // Then delete from database with improved error handling
        console.log(`Sending DELETE request to /api/admin/invoices?id=${id}`)

        const response = await fetch(`/api/admin/invoices?id=${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log(`DELETE request status: ${response.status}`)

        const data = await response.json()
        console.log("DELETE response data:", data)

        if (response.ok && data.success) {
          alert(`Invoice ${invoiceNumber} has been deleted from localStorage and database.`)
        } else {
          console.error("Database deletion failed:", data.error || response.statusText)
          alert(
            `Invoice deleted from localStorage but failed to delete from database: ${data.error || response.statusText}`,
          )
        }
      } catch (error) {
        console.error("Error deleting invoice:", error)
        alert(
          `Invoice deleted from localStorage but an error occurred with database deletion: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }
  }

  const viewInvoice = (id: string) => {
    try {
      if (typeof window !== "undefined") {
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
        const invoice = storedInvoices.find((inv: Invoice) => inv.id === id)

        if (invoice) {
          downloadInvoicePdf(id, invoice.invoice_number)
        } else {
          alert("Invoice not found")
        }
      }
    } catch (error) {
      console.error("Error viewing invoice:", error)
      alert("Failed to view invoice. Please try again.")
    }
  }

  // Update the sendInvoiceEmail function to include PDF generation and attachment

  const sendInvoiceEmail = async (id: string, invoiceNumber: string) => {
    try {
      setIsEmailSending(true)

      if (typeof window !== "undefined") {
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
        const invoice = storedInvoices.find((inv: Invoice) => inv.id === id)

        if (!invoice) {
          alert("Invoice not found")
          return
        }

        if (!invoice.customer_email) {
          alert("Customer email is required to send the invoice")
          return
        }

        // Generate PDF content
        const emailContent = await generatePdfContent(invoice)

        // Show sending notification
        alert(`Sending invoice ${invoiceNumber} to ${invoice.customer_email}...`)

        // Send email with invoice
        const response = await fetch("/api/admin/invoices/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: id,
            emailContent: emailContent,
            subject: `Invoice ${invoiceNumber} from WebFuZsion`,
            recipientEmail: invoice.customer_email,
          }),
        })

        if (response.ok) {
          // Update the invoice status to "sent" if it was "draft"
          if (invoice.status === "draft") {
            updateInvoiceStatus(invoice.id, "sent")
          }
          alert(`Email for invoice ${invoiceNumber} has been sent to ${invoice.customer_email}.`)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send email")
        }
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsEmailSending(false)
    }
  }

  const generatePdfContent = async (invoice: Invoice) => {
    // Create HTML email content with invoice details
    const customerData = {
      name: invoice.customer_name,
      email: invoice.customer_email || "",
      phone: invoice.customer_phone || "",
      address: invoice.customer_address || "",
      city: invoice.customer_city || "",
      postal_code: invoice.customer_postal_code || "",
      country: invoice.customer_country || "United Kingdom",
    }

    const invoiceItems = invoice.items || []

    // Generate HTML email content
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h2>WebFuZsion</h2>
          <p>Grantham, UK<br />steve@luckyfuzsion.com</p>
        </div>
        <div style="text-align: right;">
          <h1>INVOICE</h1>
          <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
          <p><strong>Date:</strong> ${invoice.issue_date}</p>
          <p><strong>Due Date:</strong> ${invoice.due_date}</p>
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
          <p>${invoice.project_name}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
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
          ${invoiceItems
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
          <span>£${Number(invoice.subtotal || invoice.total_amount).toFixed(2)}</span>
        </div>
        
        ${
          Number(invoice.discount_amount || 0) > 0
            ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Discount:</span>
            <span>-£${Number(invoice.discount_amount).toFixed(2)}</span>
          </div>
        `
            : ""
        }
        <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">
          <span>Total:</span>
          <span>£${Number(invoice.total_amount).toFixed(2)}</span>
        </div>
      </div>
      
      ${
        invoice.notes
          ? `
        <div style="background-color: #f9f9f9; padding: 15px; margin-top: 30px;">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }
      
      ${
        invoice.terms
          ? `
        <div style="background-color: #f9f9f9; padding: 15px; margin-top: 30px;">
          <h3>Terms & Conditions</h3>
          <p>${invoice.terms}</p>
        </div>
      `
          : ""
      }
      
      <div style="text-align: center; margin-top: 50px; color: #666; font-size: 12px;">
        <p>Thank you for your business!</p>
        <p>Payment is due within 14 days of issue.</p>
        <p>Please make payment to: Steven Platts • Sort Code: 110333 • Account: 00577966</p>
      </div>
    </div>
    `
    return emailContent
  }

  const downloadInvoicePdf = async (id: string, invoiceNumber: string) => {
    try {
      setIsPdfLoading(true)

      if (typeof window !== "undefined") {
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
        const invoice = storedInvoices.find((inv: Invoice) => inv.id === id)

        if (!invoice) {
          alert("Invoice not found")
          return
        }

        // Extract customer data with fallbacks
        const customerData: Customer = {
          name: invoice.customer_name || "No Name Provided",
          email: invoice.customer_email || "No Email Provided",
          phone: invoice.customer_phone || "",
          address: invoice.customer_address || "",
          city: invoice.customer_city || "",
          postal_code: invoice.customer_postal_code || "",
          country: invoice.customer_country || "United Kingdom",
        }

        // Get invoice items
        const invoiceItems = invoice.items || []

        // Generate PDF on the client side
        if (invoiceItems.length === 0) {
          // If no items found, create a sample item
          invoiceItems.push({
            description: "Service",
            quantity: 1,
            unit_price: invoice.total_amount,
            amount: invoice.total_amount,
          })
        }

        // Prepare invoice data for PDF generation
        const invoiceData = {
          ...invoice,
          subtotal: invoice.subtotal || invoice.total_amount,
          discount_amount: invoice.discount_amount || 0,
          notes: invoice.notes || "",
          terms:
            invoice.terms ||
            "Payment is due within 14 days of receipt of this invoice. Minor tweaks and ongoing support will be provided for 14 days after the invoice date at no additional cost. Any further support or adjustments will be chargeable at the agreed rate.",
        }

        // Use the clean PDF generator
        const { generateCleanPdf } = await import("@/lib/generate-clean-pdf")
        generateCleanPdf(invoiceData, customerData, invoiceItems)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsPdfLoading(false)
    }
  }

  // Fixed updateInvoiceStatus function to properly save status changes
  const updateInvoiceStatus = (id: string, newStatus: "draft" | "sent" | "paid" | "overdue" | "cancelled") => {
    console.log(`Starting status update for invoice ${id} to ${newStatus}`)
    setStatusUpdateLoading(id)

    try {
      if (typeof window !== "undefined") {
        // Get the current invoices from localStorage
        const storedInvoicesStr = localStorage.getItem("invoices")
        if (!storedInvoicesStr) {
          console.error("No invoices found in localStorage")
          return
        }

        // Parse the stored invoices
        const storedInvoices = JSON.parse(storedInvoicesStr)
        console.log(`Found ${storedInvoices.length} invoices in localStorage`)

        // Find the invoice to update
        const invoiceIndex = storedInvoices.findIndex((invoice: Invoice) => invoice.id === id)
        console.log(`Invoice index: ${invoiceIndex}`)

        if (invoiceIndex !== -1) {
          // Create a deep copy of the invoices array
          const updatedInvoices = JSON.parse(JSON.stringify(storedInvoices))

          // Log the current status
          console.log(`Current status: ${updatedInvoices[invoiceIndex].status}`)

          // Update the invoice status
          updatedInvoices[invoiceIndex].status = newStatus
          updatedInvoices[invoiceIndex].updated_at = new Date().toISOString()

          console.log(`Updated status to: ${updatedInvoices[invoiceIndex].status}`)

          // Make sure customer data is preserved
          const originalInvoice = storedInvoices.find((inv: Invoice) => inv.id === id)

          if (!updatedInvoices[invoiceIndex].customer_name && originalInvoice?.customer_name) {
            console.log("Restoring missing customer name from original invoice")
            updatedInvoices[invoiceIndex].customer_name = originalInvoice.customer_name
          }
          if (!updatedInvoices[invoiceIndex].customer_email && originalInvoice?.customer_email) {
            updatedInvoices[invoiceIndex].customer_email = originalInvoice.customer_email
          }

          // Save the updated invoices back to localStorage
          localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
          console.log("Saved updated invoices to localStorage")

          // Update the state to reflect the changes
          setInvoices(updatedInvoices)
          console.log("Updated invoices state")

          // Show a success message
          alert(`Invoice status updated to ${newStatus}`)
        } else {
          console.error(`Invoice with ID ${id} not found`)
          alert("Could not find the invoice to update. Please refresh the page and try again.")
        }
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
      alert("Failed to update invoice status. Please try again.")
    } finally {
      // Close the dropdown and clear the loading state after a small delay
      setTimeout(() => {
        setStatusDropdownOpen(null)
        setStatusUpdateLoading(null)
      }, 300)
    }
  }

  const toggleStatusDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStatusDropdownOpen(statusDropdownOpen === id ? null : id)
    setActionDropdownOpen(null)
  }

  const toggleActionDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActionDropdownOpen(actionDropdownOpen === id ? null : id)
    setStatusDropdownOpen(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800"
      case "sent":
        return "bg-blue-200 text-blue-800"
      case "paid":
        return "bg-green-200 text-green-800"
      case "overdue":
        return "bg-red-200 text-red-800"
      case "cancelled":
        return "bg-yellow-200 text-yellow-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="h-3 w-3 mr-1" />
      case "sent":
        return <Send className="h-3 w-3 mr-1" />
      case "paid":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "overdue":
        return <Clock className="h-3 w-3 mr-1" />
      case "cancelled":
        return <XCircle className="h-3 w-3 mr-1" />
      default:
        return <Edit className="h-3 w-3 mr-1" />
    }
  }

  // Add a new function to calculate outstanding amount after the getStatusIcon function
  const calculateOutstandingAmount = (invoices: Invoice[]) => {
    return invoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.total_amount, 0)
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Add a refresh function to reload invoices from localStorage
  const refreshInvoices = useCallback(() => {
    console.log("Refreshing invoices from localStorage")
    loadInvoicesFromLocalStorage()
  }, [loadInvoicesFromLocalStorage])

  if (isLoading) {
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

  // Sample data for demonstration
  const sampleInvoices: Invoice[] = [
    {
      id: "1",
      invoice_number: "INV-2023-001",
      project_name: "Website Redesign",
      customer_name: "Acme Corp",
      customer_email: "acme@example.com",
      customer_phone: "0123456789",
      customer_address: "123 Main St",
      customer_city: "London",
      customer_postal_code: "SW1A 0AA",
      customer_country: "United Kingdom",
      issue_date: "2023-05-01",
      due_date: "2023-05-15",
      total_amount: 1200.0,
      status: "paid",
    },
    {
      id: "2",
      invoice_number: "INV-2023-002",
      project_name: "E-commerce Integration",
      customer_name: "XYZ Ltd",
      customer_email: "xyz@example.com",
      customer_phone: "0987654321",
      customer_address: "456 Park Ave",
      customer_city: "New York",
      customer_postal_code: "10021",
      customer_country: "USA",
      issue_date: "2023-05-10",
      due_date: "2023-05-24",
      total_amount: 2500.0,
      status: "sent",
    },
    {
      id: "3",
      invoice_number: "INV-2023-003",
      project_name: "SEO Package",
      customer_name: "Local Business",
      customer_email: "local@example.com",
      customer_phone: "1122334455",
      customer_address: "789 Elm St",
      customer_city: "Los Angeles",
      customer_postal_code: "90001",
      customer_country: "USA",
      issue_date: "2023-05-15",
      due_date: "2023-05-29",
      total_amount: 750.0,
      status: "draft",
    },
  ]

  const displayInvoices = filteredInvoices.length > 0 ? filteredInvoices : invoices.length === 0 ? sampleInvoices : []

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <AdminHeader />

          <div className="flex justify-between items-center mb-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Invoice Management</h1>
              <p className="text-gray-300">Create, send, and manage your client invoices</p>
            </div>

            <Link href="/admin/email-logs">
              <button className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                <Mail className="h-4 w-4" />
                <span>View Email Logs</span>
              </button>
            </Link>
          </div>

          {setupError && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
              <p className="font-bold">Error:</p>
              <p>{setupError}</p>
              <button
                onClick={setupInvoiceSystem}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!setupComplete && !isLoading && (
            <div className="bg-amber-500/20 border border-amber-500/50 text-white p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2">Invoice System Setup Required</h2>
              <p className="mb-4">The invoice system needs to be set up before you can create and manage invoices.</p>
              <button
                onClick={setupInvoiceSystem}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
              >
                Set Up Invoice System
              </button>
            </div>
          )}

          {setupComplete && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col md:flex-row items-center w-full gap-2">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      className="w-full pl-10 pr-4 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="relative w-full md:w-auto">
                    <select
                      className="appearance-none w-full bg-brand-dark/50 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={refreshInvoices}
                    className="flex items-center justify-center gap-2 min-w-[120px] bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={syncInvoicesFromDatabase}
                    className="flex items-center justify-center gap-2 min-w-[120px] bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium"
                    disabled={isSyncingWithDb}
                  >
                    <Database className={`h-4 w-4 ${isSyncingWithDb ? "animate-pulse" : ""}`} />
                    <span>{isSyncingWithDb ? "Syncing..." : "Sync from DB"}</span>
                  </button>

                  <Link href="/admin/invoices/new" className="w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 min-w-[120px] bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium">
                      <PlusCircle className="h-4 w-4" />
                      <span>New Invoice</span>
                    </button>
                  </Link>

                  <button
                    onClick={clearStoredInvoices}
                    className="flex items-center justify-center gap-2 min-w-[120px] bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200 font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden md:inline">Clear Stored</span>
                    <span className="inline md:hidden">Clear All</span>
                  </button>
                </div>
              </div>

              {setupComplete && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-4">
                    <h3 className="text-amber-400 text-sm font-medium mb-1">Outstanding Amount</h3>
                    <p className="text-white text-2xl font-bold">£{calculateOutstandingAmount(invoices).toFixed(2)}</p>
                    <p className="text-amber-300/70 text-xs mt-1">
                      Total from {invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue").length}{" "}
                      unpaid invoices
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-400 text-sm font-medium mb-1">Sent Invoices</h3>
                    <p className="text-white text-2xl font-bold">
                      £
                      {invoices
                        .filter((inv) => inv.status === "sent")
                        .reduce((total, inv) => total + inv.total_amount, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-blue-300/70 text-xs mt-1">
                      {invoices.filter((inv) => inv.status === "sent").length} invoices awaiting payment
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-red-400 text-sm font-medium mb-1">Overdue Invoices</h3>
                    <p className="text-white text-2xl font-bold">
                      £
                      {invoices
                        .filter((inv) => inv.status === "overdue")
                        .reduce((total, inv) => total + inv.total_amount, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-red-300/70 text-xs mt-1">
                      {invoices.filter((inv) => inv.status === "overdue").length} invoices past due date
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile view - card layout */}
              <div className="md:hidden space-y-4">
                {displayInvoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <button
                          onClick={() => viewInvoice(invoice.id)}
                          className="text-brand-blue hover:underline font-medium"
                        >
                          {invoice.invoice_number}
                        </button>
                        <p className="text-sm text-gray-300">{invoice.project_name}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => toggleActionDropdown(invoice.id, e)}
                          className="p-2 hover:bg-white/10 rounded-full" // Increased padding for better touch target
                          data-dropdown="action"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {actionDropdownOpen === invoice.id && (
                          <div
                            className="absolute z-50 right-0 mt-1 w-48 bg-white rounded-md shadow-lg"
                            style={{ position: "fixed", zIndex: 9999 }}
                            onClick={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setActionDropdownOpen(null)
                                  viewInvoice(invoice.id)
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                View Invoice
                              </button>
                              <button
                                onClick={() => {
                                  setActionDropdownOpen(null)
                                  sendInvoiceEmail(invoice.id, invoice.invoice_number)
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                Send Email
                              </button>
                              <button
                                onClick={() => {
                                  setActionDropdownOpen(null)
                                  downloadInvoicePdf(invoice.id, invoice.invoice_number)
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Download className="h-4 w-4 mr-2 text-green-500" />
                                Download PDF
                              </button>
                              <a
                                href={`/admin/invoices/new?edit=${invoice.id}`}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Edit className="h-4 w-4 mr-2 text-orange-500" />
                                Edit Invoice
                              </a>
                              <button
                                onClick={() => {
                                  setActionDropdownOpen(null)
                                  deleteInvoice(invoice.id, invoice.invoice_number)
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete Invoice
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-gray-400">Customer</p>
                        <p>{invoice.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p className="font-medium">£{invoice.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Issue Date</p>
                        <p>{invoice.issue_date}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Due Date</p>
                        <p>{invoice.due_date}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleStatusDropdown(invoice.id, e)}
                          className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}
                          disabled={statusUpdateLoading === invoice.id}
                          data-dropdown="status"
                        >
                          {statusUpdateLoading === invoice.id ? (
                            <span className="inline-block h-3 w-3 mr-1 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                          ) : (
                            getStatusIcon(invoice.status)
                          )}
                          <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </button>

                        {statusDropdownOpen === invoice.id && (
                          <div
                            className="absolute z-50 mt-1 w-36 bg-white rounded-md shadow-lg"
                            style={{ position: "fixed", zIndex: 9999 }}
                            onClick={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  console.log(`Changing status to draft for invoice ${invoice.id}`)
                                  updateInvoiceStatus(invoice.id, "draft")
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
                                  console.log(`Changing status to sent for invoice ${invoice.id}`)
                                  updateInvoiceStatus(invoice.id, "sent")
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
                                  console.log(`Changing status to paid for invoice ${invoice.id}`)
                                  updateInvoiceStatus(invoice.id, "paid")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Paid
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  console.log(`Changing status to overdue for invoice ${invoice.id}`)
                                  updateInvoiceStatus(invoice.id, "overdue")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <Clock className="h-4 w-4 mr-2 text-red-500" />
                                Overdue
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  console.log(`Changing status to cancelled for invoice ${invoice.id}`)
                                  updateInvoiceStatus(invoice.id, "cancelled")
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                              >
                                <XCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                Cancelled
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {displayInvoices.length === 0 && (
                  <div className="bg-white/5 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No invoices found. Create your first invoice!</p>
                  </div>
                )}
              </div>

              {/* Desktop view - table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Invoice #</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Issue Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-sm">
                          <button onClick={() => viewInvoice(invoice.id)} className="text-brand-blue hover:underline">
                            {invoice.invoice_number}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm">{invoice.project_name}</td>
                        <td className="px-4 py-3 text-sm">{invoice.customer_name}</td>
                        <td className="px-4 py-3 text-sm">{invoice.issue_date}</td>
                        <td className="px-4 py-3 text-sm">{invoice.due_date}</td>
                        <td className="px-4 py-3 text-sm">£{invoice.total_amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <button
                              onClick={(e) => toggleStatusDropdown(invoice.id, e)}
                              className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}
                              disabled={statusUpdateLoading === invoice.id}
                              data-dropdown="status"
                            >
                              {statusUpdateLoading === invoice.id ? (
                                <div className="flex items-center">
                                  <span className="inline-block h-3 w-3 mr-1 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                <>
                                  {getStatusIcon(invoice.status)}
                                  <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                                  <ChevronDown className="h-3 w-3 ml-1" />
                                </>
                              )}
                            </button>

                            {statusDropdownOpen === invoice.id && (
                              <div
                                className="absolute z-50 mt-1 w-36 bg-white rounded-md shadow-lg"
                                style={{ zIndex: 9999 }}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log(`Changing status to draft for invoice ${invoice.id}`)
                                      updateInvoiceStatus(invoice.id, "draft")
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
                                      console.log(`Changing status to sent for invoice ${invoice.id}`)
                                      updateInvoiceStatus(invoice.id, "sent")
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
                                      console.log(`Changing status to paid for invoice ${invoice.id}`)
                                      updateInvoiceStatus(invoice.id, "paid")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Paid
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log(`Changing status to overdue for invoice ${invoice.id}`)
                                      updateInvoiceStatus(invoice.id, "overdue")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <Clock className="h-4 w-4 mr-2 text-red-500" />
                                    Overdue
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log(`Changing status to cancelled for invoice ${invoice.id}`)
                                      updateInvoiceStatus(invoice.id, "cancelled")
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dropdown-item"
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                    Cancelled
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              title="View Invoice"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => viewInvoice(invoice.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              title="Send Email"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => sendInvoiceEmail(invoice.id, invoice.invoice_number)}
                              disabled={isEmailSending}
                            >
                              <Mail className={`h-4 w-4 ${isEmailSending ? "animate-pulse" : ""}`} />
                            </button>
                            <button
                              title="Download PDF"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => downloadInvoicePdf(invoice.id, invoice.invoice_number)}
                              disabled={isPdfLoading}
                            >
                              <Download className={`h-4 w-4 ${isPdfLoading ? "animate-pulse" : ""}`} />
                            </button>
                            <button
                              title="Edit Invoice"
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => router.push(`/admin/invoices/new?edit=${invoice.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              title="Delete Invoice"
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => deleteInvoice(invoice.id, invoice.invoice_number)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {displayInvoices.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                          No invoices found. Create your first invoice!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="mt-8 p-4 bg-brand-purple/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">About the Invoice System</h3>
                <p className="text-gray-300 text-sm mt-1">
                  This invoice system uses localStorage to store your invoice data directly in your browser. This means
                  your data is stored locally on your device and will persist between sessions. No database setup is
                  required, but keep in mind that clearing your browser data will also clear your invoices.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  <strong>Email Feature:</strong> The system is configured to send emails using the SMTP settings from
                  your environment variables. When sending an invoice, the system will use the customer's email address
                  from the invoice details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {previewInvoice && (
        <InvoicePDFViewer
          invoice={previewInvoice.invoice}
          customer={previewInvoice.customer}
          items={previewInvoice.items}
          onClose={() => setPreviewInvoice(null)}
        />
      )}
    </div>
  )
}
