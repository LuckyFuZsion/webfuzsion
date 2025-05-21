// Gmail SMTP configuration helper
export const getGmailConfig = () => {
  return {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // This must be an App Password, not your regular Gmail password
    },
    tls: {
      rejectUnauthorized: true,
    },
  }
}

// Helper to get standardized email addresses
export const getEmailAddresses = () => {
  return {
    from: `"WebFuZsion" <${process.env.GMAIL_USER || "info.webfuzsion@gmail.com"}>`,
    to: process.env.GMAIL_USER || "info.webfuzsion@gmail.com",
    cc: ["stevenplatts50@aol.com"],
  }
}
