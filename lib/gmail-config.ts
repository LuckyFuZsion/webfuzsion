export function getGmailConfig() {
  // Check if required environment variables are set
  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_APP_PASSWORD

  console.log("Gmail config check - User exists:", !!user)
  console.log("Gmail config check - Password exists:", !!password)

  if (!user || !password) {
    console.error("Gmail credentials missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.")
    return null
  }

  return {
    service: "gmail",
    auth: {
      user,
      pass: password,
    },
  }
}

export function getEmailAddresses() {
  const from = process.env.EMAIL_FROM
  const to = process.env.EMAIL_TO

  console.log("Email addresses check - From exists:", !!from)
  console.log("Email addresses check - To exists:", !!to)

  if (!from) {
    console.error("Email FROM address missing. Please set EMAIL_FROM environment variable.")
    return null
  }

  return {
    from,
    to,
    cc: process.env.EMAIL_CC,
  }
}
