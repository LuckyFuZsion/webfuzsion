interface RecaptchaResponse {
  success: boolean
  error?: string
}

export async function verifyRecaptchaToken(token: string): Promise<RecaptchaResponse> {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY not configured")
      return {
        success: false,
        error: "reCAPTCHA configuration error",
      }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: "reCAPTCHA verification failed",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return {
      success: false,
      error: "Failed to verify reCAPTCHA",
    }
  }
}
