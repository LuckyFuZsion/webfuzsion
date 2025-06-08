"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "../components/admin-header"
import { V0EnvironmentNotice } from "../components/v0-environment-notice"
import { Plus, Pencil, Trash2, Search, UserPlus, X, Check, Loader2 } from "lucide-react"
import Link from "next/link"

type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
  created_at?: string
  updated_at?: string
}

export default function ClientsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

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

  useEffect(() => {
    // Check if authenticated on client side
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          loadCustomers()
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowercasedSearch) ||
          customer.email.toLowerCase().includes(lowercasedSearch) ||
          (customer.phone && customer.phone.toLowerCase().includes(lowercasedSearch)) ||
          (customer.city && customer.city.toLowerCase().includes(lowercasedSearch)),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchTerm, customers])

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      // Fetch customers from the API
      const response = await fetch("/api/admin/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers)
        setFilteredCustomers(data.customers)
      } else {
        console.error("Invalid response format:", data)
        setErrorMessage("Failed to load customers: Invalid response format")
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      setErrorMessage(`Failed to load customers: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewCustomerChange = (field: keyof Omit<Customer, "id">, value: string) => {
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [field]: value })
    } else {
      setNewCustomer({ ...newCustomer, [field]: value })
    }
  }

  const resetForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "United Kingdom",
    })
    setEditingCustomer(null)
    setShowAddForm(false)
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const customerData = editingCustomer || newCustomer

    // Validate required fields
    if (!customerData.name || !customerData.email) {
      setErrorMessage("Name and email are required")
      return
    }

    setIsSubmitting(true)

    try {
      const url = editingCustomer ? `/api/admin/customers/${editingCustomer.id}` : "/api/admin/customers"

      const method = editingCustomer ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customerData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save customer")
      }

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(editingCustomer ? "Customer updated successfully" : "Customer added successfully")
        resetForm()
        loadCustomers() // Reload the customer list
      } else {
        throw new Error(data.error || "Failed to save customer")
      }
    } catch (error) {
      console.error("Error saving customer:", error)
      setErrorMessage(`Failed to save customer: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowAddForm(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("Customer deleted successfully")
        setDeleteConfirmId(null)
        loadCustomers() // Reload the customer list
      } else {
        throw new Error(data.error || "Failed to delete customer")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      setErrorMessage(`Failed to delete customer: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader />
        <V0EnvironmentNotice />

        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Clients</h1>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/80 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showAddForm ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Add Client</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200">
              {successMessage}
            </div>
          )}

          {showAddForm && (
            <div className="mb-8 bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{editingCustomer ? "Edit Client" : "Add New Client"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.name : newCustomer.name}
                      onChange={(e) => handleNewCustomerChange("name", e.target.value)}
                      placeholder="Company or individual name"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      value={editingCustomer ? editingCustomer.email : newCustomer.email}
                      onChange={(e) => handleNewCustomerChange("email", e.target.value)}
                      placeholder="client@example.com"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.phone || "" : newCustomer.phone}
                      onChange={(e) => handleNewCustomerChange("phone", e.target.value)}
                      placeholder="01234 567890"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.address || "" : newCustomer.address}
                      onChange={(e) => handleNewCustomerChange("address", e.target.value)}
                      placeholder="Street address"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.city || "" : newCustomer.city}
                      onChange={(e) => handleNewCustomerChange("city", e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.postal_code || "" : newCustomer.postal_code}
                      onChange={(e) => handleNewCustomerChange("postal_code", e.target.value)}
                      placeholder="Postal code"
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <input
                      type="text"
                      value={editingCustomer ? editingCustomer.country || "United Kingdom" : newCustomer.country}
                      onChange={(e) => handleNewCustomerChange("country", e.target.value)}
                      className="w-full px-3 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{editingCustomer ? "Update Client" : "Add Client"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-dark/50 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <span className="ml-2 text-lg">Loading clients...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No Clients Found</h2>
              <p className="text-gray-400 mb-4">
                {searchTerm ? "No clients match your search criteria." : "You haven't added any clients yet."}
              </p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/80 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Client</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Location</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.phone || "-"}</td>
                      <td className="px-4 py-3">
                        {customer.city ? `${customer.city}, ${customer.country || "UK"}` : customer.country || "UK"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Edit Client"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(customer.id)}
                            className={`p-1 ${
                              deleteConfirmId === customer.id
                                ? "text-red-500 hover:text-red-400"
                                : "text-gray-400 hover:text-white"
                            } transition-colors`}
                            title={deleteConfirmId === customer.id ? "Confirm Delete" : "Delete Client"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          {deleteConfirmId === customer.id && (
                            <button
                              onClick={cancelDelete}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <Link
                            href={`/admin/invoices/new?customer=${customer.id}`}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Create Invoice"
                          >
                            <Plus className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
