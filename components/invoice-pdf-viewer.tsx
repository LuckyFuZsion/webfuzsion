"use client"
import { X } from "lucide-react"
import "../app/admin/invoices/invoice-mobile.css"
import { useState } from "react"

const InvoicePDFViewer = ({ invoice, customer, items, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Get the data from the server
      const response = await fetch("/api/admin/invoices/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice,
          customer,
          items,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to generate PDF")
      }

      // Use the client-side PDF generation
      const { generateCleanPdf } = await import("@/lib/generate-clean-pdf")
      generateCleanPdf(result.data.invoice, result.data.customer, result.data.items)

      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setIsGenerating(false)
      alert(`Error generating PDF: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Invoice Preview</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue/80 transition-colors ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="p-4 bg-white rounded-lg shadow-md pdf-container">
            <div className="flex justify-between mb-4 pdf-controls">
              <div>
                <h3 className="text-xl font-bold">WebFuZsion</h3>
                <p className="text-sm text-gray-600">Grantham, UK</p>
                <p className="text-sm text-gray-600">steve@luckyfuzsion.com</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold">INVOICE</h3>
                <p className="text-sm text-gray-600">{invoice.invoice_number}</p>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <div>
                <h4 className="font-bold mb-2">Bill To:</h4>
                <p className="text-sm">{customer.name}</p>
                <p className="text-sm">{customer.email}</p>
                {customer.phone && <p className="text-sm">{customer.phone}</p>}
                {customer.address && <p className="text-sm">{customer.address}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="font-bold">Issue Date:</span> {invoice.issue_date}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Due Date:</span> {invoice.due_date}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Status:</span> {invoice.status}
                </p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">£{Number(item.unit_price).toFixed(2)}</td>
                    <td className="text-right py-2">£{Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>£{Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                {invoice.tax_rate && (
                  <div className="flex justify-between mb-2">
                    <span>VAT ({invoice.tax_rate}%):</span>
                    <span>£{Number(invoice.tax_amount || 0).toFixed(2)}</span>
                  </div>
                )}
                {Number(invoice.discount_amount) > 0 && (
                  <div className="flex justify-between mb-2">
                    <span>Discount:</span>
                    <span>-£{Number(invoice.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>£{Number(invoice.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 p-4 bg-gray-100">
                <h4 className="font-bold mb-2">Notes</h4>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p>Payment is due within 14 days of issue.</p>
              <p>Please make payment to: Steven Platts • Sort Code: 110333 • Account: 00577966</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePDFViewer
