"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "../../components/admin-header"
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Loader2,
  Percent,
  Eye,
} from "lucide-react"
import Link from "next/link"
import "../invoice-mobile.css"

// Define types
type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

type InvoiceItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
  discount_percentage?: number
  discount_amount?: number
  amount: number
  original_amount?: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isCustomerSaving, setIsCustomerSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [emailPreviewHtml, setEmailPreviewHtml] = useState("")

  // Invoice form state
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [projectName, setProjectName] = useState("")
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      discount_amount: 0,
      amount: 0,
      original_amount: 0,
    },
  ])
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("")
  const [status, setStatus] = useState<"draft" | "sent" | "paid" | "overdue" | "cancelled">("draft")
  const [discountAmount, setDiscountAmount] = useState(0)

  // New customer form state
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "United Kingdom",
  })

  // Calculated values
  const originalSubtotal = items.reduce((sum, item) => sum + (item.original_amount || item.amount), 0)
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const totalItemDiscounts = items.reduce((sum, item) => sum + (item.discount_amount || 0), 0)
  const totalDiscount = totalItemDiscounts + discountAmount
  const discountPercentage = originalSubtotal > 0 ? ((totalDiscount / originalSubtotal) * 100).toFixed(2) : "0.00"
  const total = subtotal - discountAmount

  useEffect(() => {
    // Check if authenticated on client side
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)

          // Check if we're editing an existing invoice
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search)
            const id = params.get("edit")
            const customerId = params.get("customer")

            if (id) {
              setIsEditMode(true)
              setEditId(id)
            } else {
              // Generate invoice number for new invoice
              generateInvoiceNumber()
              // Set due date to 14 days from now
              const dueDate = new Date()
              dueDate.setDate(dueDate.getDate() + 14)
              setDueDate(dueDate.toISOString().split("T")[0])

              // If customer ID is provided, load that customer
              if (customerId) {
                loadCustomerById(customerId)
              }
            }
          }

          // Load customers from database
          loadCustomersFromDatabase()
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  // Second useEffect to load invoice data after customers are loaded
  useEffect(() => {
    if (!isLoading && isEditMode && editId) {
      loadInvoiceForEditing(editId)
    }
  }, [isLoading, isEditMode, editId])

  // Initialize textarea heights when items change
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const textareas = document.querySelectorAll('textarea[placeholder="Item description"]')
      textareas.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement
        element.style.height = "auto"
        element.style.height = `${element.scrollHeight}px`
      })
    }, 0)
  }, [items])

  const generateInvoiceNumber = () => {
    // Get today's date in British format (DD/MM/YYYY)
    const today = new Date()
    const day = today.getDate().toString().padStart(2, "0")
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const year = today.getFullYear()
    const dateString = `${day}/${month}/${year}`

    // Get the next sequential number from localStorage
    let nextNumber = 1
    if (typeof window !== "undefined") {
      try {
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")

        // Extract all sequential numbers from existing invoices
        const sequentialNumbers = storedInvoices
          .map((inv: any) => {
            // Try to extract the sequential part (after the hyphen)
            const match = inv.invoice_number?.match(/-(\d+)$/)
            return match ? Number.parseInt(match[1], 10) : 0
          })
          .filter((num: number) => !isNaN(num))

        // Find the highest number and increment by 1
        if (sequentialNumbers.length > 0) {
          nextNumber = Math.max(...sequentialNumbers) + 1
        }
      } catch (error) {
        console.error("Error determining next invoice number:", error)
      }
    }

    // Format the sequential number with leading zeros
    const sequentialPart = nextNumber.toString().padStart(3, "0")

    // Combine to create the final invoice number
    setInvoiceNumber(`${dateString}-${sequentialPart}`)

    // Set default terms only for new invoices, not when editing
    if (!isEditMode) {
      setTerms(
        "Minor tweaks and ongoing support will be provided for 14 days after the invoice date at no additional cost. Any further support or adjustments will be chargeable at the agreed rate.",
      )
    }
  }

  const loadCustomersFromDatabase = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers)
      } else {
        console.error("Invalid response format:", data)
        setErrorMessage("Failed to load customers: Invalid response format")
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      setErrorMessage(`Failed to load customers: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const loadCustomerById = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers?id=${customerId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch customer")
      }

      const data = await response.json()

      if (data.success && data.customer) {
        setSelectedCustomer(data.customer)
      }
    } catch (error) {
      console.error("Error loading customer:", error)
    }
  }

  const loadInvoiceForEditing = async (invoiceId: string) => {
    try {
      console.log("Loading invoice for editing:", invoiceId)

      const response = await fetch(`/api/admin/invoices?id=${invoiceId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch invoice")
      }

      const data = await response.json()

      if (data.success && data.invoice) {
        const invoice = data.invoice
        console.log("Found invoice to edit:", invoice)

        // Set invoice details
        setInvoiceNumber(invoice.invoice_number || "")
        setProjectName(invoice.project_name || "")
        setIssueDate(invoice.issue_date || new Date().toISOString().split("T")[0])
        setDueDate(invoice.due_date || "")
        setNotes(invoice.notes || "")
        setTerms(invoice.terms || "")
        setDiscountAmount(invoice.discount_amount || 0)
        setStatus(invoice.status || "draft")

        // Set customer
        if (invoice.customer) {
          setSelectedCustomer(invoice.customer)
        }

        // Set items
        if (invoice.items && invoice.items.length > 0) {
          console.log("Setting invoice items:", invoice.items)
          const formattedItems = invoice.items.map((item: any) => {
            const quantity = Number(item.quantity) || 0
            const unitPrice = Number(item.unit_price) || 0
            const originalAmount = quantity * unitPrice
            const discountPercentage = Number(item.discount_percentage) || 0
            const discountAmount = (originalAmount * discountPercentage) / 100
            const amount = originalAmount - discountAmount

            return {
              id: item.id || crypto.randomUUID(),
              description: item.description || "",
              quantity: quantity,
              unit_price: unitPrice,
              discount_percentage: discountPercentage,
              discount_amount: discountAmount,
              amount: amount,
              original_amount: originalAmount,
            }
          })
          setItems(formattedItems)
        }
      } else {
        console.error("Invoice not found for editing:", invoiceId)
        setErrorMessage("Invoice not found. It may have been deleted.")
      }
    } catch (error) {
      console.error("Error loading invoice for editing:", error)
      setErrorMessage("Failed to load invoice data for editing.")
    }
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate amount if quantity, unit_price, or discount_percentage changed
          if (field === "quantity" || field === "unit_price" || field === "discount_percentage") {
            const originalAmount = Number(updatedItem.quantity) * Number(updatedItem.unit_price)
            updatedItem.original_amount = originalAmount

            const discountPercentage = Number(updatedItem.discount_percentage || 0)
            const discountAmount = (originalAmount * discountPercentage) / 100
            updatedItem.discount_amount = discountAmount

            updatedItem.amount = originalAmount - discountAmount
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit_price: 0,
        discount_percentage: 0,
        discount_amount: 0,
        amount: 0,
        original_amount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleNewCustomerChange = (field: keyof Omit<Customer, "id">, value: string) => {
    setNewCustomer({ ...newCustomer, [field]: value })
  }

  const addNewCustomer = async () => {
    try {
      setIsCustomerSaving(true)
      setErrorMessage(null)

      // Validate required fields
      if (!newCustomer.name || !newCustomer.email) {
        setErrorMessage("Customer name and email are required")
        setIsCustomerSaving(false)
        return
      }

      // Save to database
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: newCustomer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save customer")
      }

      const data = await response.json()

      if (data.success) {
        // Reload customers
        await loadCustomersFromDatabase()

        // Find the newly created customer
        const newlyCreatedCustomer = {
          id: data.customer_id,
          ...newCustomer,
        }

        // Select the new customer
        setSelectedCustomer(newlyCreatedCustomer)
        setShowNewCustomer(false)

        // Reset the form
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          postal_code: "",
          country: "United Kingdom",
        })

        // Show a success message
        setErrorMessage("Customer saved successfully.")
        setTimeout(() => setErrorMessage(null), 3000)
      } else {
        throw new Error(data.error || "Failed to save customer")
      }
    } catch (error) {
      console.error("Error in customer creation process:", error)
      setErrorMessage(`An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsCustomerSaving(false)
    }
  }

  const saveInvoice = async (invoiceStatus: "draft" | "sent" | "paid" | "overdue" | "cancelled") => {
    setErrorMessage(null)
    setDebugInfo(null)

    // Validate form
    if (!selectedCustomer) {
      setErrorMessage("Please select a customer")
      return
    }

    if (!projectName) {
      setErrorMessage("Please enter a project name")
      return
    }

    if (items.some((item) => !item.description || item.amount === 0)) {
      setErrorMessage("Please fill in all invoice items")
      return
    }

    setIsSaving(true)

    try {
      console.log("Starting invoice save process...")

      // Prepare invoice data
      const customerData = {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || "",
        address: selectedCustomer.address || "",
        city: selectedCustomer.city || "",
        postal_code: selectedCustomer.postal_code || "",
        country: selectedCustomer.country || "United Kingdom",
      }

      // Use existing ID if editing, otherwise generate a new one
      const invoiceId = editId || crypto.randomUUID()
      console.log(`Invoice ID: ${invoiceId} (${editId ? "editing existing" : "creating new"})`)

      // Create the invoice object
      const invoiceData = {
        invoice_number: invoiceNumber,
        project_name: projectName,
        issue_date: issueDate,
        due_date: dueDate,
        status: invoiceStatus,
        subtotal,
        original_subtotal: originalSubtotal,
        discount_amount: discountAmount,
        total_item_discounts: totalItemDiscounts,
        total_discount: totalDiscount,
        discount_percentage: discountPercentage,
        total_amount: total,
        notes,
        terms,
      }

      // Create the complete invoice object for localStorage
      const completeInvoice = {
        id: invoiceId,
        ...invoiceData,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_city: customerData.city,
        customer_postal_code: customerData.postal_code,
        customer_country: customerData.country,
        items,
        updated_at: new Date().toISOString(),
      }

      // Try to save to database first
      try {
        const response = await fetch("/api/admin/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: invoiceId,
            customer: customerData,
            invoice: invoiceData,
            items,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to save invoice to database")
        }

        const data = await response.json()

        if (data.success) {
          // Database save was successful
          console.log("Invoice saved to database successfully")

          // Also save to localStorage as a backup
          saveToLocalStorage(completeInvoice)

          alert(`Invoice ${editId ? "updated" : "saved"} with status: ${invoiceStatus}!`)
          router.push("/admin/invoices")
        } else {
          throw new Error(data.error || "Failed to save invoice to database")
        }
      } catch (dbError) {
        console.error("Database save failed, falling back to localStorage:", dbError)

        // Save to localStorage as fallback
        saveToLocalStorage(completeInvoice)

        alert(
          `Invoice ${editId ? "updated" : "saved"} to browser storage with status: ${invoiceStatus}! (Database save failed)`,
        )
        router.push("/admin/invoices")
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      setErrorMessage(`Failed to save invoice: ${error instanceof Error ? error.message : "Unknown error"}`)
      setDebugInfo(error)
    } finally {
      setIsSaving(false)
    }
  }

  const saveToLocalStorage = (invoice: any) => {
    try {
      if (typeof window !== "undefined") {
        // Get existing invoices
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")

        // Find if this invoice already exists
        const existingIndex = storedInvoices.findIndex((inv: any) => inv.id === invoice.id)

        if (existingIndex !== -1) {
          // Update existing invoice
          storedInvoices[existingIndex] = invoice
        } else {
          // Add new invoice
          storedInvoices.push(invoice)
        }

        // Save back to localStorage
        localStorage.setItem("invoices", JSON.stringify(storedInvoices))
        console.log("Invoice saved to localStorage successfully")
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      throw new Error("Failed to save invoice to browser storage")
    }
  }

  const generateEmailContent = () => {
    // Format dates for display
    const formattedIssueDate = new Date(issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const formattedDueDate = new Date(dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    // Format items for the email template
    const formattedItems = items.map((item) => {
      return {
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price.toFixed(2),
        discount_percentage: item.discount_percentage ? item.discount_percentage.toFixed(2) : null,
        discount_amount: item.discount_amount ? item.discount_amount.toFixed(2) : null,
        amount: item.amount.toFixed(2),
      }
    })

    // Get the email template
    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice from WebFuZsion</title>
  <style>
    /* Base styles - using email-safe approaches */
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4a46f7;
      color: white;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
    }
    .logo-container {
      background-color: white;
      border-radius: 50px;
      padding: 8px 15px;
      margin-right: 15px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 100%;
      height: auto;
      max-height: 50px;
      object-fit: contain;
    }
    .header-text {
      display: flex;
      flex-direction: column;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      padding: 0;
      letter-spacing: 1px;
    }
    .invoice-subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    .header-right {
      text-align: right;
    }
    .invoice-details {
      margin: 0;
      font-size: 14px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .status-draft {
      background-color: #95a5a6;
      color: white;
    }
    .status-sent {
      background-color: #f39c12;
      color: white;
    }
    .status-paid {
      background-color: #2ecc71;
      color: white;
    }
    .status-overdue {
      background-color: #e74c3c;
      color: white;
    }
    .content {
      padding: 30px;
    }
    .invoice-summary {
      background-color: #f9f9f9;
      border-left: 4px solid #4a6cf7;
      padding: 15px;
      margin-bottom: 25px;
      border-radius: 0 4px 4px 0;
    }
    .invoice-summary p {
      margin: 5px 0;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #4a6cf7;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-size: 18px;
    }
    .two-columns {
      display: table;
      width: 100%;
    }
    .column {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    table.items th {
      background-color: #4a6cf7;
      color: white;
      text-align: left;
      padding: 12px 15px;
    }
    table.items td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    table.items tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .totals {
      background-color: #f9f9f9;
      border: 1px solid #eee;
      border-left: 4px solid #4a6cf7;
      border-radius: 0 4px 4px 0;
      padding: 15px;
      margin-left: auto;
      width: 250px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    .totals-row.total {
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid #ddd;
      padding-top: 10px;
      margin-top: 5px;
      color: #4a6cf7;
    }
    .discount {
      color: #e74c3c;
    }
    .notes-section {
      background-color: #f9f9f9;
      border-left: 4px solid #f39c12;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 0 4px 4px 0;
    }
    .terms-section {
      background-color: #f9f9f9;
      border-left: 4px solid #2ecc71;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 0 4px 4px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f9f9f9;
      color: #777;
      border-top: 1px solid #eee;
    }
    .payment-info {
      background-color: #e8f4fd;
      border-left: 4px solid #3498db;
      padding: 15px;
      margin-top: 30px;
      border-radius: 0 4px 4px 0;
    }
    /* Responsive adjustments */
    @media only screen and (max-width: 600px) {
      .header {
        flex-direction: column;
        text-align: center;
      }
      .header-left {
        margin-bottom: 15px;
        justify-content: center;
      }
      .header-right {
        text-align: center;
      }
      .column {
        display: block;
        width: 100%;
      }
      .totals {
        width: auto;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="logo-container">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hPxOkT9dQtd20K3dZ2fNNZkZ84SPjB.png" alt="WebFuZsion Logo" class="logo">
        </div>
        <div class="header-text">
          <h1 class="company-name">WebFuZsion</h1>
          <p class="invoice-subtitle">Thank you for your business</p>
        </div>
      </div>
      <div class="header-right">
        <div class="invoice-details">
          <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
          <p><strong>Date:</strong> ${formattedIssueDate}</p>
          <p><strong>Due:</strong> ${formattedDueDate}</p>
        </div>
        <div class="status-badge status-${status}">${status}</div>
      </div>
    </div>
    
    <div class="content">
      <div class="invoice-summary">
        <p><strong>Project:</strong> ${projectName}</p>
      </div>

      <div class="two-columns section">
        <div class="column">
          <h2 class="section-title">From</h2>
          <p>
            <strong>WebFuZsion</strong><br>
            Steven Platts<br>
            Grantham, UK<br>
            info.webfuzsion@gmail.com
          </p>
        </div>
        <div class="column">
          <h2 class="section-title">Bill To</h2>
          <p>
            <strong>${selectedCustomer?.name || ""}</strong><br>
            ${selectedCustomer?.email || ""}<br>
            ${selectedCustomer?.phone || ""}<br>
            ${selectedCustomer?.address || ""}<br>
            ${selectedCustomer?.city || ""} ${selectedCustomer?.postal_code || ""}<br>
            ${selectedCustomer?.country || ""}
          </p>
        </div>
      </div>

      <h2 class="section-title">Invoice Items</h2>
      <table class="items">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>£${item.unit_price.toFixed(2)}</td>
            <td>
              ${
                Number(item.discount_percentage || 0) > 0
                  ? `${Number(item.discount_percentage).toFixed(2)}% (£${Number(item.discount_amount || 0).toFixed(2)})`
                  : "-"
              }
            </td>
            <td>£${item.amount.toFixed(2)}</td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Original Subtotal:</span>
          <span>£${originalSubtotal.toFixed(2)}</span>
        </div>
        ${
          totalItemDiscounts > 0
            ? `
        <div class="totals-row">
          <span>Item Discounts:</span>
          <span class="discount">-£${totalItemDiscounts.toFixed(2)}</span>
        </div>
        `
            : ""
        }
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>£${subtotal.toFixed(2)}</span>
        </div>
        ${
          discountAmount > 0
            ? `
        <div class="totals-row">
          <span>Additional Discount:</span>
          <span class="discount">-£${discountAmount.toFixed(2)}</span>
        </div>
        `
            : ""
        }
        <div class="totals-row total">
          <span>Total:</span>
          <span>£${total.toFixed(2)}</span>
        </div>
        ${
          totalDiscount > 0
            ? `
        <div class="totals-row">
          <span>Total Savings:</span>
          <span class="discount">£${totalDiscount.toFixed(2)} (${discountPercentage}%)</span>
        </div>
        `
            : ""
        }
      </div>

      ${
        notes
          ? `
      <div class="notes-section">
        <h3>Notes</h3>
        <p>${notes}</p>
      </div>
      `
          : ""
      }

      ${
        terms
          ? `
      <div class="terms-section">
        <h3>Terms & Conditions</h3>
        <p>${terms}</p>
      </div>
      `
          : ""
      }

      <div class="payment-info">
        <h3>Payment Information</h3>
        <p>Please make payment to:</p>
        <p><strong>Steven Platts</strong> • Sort Code: 110333 • Account: 00577966</p>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>© ${new Date().getFullYear()} WebFuZsion. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `

    return template
  }

  const handlePreviewEmail = () => {
    if (!selectedCustomer) {
      setErrorMessage("Please select a customer to preview the email")
      return
    }

    const emailHtml = generateEmailContent()
    setEmailPreviewHtml(emailHtml)
    setShowEmailPreview(true)
  }

  const handleSendEmail = async () => {
    // Validate form
    if (!selectedCustomer) {
      setErrorMessage("Please select a customer")
      return
    }

    if (!selectedCustomer.email) {
      setErrorMessage("Customer email is required to send the invoice")
      return
    }

    if (!projectName) {
      setErrorMessage("Please enter a project name")
      return
    }

    if (items.some((item) => !item.description || item.amount === 0)) {
      setErrorMessage("Please fill in all invoice items")
      return
    }

    try {
      setIsSending(true)
      setErrorMessage(null)

      // First save the invoice with the current status
      const invoiceId = editId || crypto.randomUUID()

      // Set the status to "sent" if it's currently "draft"
      // Otherwise, keep the current status (paid, overdue, etc.)
      const emailStatus = status === "draft" ? "sent" : status

      // Save invoice with the appropriate status
      // We're not calling saveInvoice() here to avoid showing the alert
      // Instead, we'll do the save operation directly

      // Prepare invoice data
      const customerData = {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || "",
        address: selectedCustomer.address || "",
        city: selectedCustomer.city || "",
        postal_code: selectedCustomer.postal_code || "",
        country: selectedCustomer.country || "United Kingdom",
      }

      // Create the invoice object with the appropriate status
      const invoiceData = {
        invoice_number: invoiceNumber,
        project_name: projectName,
        issue_date: issueDate,
        due_date: dueDate,
        status: emailStatus, // Use the appropriate status
        subtotal,
        original_subtotal: originalSubtotal,
        discount_amount: discountAmount,
        total_item_discounts: totalItemDiscounts,
        total_discount: totalDiscount,
        discount_percentage: discountPercentage,
        total_amount: total,
        notes,
        terms,
      }

      // Format items for the email
      const formattedItems = items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        discount_amount: item.discount_amount,
        amount: item.amount,
      }))

      // Save to database first
      const saveResponse = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: invoiceId,
          customer: customerData,
          invoice: invoiceData,
          items,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || "Failed to save invoice")
      }

      // Generate email content
      const emailContent = generateEmailContent()

      // Send the email
      const response = await fetch("/api/admin/invoices/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          emailContent: emailContent,
          subject: `Invoice ${invoiceNumber} from WebFuZsion`,
          recipientEmail: selectedCustomer.email,
          invoiceData: {
            ...invoiceData,
            customer: customerData,
            items: formattedItems,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }

      // Create the complete invoice object for localStorage
      const completeInvoice = {
        id: invoiceId,
        ...invoiceData,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_city: customerData.city,
        customer_postal_code: customerData.postal_code,
        customer_country: customerData.country,
        items,
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage as a backup
      saveToLocalStorage(completeInvoice)

      // Show a notification that the invoice has been sent
      alert(`Invoice #${invoiceNumber} has been sent to ${selectedCustomer.email}`)

      // Redirect to the invoices page
      router.push("/admin/invoices")
    } catch (error) {
      console.error("Error sending invoice:", error)
      setErrorMessage(`Failed to send invoice: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSending(false)
    }
  }

  const isFormValid = () => {
    return selectedCustomer && projectName && items.every((item) => item.description && item.amount !== 0)
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
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 invoice-form">
          <AdminHeader />

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link href="/admin/invoices" className="mr-4">
                <button className="flex items-center text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Back</span>
                </button>
              </Link>
              <h1 className="text-3xl font-bold">{isEditMode ? "Edit Invoice" : "Create New Invoice"}</h1>
            </div>

            <div className="flex space-x-3">
              <div className="relative mr-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "sent" | "paid" | "overdue" | "cancelled")}
                  className="h-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg appearance-none pr-8"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
              </div>

              <button
                onClick={handlePreviewEmail}
                disabled={!isFormValid()}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Email</span>
              </button>

              <button
                onClick={() => saveInvoice(status)}
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/80 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Invoice</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={isSaving || isSending || !isFormValid()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Save & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
              {errorMessage}
              {debugInfo && (
                <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono overflow-x-auto">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Invoice details */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>

                <div className="flex mb-4 form-row">
                  <div className="w-1/2 mr-4 form-group">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div className="w-1/2 mr-4 form-group">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Website Redesign"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex mb-4 form-row">
                  <div className="w-1/2 mr-4 form-group">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="w-1/2 mr-4 form-group">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>

                <div className="overflow-x-auto mb-6 line-items-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Description</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-300 w-20">Quantity</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-300 w-36">Unit Price</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-300 w-32">Discount %</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-300 w-28">Amount</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-white/5">
                          <td className="px-4 py-3">
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                handleItemChange(item.id, "description", e.target.value)
                                // Auto-resize the textarea
                                e.target.style.height = "auto"
                                e.target.style.height = `${e.target.scrollHeight}px`
                              }}
                              onFocus={(e) => {
                                // Set initial height on focus
                                e.target.style.height = "auto"
                                e.target.style.height = `${e.target.scrollHeight}px`
                              }}
                              placeholder="Item description"
                              rows={1}
                              className="w-full px-3 py-1 bg-brand-dark/50 border border-white/20 rounded-lg text-white resize-none overflow-hidden"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-1 bg-brand-dark/50 border border-white/20 rounded-lg text-white text-right"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1">£</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) =>
                                  handleItemChange(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-full pl-7 pr-4 py-1 bg-brand-dark/50 border border-white/20 rounded-lg text-white text-right"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={item.discount_percentage || 0}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "discount_percentage",
                                    Number.parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="w-full pr-7 pl-3 py-1 bg-brand-dark/50 border border-white/20 rounded-lg text-white text-right"
                              />
                              <Percent className="absolute right-3 top-1 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex flex-col">
                              {item.discount_percentage && item.discount_percentage > 0 ? (
                                <>
                                  <span className="text-gray-400 line-through text-xs">
                                    £{(item.original_amount || 0).toFixed(2)}
                                  </span>
                                  <span>£{item.amount.toFixed(2)}</span>
                                </>
                              ) : (
                                <span>£{item.amount.toFixed(2)}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={addItem}
                  className="mt-4 flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue/80"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>

                <div className="mt-6 flex justify-end invoice-totals">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-300">Original Subtotal:</span>
                      <span>£{originalSubtotal.toFixed(2)}</span>
                    </div>
                    {totalItemDiscounts > 0 && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-300">Item Discounts:</span>
                        <span className="text-red-400">-£{totalItemDiscounts.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-300">Subtotal:</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-300">Additional Discount:</span>
                      <div className="flex items-center gap-2">
                        <span>£</span>
                        <input
                          type="number"
                          min="0"
                          max={subtotal}
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-brand-dark/50 border border-white/20 rounded-lg text-white text-right"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total:</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between py-2 text-sm text-gray-400 italic">
                        <span>Total Savings:</span>
                        <span>
                          £{totalDiscount.toFixed(2)} ({discountPercentage}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes for the client..."
                    rows={3}
                    className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Terms & Conditions</label>
                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right column - Customer details */}
            <div>
              <div className="bg-white/5 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Customer</h2>

                {!showNewCustomer ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Select Customer</label>
                      <select
                        value={selectedCustomer?.id || ""}
                        onChange={(e) => {
                          const customer = customers.find((c) => c.id === e.target.value)
                          setSelectedCustomer(customer || null)
                        }}
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setShowNewCustomer(true)}
                      className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue/80"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Customer</span>
                    </button>

                    {selectedCustomer && (
                      <div className="mt-6 p-4 bg-brand-dark/50 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {selectedCustomer.name}
                        </h3>
                        <div className="mt-2 space-y-2 text-sm text-gray-300">
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {selectedCustomer.email}
                          </p>
                          {selectedCustomer.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {selectedCustomer.phone}
                            </p>
                          )}
                          {selectedCustomer.address && (
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                              <span>
                                {selectedCustomer.address}
                                <br />
                                {selectedCustomer.city && `${selectedCustomer.city}, `}
                                {selectedCustomer.postal_code}
                                <br />
                                {selectedCustomer.country}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => handleNewCustomerChange("name", e.target.value)}
                        placeholder="Company or individual name"
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => handleNewCustomerChange("email", e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <input
                        type="text"
                        value={newCustomer.phone}
                        onChange={(e) => handleNewCustomerChange("phone", e.target.value)}
                        placeholder="01234 567890"
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                      <input
                        type="text"
                        value={newCustomer.address}
                        onChange={(e) => handleNewCustomerChange("address", e.target.value)}
                        placeholder="Street address"
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                        <input
                          type="text"
                          value={newCustomer.city}
                          onChange={(e) => handleNewCustomerChange("city", e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newCustomer.postal_code}
                          onChange={(e) => handleNewCustomerChange("postal_code", e.target.value)}
                          placeholder="Postal code"
                          className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                      <input
                        type="text"
                        value={newCustomer.country}
                        onChange={(e) => handleNewCustomerChange("country", e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => setShowNewCustomer(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        disabled={isCustomerSaving}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={addNewCustomer}
                        className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-lg transition-colors"
                        disabled={!newCustomer.name || !newCustomer.email || isCustomerSaving}
                      >
                        {isCustomerSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          "Add Customer"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                <p className="text-gray-300 mb-4">See how your invoice will look before sending it to your customer.</p>
                <button
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  onClick={() => alert("Preview functionality will be implemented soon!")}
                >
                  Preview Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Email Preview</h3>
              <button onClick={() => setShowEmailPreview(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe
                srcDoc={emailPreviewHtml}
                className="w-full h-full min-h-[700px] border rounded"
                title="Email Preview"
              />
            </div>
            <div className="p-4 bg-gray-100 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Close
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
