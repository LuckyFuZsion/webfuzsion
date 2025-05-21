import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    margin: 28,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#0066cc",
    color: "white",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 37.5,
    padding: 5,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  companyDetails: {
    color: "white",
    fontSize: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "white",
  },
  invoiceDetails: {
    color: "white",
    fontSize: 10,
    marginBottom: 4,
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    alignSelf: "flex-end",
    width: 60,
    textAlign: "center",
  },
  statusPaid: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  statusSent: {
    backgroundColor: "#ff9800",
    color: "white",
  },
  statusDraft: {
    backgroundColor: "#9e9e9e",
    color: "white",
  },
  content: {
    padding: 25,
  },
  invoiceDetailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "#f5f8fc",
    padding: 15,
    borderRadius: 5,
  },
  invoiceDetailsLeft: {
    width: "48%",
  },
  invoiceDetailsRight: {
    width: "48%",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0066cc",
    fontSize: 12,
  },
  value: {
    marginBottom: 6,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 25,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#f5f8fc",
  },
  tableColHeader: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    backgroundColor: "#0066cc",
    color: "white",
    fontWeight: "bold",
  },
  tableColHeaderQuantity: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    backgroundColor: "#0066cc",
    color: "white",
    fontWeight: "bold",
  },
  tableColHeaderPrice: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    backgroundColor: "#0066cc",
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
  },
  tableColHeaderDiscount: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    backgroundColor: "#0066cc",
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
  },
  tableColHeaderAmount: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    backgroundColor: "#0066cc",
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
  },
  tableCol: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
  },
  tableColQuantity: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
  },
  tableColPrice: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    textAlign: "right",
  },
  tableColDiscount: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    textAlign: "right",
  },
  tableColAmount: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 7,
    textAlign: "right",
  },
  totals: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 25,
  },
  totalsTable: {
    width: "40%",
    backgroundColor: "#f5f8fc",
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
    borderLeftStyle: "solid",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
  totalsBold: {
    fontWeight: "bold",
    color: "#0066cc",
    fontSize: 12,
  },
  notes: {
    marginBottom: 25,
    backgroundColor: "#f5f8fc",
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#5c2d91",
    borderLeftStyle: "solid",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderTopStyle: "solid",
    paddingTop: 10,
    fontSize: 9.5,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  thankYou: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
    color: "#0066cc",
  },
  discountText: {
    color: "#e53e3e",
    fontSize: 9.5,
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#666",
    fontSize: 9.5,
  },
})

// Define the props for the InvoicePDF component
interface InvoicePDFProps {
  invoice: {
    invoice_number: string
    project_name: string
    issue_date: string
    due_date: string
    subtotal: number
    total_amount: number
    notes?: string
    terms?: string
    status: string
    customer_name?: string
    customer_email?: string
    customer_phone?: string
    customer_address?: string
    customer_city?: string
    customer_postal_code?: string
    customer_country?: string
    original_subtotal?: number
    total_item_discounts?: number
    discount_amount?: number
    total_discount?: number
    discount_percentage?: string
  }
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    country?: string
  }
  items: Array<{
    description: string
    quantity: number
    unit_price: number
    amount: number
    discount_percentage?: number
    discount_amount?: number
    original_amount?: number
  }>
}

