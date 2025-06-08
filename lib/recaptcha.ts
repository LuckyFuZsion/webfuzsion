/**
 * Verifies a reCAPTCHA token with Google's API
 * @param token The reCAPTCHA token to verify
 * @returns Object with success status and optional error message
 */
export async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Skip verification in development environment if no secret key is available
    if (process.env.NODE_ENV === "development" && !process.env.RECAPTCHA_SECRET_KEY) {
      console.warn("RECAPTCHA_SECRET_KEY not set in development, skipping verification")
      return { success: true }
    }

    // Ensure secret key is available
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY environment variable is not set")
      return { success: false, error: "reCAPTCHA configuration error" }
    }

    // Verify with Google's reCAPTCHA API
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()

    if (data.success) {
      return { success: true }
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${data["error-codes"]?.join(", ") || "unknown error"}`,
      }
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA token:", error)
    return { success: false, error: "Error verifying reCAPTCHA token" }
  }
}
