"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react"

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

interface Quote {
  id: string
  quote_number: string
  customer_id: string
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

export default function NewQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const customerId = searchParams.get("customer")

  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [quoteNumber, setQuoteNumber] = useState("")
  const [projectName, setProjectName] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("")
  const [status, setStatus] = useState("draft")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true)
      
      // Check authentication
      const authResponse = await fetch("/api/admin/check-auth")
      if (!authResponse.ok) {
        router.push("/admin/login")
        return
      }

      // Load customers
      await loadCustomers()

      // Check if we're in edit mode
      if (editId) {
        setIsEditMode(true)
        await loadQuoteForEditing(editId)
      } else if (customerId) {
        // Pre-select customer if provided
        const customer = customers.find(c => c.id === customerId)
        if (customer) {
          setSelectedCustomer(customer)
        }
      }

      // Generate quote number if not in edit mode
      if (!editId) {
        setQuoteNumber(generateQuoteNumber())
      }

      setIsLoading(false)
    }

    initializePage()
  }, [editId, customerId, router])

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      const data = await response.json()
      if (data.success) {
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error("Error loading customers:", error)
    }
  }

  const loadQuoteForEditing = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/admin/quotes?id=${quoteId}`)
      const data = await response.json()

      if (data.success && data.quote) {
        const quote = data.quote
        setQuoteNumber(quote.quote_number)
        setProjectName(quote.project_name || '')
        setIssueDate(quote.issue_date)
        setDueDate(quote.due_date || quote.expiry_date || '')
        setNotes(quote.notes || "")
        setTerms(quote.terms || "")
        setStatus(quote.status)
        setDiscountAmount(quote.discount_amount || 0)
        
        if (quote.customers) {
          setSelectedCustomer(quote.customers)
        }
        
        if (quote.quote_items) {
          setItems(quote.quote_items)
        }
      }
    } catch (error) {
      console.error("Error loading quote:", error)
    }
  }

  const generateQuoteNumber = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `QT-${year}${month}${day}-001`
  }

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate amount
    const quantity = Number(newItems[index].quantity) || 0
    const unitPrice = Number(newItems[index].unit_price) || 0
    const discountPercentage = Number(newItems[index].discount_percentage) || 0
    
    const originalAmount = quantity * unitPrice
    const discountAmount = (originalAmount * discountPercentage) / 100
    const finalAmount = originalAmount - discountAmount
    
    newItems[index].original_amount = originalAmount
    newItems[index].discount_amount = discountAmount
    newItems[index].amount = finalAmount
    
    setItems(newItems)
  }

  const addItem = () => {
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
      discount_percentage: 0,
      discount_amount: 0,
      original_amount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const total = subtotal - discountAmount
    return { subtotal, total }
  }

  const saveQuote = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer")
      return
    }

    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    setSaving(true)

    try {
      const { subtotal, total } = calculateTotals()
      const quoteId = isEditMode ? editId! : crypto.randomUUID()

      const quoteData = {
        id: quoteId,
        customer: selectedCustomer,
        quote: {
          quote_number: quoteNumber,
          project_name: projectName,
          issue_date: issueDate,
          due_date: dueDate,
          subtotal,
          discount_amount: discountAmount,
          total_amount: total,
          status,
          notes,
          terms,
        },
        items,
      }

      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData),
      })

      const data = await response.json()

      if (data.success) {
        alert("Quote saved successfully!")
        router.push("/admin/quotes")
      } else {
        alert("Failed to save quote: " + data.error)
      }
    } catch (error) {
      console.error("Error saving quote:", error)
      alert("Failed to save quote")
    } finally {
      setSaving(false)
    }
  }

  const { subtotal, total } = calculateTotals()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push("/admin/quotes")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Quote" : "New Quote"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select
                    value={selectedCustomer?.id || ""}
                    onValueChange={(value) => {
                      const customer = customers.find(c => c.id === value)
                      setSelectedCustomer(customer || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedCustomer.name}</h4>
                    <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                    {selectedCustomer.phone && (
                      <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                    )}
                    {selectedCustomer.address && (
                      <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quoteNumber">Quote Number</Label>
                  <Input
                    id="quoteNumber"
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Discount %</Label>
                        <Input
                          type="number"
                          value={item.discount_percentage}
                          onChange={(e) => handleItemChange(index, "discount_percentage", Number(e.target.value))}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Terms and conditions..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={saveQuote}
            disabled={saving}
            className="w-full"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Quote"}
          </Button>
        </div>
      </div>
    </div>
  )
} 