// Create Document Component
export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, customer, items }) => {
  // Format date strings
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`
  }

  // Ensure customer has valid values - first try direct invoice fields, then customer object
  const safeCustomer = {
    name: invoice.customer_name || customer?.name || "No Name Provided",
    email: invoice.customer_email || customer?.email || "No Email Provided",
    phone: invoice.customer_phone || customer?.phone || "",
    address: invoice.customer_address || customer?.address || "",
    city: invoice.customer_city || customer?.city || "",
    postal_code: invoice.customer_postal_code || customer?.postal_code || "",
    country: invoice.customer_country || customer?.country || "United Kingdom",
  }

  // Get status style
  const getStatusStyle = () => {
    switch (invoice.status.toLowerCase()) {
      case "paid":
        return styles.statusPaid
      case "sent":
        return styles.statusSent
      default:
        return styles.statusDraft
    }
  }

  // Calculate correct totals
  const originalSubtotal = items.reduce((sum, item) => {
    const originalAmount = item.original_amount || item.quantity * item.unit_price
    return sum + originalAmount
  }, 0)

  const actualSubtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const totalItemDiscounts = originalSubtotal - actualSubtotal

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image src="/images/webfuzsion-logo-colorful.png" style={styles.logo} />
              <Text style={styles.companyName}>WebFuZsion</Text>
              <Text style={styles.companyDetails}>Grantham, UK</Text>
              <Text style={styles.companyDetails}>info.webfuzsion@gmail.com</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.invoiceDetails}>Invoice #: {invoice.invoice_number}</Text>
              <Text style={styles.invoiceDetails}>Date: {formatDate(invoice.issue_date)}</Text>
              <Text style={styles.invoiceDetails}>Due Date: {formatDate(invoice.due_date)}</Text>
              <View style={[styles.statusBadge, getStatusStyle()]}>
                <Text>{invoice.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {/* Invoice Details */}
            <View style={styles.invoiceDetailsSection}>
              <View style={styles.invoiceDetailsLeft}>
                <Text style={styles.sectionTitle}>Bill To:</Text>
                <Text style={styles.value}>{safeCustomer.name}</Text>
                <Text>{safeCustomer.email}</Text>
                {safeCustomer.phone ? <Text>{safeCustomer.phone}</Text> : null}
                {safeCustomer.address ? <Text>{safeCustomer.address}</Text> : null}
                {safeCustomer.city || safeCustomer.postal_code ? (
                  <Text>
                    {safeCustomer.city ? `${safeCustomer.city}, ` : ""}
                    {safeCustomer.postal_code || ""}
                  </Text>
                ) : null}
                <Text>{safeCustomer.country}</Text>
              </View>
              <View style={styles.invoiceDetailsRight}>
                <Text style={styles.sectionTitle}>Project:</Text>
                <Text style={styles.value}>{invoice.project_name}</Text>
              </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text>Description</Text>
                </View>
                <View style={styles.tableColHeaderQuantity}>
                  <Text>Qty</Text>
                </View>
                <View style={styles.tableColHeaderPrice}>
                  <Text>Unit Price</Text>
                </View>
                <View style={styles.tableColHeaderDiscount}>
                  <Text>Discount</Text>
                </View>
                <View style={styles.tableColHeaderAmount}>
                  <Text>Amount</Text>
                </View>
              </View>

              {/* Table Rows */}
              {items.map((item, index) => {
                // Calculate original amount and check if there's a discount
                const originalAmount = item.original_amount || item.quantity * item.unit_price
                const hasDiscount = originalAmount > item.amount
                const discountAmount = hasDiscount ? originalAmount - item.amount : 0
                const discountPercentage = hasDiscount ? ((discountAmount / originalAmount) * 100).toFixed(1) : 0

                return (
                  <View style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven} key={index}>
                    <View style={styles.tableCol}>
                      <Text>{item.description}</Text>
                    </View>
                    <View style={styles.tableColQuantity}>
                      <Text>{item.quantity}</Text>
                    </View>
                    <View style={styles.tableColPrice}>
                      <Text>{formatCurrency(item.unit_price)}</Text>
                    </View>
                    <View style={styles.tableColDiscount}>
                      {hasDiscount ? (
                        <Text style={styles.discountText}>
                          {discountPercentage}% ({formatCurrency(discountAmount)})
                        </Text>
                      ) : (
                        <Text>-</Text>
                      )}
                    </View>
                    <View style={styles.tableColAmount}>
                      {hasDiscount ? (
                        <View>
                          <Text style={styles.originalPrice}>{formatCurrency(originalAmount)}</Text>
                          <Text>{formatCurrency(item.amount)}</Text>
                        </View>
                      ) : (
                        <Text>{formatCurrency(item.amount)}</Text>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
              <View style={styles.totalsTable}>
                {/* Show original subtotal */}
                <View style={styles.totalsRow}>
                  <Text>Original Subtotal:</Text>
                  <Text>{formatCurrency(originalSubtotal)}</Text>
                </View>

                {/* Show item discounts if there are any */}
                {totalItemDiscounts > 0 && (
                  <View style={styles.totalsRow}>
                    <Text>Item Discounts:</Text>
                    <Text style={{ color: "#e53e3e" }}>-{formatCurrency(totalItemDiscounts)}</Text>
                  </View>
                )}

                <View style={styles.totalsRow}>
                  <Text>Subtotal:</Text>
                  <Text>{formatCurrency(actualSubtotal)}</Text>
                </View>

                {/* Show additional discount if there is one */}
                {invoice.discount_amount && invoice.discount_amount > 0 && (
                  <View style={styles.totalsRow}>
                    <Text>Additional Discount:</Text>
                    <Text style={{ color: "#e53e3e" }}>-{formatCurrency(invoice.discount_amount)}</Text>
                  </View>
                )}

                <View style={[styles.totalsRow, styles.totalsBold]}>
                  <Text>Total:</Text>
                  <Text>{formatCurrency(invoice.total_amount)}</Text>
                </View>

                {/* Show total savings if there are any */}
                {invoice.total_discount && invoice.total_discount > 0 && (
                  <View style={styles.totalsRow}>
                    <Text style={{ fontSize: 9, fontStyle: "italic", color: "#666" }}>Total Savings:</Text>
                    <Text style={{ fontSize: 9, fontStyle: "italic", color: "#666" }}>
                      {formatCurrency(invoice.total_discount)} ({invoice.discount_percentage || "0"}%)
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Notes */}
            {invoice.notes && (
              <View style={styles.notes}>
                <Text style={styles.sectionTitle}>Notes:</Text>
                <Text>{invoice.notes}</Text>
              </View>
            )}

            {/* Terms */}
            {invoice.terms && (
              <View style={styles.notes}>
                <Text style={styles.sectionTitle}>Terms & Conditions:</Text>
                <Text>{invoice.terms}</Text>
              </View>
            )}

            {/* Thank You */}
            <View style={styles.thankYou}>
              <Text>Thank you for your business!</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>WebFuZsion • Grantham, UK • info.webfuzsion@gmail.com</Text>
              <Text>Bank: Steven Platts • Sort Code: 110333 • Account: 00577966</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
