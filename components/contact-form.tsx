"use client"
import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import { submitContactForm } from "@/actions/contact-form"

// Submit button with loading state
function SubmitButton({ isMobile }: { isMobile: boolean }) {
  const { pending } = useFormStatus()

  return (
    <MagneticButton strength={isMobile ? 20 : 40}>
      <Button type="submit" className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white py-6" disabled={pending}>
        {pending ? (
          "Sending..."
        ) : (
          <>
            Send Message <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </MagneticButton>
  )
}

// Generate a simple math CAPTCHA
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return {
    question: `${num1} + ${num2} = ?`,
    answer: (num1 + num2).toString(),
  }
}

export function ContactForm({ isMobile }: { isMobile: boolean }) {
  // Initial state for the form
  const initialState = {
    success: false,
    message: "",
    errors: {},
  }

  // CAPTCHA state
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaError, setCaptchaError] = useState("")

  // Form state using useFormState hook
  const [state, formAction] = useFormState(submitContactForm, initialState)

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setCaptchaInput("")
    setCaptchaError("")
  }

  // Handle form submission with CAPTCHA validation
  const handleSubmit = (formData: FormData) => {
    // Validate CAPTCHA first
    if (captchaInput !== captcha.answer) {
      setCaptchaError("Incorrect CAPTCHA answer. Please try again.")
      refreshCaptcha()
      return
    }

    // Clear any previous CAPTCHA error
    setCaptchaError("")

    // Submit the form
    formAction(formData)
  }

  return (
    <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>

      {/* Success/Error Message */}
      {state.message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            state.success ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
          }`}
        >
          {state.success ? (
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{state.message}</p>
          </div>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <motion.input
              whileFocus={isMobile ? {} : { scale: 1.01 }}
              type="text"
              id="name"
              name="name"
              className={`w-full bg-white/5 border ${
                state.errors?.name ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink`}
              placeholder="John Smith"
              required
            />
            {state.errors?.name && <p className="mt-1 text-sm text-red-400">{state.errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <motion.input
              whileFocus={isMobile ? {} : { scale: 1.01 }}
              type="email"
              id="email"
              name="email"
              className={`w-full bg-white/5 border ${
                state.errors?.email ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink`}
              placeholder="john@example.com"
              required
            />
            {state.errors?.email && <p className="mt-1 text-sm text-red-400">{state.errors.email}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <motion.input
            whileFocus={isMobile ? {} : { scale: 1.01 }}
            type="text"
            id="subject"
            name="subject"
            className={`w-full bg-white/5 border ${
              state.errors?.subject ? "border-red-500" : "border-white/10"
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink`}
            placeholder="Website Design Enquiry"
            required
          />
          {state.errors?.subject && <p className="mt-1 text-sm text-red-400">{state.errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-300 mb-2">
            Enquiry Type
          </label>
          <motion.select
            id="enquiryType"
            name="enquiryType"
            defaultValue="Business Site"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink [&>option]:text-black"
          >
            <option value="Starter Site">Starter Site</option>
            <option value="Business Site">Business Site</option>
            <option value="Premium Site">Premium Site</option>
            <option value="Custom Quote">Custom Quote</option>
            <option value="Logo Design">Logo Design</option>
            <option value="Branding">Branding</option>
            <option value="Other">Other</option>
          </motion.select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <motion.textarea
            whileFocus={isMobile ? {} : { scale: 1.01 }}
            id="message"
            name="message"
            rows={5}
            className={`w-full bg-white/5 border ${
              state.errors?.message ? "border-red-500" : "border-white/10"
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink`}
            placeholder="Tell us about your project..."
            required
          ></motion.textarea>
          {state.errors?.message && <p className="mt-1 text-sm text-red-400">{state.errors.message}</p>}
        </div>

        {/* CAPTCHA */}
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="captcha" className="block text-sm font-medium text-gray-300">
              Verification: {captcha.question}
            </label>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="text-brand-pink hover:text-brand-pink/80 transition-colors"
              aria-label="Refresh CAPTCHA"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <motion.input
            whileFocus={isMobile ? {} : { scale: 1.01 }}
            type="text"
            id="captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className={`w-full bg-white/5 border ${
              captchaError ? "border-red-500" : "border-white/10"
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink`}
            placeholder="Enter the answer"
            required
          />
          {captchaError && <p className="mt-1 text-sm text-red-400">{captchaError}</p>}
          <p className="mt-2 text-xs text-gray-400">Please solve this simple math problem to verify you're human.</p>
        </div>

        <SubmitButton isMobile={isMobile} />
      </form>
    </div>
  )
}
