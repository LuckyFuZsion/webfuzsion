/**
 * This function generates a clean PDF for quotes without any debug information
 */
export const generateQuotePdf = (quote: any, customer: any, items: any) => {
  // Create a new window for the PDF
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow pop-ups to download the quote PDF")
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
  <title>Quote ${quote.quote_number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 18px; font-size: 11.5px; background-color: #f9f9f9; }
    .quote { max-width: 800px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    .header { display: flex; justify-content: space-between; padding: 20px 25px; background: linear-gradient(135deg, #0066cc 0%, #5c2d91 100%); color: white; }
    .company-details { text-align: left; }
    .logo { width: 85px; height: auto; margin-bottom: 8px; background-color: white; border-radius: 50%; padding: 5px; }
    .quote-details { text-align: right; }
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
    .discount-row { color: #e74c3c; }
    .notes-section { background-color: #f9f9f9; border-left: 4px solid #f39c12; padding: 15px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
    .terms-section { background-color: #f9f9f9; border-left: 4px solid #2ecc71; padding: 15px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
    .footer { text-align: center; padding: 20px; background-color: #f9f9f9; color: #777; border-top: 1px solid #eee; }
    .payment-info { background-color: #e8f4fd; border-left: 4px solid #3498db; padding: 15px; margin-top: 30px; border-radius: 0 4px 4px 0; }
    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 10px; }
    .status-draft { background-color: #95a5a6; color: white; }
    .status-sent { background-color: #f39c12; color: white; }
    .status-accepted { background-color: #2ecc71; color: white; }
    .status-rejected { background-color: #e74c3c; color: white; }
  </style>
</head>
<body>
  <div class="quote">
    <div class="header">
      <div class="company-details">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hPxOkT9dQtd20K3dZ2fNNZkZ84SPjB.png" alt="WebFuZsion Logo" class="logo">
        <h2>WebFuZsion</h2>
        <p>Grantham, UK<br>steve@webfuzsion.co.uk</p>
      </div>
      <div class="quote-details">
        <h1>QUOTE</h1>
        <p><strong>Quote #:</strong> ${quote.quote_number}</p>
        <p><strong>Date:</strong> ${new Date(quote.issue_date).toLocaleDateString('en-GB')}</p>
        <p><strong>Due Date:</strong> ${new Date(quote.due_date).toLocaleDateString('en-GB')}</p>
        <div class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</div>
      </div>
    </div>
    
    <div class="content-area">
      <div class="customer-info">
        <div>
          <h3>Bill To:</h3>
          <p><strong>${customerName}</strong><br>
          ${customerEmail}<br>
          ${customerPhone ? customerPhone + '<br>' : ''}
          ${customerAddress ? customerAddress + '<br>' : ''}
          ${customerCity ? customerCity + '<br>' : ''}
          ${customerPostalCode ? customerPostalCode + '<br>' : ''}
          ${customerCountry}</p>
        </div>
        <div>
          <h3>Project:</h3>
          <p><strong>${quote.project_name}</strong></p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="amount-column">Qty</th>
            <th class="amount-column">Unit Price</th>
            <th class="discount-column">Discount</th>
            <th class="amount-column">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${processedItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="amount-column">${item.quantity}</td>
              <td class="amount-column">£${Number(item.unit_price).toFixed(2)}</td>
              <td class="discount-column">${item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-'}</td>
              <td class="amount-column">£${Number(item.amount).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>£${Number(actualSubtotal).toFixed(2)}</span>
        </div>
        ${quote.discount_amount > 0 ? `
        <div class="summary-row discount-row">
          <span>Discount:</span>
          <span>-£${Number(quote.discount_amount).toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>£${Number(quote.total_amount).toFixed(2)}</span>
        </div>
      </div>
      
      ${quote.notes ? `
      <div class="notes-section">
        <h3>Notes</h3>
        <p>${quote.notes}</p>
      </div>
      ` : ''}
      
      ${quote.terms ? `
      <div class="terms-section">
        <h3>Terms & Conditions</h3>
        <p>${quote.terms}</p>
      </div>
      ` : ''}
      
      <div class="payment-info">
        <h3>Payment Information</h3>
        <p>Payment is due within 14 days of quote acceptance.</p>
        <p><strong>Bank Details:</strong><br>
        Steven Platts<br>
        Sort Code: 110333<br>
        Account: 00577966</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for considering WebFuZsion for your project!</p>
      <p>This quote is valid for 30 days from the date of issue.</p>
    </div>
  </div>
</body>
</html>`

  // Write the HTML content to the new window
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for the content to load, then print
  printWindow.onload = function() {
    printWindow.print()
    printWindow.close()
  }
} 