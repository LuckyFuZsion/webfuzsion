/**
 * This function generates a clean PDF without any debug information
 */
export const generateCleanPdf = (invoice: any, customer: any, items: any) => {
  // Create a new window for the PDF
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow pop-ups to download the invoice PDF")
    return
  }

  // Format the customer data
  const customerName = customer?.name || "No Name Provided"
  const customerEmail = customer?.email || "No Email Provided"
  const customerPhone = customer?.phone || ""
  const customerAddress = customer?.address || ""
  const customerCity = customer?.city || ""
  const customerPostalCode = customer?.postal_code || ""
  const customerCountry = customer?.country || "United Kingdom"

  // Process items to ensure discount information is available
  const processedItems = items.map((item) => {
    // Calculate original amount if not provided
    const originalAmount = item.original_amount || item.quantity * item.unit_price

    // Check if this item has a discount by comparing original amount to actual amount
    const hasDiscount = originalAmount > item.amount

    if (hasDiscount && !item.discount_amount) {
      const discountAmount = originalAmount - item.amount
      const discountPercentage = ((discountAmount / originalAmount) * 100).toFixed(1)

      return {
        ...item,
        original_amount: originalAmount,
        discount_amount: discountAmount,
        discount_percentage: Number.parseFloat(discountPercentage),
      }
    }

    return {
      ...item,
      original_amount: originalAmount,
    }
  })

  // Calculate correct totals
  const originalSubtotal = processedItems.reduce((sum, item) => sum + (item.original_amount || 0), 0)
  const actualSubtotal = processedItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalItemDiscounts = originalSubtotal - actualSubtotal

  // Create the HTML content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 18px; font-size: 11.5px; background-color: #f9f9f9; }
    .invoice { max-width: 800px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    .header { display: flex; justify-content: space-between; padding: 20px 25px; background: linear-gradient(135deg, #0066cc 0%, #5c2d91 100%); color: white; }
    .company-details { text-align: left; }
    .logo { width: 85px; height: auto; margin-bottom: 8px; background-color: white; border-radius: 50%; padding: 5px; }
    .invoice-details { text-align: right; }
    .content-area { padding: 25px; }
    .customer-info { display: flex; justify-content: space-between; margin-bottom: 25px; background-color: #f5f8fc; padding: 15px; border-radius: 6px; }
    .customer-info > div { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th, td { padding: 10px; text-align: left; }
    th { background-color: #0066cc; color: white; font-size: 11.5px; }
    tr:nth-child(even) { background-color: #f5f8fc; }
    tr:hover { background-color: #e9f0f9; }
    td { font-size: 11.5px; border-bottom: 1px solid #eee; }
    h1 { font-size: 22px; margin: 0 0 5px 0; }
    h2 { font-size: 18px; margin: 0 0 5px 0; color: white; }
    h3 { font-size: 14px; margin: 0 0 5px 0; color: #0066cc; }
    p { margin: 0 0 5px 0; }
    .amount-column { text-align: right; }
    .discount-column { text-align: right; }
    .summary { width: 290px; margin-left: auto; background-color: #f5f8fc; padding: 15px; border-radius: 6px; border-left: 4px solid #0066cc; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .total-row { font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px; color: #0066cc; font-size: 14px; }
    .notes { background-color: #f5f8fc; padding: 15px; margin-top: 25px; border-radius: 6px; border-left: 4px solid #5c2d91; }
    .strikethrough { text-decoration: line-through; color: #888; font-size: 0.9em; }
    .discount-text { color: #e53e3e; }
    .footer { text-align: center; margin-top: 35px; color: #666; font-size: 11.5px; padding: 15px; border-top: 1px solid #eee; }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 5px;
    }
    .status-paid { background-color: #4caf50; color: white; }
    .status-sent { background-color: #ff9800; color: white; }
    .status-draft { background-color: #9e9e9e; color: white; }
    @media print {
      body { -webkit-print-color-adjust: exact; background-color: white; }
      .invoice { box-shadow: none; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="company-details">
        <img src="/images/webfuzsion-logo-colorful.png" alt="WebFuZsion Logo" class="logo">
        <h2>WebFuZsion</h2>
        <p>Grantham, UK<br>steve@luckyfuzsion.com</p>
      </div>
      <div class="invoice-details">
        <h1>INVOICE</h1>
        <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
        <p><strong>Date:</strong> ${invoice.issue_date}</p>
        <p><strong>Due Date:</strong> ${invoice.due_date}</p>
        <div class="status-badge status-${invoice.status.toLowerCase()}">
          ${invoice.status.toUpperCase()}
        </div>
      </div>
    </div>
    
    <div class="content-area">
      <div class="customer-info">
        <div>
          <h3>Bill To:</h3>
          <p>${customerName}<br>
          ${customerEmail}<br>
          ${customerPhone ? `${customerPhone}<br>` : ""}
          ${customerAddress ? `${customerAddress}<br>` : ""}
          ${customerCity ? `${customerCity}` : ""}${customerPostalCode ? `, ${customerPostalCode}` : ""}<br>
          ${customerCountry}</p>
        </div>
        <div>
          <h3>Project:</h3>
          <p>${invoice.project_name}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th class="discount-column">Discount</th>
            <th class="amount-column">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${processedItems
            .map((item, index) => {
              const originalAmount = item.original_amount || item.quantity * item.unit_price
              const hasDiscount = originalAmount > item.amount

              return `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>£${Number(item.unit_price).toFixed(2)}</td>
              <td class="discount-column">
                ${
                  hasDiscount
                    ? `<span class="discount-text">${Number(item.discount_percentage || 0).toFixed(1)}% (£${Number(item.discount_amount || originalAmount - item.amount).toFixed(2)})</span>`
                    : "-"
                }
              </td>
              <td class="amount-column">
                ${
                  hasDiscount
                    ? `<div><span class="strikethrough">£${Number(originalAmount).toFixed(2)}</span><br>£${Number(item.amount).toFixed(2)}</div>`
                    : `£${Number(item.amount).toFixed(2)}`
                }
              </td>
            </tr>
          `
            })
            .join("")}
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-row">
          <span>Original Subtotal:</span>
          <span>£${Number(originalSubtotal).toFixed(2)}</span>
        </div>
        ${
          totalItemDiscounts > 0
            ? `
        <div class="summary-row">
          <span>Item Discounts:</span>
          <span class="discount-text">-£${Number(totalItemDiscounts).toFixed(2)}</span>
        </div>
        `
            : ""
        }
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>£${Number(actualSubtotal).toFixed(2)}</span>
        </div>
        ${
          invoice.tax_rate
            ? `
        <div class="summary-row">
          <span>VAT (${invoice.tax_rate}%):</span>
          <span>£${Number(invoice.tax_amount || 0).toFixed(2)}</span>
        </div>
        `
            : ""
        }
        ${
          Number(invoice.discount_amount) > 0
            ? `
          <div class="summary-row">
            <span>Additional Discount:</span>
            <span class="discount-text">-£${Number(invoice.discount_amount).toFixed(2)}</span>
          </div>
        `
            : ""
        }
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>£${Number(invoice.total_amount).toFixed(2)}</span>
        </div>
        ${
          invoice.total_discount && Number(invoice.total_discount) > 0
            ? `
          <div class="summary-row" style="margin-top: 4px; font-style: italic; color: #666; font-size: 10.5px;">
            <span>Total Savings:</span>
            <span>£${Number(invoice.total_discount).toFixed(2)} (${invoice.discount_percentage || "0"}%)</span>
          </div>
        `
            : ""
        }
      </div>
      
      ${
        invoice.notes
          ? `
        <div class="notes">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }
      
      ${
        invoice.terms
          ? `
        <div class="notes">
          <h3>Terms & Conditions</h3>
          <p>${invoice.terms}</p>
        </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Please make payment to: Steven Platts • Sort Code: 110333 • Account: 00577966</p>
      </div>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 18px;">
    <button onclick="window.print();" style="padding: 8px 16px; background-color: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>
`

  // Write the HTML content to the new window
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Trigger print dialog after content is loaded
  printWindow.addEventListener("load", () => {
    printWindow.focus()
    printWindow.print()
  })
}
