"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "@/app/admin/components/admin-header"
import { AlertTriangle, Database, Trash2, Check, X, Loader2, Info } from "lucide-react"

export default function CleanupSchemaPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [schemaInfo, setSchemaInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteResult, setDeleteResult] = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const checkSchemas = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/check-schemas")

        if (!response.ok) {
          throw new Error(`Schema check failed: ${response.status}`)
        }

        const data = await response.json()
        setSchemaInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Schema check error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkSchemas()
  }, [])

  const deleteInvoiceSystemSchema = async () => {
    try {
      setIsDeleting(true)
      setDeleteResult(null)

      const response = await fetch("/api/admin/delete-schema", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schemaName: "invoice_system",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Schema deletion failed")
      }

      setDeleteResult({
        success: true,
        message: result.message || "Schema deleted successfully",
        details: result.details || {},
      })

      // Refresh schema info
      const checkResponse = await fetch("/api/admin/check-schemas")
      if (checkResponse.ok) {
        const checkData = await checkResponse.json()
        setSchemaInfo(checkData)
      }
    } catch (err) {
      setDeleteResult({
        success: false,
        message: err instanceof Error ? err.message : "Schema deletion failed",
      })
      console.error("Schema deletion error:", err)
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <AdminHeader />

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Database Schema Cleanup</h1>
            <p className="text-gray-300">Remove the unused invoice_system schema and its contents</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <span className="ml-3">Checking database schemas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-6 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-500/20 border border-blue-500/50 text-white p-6 rounded-lg mb-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Schema Status</h3>
                    <p className="text-sm mt-1">
                      Current database schemas and their contents. You can safely delete the invoice_system schema since
                      all your data is in the public schema.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Schema Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">public schema</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        Invoices: {schemaInfo?.schemas?.public?.tables?.invoices?.count || 0} records
                      </p>
                      <p className="text-gray-300">
                        Customers: {schemaInfo?.schemas?.public?.tables?.customers?.count || 0} records
                      </p>
                      <p className="text-gray-300">
                        Invoice Items: {schemaInfo?.schemas?.public?.tables?.invoice_items?.count || 0} records
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">This is your main schema containing all active data.</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">invoice_system schema</h3>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        {schemaInfo?.schemas?.invoice_system?.exists ? "Unused" : "Not Found"}
                      </span>
                    </div>
                    {schemaInfo?.schemas?.invoice_system?.exists ? (
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          Invoices: {schemaInfo?.schemas?.invoice_system?.tables?.invoices?.count || 0} records
                        </p>
                        <p className="text-gray-300">
                          Customers: {schemaInfo?.schemas?.invoice_system?.tables?.customers?.count || 0} records
                        </p>
                        <p className="text-gray-300">
                          Invoice Items: {schemaInfo?.schemas?.invoice_system?.tables?.invoice_items?.count || 0}{" "}
                          records
                        </p>
                        <p className="text-sm text-gray-400 mt-3">
                          This schema can be safely deleted since you're using the public schema.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400">Schema not found - already cleaned up!</p>
                    )}
                  </div>
                </div>
              </div>

              {schemaInfo?.schemas?.invoice_system?.exists && (
                <>
                  <div className="bg-amber-500/20 border border-amber-500/50 text-white p-6 rounded-lg mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium">Warning</h3>
                        <p className="text-sm mt-1">
                          This action will permanently delete the <code>invoice_system</code> schema and all its
                          contents. This cannot be undone. Make sure you have backed up any important data.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Delete Unused Schema</h2>

                    {!confirmDelete ? (
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Click the button below to confirm that you want to delete the invoice_system schema.
                        </p>
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span>I want to delete the invoice_system schema</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg">
                          <p className="text-white font-medium mb-2">Final Confirmation</p>
                          <p className="text-red-200 text-sm">
                            Are you absolutely sure you want to delete the invoice_system schema? This will remove:
                          </p>
                          <ul className="text-red-200 text-sm mt-2 ml-4 list-disc">
                            <li>
                              {schemaInfo?.schemas?.invoice_system?.tables?.invoices?.count || 0} invoices in
                              invoice_system.invoices
                            </li>
                            <li>
                              {schemaInfo?.schemas?.invoice_system?.tables?.customers?.count || 0} customers in
                              invoice_system.customers
                            </li>
                            <li>
                              {schemaInfo?.schemas?.invoice_system?.tables?.invoice_items?.count || 0} invoice items in
                              invoice_system.invoice_items
                            </li>
                            <li>The entire invoice_system schema</li>
                          </ul>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors"
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={deleteInvoiceSystemSchema}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
                          >
                            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                            <span>{isDeleting ? "Deleting..." : "Yes, Delete Schema"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {deleteResult && (
                <div
                  className={`p-6 rounded-lg mb-6 ${
                    deleteResult.success
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <div className="flex items-start">
                    {deleteResult.success ? (
                      <Check className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                    )}
                    <div>
                      <h3 className="font-medium">{deleteResult.success ? "Success" : "Error"}</h3>
                      <p className="text-sm mt-1">{deleteResult.message}</p>

                      {deleteResult.success && (
                        <div className="mt-3 text-sm">
                          <p>✅ The invoice_system schema has been completely removed</p>
                          <p>✅ Your public schema data remains intact</p>
                          <p>✅ Database cleanup completed successfully</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-brand-purple/10 border border-purple-500/30 rounded-lg p-4 mt-8">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">After Cleanup</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      Once the invoice_system schema is deleted, your application will only use the public schema. This
                      will eliminate any confusion and ensure all diagnostic tools work correctly. Your invoice
                      management system will continue to work normally with the data in the public schema.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
