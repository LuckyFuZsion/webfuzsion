"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditQuotePage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params.id as string

  console.log("EditQuotePage rendered with quoteId:", quoteId)

  const [isLoading, setIsLoading] = useState(true)
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
    console.log("EditQuotePage useEffect triggered with quoteId:", quoteId)
    
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

      // Load quote for editing
      await loadQuoteForEditing(quoteId)

      setIsLoading(false)
    }

    initializePage()
  }, [quoteId, router])

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      const data = await response.json()

      if (data.success) {
        setCustomers(data.customers || [])
      }
    } catch (err) {
      console.error("Error loading customers:", err)
    }
  }

  const loadQuoteForEditing = async (quoteId: string) => {
    try {
      console.log("Loading quote for editing:", quoteId)
      const response = await fetch(`/api/admin/quotes?id=${quoteId}`)
      const data = await response.json()

      if (data.success && data.quote) {
        const quote = data.quote
        
        setQuoteNumber(quote.quote_number)
        setProjectName(quote.project_name)
        setIssueDate(quote.issue_date)
        setDueDate(quote.due_date)
        setNotes(quote.notes || "")
        setTerms(quote.terms || "")
        setStatus(quote.status)
        setDiscountAmount(quote.discount_amount || 0)
        
        if (quote.customer) {
          setSelectedCustomer(quote.customer)
        }
        
        if (quote.items) {
          setItems(quote.items)
        }
      }
    } catch (err) {
      console.error("Error loading quote:", err)
    }
  }

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate amounts
    const quantity = Number(updatedItems[index].quantity) || 0
    const unitPrice = Number(updatedItems[index].unit_price) || 0
    const discountPercentage = Number(updatedItems[index].discount_percentage) || 0

    const originalAmount = quantity * unitPrice
    const discountAmount = (originalAmount * discountPercentage) / 100
    const finalAmount = originalAmount - discountAmount

    updatedItems[index] = {
      ...updatedItems[index],
      original_amount: originalAmount,
      discount_amount: discountAmount,
      amount: finalAmount,
    }

    setItems(updatedItems)
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

    try {
      setSaving(true)

      const { subtotal, total } = calculateTotals()

      const quoteData = {
        id: quoteId,
        customer: selectedCustomer,
        quote: {
          id: quoteId,
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
        alert("Quote updated successfully!")
        router.push(`/admin/quotes/${quoteId}`)
      } else {
        alert("Failed to update quote: " + data.error)
      }
    } catch (err) {
      alert("Failed to update quote")
      console.error("Error updating quote:", err)
    } finally {
      setSaving(false)
    }
  }

  const { subtotal, total } = calculateTotals()

  // Simple test to see if the route is working
  if (!quoteId) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: No quote ID provided</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading quote...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/admin/quotes/${quoteId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quote
          </Button>
          <h1 className="text-3xl font-bold">Edit Quote: {quoteNumber}</h1>
        </div>
        <Button onClick={saveQuote} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Quote"}
        </Button>
      </div>

      <div className="grid gap-6">
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
              <div>
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  step="0.01"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
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
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{selectedCustomer.name}</h4>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                {selectedCustomer.phone && (
                  <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quote Items */}
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
                <div key={item.id} className="grid grid-cols-6 gap-4 items-end border-b pb-4">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.discount_percentage}
                      onChange={(e) => handleItemChange(index, "discount_percentage", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      readOnly
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notes for this quote..."
                rows={4}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter terms and conditions..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-£{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 